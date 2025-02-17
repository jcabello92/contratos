import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {convertToParamMap, Router} from '@angular/router';
import {getXHRResponse} from 'rxjs/internal/ajax/getXHRResponse';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css'],
  imports: [
    NgForOf,
    HttpClientModule,
    FormsModule,
    NgIf,
    NgClass
  ],
  standalone: true
})
export class ContratosComponent implements OnInit {
  contratos: any[] = [];
  modalAbiertoCrear: boolean = false;
  nuevoContrato = {
    nombre: '',
    fecha_inicio: '',
    fecha_termino: '',
    proveedor: '',
    ito: ''
  };

  contratoSeleccionado: boolean[] = [];
  contratoActual: any = {};
  showModalEditar = false;
  modalAbiertoEliminar: boolean = false;
  idsContratosEliminar: string = '';
  contratosAEliminar: any[] =[];

  //filtros
  campoOrden: string = 'nombre';
  orden: string = 'asc';

  //paginación
  contratosAObtener: number = 1;

  //Para los combobox de los crud
  proveedores: any[] = [];
  itos: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obtenerContratos();
    this.obtenerProveedores();
    this.obtenerItos();
  }

  abrirModalContratoCrear() {
    this.modalAbiertoCrear = true;
  }

  cerrarModalContratoCrear() {
    this.modalAbiertoCrear = false;
    this.nuevoContrato = { nombre: '', fecha_inicio: '', fecha_termino: '', proveedor: '', ito: '' };
  }

  obtenerContratos() {
    const url = `http://localhost:8000/api/contratos/pagina/${this.contratosAObtener}`;

    this.http.get<any[]>(url).subscribe(
      async data => {
        if (data.length > 0) {
          const fechaActual = new Date();

          this.contratos = data.sort((a, b) => {
            const fechaTerminoA = new Date(a.fecha_termino.replace(/-/g, '/')).getTime();
            const fechaTerminoB = new Date(b.fecha_termino.replace(/-/g, '/')).getTime();
            const estaVencidoA = fechaTerminoA < fechaActual.getTime();
            const estaVencidoB = fechaTerminoB < fechaActual.getTime();

            if (estaVencidoA && !estaVencidoB) return 1;
            if (!estaVencidoA && estaVencidoB) return -1;

            return fechaTerminoA - fechaTerminoB;
          });

          // Obtener nombres de proveedores e itos
          await this.ObtenerProveedoresEItosEnContratos();
        } else {
          alert('No hay más contratos disponibles.');
          this.contratosAObtener--;
        }
      },
      error => console.error('Error al obtener contratos:', error)
    );
  }

  async ObtenerProveedoresEItosEnContratos() {
    try {
      const peticiones = this.contratos.map(async (contrato) => {
        try {
          const proveedorUrl = `http://localhost:8000/api/proveedores/id/${contrato.proveedor}`;
          const itoUrl = `http://localhost:8000/api/itos/id/${contrato.ito}`;

          const [proveedorData, itoData] = await Promise.all([
            this.http.get<any[]>(proveedorUrl).toPromise().catch(() => []), // Evitar undefined
            this.http.get<any[]>(itoUrl).toPromise().catch(() => []) // Evitar undefined
          ]);

          // Asignar datos obtenidos con validación de arrays
          contrato.proveedor = (Array.isArray(proveedorData) && proveedorData.length > 0)
            ? proveedorData[0].razon_social
            : 'Desconocido';

          contrato.ito = (Array.isArray(itoData) && itoData.length > 0)
            ? `${itoData[0].nombre} ${itoData[0].apellido}`
            : 'Desconocido';

        } catch (error) {
          console.error(`Error al obtener datos para contrato ID ${contrato.id}:`, error);
        }
      });

      await Promise.all(peticiones);

    } catch (error) {
      console.error('Error en ObtenerProveedoresEItosEnContratos:', error);
    }
  }

  //=========================================================================

  async obtenerProveedores() {
    let pagina = 1;
    this.proveedores = []; // Reinicia la lista antes de empezar
    let continuar = true;

    while (continuar) {
      try {
        const respuesta: any = await this.http.get(`http://localhost:8000/api/proveedores/pagina/${pagina}`).toPromise();

        if (!respuesta || typeof respuesta === 'string' && respuesta.includes('No se encontraron proveedores')) {
          continuar = false;
        } else if (Array.isArray(respuesta)) {
          this.proveedores = [...this.proveedores, ...respuesta]; // Concatenar de forma segura
          pagina++;
        } else {
          console.warn("Formato inesperado en la respuesta de proveedores:", respuesta);
          continuar = false;
        }
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
        continuar = false;
      }
    }
  }

  async obtenerItos() {
    let pagina = 1;
    this.itos = []; // Reinicia la lista antes de empezar
    let continuar = true;

    while (continuar) {
      try {
        const respuesta: any = await this.http.get(`http://localhost:8000/api/itos/pagina/${pagina}`).toPromise();

        if (!respuesta || typeof respuesta === 'string' && respuesta.includes('No se encontraron itos')) {
          continuar = false;
        } else if (Array.isArray(respuesta)) {
          this.itos = [...this.itos, ...respuesta]; // Concatenar de forma segura
          pagina++;
        } else {
          console.warn("Formato inesperado en la respuesta de itos:", respuesta);
          continuar = false;
        }
      } catch (error) {
        console.error('Error al obtener itos:', error);
        continuar = false;
      }
    }
  }



  crearContrato() {
    const formatearCampo = (campo: string, longitud: number) => {
      return String(campo).padStart(longitud, '0');
    };

    const contrato = {
      nombre: this.nuevoContrato.nombre,
      fecha_inicio: this.nuevoContrato.fecha_inicio,
      fecha_termino: this.nuevoContrato.fecha_termino,
      proveedor: this.nuevoContrato.proveedor ? formatearCampo(this.nuevoContrato.proveedor, 4) : this.nuevoContrato.proveedor,
      ito: this.nuevoContrato.ito ? formatearCampo(this.nuevoContrato.ito, 3) : this.nuevoContrato.ito
    };

    if (contrato.nombre && contrato.fecha_termino && contrato.fecha_inicio && contrato.proveedor && contrato.ito) {
      if (new Date(contrato.fecha_inicio) <= new Date(contrato.fecha_termino)) {
        const url = 'http://localhost:8000/api/contratos';

        this.http.post(url, contrato, { responseType: 'text' })
          .subscribe(
            response => {
              console.log('Respuesta del servidor:', response);
              if (response == "No se enviaron todos los datos requeridos.") {
                alert("Un dato ingresado no fue reconocido por el sistema");
              } else {
                alert("Contrato creado con éxito");
                this.cerrarModalContratoCrear();
                this,this.obtenerContratos()
              }
            },
            error => {
              console.error('Error al crear contrato:', error);
              alert("No se pudo crear el contrato, hay un dato mal ingresado");
            }
          );
      } else {
        alert("La fecha de término del contrato no puede ser anterior a la fecha de inicio");
      }
    } else {
      alert("No están todos los datos ingresados");
    }
  }

  onCheckboxChange(index: number) {
    this.contratoSeleccionado[index] = !this.contratoSeleccionado[index];
  }

  actualizarContrato() {
    const seleccionados = this.contratos.filter((_, index) => this.contratoSeleccionado[index]);

    if (seleccionados.length === 1) {
      this.contratoActual = seleccionados[0];
      this.showModalEditar = true;
    } else if (seleccionados.length > 1){
      alert('Solo puedes seleccionar un contrato para actualizar.');
    } else {
      alert('Por favor selecciona un proveedor para actualizar.');
    }
  }

  cancelarActualizacion() {
    this.showModalEditar = false;
  }

  actualizarElContrato() {
    const formatearCampo = (campo: string, longitud: number) => {
      return String(campo).padStart(longitud, '0');
    };

    const contrato = this.contratoActual;
    const datosActualizar: any = {};

    if (contrato.nombre) datosActualizar.nombre = contrato.nombre;
    if (contrato.fecha_inicio) datosActualizar.fecha_inicio = contrato.fecha_inicio;
    if (contrato.fecha_termino) datosActualizar.fecha_termino = contrato.fecha_termino;
    if (contrato.proveedor) datosActualizar.proveedor = formatearCampo(contrato.proveedor, 4);
    if (contrato.ito) datosActualizar.ito = formatearCampo(contrato.ito, 3);

    if (Object.keys(datosActualizar).length > 0) {
      const url = `http://localhost:8000/api/contratos/${contrato.id}`;

      this.http.patch(url, datosActualizar, { responseType: 'text' })
        .subscribe(
          (response) => {
            if (response == "Se encontraron errores en los datos enviados.") {
              alert("Un dato ingresado no fue reconocido por el sistema");
            } else {
              alert('Contrato actualizado correctamente');
              this.showModalEditar = false;
              this.obtenerContratos();
            }
          },
          (error) => {
            console.error('Error al actualizar contrato:', error);
            alert("No se pudo actualizar el contrato, hay un dato mal ingresado");
          }
        );
    } else {
      alert("No hay cambios para actualizar");
    }
  }


  eliminarContrato() {
    const seleccionados = this.contratos.filter((_, index) => this.contratoSeleccionado[index]);

    if (seleccionados.length > 0) {
      const idsSeleccionados = seleccionados.map((contrato) => contrato.id);

      // Llamar a la API para obtener los contratos completos
      this.obtenerContratosParaEliminar(idsSeleccionados);

      this.modalAbiertoEliminar = true;
    } else {
      alert('Ningún contrato fue seleccionado para eliminar');
    }
  }

  obtenerContratosParaEliminar(ids: number[]) {
    const apiUrl = 'http://localhost:8000/api/contratos/id/';

    const requests = ids.map(id => {
      return this.http.get(`${apiUrl}${id}`);
    });

    // Suscribirse a los Observables
    forkJoin(requests).subscribe(
      (respuestas: any[]) => {
        console.log('Respuestas de la API:', respuestas);  // Verifica la respuesta ahora

        // Extraemos el contrato de cada array de la respuesta
        this.contratosAEliminar = respuestas.map(respuesta => respuesta[0]); // Accede al primer contrato

        console.log('Contratos a eliminar:', this.contratosAEliminar);  // Verifica los contratos extraídos
      },
      (error) => {
        console.error('Error al obtener los contratos:', error);
      }
    );
  }


  cerrarModalEliminar() {
    this.modalAbiertoEliminar = false;
    this.idsContratosEliminar = '';
  }

  confirmarEliminacion() {
    const seleccionados = this.contratos.filter((_, index) => this.contratoSeleccionado[index]);

    seleccionados.forEach(contrato => {
      const url = `http://localhost:8000/api/contratos/${contrato.id}`;

      this.http.delete(url, { responseType: 'text' }).subscribe(
        (response) => {
          console.log(`Contrato con ID ${contrato.id} eliminado:`, response);
          alert("Contrato(s) eliminado(s) con éxito");
          this.obtenerContratos();
        },
        (error) => {
          console.error(`Error al eliminar el contrato con ID ${contrato.id}:`, error);
          alert(`Error al eliminar uno o más contratos: ${error.message}`);
        }
      );

    });
    this.cerrarModalEliminar();
  }


  filtrarContratos() {
    const url = `http://localhost:8000/api/contratos/pagina/${this.contratosAObtener}`;

    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.contratos = data.sort((a, b) => {
          let valorA: any = a[this.campoOrden];
          let valorB: any = b[this.campoOrden];

          if (this.campoOrden === 'rut') {
            valorA = this.parsearRut(valorA);
            valorB = this.parsearRut(valorB);
          } else if (this.campoOrden === 'fecha_inicio' || this.campoOrden === 'fecha_termino') {
            valorA = valorA ? new Date(valorA) : new Date(0); // Fecha mínima si es null
            valorB = valorB ? new Date(valorB) : new Date(0);
          } else {
            valorA = valorA ? valorA.toString().toLowerCase() : '';
            valorB = valorB ? valorB.toString().toLowerCase() : '';
          }

          return this.orden === 'asc' ? (valorA > valorB ? 1 : -1) : (valorA < valorB ? 1 : -1);
        });
      },
      (error) => {
        console.error('Error al filtrar contratos:', error);
      }
    );
  }


  parsearRut(rut: string): number {
    return parseInt(rut.replace(/\./g, '').split('-')[0], 10);
  }


  gestionPaginas(accion: string) {
    if (accion === 'anterior') {
      if (this.contratosAObtener > 1) {
        this.contratosAObtener--;
        this.obtenerContratos();
      } else {
        alert('No hay una página anterior a esta.');
      }
    } else if (accion === 'siguiente') {
      const paginaSiguiente = this.contratosAObtener + 1;
      const url = `http://localhost:8000/api/contratos/pagina/${paginaSiguiente}`;

      this.http.get<any>(url, { responseType: 'json' as 'json' }).subscribe(
        response => {
          if (Array.isArray(response) && response.length > 0) {
            this.contratosAObtener++;
            this.contratos = response;
          } else {
            alert('No hay más contratos disponibles.');
          }
        },
        error => {
          if (error.status === 200 && error.error?.text) {
            // Caso donde la API devuelve un mensaje de error en texto plano
            alert('No hay más contratos disponibles.');
          } else {
            console.error('Error al obtener contratos :', error);
            alert('Ocurrió un error al obtener los contratos . Intente nuevamente.');
          }
        }
      );
    }
  }

  getEstadoContrato(fechaTermino: string): string {
    const fechaActual = new Date().getTime();
    const fechaTerminoTime = new Date(fechaTermino.replace(/-/g, '/')).getTime();

    return fechaTerminoTime < fechaActual ? 'Vencido' : 'En Proceso';
  }


  protected readonly convertToParamMap = convertToParamMap;
}
