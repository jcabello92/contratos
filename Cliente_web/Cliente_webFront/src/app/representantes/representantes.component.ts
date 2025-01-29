import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgForOf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-representantes',
  templateUrl: './representantes.component.html',
  styleUrl: './representantes.component.css',
  imports: [
    NgForOf,
    HttpClientModule
  ],
  standalone: true
})
export class RepresentantesComponent implements OnInit {
  representantes: any[] = []; // Lista para almacenar los datos de la API

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerRepresentantes(); // Cargar datos al iniciar el componente
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
}
