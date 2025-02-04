<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'proveedores';
    protected $fillable = [
        'rut',
        'razon_social',
        'direccion',
        'comuna',
        'telefono',
        'correo',
        'representante',
        'estado'
    ];
}