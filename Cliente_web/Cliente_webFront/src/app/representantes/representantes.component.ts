import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
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

  //filtros
  campoOrden: string = 'rut'; // Valor predeterminado
  orden: string = 'asc'; // Valor predeterminado

  //Páginación:
  RepresentantesAObtener: number = 1;


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
    const url = `http://localhost:8000/api/representantes/pagina/${this.RepresentantesAObtener}`;
    this.http.get<any[]>(url).subscribe(
      data => {
        if (data.length > 0) {
          this.representantes = data;
        } else {
          alert('No hay más representantes para continuar avanzando en la página');
          this.RepresentantesAObtener--; // Revertimos el cambio si no hay más datos
        }
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


    if(this.nuevoRepresentante.rut && this.nuevoRepresentante.nombre && this.nuevoRepresentante.apellido && this.nuevoRepresentante.telefono && this.nuevoRepresentante.correo){

      const url = `http://localhost:8000/api/representantes?${params.toString()}`;

      this.http.post(url, {}, { responseType: 'text' }) // 👈 Esperamos respuesta de tipo texto
        .subscribe(
          response => {
            if(response == "No se enviaron todos los datos requeridos."){
              alert("Un dato ingresado, no fue reconocido por el sistema")
            }else{
              alert("El representante fue creado exitosamente")
              console.log('Respuesta del servidor:', response);
              this.obtenerRepresentantes(); // Actualizar la lista después de la creación
              this.cerrarModalRepresentantesCrear(); // Cerrar el modal
            }
          },
          error => {
            console.error('Error al crear representante:', error);
            alert("No se pudo crear el representante, hay un dato mal ingresado")
          }
        );
    }else{
      alert("No están todos los datos ingresados")
    }
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

    if(representante.rut && representante.nombre && representante.apellido && representante.telefono &&representante.correo){
      // Aseguramos que la respuesta se maneje como texto si es necesario
      this.http.patch(url, {}, { responseType: 'text' }).subscribe(
        (response) => {
          if(response == "Se encontraron errores en los datos enviados."){
            alert("Un dato ingresado, no fue reconocido por el sistema")
          }else{
            alert("Representante actualizado correctamente")
            console.log('Representante actualizado correctamente:', response);
            this.showModalEditar = false; // Cerrar el modal después de la actualización
            this.obtenerRepresentantes(); // Actualizar la lista de representantes
          }
        },
        (error) => {
          console.error('Error al actualizar representante:', error);
          alert("No se pudo actualizar el representante, hay un dato mal ingresado")
        }
      );
    }else{
      alert("No están todos los datos ingresados")
    }
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
          alert("Representante(s) eliminado(s) con éxito")
          this.obtenerRepresentantes(); // Actualizar la lista después de la eliminación
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 500) {
              // Si es error 500 (Internal Server Error)
              console.error(`Error 500 al eliminar el representante con ID ${representante.id}:`, error);
              alert("ERROR: No se puede eliminar uno o más representante(s) porque tiene un proveedor asociado.");
            } else {
              // Si es otro error diferente a 500
              console.error(`Error al eliminar el representante con ID ${representante.id}:`, error);
              alert(`Error al eliminar uno o más representante(s)`);
            }
          } else {
            // Si el error no es un HttpErrorResponse (error inesperado)
            console.error(`Error inesperado al eliminar el representante con ID ${representante.id}:`, error);
            alert("Ocurrió un error inesperado al eliminar uno o más representante(s).");
          }
        }

      );
    });

    // Cerrar el modal después de la eliminación
    this.cerrarModalEliminar();
  }

  filtrarRepresentantes() {
    const url = `http://localhost:8000/api/representantes/pagina/${this.RepresentantesAObtener}`;

    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.representantes = data.sort((a, b) => {
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
        console.error('Error al filtrar representantes:', error);
      }
    );
  }

  parsearRut(rut: string): number {
    return parseInt(rut.replace(/\./g, '').split('-')[0], 10);
  }

  gestionPaginas(accion: string) {
    if (accion === 'anterior') {
      if (this.RepresentantesAObtener > 1) {
        this.RepresentantesAObtener--;
        this.obtenerRepresentantes();
      } else {
        alert('No hay una página anterior a esta.');
      }
    } else if (accion === 'siguiente') {
      const paginaSiguiente = this.RepresentantesAObtener + 1;
      const url = `http://localhost:8000/api/representantes/pagina/${paginaSiguiente}`;

      this.http.get<any>(url, { responseType: 'json' as 'json' }).subscribe(
        response => {
          if (Array.isArray(response) && response.length > 0) {
            this.RepresentantesAObtener++;
            this.representantes = response;
          } else {
            alert('No hay más representantes disponibles.');
          }
        },
        error => {
          if (error.status === 200 && error.error?.text) {
            // Caso donde la API devuelve un mensaje de error en texto plano
            alert('No hay más representantes disponibles.');
          } else {
            console.error('Error al obtener representantes:', error);
            alert('Ocurrió un error al obtener representantes. Intente nuevamente.');
          }
        }
      );
    }
  }


}
