<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Region;

class RegionController extends Controller
{
    # OBTIENE UNA LISTA DE REGIONES
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
            'abreviatura',
            'capital'
        ];

        $regiones = Region::select($campos)->skip($pagina)->limit(50)->get();

        if($regiones->isEmpty())
        {
            return 'No se encontraron regiones registradas en el sistema.';
        }

        return $regiones;
    }





    # OBTIENE UNA REGION
    public function show(int $id)
    {
        $campos = [
            'id',
            'nombre',
            'abreviatura',
            'capital'
        ];

        $region = Region::select($campos)->where('id', $id)->limit(1)->get();

        if($region->isEmpty())
        {
            return 'No se encontró la región registrada en el sistema.';
        }
        
        return $region;
    }
}