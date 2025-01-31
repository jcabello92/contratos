import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-oits',
  imports: [
    NgForOf,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './oits.component.html',
  standalone: true,
  styleUrl: './oits.component.css'
})
export class OITsComponent implements OnInit{
  itos: any[] = [];


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
      this.ObtenerItos();
  }

  ObtenerItos(){
    this.http.get<any>('http://localhost:8000/api/itos/pagina/1')
      .subscribe(
        data => {
          this.itos = data; // Asigna los datos obtenidos a la variable
        },
        error => {
          console.error('Error al obtener representantes:', error);
        }
      );


  }





}
