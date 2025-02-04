<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Contrato;

class ContratoController extends Controller
{
    # OBTIENE UNA LISTA DE CONTRATOS
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
            'fecha_inicio',
            'fecha_termino',
            'proveedor',
            'ito'
        ];

        $contratos = Contrato::select($campos)->where('estado', 1)->skip($pagina)->limit(50)->get();

        if($contratos->isEmpty())
        {
            return 'No se encontraron contratos registrados en el sistema.';
        }

        return $contratos;
    }





    # AGREGA UN CONTRATO
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'max:80|required|unique:App\Models\Contrato,nombre',
            'fecha_inicio' => 'size:10|required',
            'fecha_termino' => 'size:10',
            'proveedor' => 'numeric|digits:4|required',
            'ito' => 'numeric|digits:3|required'
        ]);

        if($validator->fails())
        {
            return 'No se enviaron todos los datos requeridos.';
        }

        $contrato = Contrato::insert([
            'nombre' => $request->nombre,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_termino' => $request->fecha_termino,
            'proveedor' => $request->proveedor,
            'ito' => $request->ito
        ]);

        if(!$contrato)
        {
            return 'No se pudo registrar el contrato en el sistema.';
        }

        return 'Contrato registrado con éxito en el sistema.';
    }





    # OBTIENE UN CONTRATO
    public function show(int $id)
    {
        $campos = [
            'id',
            'nombre',
            'fecha_inicio',
            'fecha_termino',
            'proveedor',
            'ito'
        ];

        $contrato = Contrato::select($campos)->where('id', $id)->where('estado', 1)->limit(1)->get();

        if($contrato->isEmpty())
        {
            return 'No se encontró el contrato registrado en el sistema.';
        }
        
        return $contrato;
    }





    # ACTUALIZA UN CONTRATO
    public function update(int $id, Request $request)
    {
        $contrato = Contrato::find($id);

        if(!$contrato)
        {
            return 'No se encontró el contrato registrado en el sistema.';
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'max:80',
            'fecha_inicio' => 'size:10',
            'fecha_termino' => 'size:10',
            'proveedor' => 'numeric|digits:4',
            'ito' => 'numeric|digits:3',
            'estado' => 'numeric|digits:1'
        ]);

        if($validator->fails())
        {
            return 'Se encontraron errores en los datos enviados.';
        }

        if($request->has('nombre'))
        {
            $nombre_aux = Contrato::select('id')->where('nombre', $request->nombre)->where('estado', 1)->limit(1)->get();

            if(!$nombre_aux->isEmpty())
            {
                if($id == $nombre_aux[0]['id'])
                {
                    //return 'El nombre se encuentra repetido pero es el mismo.';
                }
                else
                {
                    return 'El nombre ya se encuentra registrado en el sistema.';
                }
            }
        }

        if($request->has('nombre'))
        {
            $contrato->nombre = $request->nombre;
        }
        if($request->has('fecha_inicio'))
        {
            $contrato->fecha_inicio = $request->fecha_inicio;
        }
        if($request->has('fecha_termino'))
        {
            $contrato->fecha_termino = $request->fecha_termino;
        }
        if($request->has('proveedor'))
        {
            $contrato->proveedor = $request->proveedor;
        }
        if($request->has('ito'))
        {
            $contrato->ito = $request->ito;
        }
        if($request->has('estado'))
        {
            $contrato->estado = $request->estado;
        }

        $contrato->save();

        return 'Contrato actualizado con éxito en el sistema.';
    }





    # ELIMINA UN CONTRATO
    public function destroy(int $id)
    {
        $contrato = Contrato::find($id);

        if(!$contrato)
        {
            return 'No se encontró el contrato registrado en el sistema.';
        }

        $contrato->delete();

        return 'Contrato eliminado con éxito del sistema.';
    }
}