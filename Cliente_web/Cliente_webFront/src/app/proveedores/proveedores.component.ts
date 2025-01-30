import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  imports: [
    NgForOf,
    HttpClientModule
  ],
  standalone: true
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = []; // Aquí almacenaremos los proveedores

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerProveedores();

    // Asegurar que el evento se asigne después de la carga del DOM
    const formCrear = document.getElementById('formCrear') as HTMLFormElement;
    if (formCrear) {
      formCrear.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se recargue
        this.crearProveedor();
      });
    }
  }

  obtenerProveedores() {
    this.http.get<any>('http://localhost:8000/api/proveedores/pagina/1')
      .subscribe(
        data => {
          this.proveedores = data; // Asigna los datos obtenidos al array
        },
        error => {
          console.error('Error al obtener proveedores:', error);
        }
      );
  }


  abrirModalCrear(): void {
    const modal = document.getElementById('modalCrear');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  cerrarModalCrear(): void {
    const modal = document.getElementById('modalCrear');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  crearProveedor(): void {
    const rut = (document.getElementById('rut') as HTMLInputElement)?.value || '';
    const razonSocial = (document.getElementById('razon_social') as HTMLInputElement)?.value || '';
    const direccion = (document.getElementById('direccion') as HTMLInputElement)?.value || '';
    const comuna = (document.getElementById('comuna') as HTMLInputElement)?.value.padStart(3, '0') || '';
    const telefono = (document.getElementById('telefono') as HTMLInputElement)?.value || '';
    const correo = (document.getElementById('correo') as HTMLInputElement)?.value || '';
    const representante = (document.getElementById('representante') as HTMLInputElement)?.value.padStart(4, '0') || '';

    console.log({ rut, razonSocial, direccion, comuna, telefono, correo, representante });

    // Crear la URL con los parámetros de la API
    const url = `http://localhost:8000/api/proveedores/?rut=${rut}&razon_social=${razonSocial}&direccion=${direccion}&comuna=${comuna}&telefono=${telefono}&correo=${correo}&representante=${representante}`;

    // Hacer la llamada POST a la API usando fetch
    fetch(url, {
      method: 'POST', // Método POST
    })
      .then(response => {
        // Verificar si la respuesta es JSON antes de intentar parsearla
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json(); // Si es JSON, parsear
        } else {
          return response.text(); // Si no es JSON, devolver el texto completo
        }
      })
      .then(data => {
        if (typeof data === 'string') {
          // Si la respuesta es un texto, mostrarlo en consola
          console.log('Respuesta no JSON:', data);
          this.obtenerProveedores();
        } else {
          console.log('Proveedor creado:', data);
          this.obtenerProveedores();
        }
        // Cerrar el modal después de enviar
        this.cerrarModalCrear();
        // Limpiar los campos del modal
        this.limpiarCamposModal();
      })
      .catch(error => {
        console.error('Error al crear el proveedor:', error);
      });
  }

  limpiarCamposModal() {
    // Limpiar los campos del modal
    (document.getElementById('rut') as HTMLInputElement).value = '';
    (document.getElementById('razon_social') as HTMLInputElement).value = '';
    (document.getElementById('direccion') as HTMLInputElement).value = '';
    (document.getElementById('comuna') as HTMLInputElement).value = '';
    (document.getElementById('telefono') as HTMLInputElement).value = '';
    (document.getElementById('correo') as HTMLInputElement).value = '';
    (document.getElementById('representante') as HTMLInputElement).value = '';
  }


}
