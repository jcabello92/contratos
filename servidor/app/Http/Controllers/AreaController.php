<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Area;

class AreaController extends Controller
{
    # OBTIENE UNA LISTA DE AREAS
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
            'area'
        ];

        $areas = Area::select($campos)->where('estado', 1)->skip($pagina)->limit(50)->get();

        if($areas->isEmpty())
        {
            return 'No se encontraron áreas registradas en el sistema.';
        }

        return $areas;
    }





    # OBTIENE UN AREA
    public function show(int $id)
    {
        $campos = [
            'id',
            'nombre',
            'area'
        ];

        $area = Area::select($campos)->where('id', $id)->where('estado', 1)->limit(1)->get();

        if($area->isEmpty())
        {
            return 'No se encontró el área registrada en el sistema.';
        }
        
        return $area;
    }
}