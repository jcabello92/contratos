<!DOCTYPE html>
<html>
    <head>
        <title>Prueba archivos</title>
    </head>
    <body>
        <form method="post" action="/api/documentos" enctype="multipart/form-data">
        @csrf
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre"/>
            <br>
            <label for="fecha_subida">Fecha Subida</label>
            <input type="text" id="fecha_subida" name="fecha_subida"/>
            <br>
            <label for="hora_subida">Hora Subida</label>
            <input type="text" id="hora_subida" name="hora_subida"/>
            <br>
            <label for="tipo_documento">Tipo de Documento</label>
            <input type="number" id="tipo_documento" name="tipo_documento"/>
            <br>
            <label for="contrato">Contrato</label>
            <input type="number" id="contrato" name="contrato"/>
            <br>
            <label for="archivo">Archivo</label>
            <input type="file" id="archivo" name="archivo" accept=".pdf"/>
            <br>
            <button type="submit">ENVIAR</button>
        </form>
    </body>
</html>
