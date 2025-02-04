<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Rol;

class RolController extends Controller
{
    # OBTIENE UNA LISTA DE ROLES
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

        $roles = Rol::select($campos)->where('estado', 1)->skip($pagina)->limit(50)->get();

        if($roles->isEmpty())
        {
            return 'No se encontraron roles registrados en el sistema.';
        }

        return $roles;
    }





    # OBTIENE UN ROL
    public function show(int $id)
    {
        $campos = [
            'id',
            'nombre'
        ];

        $rol = Rol::select($campos)->where('id', $id)->where('estado', 1)->limit(1)->get();

        if($rol->isEmpty())
        {
            return 'No se encontró el rol registrado en el sistema.';
        }
        
        return $rol;
    }
}