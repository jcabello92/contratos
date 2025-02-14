import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {getXHRResponse} from 'rxjs/internal/ajax/getXHRResponse';

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

  //filtros
  campoOrden: string = 'nombre';
  orden: string = 'asc';

  //paginación
  contratosAObtener: number = 1;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obtenerContratos();
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
      data => {
        if (data.length > 0) {
          const fechaActual = new Date();

          this.contratos = data.sort((a, b) => {
            // Convertir fechas de término a objetos Date asegurándonos del formato correcto
            const fechaTerminoA = new Date(a.fecha_termino.replace(/-/g, '/')).getTime();
            const fechaTerminoB = new Date(b.fecha_termino.replace(/-/g, '/')).getTime();

            const estaVencidoA = fechaTerminoA < fechaActual.getTime();
            const estaVencidoB = fechaTerminoB < fechaActual.getTime();

            if (estaVencidoA && !estaVencidoB) return 1;  // `a` está vencido, moverlo abajo
            if (!estaVencidoA && estaVencidoB) return -1; // `b` está vencido, moverlo abajo

            return fechaTerminoA - fechaTerminoB; // Ordenar del más próximo al más lejano
          });
        } else {
          alert('No hay más contratos disponibles.');
          this.contratosAObtener--;
        }
      },
      error => console.error('Error al obtener contratos:', error)
    );
  }




  crearContrato() {
    const formatearCampo = (campo: string, longitud: number) => {
      return String(campo).padStart(longitud, '0');
    };

    const contrato = {
      nombre :this.nuevoContrato.nombre,
      fecha_inicio:this.nuevoContrato.fecha_inicio,
      fecha_termino:this.nuevoContrato.fecha_termino,
      proveedor:this.nuevoContrato.proveedor ? formatearCampo(this.nuevoContrato.proveedor, 4) : this.nuevoContrato.proveedor ,
      ito:this.nuevoContrato.ito ? formatearCampo(this.nuevoContrato.ito, 3) : this.nuevoContrato.ito
    };

    if (contrato.nombre && contrato.fecha_termino && contrato.fecha_inicio && contrato.proveedor && contrato.ito) {
      if(new Date(contrato.fecha_inicio) <= new Date(contrato.fecha_termino)){
        const url = 'http://localhost:8000/api/contratos';

        this.http.post(url, contrato, { responseType: 'text' })
          .subscribe(
            response => {
              console.log('Respuesta del servidor:', response);
              if(response =="No se enviaron todos los datos requeridos."){
                alert("Un dato ingresado, no fue reconocido por el sistema")
              }else{
                alert("Contrato creado con éxito");
                this.obtenerContratos();
                this.cerrarModalContratoCrear();
              }
            },
            error => {
              console.error('Error al crear contrato:', error);
              alert("No se pudo crear el contrato, hay un dato mal ingresado");
            }
          );
      }else{
        alert("La fecha de término del contrato no puede ser anterior a la fecha de inicio del contrato")
      }
    }
    else {
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
    if (contrato.proveedor) datosActualizar.proveedor = formatearCampo(contrato.proveedor,4);
    if (contrato.ito) datosActualizar.ito = formatearCampo(contrato.ito,3);

    if (contrato.nombre && contrato.fecha_inicio && contrato.fecha_termino && contrato.proveedor && contrato.ito) {
      const url = `http://localhost:8000/api/contratos/${contrato.id}`;

      this.http.patch(url, datosActualizar, { responseType: 'text' })
        .subscribe(
          (response) => {
            if(response== "Se encontraron errores en los datos enviados."){
              alert("Un dato ingresado, no fue reconocido por el sistema")
            }else{
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

      const idsSeleccionados = seleccionados.map((contrato) => contrato.id).join(', ');
      this.idsContratosEliminar = idsSeleccionados;
      this.modalAbiertoEliminar = true;
    } else {
      alert('Ningún contrato fue seleccionado para eliminar');
    }
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
        error => {
          console.error(`Error al eliminar el contrato con ID ${contrato.id}:`, error);
          alert("Error al eliminar uno o más contratos");
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



}
