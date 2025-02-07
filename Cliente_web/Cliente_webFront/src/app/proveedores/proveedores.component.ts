import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  imports: [
    NgForOf,
    HttpClientModule,
    FormsModule,
    NgClass
  ],
  standalone: true
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = []; // Lista para almacenar los datos de los proveedores
  modalAbiertoCrear: boolean = false; // Controla la visibilidad del modal
  nuevoProveedor = {
    rut: '',
    razonSocial: '',
    direccion: '',
    comuna: '',
    telefono: '',
    correo: '',
    representante: ''
  };

  proveedorSeleccionado: boolean[] = [];
  proveedorActual: any = {};
  showModalEditar = false;
  modalAbiertoEliminar: boolean = false; // Controla el modal de eliminación
  proveedoresParaEliminar: any[] = []; // Almacena los proveedores seleccionados
  idsProveedoresEliminar: string = ''; // Almacena los IDs seleccionados como string para el modal de confirmación

  //filtros
  campoOrden: string = 'rut'; // Valor predeterminado
  orden: string = 'asc'; // Valor predeterminado


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obtenerProveedores(); // Cargar datos al iniciar el componente
  }

  // Abrir Modal
  abrirModalProveedorCrear() {
    this.modalAbiertoCrear = true;
  }

  // Cerrar Modal
  cerrarModalProveedorCrear() {
    this.modalAbiertoCrear = false;
    this.nuevoProveedor = { rut: '', razonSocial: '', direccion: '', comuna: '', telefono: '', correo: '', representante: '' }; // Reiniciar campos
  }

  obtenerProveedores() {
    this.http.get<any>('http://localhost:8000/api/proveedores/pagina/1')
      .subscribe(
        data => {
          this.proveedores = data; // Asigna los datos obtenidos a la variable
        },
        error => {
          console.error('Error al obtener proveedores:', error);
        }
      );
  }

  // Crear Proveedor
  crearProveedor() {
    // Función para agregar ceros a la izquierda hasta completar la longitud requerida
    const formatearCampo = (campo: string, longitud: number) => {
      return String(campo).padStart(longitud, '0');
    };

    const proveedor = {
      rut: this.nuevoProveedor.rut,
      razon_social: this.nuevoProveedor.razonSocial,
      direccion: this.nuevoProveedor.direccion,

      // Formatear comuna a 3 dígitos
      comuna: this.nuevoProveedor.comuna ? formatearCampo(this.nuevoProveedor.comuna, 3) : this.nuevoProveedor.comuna,

      telefono: this.nuevoProveedor.telefono,
      correo: this.nuevoProveedor.correo,

      // Formatear representante a 4 dígitos
      representante: this.nuevoProveedor.representante ? formatearCampo(this.nuevoProveedor.representante, 4) : this.nuevoProveedor.representante,
    };

    const url = 'http://localhost:8000/api/proveedores';

    this.http.post(url, proveedor, { responseType: 'text' })
      .subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          this.obtenerProveedores(); // Actualizar la lista después de la creación
          this.cerrarModalProveedorCrear(); // Cerrar el modal
        },
        error => {
          console.error('Error al crear proveedor:', error);
        }
      );
  }


  // Maneja el cambio de los checkboxes
  onCheckboxChange(index: number) {
    this.proveedorSeleccionado[index] = !this.proveedorSeleccionado[index];
  }

  actualizarProveedor() {
    const seleccionados = this.proveedores.filter((_, index) => this.proveedorSeleccionado[index]);

    if (seleccionados.length === 1) {
      // Solo se puede actualizar un proveedor a la vez
      this.proveedorActual = seleccionados[0];
      console.log(this.proveedorActual);
      this.showModalEditar = true;
    } else if (seleccionados.length > 1) {
      alert('Solo puedes seleccionar un proveedor para actualizar.');
    } else {
      alert('Por favor selecciona un proveedor para actualizar.');
    }
  }

  cancelarActualizacion() {
    this.showModalEditar = false; // Cierra el modal sin realizar cambios
  }

  actualizarElProveedor() {
    const proveedor = this.proveedorActual;

    // Función para agregar ceros a la izquierda hasta completar la longitud requerida
    const formatearCampo = (campo: string, longitud: number) => {
      return String(campo).padStart(longitud, '0');
    };

    // Solo enviar los campos que han cambiado
    const datosActualizar: any = {};

    if (proveedor.rut) datosActualizar.rut = proveedor.rut;
    if (proveedor.razon_social) datosActualizar.razon_social = proveedor.razon_social;
    if (proveedor.direccion) datosActualizar.direccion = proveedor.direccion;

    // Formatear comuna a 3 dígitos
    if (proveedor.comuna) datosActualizar.comuna = formatearCampo(proveedor.comuna, 3);

    if (proveedor.telefono) datosActualizar.telefono = proveedor.telefono;
    if (proveedor.correo) datosActualizar.correo = proveedor.correo;

    // Formatear representante a 4 dígitos
    if (proveedor.representante) datosActualizar.representante = formatearCampo(proveedor.representante, 4);

    const url = `http://localhost:8000/api/proveedores/${proveedor.id}`;

    this.http.patch(url, datosActualizar, { responseType: 'text' })
      .subscribe(
        (response) => {
          console.log('Proveedor actualizado correctamente:', response);
          this.showModalEditar = false;
          this.obtenerProveedores(); // Actualizar la lista de proveedores
        },
        (error) => {
          console.error('Error al actualizar proveedor:', error);
        }
      );
  }


  eliminarProveedor() {
    const seleccionados = this.proveedores.filter((_, index) => this.proveedorSeleccionado[index]);

    if (seleccionados.length > 0) {
      const idsSeleccionados = seleccionados.map((proveedor) => proveedor.id).join(', ');
      this.idsProveedoresEliminar = idsSeleccionados;
      this.modalAbiertoEliminar = true;
    } else {
      alert('Ningún proveedor fue seleccionado para eliminar');
    }
  }

  cerrarModalEliminar() {
    this.modalAbiertoEliminar = false;
    this.idsProveedoresEliminar = '';
  }

  confirmarEliminacion() {
    const seleccionados = this.proveedores.filter((_, index) => this.proveedorSeleccionado[index]);

    seleccionados.forEach((proveedor) => {
      const url = `http://localhost:8000/api/proveedores/${proveedor.id}`;

      this.http.delete(url, { responseType: 'text' }).subscribe(
        (response) => {
          console.log(`Proveedor con ID ${proveedor.id} eliminado:`, response);
          this.obtenerProveedores(); // Actualizar la lista después de la eliminación
        },
        (error) => {
          console.error(`Error al eliminar el proveedor con ID ${proveedor.id}:`, error);
        }
      );
    });

    this.cerrarModalEliminar();
  }

  filtrarProveedores() {
    const url = `http://localhost:8000/api/proveedores/pagina/1`;

    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.proveedores = data.sort((a, b) => {
          let valorA: any = a[this.campoOrden];
          let valorB: any = b[this.campoOrden];

          if (this.campoOrden === 'rut') {
            valorA = this.parsearRut(valorA);
            valorB = this.parsearRut(valorB);
          } else {
            valorA = valorA ? valorA.toString().toLowerCase() : '';
            valorB = valorB ? valorB.toString().toLowerCase() : '';
          }

          return this.orden === 'asc' ? (valorA > valorB ? 1 : -1) : (valorA < valorB ? 1 : -1);
        });
      },
      (error) => {
        console.error('Error al filtrar proveedores:', error);
      }
    );
  }

  parsearRut(rut: string): number {
    return parseInt(rut.replace(/\./g, '').split('-')[0], 10);
  }

}
