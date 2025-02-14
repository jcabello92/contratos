<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Comuna;

class ComunaController extends Controller
{
    # OBTIENE UNA LISTA DE COMUNAS
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
            'provincia'
        ];

        $comunas = Comuna::select($campos)->skip($pagina)->limit(50)->get();

        if($comunas->isEmpty())
        {
            return 'No se encontraron comunas registradas en el sistema.';
        }

        return $comunas;
    }





    # OBTIENE UNA COMUNA
    public function show(int $id)
    {
        $campos = [
            'id',
            'nombre',
            'provincia'
        ];

        $comuna = Comuna::select($campos)->where('id', $id)->limit(1)->get();

        if($comuna->isEmpty())
        {
            return 'No se encontró la comuna registrada en el sistema.';
        }
        
        return $comuna;
    }
}