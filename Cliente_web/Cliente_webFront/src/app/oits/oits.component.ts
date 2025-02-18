import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-oits',
  templateUrl: './oits.component.html',
  styleUrl: './oits.component.css',
  imports: [
    NgForOf,
    HttpClientModule,
    FormsModule,
    NgIf
  ],
  standalone: true
})
export class OITsComponent implements OnInit {
  itos: any[] = []; // Lista para almacenar los datos de la API
  modalAbiertoCrear: boolean = false; // Controla la visibilidad del modal

  nuevoIto: {
    rut: string;
    nombre: string;
    apellido: string;
    telefono: string;
    correo: string;
    area: { id: number; nombre: string } | null;
  } = {
    rut: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    area: null
  };


  itoSeleccionado: boolean[] = [];
  itoActual: any = {};
  showModalEditar = false;
  modalAbiertoEliminar: boolean = false; // Controla el modal de eliminación
  itosParaEliminar: any[] = []; // Almacena los itos seleccionados
  idsParaEliminar: string = ''; // Almacena los IDs seleccionados como string para el modal de confirmación

  //Filtros
  campoOrden: string = 'rut'; // Valor predeterminado
  orden: string = 'asc'; // Valor predeterminado

  //Páginación
  ItosAObtener: number = 1;

  //Para los combobox del crud
  areas: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  async ngOnInit() {
    await this.obtenerAreas();
    this.obtenerItos();
  }


  // Abrir Modal
  abrirModalItoCrear() {
    this.modalAbiertoCrear = true;
  }

  // Cerrar Modal
  cerrarModalItoCrear() {
    this.modalAbiertoCrear = false;
    this.nuevoIto = { rut: '', nombre: '', apellido: '', telefono: '', correo: '' ,area: null}; // Reiniciar campos
  }

  async obtenerItos() {
    const url = `http://localhost:8000/api/itos/pagina/${this.ItosAObtener}`;

    this.http.get<any[]>(url).subscribe(
      async data => {
        if (data.length > 0) {
          this.itos = data;

          // Hacer el match de áreas
          await this.asignarAreaAItos();
        } else {
          alert('No hay más itos para continuar avanzando en la página');
          this.ItosAObtener--; // Revertimos el cambio si no hay más datos
        }
      },
      error => {
        console.error('Error al obtener itos:', error);
      }
    );
  }


  async asignarAreaAItos() {
    try {
      this.itos.forEach(ito => {
        // Buscar el área correspondiente
        const areaEncontrada = this.areas.find(area => area.id === ito.area);
        ito.area = areaEncontrada ? areaEncontrada.nombre : "Desconocida";
      });
    } catch (error) {
      console.error('Error al asignar área a los Itos:', error);
    }
  }


  async obtenerAreas() {
    let pagina = 1;
    this.areas = []; // Reiniciamos el array
    let continuar = true;

    while (continuar) {
      try {
        const respuesta: any = await this.http.get(`http://localhost:8000/api/areas/pagina/${pagina}`).toPromise();

        if (!respuesta || (typeof respuesta === 'string' && respuesta.includes('No se encontraron áreas registradas'))) {
          continuar = false;
        } else if (Array.isArray(respuesta)) {
          this.areas = [...this.areas, ...respuesta];
          pagina++;
        } else {
          console.warn("Formato inesperado en la respuesta de áreas:", respuesta);
          continuar = false;
        }
      } catch (error) {
        console.error('Error al obtener áreas:', error);
        continuar = false;
      }
    }
  }


  // Crear Ito
  crearIto() {
    const formatearCampo = (campo: string, longitud: number) => {
      return String(campo).padStart(longitud, '0');
    };

    const ito = {
      rut: this.nuevoIto.rut,
      nombre: this.nuevoIto.nombre,
      apellido: this.nuevoIto.apellido,
      telefono: this.nuevoIto.telefono,
      correo: this.nuevoIto.correo,
      area: this.nuevoIto.area ? formatearCampo(this.nuevoIto.area.id.toString(), 3) : null
    };

    if (ito.rut && ito.nombre && ito.apellido && ito.telefono && ito.correo && ito.area) {
      const url = 'http://localhost:8000/api/itos';

      this.http.post(url, ito, { responseType: 'text' }).subscribe(
        response => {
          if (response == "No se enviaron todos los datos requeridos.") {
            alert("Un dato ingresado no fue reconocido por el sistema");
          } else {
            alert("El ito fue creado exitosamente");
            console.log('Respuesta del servidor:', response);
            this.obtenerItos();
            this.cerrarModalItoCrear();
          }
        },
        error => {
          console.error('Error al crear ito:', error);
          alert("No se pudo crear el ito, hay un dato mal ingresado");
        }
      );
    } else {
      alert("No están todos los datos ingresados");
    }
  }


  // Maneja el cambio de los checkboxes
  onCheckboxChange(index: number) {
    this.itoSeleccionado[index] = !this.itoSeleccionado[index];
  }

  actualizarIto() {
    const seleccionados = this.itos.filter((_, index) => this.itoSeleccionado[index]);

    if (seleccionados.length === 1) {
      // Solo se permite actualizar un ITO a la vez
      this.itoActual = { ...seleccionados[0] }; // Copia para evitar modificar directamente la lista
      console.log('ITO seleccionado para actualizar:', this.itoActual);
      this.showModalEditar = true;
    } else if (seleccionados.length > 1) {
      alert('Solo puedes seleccionar un ITO para actualizar.');
    } else {
      alert('Por favor selecciona un ITO para actualizar.');
    }
  }

  cancelarActualizacion() {
    this.showModalEditar = false; // Cierra el modal sin cambios
  }

  actualizarElIto() {
    const ito = this.itoActual;

    // Verificar que `ito.area` tenga un objeto con `id`
    const areaConTresDigitos = ito.area ? String(ito.area.id).padStart(3, '0') : null;

    const datosActualizar: any = {};

    if (ito.rut) datosActualizar.rut = ito.rut;
    if (ito.nombre) datosActualizar.nombre = ito.nombre;
    if (ito.apellido) datosActualizar.apellido = ito.apellido;
    if (ito.telefono) datosActualizar.telefono = ito.telefono;
    if (ito.correo) datosActualizar.correo = ito.correo;
    if (areaConTresDigitos) datosActualizar.area = areaConTresDigitos;

    if (Object.keys(datosActualizar).length > 0) {
      const url = `http://localhost:8000/api/itos/${ito.id}`;

      this.http.patch(url, datosActualizar, { responseType: 'text' }).subscribe(
        (response) => {
          if (response === 'Se encontraron errores en los datos enviados.') {
            alert('Un dato ingresado no fue reconocido por el sistema.');
          } else {
            alert('ITO actualizado correctamente');
            console.log('ITO actualizado correctamente:', response);
            this.showModalEditar = false; // Cerrar el modal
            this.obtenerItos(); // Refrescar la lista de ITOs
          }
        },
        (error) => {
          console.error('Error al actualizar ITO:', error);
          alert('No se pudo actualizar el ITO, hay un dato mal ingresado.');
        }
      );
    } else {
      alert('No hay cambios para actualizar.');
    }
  }




// Función para mostrar el modal de eliminación con los IDs seleccionados
  eliminarIto() {
    const seleccionados = this.itos.filter((_, index) => this.itoSeleccionado[index]);

    if (seleccionados.length > 0) {
      const idsSeleccionados = seleccionados.map((ito) => ito.id);

      // Llamar a la API para obtener los itos completos
      this.obtenerItosParaEliminar(idsSeleccionados);

      this.modalAbiertoEliminar = true;
    } else {
      console.log('Ningún ito seleccionado para eliminar');
    }
  }

  obtenerItosParaEliminar(ids: number[]) {
    const apiUrl = 'http://localhost:8000/api/itos/id/';

    const requests = ids.map(id => this.http.get(`${apiUrl}${id}`));

    forkJoin(requests).subscribe(
      (respuestas: any[]) => {
        console.log('Respuestas de la API:', respuestas);

        // Extraemos el primer objeto de cada array en respuestas
        this.itosParaEliminar = respuestas.map(respuesta => respuesta[0]);

        console.log('Itos a eliminar:', this.itosParaEliminar);

        // Ahora que los datos están listos, abrir el modal
        this.modalAbiertoEliminar = true;
      },
      (error) => {
        console.error('Error al obtener los itos:', error);
      }
    );
  }



// Función para cerrar el modal de eliminación
  cerrarModalEliminar() {
    this.modalAbiertoEliminar = false;
    this.idsParaEliminar = '';
  }

// Función para confirmar la eliminación de los itos seleccionados
  confirmarEliminacion() {
    const seleccionados = this.itos.filter((_, index) => this.itoSeleccionado[index]);

    seleccionados.forEach((ito) => {
      const url = `http://localhost:8000/api/itos/${ito.id}`;

      this.http.delete(url, { responseType: 'text' }).subscribe(
        (response) => {
          console.log(`Ito con ID ${ito.id} eliminado:`, response);
          alert("Ito(s) eliminado(s) con éxito");
          this.obtenerItos(); // Actualizar la lista después de la eliminación
        },
        (error) => {
          console.error(`Error al eliminar el ito con ID ${ito.id}:`, error);
          alert("Error al eliminar un(os) ito(s)");
        }
      );
    });

    this.cerrarModalEliminar();
  }



  filtrarItos() {
    const url = `http://localhost:8000/api/itos/pagina/${this.ItosAObtener}`;

    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.itos = data.sort((a, b) => {
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
        console.error('Error al filtrar itos:', error);
      }
    );
  }

  parsearRut(rut: string): number {
    return parseInt(rut.replace(/\./g, '').split('-')[0], 10);
  }

  gestionPaginas(accion: string) {
    if (accion === 'anterior') {
      if (this.ItosAObtener > 1) {
        this.ItosAObtener--;
        this.obtenerItos();
      } else {
        alert('No hay una página anterior a esta.');
      }
    } else if (accion === 'siguiente') {
      const paginaSiguiente = this.ItosAObtener + 1;
      const url = `http://localhost:8000/api/itos/pagina/${paginaSiguiente}`;

      this.http.get<any>(url, { responseType: 'json' as 'json' }).subscribe(
        response => {
          if (Array.isArray(response) && response.length > 0) {
            this.ItosAObtener++;
            this.itos = response;
          } else {
            alert('No hay más itos disponibles.');
          }
        },
        error => {
          if (error.status === 200 && error.error?.text) {
            // Caso donde la API devuelve un mensaje de error en texto plano
            alert('No hay más itos disponibles.');
          } else {
            console.error('Error al obtener itos:', error);
            alert('Ocurrió un error al obtener itos. Intente nuevamente.');
          }
        }
      );
    }
  }


}
