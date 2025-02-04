<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    public $timestamps = false;

    protected $connection = 'mariadb';
    protected $table = 'documentos';
    protected $fillable = [
        'nombre',
        'fecha_subida',
        'hora_subida',
        'tipo_documento',
        'contrato',
        'estado'
    ];
}