import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
    comuna: { id: 0, nombre: '' },  // Inicializado con un objeto vacío
    telefono: '',
    correo: '',
    representante: { id: 0, nombre: '', apellido: '' }  // Inicializado con un objeto vacío
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

  //Para los combobox del crud
  comunas: any[] = [];
  representantes: any[] = [];


  constructor(private http: HttpClient, private router: Router) {}

  async ngOnInit() {
    await this.obtenerComunas();
    await this.obtenerRepresentantes();
    this.obtenerProveedores();
  }


  // Abrir Modal
  abrirModalProveedorCrear() {
    this.modalAbiertoCrear = true;
  }

  // Cerrar Modal
  cerrarModalProveedorCrear() {
    this.modalAbiertoCrear = false;
    this.nuevoProveedor = {
      rut: '',
      razonSocial: '',
      direccion: '',
      comuna: { id: 0, nombre: '' },  // Inicializado con un objeto vacío
      telefono: '',
      correo: '',
      representante: { id: 0, nombre: '', apellido: '' }  // Inicializado con un objeto vacío
    };
  }


  async obtenerProveedores() {
    const url = `http://localhost:8000/api/proveedores/pagina/${this.proveedoresAObtener}`;

    this.http.get<any[]>(url).subscribe(
      async data => {
        if (data.length > 0) {
          this.proveedores = data;

          // Hacer el match de comunas y representantes
          await this.asignarComunaYRepresentante();
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

  async asignarComunaYRepresentante() {
    try {
      this.proveedores.forEach(proveedor => {
        // Buscar la comuna correspondiente
        const comunaEncontrada = this.comunas.find(comuna => comuna.id === proveedor.comuna);
        proveedor.comuna = comunaEncontrada ? comunaEncontrada.nombre : "Desconocida";

        // Buscar el representante correspondiente
        const representanteEncontrado = this.representantes.find(representante => representante.id === proveedor.representante);
        proveedor.representante = representanteEncontrado
          ? `${representanteEncontrado.nombre} ${representanteEncontrado.apellido}`
          : "Desconocido";
      });
    } catch (error) {
      console.error('Error al asignar comuna y representante:', error);
    }
  }


  async obtenerComunas() {
    let pagina = 1;
    this.comunas = []; // Reiniciamos el array
    let continuar = true;

    while (continuar) {
      try {
        const respuesta: any = await this.http.get(`http://localhost:8000/api/comunas/pagina/${pagina}`).toPromise();

        if (!respuesta || (typeof respuesta === 'string' && respuesta.includes('No se encontraron comunas registradas'))) {
          continuar = false;
        } else if (Array.isArray(respuesta)) {
          this.comunas = [...this.comunas, ...respuesta];
          pagina++;
        } else {
          console.warn("Formato inesperado en la respuesta de comunas:", respuesta);
          continuar = false;
        }
      } catch (error) {
        console.error('Error al obtener comunas:', error);
        continuar = false;
      }
    }
  }

  async obtenerRepresentantes() {
    let pagina = 1;
    this.representantes = []; // Reiniciamos el array
    let continuar = true;

    while (continuar) {
      try {
        const respuesta: any = await this.http.get(`http://localhost:8000/api/representantes/pagina/${pagina}`).toPromise();

        if (!respuesta || (typeof respuesta === 'string' && respuesta.includes('No se encontraron representantes registrados'))) {
          continuar = false;
        } else if (Array.isArray(respuesta)) {
          this.representantes = [...this.representantes, ...respuesta];
          pagina++;
        } else {
          console.warn("Formato inesperado en la respuesta de representantes:", respuesta);
          continuar = false;
        }
      } catch (error) {
        console.error('Error al obtener representantes:', error);
        continuar = false;
      }
    }
  }




  /*=================================================================================================*/

  // Función para crear proveedor
  crearProveedor() {
    const formatearCampo = (campo: string, longitud: number) => {
      return String(campo).padStart(longitud, '0');
    };


    const proveedor = {
      rut: this.nuevoProveedor.rut,
      razon_social: this.nuevoProveedor.razonSocial,
      direccion: this.nuevoProveedor.direccion,

      // Comuna: Verificar que 'comuna' no sea null y obtener su 'id'
      comuna: this.nuevoProveedor.comuna ? this.nuevoProveedor.comuna.id.toString().padStart(3, '0') : null,

      telefono: this.nuevoProveedor.telefono,
      correo: this.nuevoProveedor.correo,

      // Representante: Verificar que 'representante' no sea null y obtener su 'id'
      representante: this.nuevoProveedor.representante ? this.nuevoProveedor.representante.id.toString().padStart(4, '0') : null,
    };



    if(proveedor.rut && proveedor.razon_social && proveedor.direccion && proveedor.comuna && proveedor.telefono && proveedor.correo && proveedor.representante){
      const url = 'http://localhost:8000/api/proveedores';

      this.http.post(url, proveedor, { responseType: 'text' })
        .subscribe(
          response => {
            console.log('Respuesta del servidor:', response);
            if(response == "No se enviaron todos los datos requeridos.") {
              alert("Un dato ingresado, no fue reconocido por el sistema");
            } else {
              alert("Proveedor creado con éxito");
              this.obtenerProveedores(); // Actualizar la lista después de la creación
              this.cerrarModalProveedorCrear(); // Cerrar el modal
            }
          },
          error => {
            console.error('Error al crear proveedor:', error);
            alert("No se pudo crear el proveedor, hay un dato mal ingresado");
          }
        );
    } else {
      alert("No están todos los datos ingresados");
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

  async gestionPaginas(accion: string) {
    if (accion === 'anterior') {
      if (this.proveedoresAObtener > 1) {
        this.proveedoresAObtener--;
        await this.obtenerProveedores();
      } else {
        alert('No hay una página anterior a esta.');
      }
    } else if (accion === 'siguiente') {
      const paginaSiguiente = this.proveedoresAObtener + 1;
      const url = `http://localhost:8000/api/proveedores/pagina/${paginaSiguiente}`;

      try {
        const response = await this.http.get<any>(url).toPromise();

        if (Array.isArray(response) && response.length > 0) {
          this.proveedoresAObtener++;
          this.proveedores = response;
          await this.asignarComunaYRepresentante();
        } else {
          alert('No hay más proveedores disponibles.');
        }
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 200 && typeof error.error === 'string') {
            alert('No hay más proveedores disponibles.');
          } else {
            console.error('Error al obtener proveedores:', error);
            alert('Ocurrió un error al obtener proveedores. Intente nuevamente.');
          }
        } else {
          console.error('Error inesperado:', error);
          alert('Ocurrió un error inesperado.');
        }
      }
    }
  }





}
