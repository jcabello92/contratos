import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';


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

  constructor(private http: HttpClient) {}

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




}
