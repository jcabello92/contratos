<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDocumento extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'tipos_documentos';
    protected $fillable = [
        'nombre',
        'estado'
    ];
}