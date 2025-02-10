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

  //Páginación
  proveedoresAObtener: number = 1;


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
    const url = `http://localhost:8000/api/proveedores/pagina/${this.proveedoresAObtener}`;
    this.http.get<any[]>(url).subscribe(
      data => {
        if (data.length > 0) {
          this.proveedores = data;
        } else {
          alert('No hay más proveedores para continuar avanzando en la página');
          this.proveedoresAObtener--; // Revertimos el cambio si no hay más datos
        }
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

    if(proveedor.rut && proveedor.razon_social && proveedor.direccion && proveedor.comuna && proveedor.telefono && proveedor.correo && proveedor.representante){
      const url = 'http://localhost:8000/api/proveedores';

      this.http.post(url, proveedor, { responseType: 'text' })
        .subscribe(
          response => {
            console.log('Respuesta del servidor:', response);
            if(response == "No se enviaron todos los datos requeridos."){
                alert("Un dato ingresado, no fue reconocido por el sistema")
            }else {
                alert("Proveedor creado con éxito")
                this.obtenerProveedores(); // Actualizar la lista después de la creación
                this.cerrarModalProveedorCrear(); // Cerrar el modal
            }
          },
          error => {
            console.error('Error al crear proveedor:', error);
            alert("No se pudo crear el proveedor, hay un dato mal ingresado")
          }
        );
    }
    else{
      alert("No están todos los datos ingresados")
    }

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


    if(proveedor.rut && proveedor.razon_social && proveedor.direccion && proveedor.comuna && proveedor.telefono && proveedor.correo && proveedor.representante){
      const url = `http://localhost:8000/api/proveedores/${proveedor.id}`;

      this.http.patch(url, datosActualizar, { responseType: 'text' })
        .subscribe(
          (response) => {
            if(response == "Se encontraron errores en los datos enviados."){
                alert("Un dato ingresado, no fue reconocido por el sistema")
            }else{
              alert('Proveedor actualizado correctamente');
              this.showModalEditar = false;
              this.obtenerProveedores(); // Actualizar la lista de proveedores
            }
          },
          (error) => {
            console.error('Error al actualizar proveedor:', error);
            alert("No se pudo actualizar el proveedor, hay un dato mal ingresado")
          }
        );
    }else{
      alert("No están todos los datos ingresados")
    }


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
          alert("proveedor(es) eliminado(s) con éxito")
          this.obtenerProveedores(); // Actualizar la lista después de la eliminación
        },
        (error) => {
          console.error(`Error al eliminar el proveedor con ID ${proveedor.id}:`, error);
          alert("Error al eliminar un(os) proveedor(s)")
        }
      );
    });

    this.cerrarModalEliminar();
  }

  filtrarProveedores() {
    const url = `http://localhost:8000/api/proveedores/pagina/${this.proveedoresAObtener}`;

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

  gestionPaginas(accion: string) {
    if (accion === 'anterior') {
      if (this.proveedoresAObtener > 1) {
        this.proveedoresAObtener--;
        this.obtenerProveedores();
      } else {
        alert('No hay una página anterior a esta.');
      }
    } else if (accion === 'siguiente') {
      const paginaSiguiente = this.proveedoresAObtener + 1;
      const url = `http://localhost:8000/api/proveedores/pagina/${paginaSiguiente}`;

      this.http.get<any>(url, { responseType: 'json' as 'json' }).subscribe(
        response => {
          if (Array.isArray(response) && response.length > 0) {
            this.proveedoresAObtener++;
            this.proveedores = response;
          } else {
            alert('No hay más proveedores disponibles.');
          }
        },
        error => {
          if (error.status === 200 && error.error?.text) {
            // Caso donde la API devuelve un mensaje de error en texto plano
            alert('No hay más proveedores disponibles.');
          } else {
            console.error('Error al obtener proveedores:', error);
            alert('Ocurrió un error al obtener proveedores. Intente nuevamente.');
          }
        }
      );
    }
  }



}
