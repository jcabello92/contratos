import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css',
  imports: [NgForOf, HttpClientModule, FormsModule, NgIf],
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
    tipo_documento: '',
    contrato:''
  };

  documentoSeleccionado: boolean[] = [];
  documentoActual: any = {};
  documentosParaEliminar: any[] = [];
  idsParaEliminar: string = '';

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

          // Hacer el match de tipo_documento y contrato
          await this.asignarTipoDocumentoYContrato();
        } else {
          alert('No hay más documentos para continuar avanzando en la página');
          this.DocumentosAObtener--; // Revertimos el cambio si no hay más datos
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
        // Buscar el tipo de documento correspondiente
        const tipoDocumentoEncontrado = this.tiposDocumentos.find(tipo => tipo.id === documento.tipo_documento);
        documento.tipo_documento = tipoDocumentoEncontrado ? tipoDocumentoEncontrado.nombre : "Desconocido";

        // Buscar el contrato correspondiente
        const contratoEncontrado = this.contratos.find(contrato => contrato.id === documento.contrato);
        documento.contrato = contratoEncontrado ? contratoEncontrado.nombre : "Desconocido";
      });
    } catch (error) {
      console.error('Error al asignar tipo de documento y contrato:', error);
    }
  }

  async obtenerTiposDocumentos() {
    let pagina = 1;
    this.tiposDocumentos = []; // Reiniciamos el array
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
    this.contratos = []; // Reiniciamos el array
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
    this.nuevoDocumento = { nombre: '', fecha_subida: '', hora_subida: '', tipo_documento: '', contrato: '' };
  }

  crearDocumento() {
    // Asegurar que tipo_documento tenga al menos 2 dígitos
    this.nuevoDocumento.tipo_documento = this.nuevoDocumento.tipo_documento.padStart(2, '0');

    // Asegurar que contrato tenga al menos 4 dígitos
    this.nuevoDocumento.contrato = this.nuevoDocumento.contrato.padStart(4, '0');

    const params = new URLSearchParams();
    params.set('nombre', this.nuevoDocumento.nombre);
    params.set('fecha_subida', this.nuevoDocumento.fecha_subida);
    params.set('hora_subida', this.nuevoDocumento.hora_subida);
    params.set('tipo_documento', this.nuevoDocumento.tipo_documento);
    params.set('contrato', this.nuevoDocumento.contrato);

    if(this.nuevoDocumento.nombre && this.nuevoDocumento.fecha_subida && this.nuevoDocumento.hora_subida && this.nuevoDocumento.tipo_documento && this.nuevoDocumento.contrato){
      const url = `http://localhost:8000/api/documentos?${params.toString()}`;

      this.http.post(url, {}, { responseType: 'text' }).subscribe(
        response => {
          if(response == "No se enviaron todos los datos requeridos."){
            alert("Un dato ingresado, no fue reconocido por el sistema")
          }else{
            //console.log('Documento creado:', response);
            alert("El documento fue creado exitosamente")
            this.obtenerDocumentos();
            this.cerrarModalDocumentosCrear();
          }
        },
        error => {
          console.error('Error al crear documento:', error);
          alert("No se pudo crear el documento, hay un dato mal ingresado")
        }
      );
    }else{
      alert("No están todos los datos ingresados")
    }
  }


  onCheckboxChange(index: number) {
    this.documentoSeleccionado[index] = !this.documentoSeleccionado[index];
  }

  actualizarDocumento() {
    const seleccionados = this.documentos.filter((_, index) => this.documentoSeleccionado[index]);

    if (seleccionados.length === 1) {
      this.documentoActual = seleccionados[0];

      // Asegurar que tipo_documento y contrato sean strings antes de aplicar padStart
      this.nuevoDocumento = {
        nombre: this.documentoActual.nombre,
        fecha_subida: this.documentoActual.fecha_subida,
        hora_subida: this.documentoActual.hora_subida,
        tipo_documento: String(this.documentoActual.tipo_documento).padStart(2, '0'),
        contrato: String(this.documentoActual.contrato).padStart(4, '0'),
      };

      this.showModalEditar = true;
    } else {
      alert(seleccionados.length > 1 ? 'Solo puedes seleccionar un documento para actualizar.' : 'Selecciona un documento para actualizar.');
    }
  }



  cancelarActualizacion() {
    this.showModalEditar = false;
  }

  actualizarElDocumento() {
    const doc = this.nuevoDocumento;
    let url = `http://localhost:8000/api/documentos/${this.documentoActual.id}?`;

    const params: string[] = [];
    if (doc.nombre) params.push(`nombre=${doc.nombre}`);
    if (doc.fecha_subida) params.push(`fecha_subida=${doc.fecha_subida}`);
    if (doc.hora_subida) params.push(`hora_subida=${doc.hora_subida}`);
    if (doc.tipo_documento) params.push(`tipo_documento=${String(doc.tipo_documento).padStart(2, '0')}`);
    if (doc.contrato) params.push(`contrato=${String(doc.contrato).padStart(4, '0')}`);

    if (params.length > 0) {
      url += params.join('&');
    }

    if(doc.nombre && doc.fecha_subida && doc.hora_subida && doc.tipo_documento && doc.contrato){
      this.http.patch(url, {}, { responseType: 'text' }).subscribe(
        response => {
          if(response == "Se encontraron errores en los datos enviados."){
            alert("Un dato ingresado, no fue reconocido por el sistema")
          }else{
            alert("Documento actualizado correctamente")
            //console.log('Documento actualizado:', response);
            this.showModalEditar = false;
            this.obtenerDocumentos();
          }
        },
        error => {
          console.error('Error al actualizar documento:', error);
          alert("No se pudo actualizar el documento, hay un dato mal ingresado")
        }
      );
    }else{
      alert("No están todos los datos ingresados")
    }
  }


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

  obtenerDocumentosParaEliminar(ids: number[]) {
    const apiUrl = 'http://localhost:8000/api/documentos/id/';

    const requests = ids.map(id => this.http.get(`${apiUrl}${id}`));

    forkJoin(requests).subscribe(
      (respuestas: any[]) => {
        this.documentosParaEliminar = respuestas.map(respuesta => respuesta[0]);
        //console.log('Documentos a eliminar:', this.documentosParaEliminar);
      },
      error => {
        console.error('Error al obtener los documentos:', error);
      }
    );
  }


  cerrarModalEliminar() {
    this.modalAbiertoEliminar = false;
    this.idsParaEliminar = '';
    this.documentosParaEliminar = [];
  }

  confirmarEliminacion() {
    const seleccionados = this.documentosParaEliminar;

    seleccionados.forEach(doc => {
      const url = `http://localhost:8000/api/documentos/${doc.id}`;

      this.http.delete(url, { responseType: 'text' }).subscribe(
        response => {
          //console.log(`Documento con ID ${doc.id} eliminado:`, response);
          alert('Documento(s) eliminado(s) con éxito');
          this.obtenerDocumentos();
        },
        error => {
          console.error(`Error al eliminar el documento con ID ${doc.id}:`, error);
          alert('Error al eliminar un(os) documento(s)');
        }
      );
    });

    this.cerrarModalEliminar();
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
