import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-ajustes',
  imports: [RouterLink, NgIf],
  templateUrl: './ajustes.component.html',
  standalone: true,
  styleUrl: './ajustes.component.css'
})
export class AjustesComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  imagenPreview: string | null = null;

  constructor(private router: Router) {}

  seleccionarArchivo() {
    this.fileInput.nativeElement.click();
  }

  procesarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];

      //Solo png o jpg
      if (!archivo.type.match('image/png') && !archivo.type.match('image/jpeg')) {
        alert('Solo se permiten imágenes en formato PNG o JPG.');
        input.value = ''; // Limpiar el input
        return;
      }

      //vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.imagenPreview = e.target.result as string;
        }
      };
      reader.readAsDataURL(archivo);
    }
  }
}
