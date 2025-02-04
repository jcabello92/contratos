<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Representante extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'representantes';
    protected $fillable = [
        'rut',
        'nombre',
        'apellido',
        'telefono',
        'correo',
        'estado'
    ];
}