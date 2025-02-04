<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Usuario;

class UsuarioController extends Controller
{
    # OBTIENE UNA LISTA DE USUARIOS
    public function index(int $pagina)
    {
        $pagina--;

        if($pagina > 0)
        {
            $pagina = $pagina * 50;
        }

        $campos = [
            'id',
            'usuario',
            'rut',
            'nombre',
            'apellido',
            'telefono',
            'correo',
            'rol'
        ];

        $usuarios = Usuario::select($campos)->where('estado', 1)->skip($pagina)->limit(50)->get();

        if($usuarios->isEmpty())
        {
            return 'No se encontraron usuarios registrados en el sistema.';
        }

        return $usuarios;
    }





    # AGREGA UN USUARIO
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'usuario' => 'max:30|required|unique:App\Models\Usuario,usuario',
            'contrasena' => 'size:32|required',
            'rut' => 'min:11|max:13|required|unique:App\Models\Usuario,rut',
            'nombre' => 'max:50|required',
            'apellido' => 'max:50|required',
            'telefono' => 'max:11',
            'correo' => 'max:80|required',
            'rol' => 'numeric|digits:1|required'
        ]);

        if($validator->fails())
        {
            return 'No se enviaron todos los datos requeridos.';
        }

        $usuario = Usuario::insert([
            'usuario' => $request->usuario,
            'contrasena' => $request->contrasena,
            'rut' => $request->rut,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'telefono' => $request->telefono,
            'correo' => $request->correo,
            'rol' => $request->rol
        ]);

        if(!$usuario)
        {
            return 'No se pudo registrar el usuario en el sistema.';
        }

        return 'Usuario registrado con éxito en el sistema.';
    }





    # OBTIENE UN USUARIO
    public function show(int $id)
    {
        $campos = [
            'id',
            'usuario',
            'rut',
            'nombre',
            'apellido',
            'telefono',
            'correo',
            'rol'
        ];

        $usuario = Usuario::select($campos)->where('id', $id)->where('estado', 1)->limit(1)->get();

        if($usuario->isEmpty())
        {
            return 'No se encontró el usuario registrado en el sistema.';
        }
        
        return $usuario;
    }





    # ACTUALIZA UN USUARIO
    public function update(int $id, Request $request)
    {
        $usuario = Usuario::find($id);

        if(!$usuario)
        {
            return 'No se encontró el usuario registrado en el sistema.';
        }

        $validator = Validator::make($request->all(), [
            'usuario' => 'max:30',
            'contrasena' => 'size:32',
            'rut' => 'min:11|max:13',
            'nombre' => 'max:50',
            'apellido' => 'max:50',
            'telefono' => 'max:11',
            'correo' => 'max:80',
            'rol' => 'numeric|digits:1',
            'estado' => 'numeric|digits:1'
        ]);

        if($validator->fails())
        {
            return 'Se encontraron errores en los datos enviados.';
        }

        if($request->has('usuario'))
        {
            $usuario_aux = Usuario::select('id')->where('usuario', $request->usuario)->where('estado', 1)->limit(1)->get();

            if(!$usuario_aux->isEmpty())
            {
                if($id == $usuario_aux[0]['id'])
                {
                    //return 'El usuario se encuentra repetido pero es el mismo.';
                }
                else
                {
                    return 'El usuario ya se encuentra registrado en el sistema.';
                }
            }
        }

        if($request->has('rut'))
        {
            $usuario_aux = Usuario::select('id')->where('rut', $request->rut)->where('estado', 1)->limit(1)->get();

            if(!$usuario_aux->isEmpty())
            {
                if($id == $usuario_aux[0]['id'])
                {
                    //return 'El RUT se encuentra repetido pero es el mismo.';
                }
                else
                {
                    return 'El RUT ya se encuentra registrado en el sistema.';
                }
            }
        }

        if($request->has('usuario'))
        {
            $usuario->usuario = $request->usuario;
        }
        if($request->has('contrasena'))
        {
            $usuario->contrasena = $request->contrasena;
        }
        if($request->has('rut'))
        {
            $usuario->rut = $request->rut;
        }
        if($request->has('nombre'))
        {
            $usuario->nombre = $request->nombre;
        }
        if($request->has('apellido'))
        {
            $usuario->apellido = $request->apellido;
        }
        if($request->has('telefono'))
        {
            $usuario->telefono = $request->telefono;
        }
        if($request->has('correo'))
        {
            $usuario->correo = $request->correo;
        }
        if($request->has('rol'))
        {
            $usuario->rol = $request->rol;
        }
        if($request->has('estado'))
        {
            $usuario->estado = $request->estado;
        }

        $usuario->save();

        return 'Usuario actualizado con éxito en el sistema.';
    }





    # ELIMINA UN USUARIO
    public function destroy(int $id)
    {
        $usuario = Usuario::find($id);

        if(!$usuario)
        {
            return 'No se encontró el usuario registrado en el sistema.';
        }

        $usuario->delete();

        return 'Usuario eliminado con éxito del sistema.';
    }





    # LOGIN DE UN USUARIO
    public function login(Request $request)
    {
        $campos = [
            'id',
            'usuario',
            'contrasena',
            'rut',
            'nombre',
            'apellido',
            'telefono',
            'correo',
            'rol'
        ];
        
        $usuario = Usuario::select($campos)->where('usuario', $request->usuario)->where('contrasena', $request->contrasena)->where('estado', 1)->limit(1)->get();

        if($usuario->isEmpty())
        {
            return 'No se encontró el usuario registrado en el sistema.';
        }
        
        return $usuario;
    }
}