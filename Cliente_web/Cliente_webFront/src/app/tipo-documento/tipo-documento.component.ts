import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tipo-documento',
  imports: [
    FormsModule,
    HttpClientModule,
    HttpClientModule,
    NgForOf
  ],
  templateUrl: './tipo-documento.component.html',
  standalone: true,
  styleUrl: './tipo-documento.component.css'
})
export class TipoDocumentoComponent implements OnInit{
  TiposDeDocumentos: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.ObtenerTiposDeDocumentos()
  }

  ObtenerTiposDeDocumentos(){
    this.http.get<any>('http://localhost:8000/api/tipos_documentos/pagina/1')
      .subscribe(
        data => {
          this.TiposDeDocumentos = data; // Asigna los datos obtenidos a la variable
        },
        error => {
          console.error('Error al obtener los tipos de documentos:', error);
        }
      );
  }




}
