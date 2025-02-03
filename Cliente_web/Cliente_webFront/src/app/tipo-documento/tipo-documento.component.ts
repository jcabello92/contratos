import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./tipo-documento.component.css']
})
export class TipoDeDocumentoComponent implements OnInit {
  tiposDeDocumento: any[] = [];
  tipoDocumentoForm: FormGroup;
  modalActivo: string | null = null;
  idAEditar: number | null = null;
  idAEliminar: number | null = null;
  nuevoDocumento = { id: null, nombre: '' };
  documentoSeleccionado: any = { id: null, nombre: '' };

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.tipoDocumentoForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerTiposDeDocumento();
  }

  obtenerTiposDeDocumento(): void {
    this.http.get<any[]>('http://localhost:8000/api/tipos_documentos/pagina/1').subscribe(
      data => this.tiposDeDocumento = data,
      error => console.error('Error al obtener tipos de documento', error)
    );
  }

  abrirModal(tipo: string, documento: any = null): void {
    this.modalActivo = tipo;
    if (tipo === 'editar' && documento) {
      this.idAEditar = documento.id;
      // Establecer el valor del campo 'nombre' al valor que está editando el usuario
      this.tipoDocumentoForm.setValue({ nombre: documento.nombre });
      this.documentoSeleccionado = { ...documento };
    }
    if (tipo === 'eliminar' && documento) {
      this.idAEliminar = documento.id;
    }
  }


  cerrarModal(): void {
    this.modalActivo = null;
    this.tipoDocumentoForm.reset();
    this.idAEditar = null;
    this.idAEliminar = null;
    this.nuevoDocumento = { id: null, nombre: '' };
    this.documentoSeleccionado = { id: null, nombre: '' };
  }

  agregarTipoDocumento(): void {
    const documento = { nombre: this.nuevoDocumento.nombre }; // Solo el nombre
    if (this.nuevoDocumento.nombre.trim()) {
      this.http.post('http://localhost:8000/api/tipos_documentos', documento, { responseType: 'text' }).subscribe(
        (response) => {
          console.log(response); // Esto debería mostrar el mensaje "Tipo de documento registrado con éxito en el sistema."
          this.obtenerTiposDeDocumento();
          this.cerrarModal();
        },
        error => console.error('Error al agregar tipo de documento', error)
      );
    } else {
      console.log("El nombre del documento no es válido");
    }
  }



  actualizarTipoDocumento(): void {
    if (this.idAEditar && this.tipoDocumentoForm.valid) {
      // Accedemos directamente al valor del campo 'nombre'
      const documento = { nombre: this.documentoSeleccionado.nombre };

      this.http.patch(`http://localhost:8000/api/tipos_documentos/${this.idAEditar}`, documento, { responseType: 'text' })
        .subscribe(
          (response) => {
            console.log("Tipo de documento", documento);  // Aquí solo vemos el objeto con el campo 'nombre'
            console.log("Respuesta del servidor:", response); // Mostramos la respuesta del backend
            this.obtenerTiposDeDocumento();
            this.cerrarModal();
          },
          error => console.error('Error al actualizar tipo de documento', error)
        );
    } else {
      console.log("El formulario no es válido o el ID no está definido");
    }
  }


  eliminarTipoDocumento(): void {
    if (this.idAEliminar) {
      this.http.delete(`http://localhost:8000/api/tipos_documentos/${this.idAEliminar}`,
        { responseType: 'text' })
        .subscribe(
          () => {
            this.obtenerTiposDeDocumento();
            this.cerrarModal();
          },
          error => console.error('Error al eliminar tipo de documento', error)
        );
    }
  }

}
