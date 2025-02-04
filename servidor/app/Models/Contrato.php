<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contrato extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'contratos';
    protected $fillable = [
        'nombre',
        'fecha_inicio',
        'fecha_termino',
        'proveedor',
        'ito',
        'estado'
    ];
}