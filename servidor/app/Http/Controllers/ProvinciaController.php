<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Provincia;

class ProvinciaController extends Controller
{
    # OBTIENE UNA LISTA DE PROVINCIAS
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
            'region'
        ];

        $provincias = Provincia::select($campos)->skip($pagina)->limit(50)->get();

        if($provincias->isEmpty())
        {
            return 'No se encontraron provincias registradas en el sistema.';
        }

        return $provincias;
    }





    # OBTIENE UNA PROVINCIA
    public function show(int $id)
    {
        $campos = [
            'id',
            'nombre',
            'region'
        ];

        $provincia = Provincia::select($campos)->where('id', $id)->limit(1)->get();

        if($provincia->isEmpty())
        {
            return 'No se encontró la provincia registrada en el sistema.';
        }
        
        return $provincia;
    }
}