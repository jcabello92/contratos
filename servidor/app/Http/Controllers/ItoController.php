<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Ito;

class ItoController extends Controller
{
    # OBTIENE UNA LISTA DE ITOS
    public function index(int $pagina)
    {
        $pagina--;

        if($pagina > 0)
        {
            $pagina = $pagina * 50;
        }

        $campos = [
            'id',
            'rut',
            'nombre',
            'apellido',
            'telefono',
            'correo',
            'area'
        ];

        $itos = Ito::select($campos)->where('estado', 1)->skip($pagina)->limit(50)->get();

        if($itos->isEmpty())
        {
            return 'No se encontraron itos registrados en el sistema.';
        }

        return $itos;
    }





    # AGREGA UN ITO
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rut' => 'min:11|max:13|required|unique:App\Models\Ito,rut',
            'nombre' => 'max:50|required',
            'apellido' => 'max:50|required',
            'telefono' => 'max:11',
            'correo' => 'max:80|required',
            'area' => 'numeric|digits:3|required'
        ]);

        if($validator->fails())
        {
            return 'No se enviaron todos los datos requeridos.';
        }

        $ito = Ito::insert([
            'rut' => $request->rut,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'telefono' => $request->telefono,
            'correo' => $request->correo,
            'area' => $request->area
        ]);

        if(!$ito)
        {
            return 'No se pudo registrar el ito en el sistema.';
        }

        return 'Ito registrado con éxito en el sistema.';
    }





    # OBTIENE UN ITO
    public function show(int $id)
    {
        $campos = [
            'id',
            'rut',
            'nombre',
            'apellido',
            'telefono',
            'correo',
            'area'
        ];

        $ito = Ito::select($campos)->where('id', $id)->where('estado', 1)->limit(1)->get();

        if($ito->isEmpty())
        {
            return 'No se encontró el ito registrado en el sistema.';
        }
        
        return $ito;
    }





    # ACTUALIZA UN ITO
    public function update(int $id, Request $request)
    {
        $ito = Ito::find($id);

        if(!$ito)
        {
            return 'No se encontró el ito registrado en el sistema.';
        }

        $validator = Validator::make($request->all(), [
            'rut' => 'min:11|max:13',
            'nombre' => 'max:50',
            'apellido' => 'max:50',
            'telefono' => 'max:11',
            'correo' => 'max:80',
            'area' => 'numeric|digits:3',
            'estado' => 'numeric|digits:1'
        ]);

        if($validator->fails())
        {
            return 'Se encontraron errores en los datos enviados.';
        }

        if($request->has('rut'))
        {
            $ito_aux = Ito::select('id')->where('rut', $request->rut)->where('estado', 1)->limit(1)->get();

            if(!$ito_aux->isEmpty())
            {
                if($id == $ito_aux[0]['id'])
                {
                    //return 'El RUT se encuentra repetido pero es el mismo.';
                }
                else
                {
                    return 'El RUT ya se encuentra registrado en el sistema.';
                }
            }
        }

        if($request->has('rut'))
        {
            $ito->rut = $request->rut;
        }
        if($request->has('nombre'))
        {
            $ito->nombre = $request->nombre;
        }
        if($request->has('apellido'))
        {
            $ito->apellido = $request->apellido;
        }
        if($request->has('telefono'))
        {
            $ito->telefono = $request->telefono;
        }
        if($request->has('correo'))
        {
            $ito->correo = $request->correo;
        }
        if($request->has('area'))
        {
            $ito->area = $request->area;
        }
        if($request->has('estado'))
        {
            $ito->estado = $request->estado;
        }

        $ito->save();

        return 'Ito actualizado con éxito en el sistema.';
    }





    # ELIMINA UN ITO
    public function destroy(int $id)
    {
        $ito = Ito::find($id);

        if(!$ito)
        {
            return 'No se encontró el ito registrado en el sistema.';
        }

        $ito->delete();

        return 'Ito eliminado con éxito del sistema.';
    }
}