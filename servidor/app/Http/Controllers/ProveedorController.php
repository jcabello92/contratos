<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Proveedor;

class ProveedorController extends Controller
{
    # OBTIENE UNA LISTA DE PROVEEDORES
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
            'razon_social',
            'direccion',
            'comuna',
            'telefono',
            'correo',
            'representante'
        ];

        $proveedores = Proveedor::select($campos)->where('estado', 1)->skip($pagina)->limit(50)->get();

        if($proveedores->isEmpty())
        {
            return 'No se encontraron proveedores registrados en el sistema.';
        }

        return $proveedores;
    }





    # AGREGA UN PROVEEDOR
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rut' => 'min:11|max:13|required|unique:App\Models\Proveedor,rut',
            'razon_social' => 'max:100|required',
            'direccion' => 'max:120|required',
            'comuna' => 'numeric|digits:3|required',
            'telefono' => 'max:11',
            'correo' => 'max:80|required',
            'representante' => 'numeric|digits:4|required'
        ]);

        if($validator->fails())
        {
            return 'No se enviaron todos los datos requeridos.';
        }

        $proveedor = Proveedor::insert([
            'rut' => $request->rut,
            'razon_social' => $request->razon_social,
            'direccion' => $request->direccion,
            'comuna' => $request->comuna,
            'telefono' => $request->telefono,
            'correo' => $request->correo,
            'representante' => $request->representante
        ]);

        if(!$proveedor)
        {
            return 'No se pudo registrar el proveedor en el sistema.';
        }

        return 'Proveedor registrado con éxito en el sistema.';
    }





    # OBTIENE UN PROVEEDOR
    public function show(int $id)
    {
        $campos = [
            'id',
            'rut',
            'razon_social',
            'direccion',
            'comuna',
            'telefono',
            'correo',
            'representante'
        ];

        $proveedor = Proveedor::select($campos)->where('id', $id)->where('estado', 1)->limit(1)->get();

        if($proveedor->isEmpty())
        {
            return 'No se encontró el proveedor registrado en el sistema.';
        }
        
        return $proveedor;
    }





    # ACTUALIZA UN PROVEEDOR
    public function update(int $id, Request $request)
    {
        $proveedor = Proveedor::find($id);

        if(!$proveedor)
        {
            return 'No se encontró el proveedor registrado en el sistema.';
        }

        $validator = Validator::make($request->all(), [
            'rut' => 'min:11|max:13',
            'razon_social' => 'max:100',
            'direccion' => 'max:120',
            'comuna' => 'numeric|digits:3',
            'telefono' => 'max:11',
            'correo' => 'max:80',
            'representante' => 'numeric|digits:4',
            'estado' => 'numeric|digits:1'
        ]);

        if($validator->fails())
        {
            return 'Se encontraron errores en los datos enviados.';
        }

        if($request->has('rut'))
        {
            $proveedor_aux = Proveedor::select('id')->where('rut', $request->rut)->where('estado', 1)->limit(1)->get();

            if(!$proveedor_aux->isEmpty())
            {
                if($id == $proveedor_aux[0]['id'])
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
            $proveedor->rut = $request->rut;
        }
        if($request->has('razon_social'))
        {
            $proveedor->razon_social = $request->razon_social;
        }
        if($request->has('direccion'))
        {
            $proveedor->direccion = $request->direccion;
        }
        if($request->has('comuna'))
        {
            $proveedor->comuna = $request->comuna;
        }
        if($request->has('telefono'))
        {
            $proveedor->telefono = $request->telefono;
        }
        if($request->has('correo'))
        {
            $proveedor->correo = $request->correo;
        }
        if($request->has('representante'))
        {
            $proveedor->representante = $request->representante;
        }
        if($request->has('estado'))
        {
            $proveedor->estado = $request->estado;
        }

        $proveedor->save();

        return 'Proveedor actualizado con éxito en el sistema.';
    }





    # ELIMINA UN PROVEEDOR
    public function destroy(int $id)
    {
        $proveedor = Proveedor::find($id);

        if(!$proveedor)
        {
            return 'No se encontró el proveedor registrado en el sistema.';
        }

        $proveedor->delete();

        return 'Proveedor eliminado con éxito del sistema.';
    }
}