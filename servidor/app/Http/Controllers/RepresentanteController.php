<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Representante;

class RepresentanteController extends Controller
{
    # OBTIENE UNA LISTA DE REPRESENTANTES
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
            'correo'
        ];

        $representantes = Representante::select($campos)->where('estado', 1)->skip($pagina)->limit(50)->get();

        if($representantes->isEmpty())
        {
            return 'No se encontraron representantes registrados en el sistema.';
        }

        return $representantes;
    }





    # AGREGA UN REPRESENTANTE
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rut' => 'min:11|max:13|required|unique:App\Models\Representante,rut',
            'nombre' => 'max:50|required',
            'apellido' => 'max:50|required',
            'telefono' => 'max:11',
            'correo' => 'max:80|required'
        ]);

        if($validator->fails())
        {
            return 'No se enviaron todos los datos requeridos.';
        }

        $representante = Representante::insert([
            'rut' => $request->rut,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'telefono' => $request->telefono,
            'correo' => $request->correo
        ]);

        if(!$representante)
        {
            return 'No se pudo registrar el representante en el sistema.';
        }

        return 'Representante registrado con éxito en el sistema.';
    }





    # OBTIENE UN REPRESENTANTE
    public function show(int $id)
    {
        $campos = [
            'id',
            'rut',
            'nombre',
            'apellido',
            'telefono',
            'correo'
        ];

        $representante = Representante::select($campos)->where('id', $id)->where('estado', 1)->limit(1)->get();

        if($representante->isEmpty())
        {
            return 'No se encontró el representante registrado en el sistema.';
        }
        
        return $representante;
    }





    # ACTUALIZA UN REPRESENTANTE
    public function update(int $id, Request $request)
    {
        $representante = Representante::find($id);

        if(!$representante)
        {
            return 'No se encontró el representante registrado en el sistema.';
        }

        $validator = Validator::make($request->all(), [
            'rut' => 'min:11|max:13',
            'nombre' => 'max:50',
            'apellido' => 'max:50',
            'telefono' => 'max:11',
            'correo' => 'max:80',
            'estado' => 'numeric|digits:1'
        ]);

        if($validator->fails())
        {
            return 'Se encontraron errores en los datos enviados.';
        }

        if($request->has('rut'))
        {
            $representante_aux = Representante::select('id')->where('rut', $request->rut)->where('estado', 1)->limit(1)->get();

            if(!$representante_aux->isEmpty())
            {
                if($id == $representante_aux[0]['id'])
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
            $representante->rut = $request->rut;
        }
        if($request->has('nombre'))
        {
            $representante->nombre = $request->nombre;
        }
        if($request->has('apellido'))
        {
            $representante->apellido = $request->apellido;
        }
        if($request->has('telefono'))
        {
            $representante->telefono = $request->telefono;
        }
        if($request->has('correo'))
        {
            $representante->correo = $request->correo;
        }
        if($request->has('estado'))
        {
            $representante->estado = $request->estado;
        }

        $representante->save();

        return 'Representante actualizado con éxito en el sistema.';
    }





    # ELIMINA UN REPRESENTANTE
    public function destroy(int $id)
    {
        $representante = Representante::find($id);

        if(!$representante)
        {
            return 'No se encontró el representante registrado en el sistema.';
        }

        $representante->delete();

        return 'Representante eliminado con éxito del sistema.';
    }
}