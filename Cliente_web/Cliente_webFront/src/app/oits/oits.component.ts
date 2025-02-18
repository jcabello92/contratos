import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  nuevoIto = {
    rut: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    area:''
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
    this.nuevoIto = { rut: '', nombre: '', apellido: '', telefono: '', correo: '' ,area: ''}; // Reiniciar campos
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
    const areaConTresDigitos = this.nuevoIto.area.padStart(3, '0');

    const params = new URLSearchParams();
    params.set('rut', this.nuevoIto.rut);
    params.set('nombre', this.nuevoIto.nombre);
    params.set('apellido', this.nuevoIto.apellido);
    params.set('telefono', this.nuevoIto.telefono);
    params.set('correo', this.nuevoIto.correo);
    params.set('area', areaConTresDigitos);  // Usamos el área con 3 dígitos

    if(this.nuevoIto.rut && this.nuevoIto.nombre && this.nuevoIto.apellido && this.nuevoIto.telefono && this.nuevoIto.correo && areaConTresDigitos){
      const url = `http://localhost:8000/api/itos?${params.toString()}`;

      this.http.post(url, {}, { responseType: 'text' })
        .subscribe(
          response => {
            if(response=="No se enviaron todos los datos requeridos."){
              alert("Un dato ingresado, no fue reconocido por el sistema")
            }else{
              alert("El ito fue creado exitosamente")
              console.log('Respuesta del servidor:', response);
              this.obtenerItos();
              this.cerrarModalItoCrear();
            }
          },
          error => {
            console.error('Error al crear ito:', error);
            alert("No se pudo crear el ito, hay un dato mal ingresado")
          }
        );
    }else{
      alert("No están todos los datos ingresados")
    }
  }

  // Maneja el cambio de los checkboxes
  onCheckboxChange(index: number) {
    this.itoSeleccionado[index] = !this.itoSeleccionado[index];
  }

  actualizarIto() {
    const seleccionados = this.itos.filter((_, index) => this.itoSeleccionado[index]);

    if (seleccionados.length === 1) {
      // Solo se puede actualizar un ito a la vez
      this.itoActual = seleccionados[0];
      console.log(this.itoActual)
      this.showModalEditar = true;
    } else if (seleccionados.length > 1) {
      // Mostrar alerta si se seleccionaron varios itos
      alert('Solo puedes seleccionar un ito para actualizar.');
    } else {
      // Mostrar alerta si no se seleccionó ningún ito
      alert('Por favor selecciona un ito para actualizar.');
    }
  }

  cancelarActualizacion() {
    this.showModalEditar = false; // Cierra el modal sin realizar cambios
  }

  actualizarElIto() {
    const ito = this.itoActual;

    // Aseguramos que el área sea una cadena y tenga 3 dígitos, agregando ceros a la izquierda si es necesario
    const areaConTresDigitos = ito.area ? String(ito.area).padStart(3, '0') : '';

    let url = `http://localhost:8000/api/itos/${ito.id}?`;

    const params: string[] = [];
    if (ito.rut) params.push(`rut=${ito.rut}`);
    if (ito.nombre) params.push(`nombre=${ito.nombre}`);
    if (ito.apellido) params.push(`apellido=${ito.apellido}`);
    if (ito.telefono) params.push(`telefono=${ito.telefono}`);
    if (ito.correo) params.push(`correo=${ito.correo}`);
    if (areaConTresDigitos) params.push(`area=${areaConTresDigitos}`);  // Usamos el área con 3 dígitos

    if (params.length > 0) {
      url += params.join('&');
    }

    if(ito.rut && ito.nombre && ito.apellido && ito.telefono && ito.correo && areaConTresDigitos){
      this.http.patch(url, {}, { responseType: 'text' }).subscribe(
        (response) => {
          if(response=="Se encontraron errores en los datos enviados."){
            alert("Un dato ingresado, no fue reconocido por el sistema")
          }else{
            alert("Ito actualizado correctamente")
            console.log('Ito actualizado correctamente:', response);
            this.showModalEditar = false; // Cerrar el modal después de la actualización
            this.obtenerItos(); // Actualizar la lista de itos
          }
        },
        (error) => {
          console.error('Error al actualizar ito:', error);
          alert("No se pudo actualizar el ito, hay un dato mal ingresado")
        }
      );
    }else{
      alert("No están todos los datos ingresados")

    }
  }



  // Función para mostrar el modal de eliminación con los IDs seleccionados
  eliminarIto() {
    const seleccionados = this.itos.filter((_, index) => this.itoSeleccionado[index]);

    if (seleccionados.length > 0) {
      const idsSeleccionados = seleccionados.map((ito) => ito.id).join(', ');
      this.idsParaEliminar = idsSeleccionados;
      this.modalAbiertoEliminar = true;
    } else {
      console.log('Ningún ito seleccionado para eliminar');
    }
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
          alert("Ito(s) eliminado(s) con éxito")
          this.obtenerItos(); // Actualizar la lista después de la eliminación
        },
        (error) => {
          console.error(`Error al eliminar el ito con ID ${ito.id}:`, error);
          alert("Error al eliminar un(os) ito(s)")
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
