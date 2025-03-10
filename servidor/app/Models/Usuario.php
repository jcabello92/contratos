<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'usuarios';
    protected $fillable = [
        'usuario',
        'contrasena',
        'rut',
        'nombre',
        'apellido',
        'telefono',
        'correo',
        'rol',
        'estado'
    ];
}