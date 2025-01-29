import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';


@Component({
  selector: 'app-representantes',
  templateUrl: './representantes.component.html',
  styleUrl: './representantes.component.css',
  imports: [
    NgForOf,
    HttpClientModule,
    FormsModule,
    NgIf
  ],
  standalone: true
})
export class RepresentantesComponent implements OnInit {
  representantes: any[] = []; // Lista para almacenar los datos de la API
  modalAbiertoCrear: boolean = false; // Controla la visibilidad del modal

  nuevoRepresentante = {
    rut: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: ''
  };

  representanteSeleccionado: boolean[] = [];
  representanteActual: any = {};
  showModalEditar = false;
  modalAbiertoEliminar: boolean = false; // Controla el modal de eliminación
  representantesParaEliminar: any[] = []; // Almacena los representantes seleccionados
  idsParaEliminar: string = ''; // Almacena los IDs seleccionados como string para el modal de confirmación


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obtenerRepresentantes(); // Cargar datos al iniciar el componente
  }


  // Abrir Modal
  abrirModalRepresentantesCrear() {
    this.modalAbiertoCrear = true;
  }

  // Cerrar Modal
  cerrarModalRepresentantesCrear() {
    this.modalAbiertoCrear = false;
    this.nuevoRepresentante = { rut: '', nombre: '', apellido: '', telefono: '', correo: '' }; // Reiniciar campos
  }


  obtenerRepresentantes() {
    this.http.get<any>('http://localhost:8000/api/representantes/pagina/1')
      .subscribe(
        data => {
          this.representantes = data; // Asigna los datos obtenidos a la variable
        },
        error => {
          console.error('Error al obtener representantes:', error);
        }
      );
  }

  // Crear Representante
  crearRepresentante() {
    const params = new URLSearchParams();
    params.set('rut', this.nuevoRepresentante.rut);
    params.set('nombre', this.nuevoRepresentante.nombre);
    params.set('apellido', this.nuevoRepresentante.apellido);
    params.set('telefono', this.nuevoRepresentante.telefono);
    params.set('correo', this.nuevoRepresentante.correo);

    const url = `http://localhost:8000/api/representantes?${params.toString()}`;

    this.http.post(url, {}, { responseType: 'text' }) // 👈 Esperamos respuesta de tipo texto
      .subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          this.obtenerRepresentantes(); // Actualizar la lista después de la creación
          this.cerrarModalRepresentantesCrear(); // Cerrar el modal
        },
        error => {
          console.error('Error al crear representante:', error);
        }
      );
  }


// Maneja el cambio de los checkboxes
  onCheckboxChange(index: number) {
    this.representanteSeleccionado[index] = !this.representanteSeleccionado[index];
  }

  actualizarRepresentante() {
    const seleccionados = this.representantes.filter((_, index) => this.representanteSeleccionado[index]);

    if (seleccionados.length === 1) {
      // Solo se puede actualizar un representante a la vez
      this.representanteActual = seleccionados[0];
      console.log(this.representanteActual)
      this.showModalEditar = true;
    } else if (seleccionados.length > 1) {
      // Mostrar alerta si se seleccionaron varios representantes
      alert('Solo puedes seleccionar un representante para actualizar.');
    } else {
      // Mostrar alerta si no se seleccionó ningún representante
      alert('Por favor selecciona un representante para actualizar.');
    }
  }


  cancelarActualizacion() {
    this.showModalEditar = false; // Cierra el modal sin realizar cambios
  }

  actualizarElRepresentante() {
    const representante = this.representanteActual;
    let url = `http://localhost:8000/api/representantes/${representante.id}?`;

    const params: string[] = [];
    if (representante.rut) params.push(`rut=${representante.rut}`);
    if (representante.nombre) params.push(`nombre=${representante.nombre}`);
    if (representante.apellido) params.push(`apellido=${representante.apellido}`);
    if (representante.telefono) params.push(`telefono=${representante.telefono}`);
    if (representante.correo) params.push(`correo=${representante.correo}`);

    if (params.length > 0) {
      url += params.join('&');
    }

    // Aseguramos que la respuesta se maneje como texto si es necesario
    this.http.patch(url, {}, { responseType: 'text' }).subscribe(
      (response) => {
        console.log('Representante actualizado correctamente:', response);
        this.showModalEditar = false; // Cerrar el modal después de la actualización
        this.obtenerRepresentantes(); // Actualizar la lista de representantes
      },
      (error) => {
        console.error('Error al actualizar representante:', error);
      }
    );
  }

  // Función para mostrar el modal de eliminación con los IDs seleccionados
  eliminarRepresentante() {
    const seleccionados = this.representantes.filter((_, index) => this.representanteSeleccionado[index]);

    if (seleccionados.length > 0) {
      // Crear la lista de IDs seleccionados para mostrar en el modal
      const idsSeleccionados = seleccionados.map((representante) => representante.id).join(', ');

      // Asignar los IDs a mostrar en el modal
      this.idsParaEliminar = idsSeleccionados;

      // Abrir el modal de confirmación
      this.modalAbiertoEliminar = true;
    } else {
      console.log('Ningún representante seleccionado para eliminar');
    }
  }

  // Función para cerrar el modal de eliminación
  cerrarModalEliminar() {
    this.modalAbiertoEliminar = false;
    this.idsParaEliminar = ''; // Limpiar los IDs mostrados en el modal
  }

  // Función para confirmar la eliminación de los representantes seleccionados
  confirmarEliminacion() {
    const seleccionados = this.representantes.filter((_, index) => this.representanteSeleccionado[index]);

    seleccionados.forEach((representante) => {
      const url = `http://localhost:8000/api/representantes/${representante.id}`;

      this.http.delete(url, { responseType: 'text' }).subscribe(
        (response) => {
          console.log(`Representante con ID ${representante.id} eliminado:`, response);
          this.obtenerRepresentantes(); // Actualizar la lista después de la eliminación
        },
        (error) => {
          console.error(`Error al eliminar el representante con ID ${representante.id}:`, error);
        }
      );
    });

    // Cerrar el modal después de la eliminación
    this.cerrarModalEliminar();
  }




}
