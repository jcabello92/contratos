import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obtenerDocumentos();
  }

  obtenerDocumentos() {
    this.http.get<any>('http://localhost:8000/api/documentos/pagina/1').subscribe(
      data => {
        this.documentos = data;
      },
      error => {
        console.error('Error al obtener documentos:', error);
      }
    );
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
            console.log('Documento creado:', response);
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
            console.log('Documento actualizado:', response);
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
      this.idsParaEliminar = seleccionados.map(doc => doc.id).join(', ');
      this.modalAbiertoEliminar = true;
    } else {
      console.log('Ningún documento seleccionado para eliminar');
    }
  }

  cerrarModalEliminar() {
    this.modalAbiertoEliminar = false;
    this.idsParaEliminar = '';
  }

  confirmarEliminacion() {
    const seleccionados = this.documentos.filter((_, index) => this.documentoSeleccionado[index]);

    seleccionados.forEach(doc => {
      const url = `http://localhost:8000/api/documentos/${doc.id}`;

      this.http.delete(url, { responseType: 'text' }).subscribe(
        response => {
          console.log(`Documento con ID ${doc.id} eliminado:`, response);
          alert("documento(s) eliminado(s) con éxito")
          this.obtenerDocumentos();
        },
        error => {
          console.error(`Error al eliminar el documento con ID ${doc.id}:`, error);
          alert("Error al eliminar un(os) documento(s)")
        }
      );
    });

    this.cerrarModalEliminar();
  }

  filtrarDocumentos() {
    const url = `http://localhost:8000/api/documentos/pagina/1`;

    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.documentos = data.sort((a, b) => {
          let valorA: any = a[this.campoOrden];
          let valorB: any = b[this.campoOrden];

          if (this.campoOrden === 'fecha_subida') {
            valorA = new Date(valorA);
            valorB = new Date(valorB);
          } else if (this.campoOrden === 'hora_subida') {
            valorA = this.parsearHora(valorA);
            valorB = this.parsearHora(valorB);
          } else {
            valorA = valorA ? valorA.toString().toLowerCase() : '';
            valorB = valorB ? valorB.toString().toLowerCase() : '';
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
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }


}
