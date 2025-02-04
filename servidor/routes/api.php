<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\RepresentanteController;
use App\Http\Controllers\ItoController;
use App\Http\Controllers\ContratoController;
use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\TipoDocumentoController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\ComunaController;
use App\Http\Controllers\ProvinciaController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\RolController;

# USUARIOS
Route::get('/usuarios/pagina/{pagina}', [UsuarioController::class, 'index']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::get('/usuarios/id/{id}', [UsuarioController::class, 'show']);
Route::patch('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);

Route::get('/usuarios', [UsuarioController::class, 'login']);

# PROVEEDORES
Route::get('/proveedores/pagina/{pagina}', [ProveedorController::class, 'index']);
Route::post('/proveedores', [ProveedorController::class, 'store']);
Route::get('/proveedores/id/{id}', [ProveedorController::class, 'show']);
Route::patch('/proveedores/{id}', [ProveedorController::class, 'update']);
Route::delete('/proveedores/{id}', [ProveedorController::class, 'destroy']);

# REPRESENTANTES
Route::get('/representantes/pagina/{pagina}', [RepresentanteController::class, 'index']);
Route::post('/representantes', [RepresentanteController::class, 'store']);
Route::get('/representantes/id/{id}', [RepresentanteController::class, 'show']);
Route::patch('/representantes/{id}', [RepresentanteController::class, 'update']);
Route::delete('/representantes/{id}', [RepresentanteController::class, 'destroy']);

# ITOS
Route::get('/itos/pagina/{pagina}', [ItoController::class, 'index']);
Route::post('/itos', [ItoController::class, 'store']);
Route::get('/itos/id/{id}', [ItoController::class, 'show']);
Route::patch('/itos/{id}', [ItoController::class, 'update']);
Route::delete('/itos/{id}', [ItoController::class, 'destroy']);

# CONTRATOS
Route::get('/contratos/pagina/{pagina}', [ContratoController::class, 'index']);
Route::post('/contratos', [ContratoController::class, 'store']);
Route::get('/contratos/id/{id}', [ContratoController::class, 'show']);
Route::patch('/contratos/{id}', [ContratoController::class, 'update']);
Route::delete('/contratos/{id}', [ContratoController::class, 'destroy']);

# DOCUMENTOS
Route::get('/documentos/pagina/{pagina}', [DocumentoController::class, 'index']);
Route::post('/documentos', [DocumentoController::class, 'store']);
Route::get('/documentos/id/{id}', [DocumentoController::class, 'show']);
Route::patch('/documentos/{id}', [DocumentoController::class, 'update']);
Route::delete('/documentos/{id}', [DocumentoController::class, 'destroy']);

# TIPOS DOCUMENTOS
Route::get('/tipos_documentos/pagina/{pagina}', [TipoDocumentoController::class, 'index']);
Route::post('/tipos_documentos', [TipoDocumentoController::class, 'store']);
Route::get('/tipos_documentos/id/{id}', [TipoDocumentoController::class, 'show']);
Route::patch('/tipos_documentos/{id}', [TipoDocumentoController::class, 'update']);
Route::delete('/tipos_documentos/{id}', [TipoDocumentoController::class, 'destroy']);

# AREAS
Route::get('/areas/pagina/{pagina}', [AreaController::class, 'index']);
Route::get('/areas/id/{id}', [AreaController::class, 'show']);

# COMUNAS
Route::get('/comunas/pagina/{pagina}', [ComunaController::class, 'index']);
Route::get('/comunas/id/{id}', [ComunaController::class, 'show']);

# PROVINCIAS
Route::get('/provincias/pagina/{pagina}', [ProvinciaController::class, 'index']);
Route::get('/provincias/id/{id}', [ProvinciaController::class, 'show']);

# REGIONES
Route::get('/regiones/pagina/{pagina}', [RegionController::class, 'index']);
Route::get('/regiones/id/{id}', [RegionController::class, 'show']);

# ROLES
Route::get('/roles/pagina/{pagina}', [RolController::class, 'index']);
Route::get('/roles/id/{id}', [RolController::class, 'show']);