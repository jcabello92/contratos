<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ito extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'itos';
    protected $fillable = [
        'rut',
        'nombre',
        'apellido',
        'telefono',
        'correo',
        'area',
        'estado'
    ];
}