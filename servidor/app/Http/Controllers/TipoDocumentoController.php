<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\TipoDocumento;

class TipoDocumentoController extends Controller
{
    # OBTIENE UNA LISTA DE TIPOS DE DOCUMENTOS
    public function index(int $pagina)
    {
        $pagina--;

        if($pagina > 0)
        {
            $pagina = $pagina * 50;
        }

        $campos = [
            'id',
            'nombre'
        ];

        $tiposDocumentos = TipoDocumento::select($campos)->where('estado', 1)->skip($pagina)->limit(50)->get();

        if($tiposDocumentos->isEmpty())
        {
            return 'No se encontraron tipos de documentos registrados en el sistema.';
        }

        return $tiposDocumentos;
    }





    # AGREGA UN TIPO DE DOCUMENTO
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'max:40|required|unique:App\Models\TipoDocumento,nombre'
        ]);

        if($validator->fails())
        {
            return 'No se enviaron todos los datos requeridos.';
        }

        $tipoDocumento = TipoDocumento::insert([
            'nombre' => $request->nombre
        ]);

        if(!$tipoDocumento)
        {
            return 'No se pudo registrar el tipo de documento en el sistema.';
        }

        return 'Tipo de documento registrado con éxito en el sistema.';
    }





    # OBTIENE UN TIPO DE DOCUMENTO
    public function show(int $id)
    {
        $campos = [
            'id',
            'nombre'
        ];

        $tipoDocumento = TipoDocumento::select($campos)->where('id', $id)->where('estado', 1)->limit(1)->get();

        if($tipoDocumento->isEmpty())
        {
            return 'No se encontró el tipo de documento registrado en el sistema.';
        }
        
        return $tipoDocumento;
    }





    # ACTUALIZA UN TIPO DE DOCUMENTO
    public function update(int $id, Request $request)
    {
        $tipoDocumento = TipoDocumento::find($id);

        if(!$tipoDocumento)
        {
            return 'No se encontró el tipo de documento registrado en el sistema.';
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'max:40',
            'estado' => 'numeric|digits:1'
        ]);

        if($validator->fails())
        {
            return 'Se encontraron errores en los datos enviados.';
        }

        if($request->has('nombre'))
        {
            $tipoDocumento_aux = TipoDocumento::select('id')->where('nombre', $request->nombre)->where('estado', 1)->limit(1)->get();

            if(!$tipoDocumento_aux->isEmpty())
            {
                if($id == $tipoDocumento_aux[0]['id'])
                {
                    //return 'El RUT se encuentra repetido pero es el mismo.';
                }
                else
                {
                    return 'El tipo de documento ya se encuentra registrado en el sistema.';
                }
            }
        }

        if($request->has('nombre'))
        {
            $tipoDocumento->nombre = $request->nombre;
        }
        if($request->has('estado'))
        {
            $tipoDocumento->estado = $request->estado;
        }

        $tipoDocumento->save();

        return 'Tipo de documento actualizado con éxito en el sistema.';
    }





    # ELIMINA UN TIPO DE DOCUMENTO
    public function destroy(int $id)
    {
        $tipoDocumento = TipoDocumento::find($id);

        if(!$tipoDocumento)
        {
            return 'No se encontró el tipo de documento registrado en el sistema.';
        }

        $tipoDocumento->delete();

        return 'Tipo de documento eliminado con éxito del sistema.';
    }
}