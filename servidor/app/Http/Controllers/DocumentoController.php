<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

use App\Models\Documento;

class DocumentoController extends Controller
{
    # OBTIENE UNA LISTA DE DOCUMENTOS
    public function index(int $pagina)
    {
        $pagina--;

        if($pagina > 0)
        {
            $pagina = $pagina * 50;
        }

        $campos = [
            'id',
            'nombre',
            'fecha_subida',
            'hora_subida',
            'tipo_documento',
            'contrato'
        ];

        $documentos = Documento::select($campos)->where('estado', 1)->skip($pagina)->limit(50)->get();

        if($documentos->isEmpty())
        {
            return 'No se encontraron documentos registrados en el sistema.';
        }

        return $documentos;
    }





    # AGREGA UN DOCUMENTO
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'max:100|required|unique:App\Models\Documento,nombre',
            'fecha_subida' => 'max:10|required',
            'hora_subida' => 'max:8|required',
            'tipo_documento' => 'max:2|required',
            'contrato' => 'max:4|required'
        ]);

        if($validator->fails())
        {
            return 'No se enviaron todos los datos requeridos.';
        }

        $documento = Documento::insert([
            'nombre' => $request->nombre,
            'fecha_subida' => $request->fecha_subida,
            'hora_subida' => $request->hora_subida,
            'tipo_documento' => (int)$request->tipo_documento,
            'contrato' => (int)$request->contrato
        ]);

        if(!$documento)
        {
            return 'No se pudo registrar el documento en el sistema.';
        }

        Storage::disk('local')->put(Documento::latest('id')->first()->id, $request->archivo);

        return $request->archivo;

        return 'Documento registrado con éxito en el sistema.';
    }





    # OBTIENE UN DOCUMENTO
    public function show(int $id)
    {
        $campos = [
            'id',
            'nombre',
            'fecha_subida',
            'hora_subida',
            'tipo_documento',
            'contrato'
        ];

        $documento = Documento::select($campos)->where('id', $id)->where('estado', 1)->limit(1)->get();

        if($documento->isEmpty())
        {
            return 'No se encontró el documento registrado en el sistema.';
        }

        $archivo = Storage::download("/" . $id . "/5dZ58Sr6vZi9xPbvqdUPFwp2hi4560tZ2LE7I6TL.pdf");
        
        return $archivo;
    }





    # ACTUALIZA UN DOCUMENTO
    public function update(int $id, Request $request)
    {
        $documento = Documento::find($id);

        if(!$documento)
        {
            return 'No se encontró el documento registrado en el sistema.';
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'max:100',
            'fecha_subida' => 'max:10',
            'hora_subida' => 'max:8',
            'tipo_documento' => 'numeric|digits:2',
            'contrato' => 'numeric|digits:4',
            'estado' => 'numeric|digits:1'
        ]);

        if($validator->fails())
        {
            return 'Se encontraron errores en los datos enviados.';
        }

        if($request->has('nombre'))
        {
            $documento_aux = Documento::select('id')->where('nombre', $request->nombre)->where('estado', 1)->limit(1)->get();

            if(!$documento_aux->isEmpty())
            {
                if($id == $documento_aux[0]['id'])
                {
                    //return 'El RUT se encuentra repetido pero es el mismo.';
                }
                else
                {
                    return 'El nombre ya se encuentra registrado en el sistema.';
                }
            }
        }

        if($request->has('nombre'))
        {
            $documento->nombre = $request->nombre;
        }
        if($request->has('fecha_subida'))
        {
            $documento->fecha_subida = $request->fecha_subida;
        }
        if($request->has('hora_subida'))
        {
            $documento->hora_subida = $request->hora_subida;
        }
        if($request->has('tipo_documento'))
        {
            $documento->tipo_documento = $request->tipo_documento;
        }
        if($request->has('contrato'))
        {
            $documento->contrato = $request->contrato;
        }
        if($request->has('estado'))
        {
            $documento->estado = $request->estado;
        }

        $documento->save();

        return 'Documento actualizado con éxito en el sistema.';
    }





    # ELIMINA UN DOCUMENTO
    public function destroy(int $id)
    {
        $documento = Documento::find($id);

        if(!$documento)
        {
            return 'No se encontró el documento registrado en el sistema.';
        }

        $documento->delete();

        return 'Documento eliminado con éxito del sistema.';
    }
}