import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css',
  imports: [NgForOf, HttpClientModule, FormsModule, NgIf, NgClass],
  standalone: true
})
export class DocumentosComponent implements OnInit {
  documentos: any[] = [];
  modalAbiertoCrear: boolean = false;
  modalAbiertoEliminar: boolean = false;
  showModalEditar = false;

  nuevoDocumento = {
    nombre: '',
    fecha_subida: '',
    hora_subida: '',
    tipo_documento: { id: 0, nombre: '' },
    contrato: { id: 0, nombre: '' }
  };

  documentoSeleccionado: boolean[] = [];
  documentoActual: any = {};
  documentosParaEliminar: any[] = [];
  idsParaEliminar: string = '';
  //archivo seleccionado para subir al sistema
  selectedFile: File | null = null;

  //filtros
  campoOrden: string = 'nombre'; // Valor predeterminado
  orden: string = 'asc'; // Valor predeterminado

  //Páginación
  DocumentosAObtener:number = 1 ;

  //Para los combobox del crud
  tiposDocumentos: any[] = [];
  contratos: any[] = [];


  constructor(private http: HttpClient, private router: Router) {}

  async ngOnInit() {
    await this.obtenerTiposDocumentos();
    await this.obtenerContratos();
    this.obtenerDocumentos();
  }

  async obtenerDocumentos() {
    const url = `http://localhost:8000/api/documentos/pagina/${this.DocumentosAObtener}`;
    this.http.get<any[]>(url).subscribe(
      async data => {
        if (data.length > 0) {
          this.documentos = data;
          this.documentoSeleccionado = new Array(data.length).fill(false);
          await this.asignarTipoDocumentoYContrato();
        } else {
          alert('No hay más documentos para continuar avanzando en la página');
          this.DocumentosAObtener--;
        }
      },
      error => {
        console.error('Error al obtener documentos:', error);
      }
    );
  }

  async asignarTipoDocumentoYContrato() {
    try {
      this.documentos.forEach(documento => {
        const tipoDocumentoEncontrado = this.tiposDocumentos.find(tipo => tipo.id === documento.tipo_documento);
        documento.tipo_documento = tipoDocumentoEncontrado ? tipoDocumentoEncontrado.nombre : "Desconocido";

        const contratoEncontrado = this.contratos.find(contrato => contrato.id === documento.contrato);
        documento.contrato = contratoEncontrado ? contratoEncontrado.nombre : "Desconocido";
      });
    } catch (error) {
      console.error('Error al asignar tipo de documento y contrato:', error);
    }
  }

  async obtenerTiposDocumentos() {
    let pagina = 1;
    this.tiposDocumentos = [];
    let continuar = true;

    while (continuar) {
      try {
        const respuesta: any = await this.http.get(`http://localhost:8000/api/tipos_documentos/pagina/${pagina}`).toPromise();

        if (!respuesta || (typeof respuesta === 'string' && respuesta.includes('No se encontraron tipos de documentos registrados'))) {
          continuar = false;
        } else if (Array.isArray(respuesta)) {
          this.tiposDocumentos = [...this.tiposDocumentos, ...respuesta];
          pagina++;
        } else {
          console.warn("Formato inesperado en la respuesta de tipos de documentos:", respuesta);
          continuar = false;
        }
      } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
        continuar = false;
      }
    }
  }

  async obtenerContratos() {
    let pagina = 1;
    this.contratos = [];
    let continuar = true;

    while (continuar) {
      try {
        const respuesta: any = await this.http.get(`http://localhost:8000/api/contratos/pagina/${pagina}`).toPromise();

        if (!respuesta || (typeof respuesta === 'string' && respuesta.includes('No se encontraron contratos registrados'))) {
          continuar = false;
        } else if (Array.isArray(respuesta)) {
          this.contratos = [...this.contratos, ...respuesta];
          pagina++;
        } else {
          console.warn("Formato inesperado en la respuesta de contratos:", respuesta);
          continuar = false;
        }
      } catch (error) {
        console.error('Error al obtener contratos:', error);
        continuar = false;
      }
    }
  }

  abrirModalDocumentosCrear() {
    this.modalAbiertoCrear = true;
  }

  cerrarModalDocumentosCrear() {
    this.modalAbiertoCrear = false;
    this.nuevoDocumento = {
      nombre: '',
      fecha_subida: '',
      hora_subida: '',
      tipo_documento: { id: 0, nombre: '' },
      contrato: { id: 0, nombre: '' }
    };
    this.selectedFile = null;
  }

  // Método para abrir el input de archivo "oculto"
  abrirSelectorArchivos(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  // Método que se llama cuando el usuario selecciona un archivo
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  crearDocumento() {
    if (
      this.nuevoDocumento.nombre &&
      this.nuevoDocumento.fecha_subida &&
      this.nuevoDocumento.hora_subida &&
      this.nuevoDocumento.tipo_documento.id &&
      this.nuevoDocumento.contrato.id
    ) {
      const formData = new FormData();
      formData.append('nombre', this.nuevoDocumento.nombre);
      formData.append('fecha_subida', this.nuevoDocumento.fecha_subida);
      formData.append('hora_subida', this.nuevoDocumento.hora_subida);
      formData.append('tipo_documento', this.nuevoDocumento.tipo_documento.id.toString().padStart(2, '0'));
      formData.append('contrato', this.nuevoDocumento.contrato.id.toString().padStart(4, '0'));

      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile, this.selectedFile.name);
      }

      const url = 'http://localhost:8000/api/documentos';

      this.http.post(url, formData, { responseType: 'text' }).subscribe(
        response => {
          alert("Documento creado con éxito");
          this.obtenerDocumentos();
          this.cerrarModalDocumentosCrear();
        },
        error => {
          console.error('Error al crear documento:', error);
          alert("No se pudo crear el documento, hay un dato mal ingresado");
        }
      );
    } else {
      alert("No están todos los datos ingresados");
    }
  }


  // Método para manejar el cambio en los checkboxes
  onCheckboxChange(index: number) {
    this.documentoSeleccionado[index] = !this.documentoSeleccionado[index];
  }

// Método para abrir el modal de actualización
  actualizarDocumento() {
    const seleccionados = this.documentos.filter((_, index) => this.documentoSeleccionado[index]);
    console.log('Documentos seleccionados para actualizar:', seleccionados);
    if (seleccionados.length === 1) {
      // Copiamos el documento seleccionado para trabajar sobre él sin modificar el original
      this.documentoActual = { ...seleccionados[0] };

      // Rellenamos el objeto de edición (nuevoDocumento) con los datos actuales
      this.nuevoDocumento.nombre = this.documentoActual.nombre;
      this.nuevoDocumento.fecha_subida = this.documentoActual.fecha_subida;
      this.nuevoDocumento.hora_subida = this.documentoActual.hora_subida;
      // Para los combobox: buscamos en los arrays de tipos y contratos usando el nombre.
      this.nuevoDocumento.tipo_documento = this.tiposDocumentos.find(tipo => tipo.nombre === this.documentoActual.tipo_documento)
        || { id: 0, nombre: this.documentoActual.tipo_documento };
      this.nuevoDocumento.contrato = this.contratos.find(contrato => contrato.nombre === this.documentoActual.contrato)
        || { id: 0, nombre: this.documentoActual.contrato };

      this.showModalEditar = true;
    } else {
      alert(seleccionados.length > 1
        ? 'Solo puedes seleccionar un documento para actualizar.'
        : 'Selecciona un documento para actualizar.');
    }
  }

// Cierra el modal de actualización sin realizar cambios
  cancelarActualizacion() {
    this.showModalEditar = false;
  }

// Método para enviar la actualización del documento (sin modificar el archivo)
  actualizarElDocumento() {
    const doc = this.nuevoDocumento;
    let url = `http://localhost:8000/api/documentos/${this.documentoActual.id}?`;
    const params: string[] = [];

    if (doc.nombre) params.push(`nombre=${doc.nombre}`);
    if (doc.fecha_subida) params.push(`fecha_subida=${doc.fecha_subida}`);
    if (doc.hora_subida) params.push(`hora_subida=${doc.hora_subida}`);
    if (doc.tipo_documento && doc.tipo_documento.id)
      params.push(`tipo_documento=${doc.tipo_documento.id.toString().padStart(2, '0')}`);
    if (doc.contrato && doc.contrato.id)
      params.push(`contrato=${doc.contrato.id.toString().padStart(4, '0')}`);

    if (params.length > 0) {
      url += params.join('&');
    }

    if (doc.nombre && doc.fecha_subida && doc.hora_subida && doc.tipo_documento && doc.contrato) {
      this.http.patch(url, {}, { responseType: 'text' }).subscribe(
        response => {
          if (response === "Se encontraron errores en los datos enviados.") {
            alert("Un dato ingresado, no fue reconocido por el sistema");
          } else {
            alert("Documento actualizado correctamente");
            this.showModalEditar = false;
            this.obtenerDocumentos(); // Actualiza la lista de documentos
          }
        },
        error => {
          console.error('Error al actualizar documento:', error);
          alert("No se pudo actualizar el documento, hay un dato mal ingresado");
        }
      );
    } else {
      alert("No están todos los datos ingresados");
    }
  }


  // Método para iniciar la eliminación: se obtienen los documentos seleccionados
  eliminarDocumento() {
    const seleccionados = this.documentos.filter((_, index) => this.documentoSeleccionado[index]);

    if (seleccionados.length > 0) {
      const idsSeleccionados = seleccionados.map(doc => doc.id);
      this.obtenerDocumentosParaEliminar(idsSeleccionados);
      this.modalAbiertoEliminar = true;
    } else {
      alert('Ningún documento fue seleccionado para eliminar');
    }
  }

// Se consulta la API para obtener cada documento completo (usando el endpoint correcto)
  obtenerDocumentosParaEliminar(ids: number[]) {
    // Usamos el endpoint sin el segmento "id"
    const apiUrl = 'http://localhost:8000/api/documentos/id/';
    const requests = ids.map(id => this.http.get(`${apiUrl}${id}`));

    forkJoin(requests).subscribe(
      (respuestas: any[]) => {
        // Asumimos que cada respuesta es el objeto completo del documento
        this.documentosParaEliminar = respuestas;
        console.log('Documentos a eliminar:', this.documentosParaEliminar);
      },
      error => {
        console.error('Error al obtener los documentos:', error);
      }
    );
  }

// Cierra el modal de eliminación y limpia las variables asociadas
  cerrarModalEliminar() {
    this.modalAbiertoEliminar = false;
    this.idsParaEliminar = '';
    this.documentosParaEliminar = [];
  }

// Confirma la eliminación, enviando una petición DELETE para cada documento
  confirmarEliminacion() {
    const seleccionados = this.documentosParaEliminar;

    seleccionados.forEach(doc => {
      const url = `http://localhost:8000/api/documentos/${doc.id}`;
      this.http.delete(url, { responseType: 'text' }).subscribe(
        response => {
          alert('Documento(s) eliminado(s) con éxito');
          this.obtenerDocumentos(); // Actualiza la lista de documentos tras la eliminación
        },
        error => {
          console.error(`Error al eliminar el documento con ID ${doc.id}:`, error);
          alert('Error al eliminar uno o más documento(s)');
        }
      );
    });

    this.cerrarModalEliminar();
  }



  descargarDocumento(documento: any) {
    const url = `http://localhost:8000/api/documentos/id/${documento.id}`;

    // Pedimos el archivo como 'blob' (binario)
    this.http.get(url, { responseType: 'blob' }).subscribe(
      async (blob) => {
        // Convertimos el blob a texto, para detectar si es un mensaje de error
        const text = await blob.text();

        // Si el texto contiene 'No se encontró el documento registrado en el sistema',
        // significa que el backend devolvió un error en vez de un archivo
        if (text.includes('No se encontró el documento registrado en el sistema.')) {
          alert('No se encontró un archivo en el sistema para este documento');
          return;
        }

        // Si no contiene el mensaje de error, asumimos que es un archivo válido
        // Para descargarlo en el navegador:
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = documento.nombre || 'documento.pdf'; // Nombre sugerido del archivo
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      },
      (error) => {
        console.error('Error al descargar el documento:', error);
        alert('No se encontró un archivo en el sistema para este documento');
      }
    );
  }


  async filtrarDocumentos() {
    const url = `http://localhost:8000/api/documentos/pagina/${this.DocumentosAObtener}`;

    this.http.get<any[]>(url).subscribe(
      async (data) => {
        this.documentos = data;

        // Esperamos que los nombres de tipo_documento y contrato sean asignados
        await this.asignarTipoDocumentoYContrato();

        // Ahora ordenamos los datos con los valores correctos
        this.documentos.sort((a, b) => {
          let valorA: any, valorB: any;

          if (this.campoOrden === 'nombre') {
            valorA = a.nombre.toLowerCase();
            valorB = b.nombre.toLowerCase();
          } else if (this.campoOrden === 'FechaSubida') {
            valorA = a.fecha_subida ? new Date(a.fecha_subida) : new Date(0);
            valorB = b.fecha_subida ? new Date(b.fecha_subida) : new Date(0);
          } else if (this.campoOrden === 'HoraSubida') {
            valorA = a.hora_subida ? this.parsearHora(a.hora_subida) : 0;
            valorB = b.hora_subida ? this.parsearHora(b.hora_subida) : 0;
          } else {
            return 0; // Si el campo no es válido, no hacemos nada
          }

          return this.orden === 'asc' ? (valorA > valorB ? 1 : -1) : (valorA < valorB ? 1 : -1);
        });
      },
      (error) => {
        console.error('Error al filtrar documentos:', error);
      }
    );
  }



  parsearHora(hora: string): number {
    if (!hora) return 0;

    let horas = 0, minutos = 0;

    if (hora.includes(':')) {
      // Maneja el formato correcto (ejemplo: "14:40" o "1:13")
      let partes = hora.split(':').map(Number);
      horas = partes[0];
      minutos = partes[1];
    } else if (hora.includes('.')) {
      // Maneja formato incorrecto como "14.40" convirtiéndolo a "14:40"
      let partes = hora.split('.').map(Number);
      horas = partes[0];
      minutos = partes[1];
    }

    return horas * 60 + minutos; // Convierte todo a minutos
  }


  async gestionPaginas(accion: string) {
    if (accion === 'anterior') {
      if (this.DocumentosAObtener > 1) {
        this.DocumentosAObtener--;
        await this.obtenerDocumentos();
      } else {
        alert('No hay una página anterior a esta.');
      }
    } else if (accion === 'siguiente') {
      const paginaSiguiente = this.DocumentosAObtener + 1;
      const url = `http://localhost:8000/api/documentos/pagina/${paginaSiguiente}`;

      this.http.get<string>(url, { responseType: 'text' as 'json' }).subscribe(
        response => {
          try {
            // Intentamos parsear como JSON
            const jsonResponse = JSON.parse(response);

            if (Array.isArray(jsonResponse) && jsonResponse.length > 0) {
              this.DocumentosAObtener++;
              this.documentos = jsonResponse;
              this.asignarTipoDocumentoYContrato()
            } else {
              alert('No hay más documentos disponibles.');
            }
          } catch (e) {
            // Si falla el JSON.parse, significa que la respuesta era texto plano
            alert('No hay más documentos disponibles.');
          }
        },
        error => {
          if (error instanceof HttpErrorResponse && typeof error.error === 'string') {
            // Caso donde la API devuelve un mensaje de error en texto plano
            alert('No hay más documentos disponibles.');
          } else {
            console.error('Error al obtener documentos:', error);
            alert('Ocurrió un error al obtener documentos. Intente nuevamente.');
          }
        }
      );

    }
  }


}
