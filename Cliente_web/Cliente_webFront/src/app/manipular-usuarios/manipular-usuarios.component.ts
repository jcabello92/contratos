import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-manipular-usuarios',
  imports: [
    NgClass,
    NgStyle,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './manipular-usuarios.component.html',
  standalone: true,
  styleUrl: './manipular-usuarios.component.css',
})
export class ManipularUsuariosComponent {
  showModal: boolean = false;
  nuevoUsuario = {
    usuario: '',
    contrasena: '',
    rut: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    rol: '',
  };

  constructor(private http: HttpClient) {}

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.nuevoUsuario = {
      usuario: '',
      contrasena: '',
      rut: '',
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      rol: '',
    };
  }

  crearUsuario() {
    if (
      !this.nuevoUsuario.usuario ||
      !this.nuevoUsuario.contrasena ||
      !this.nuevoUsuario.rut ||
      !this.nuevoUsuario.nombre ||
      !this.nuevoUsuario.apellido ||
      !this.nuevoUsuario.telefono ||
      !this.nuevoUsuario.correo ||
      !this.nuevoUsuario.rol
    ) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    // Cifrar la contraseña usando MD5
    const md5 = new Md5();
    const contrasenaCifrada = md5.appendStr(this.nuevoUsuario.contrasena).end() as string;

    // Crear los parámetros para la URL
    const queryParams = new URLSearchParams({
      usuario: this.nuevoUsuario.usuario,
      contrasena: contrasenaCifrada,
      rut: this.nuevoUsuario.rut,
      nombre: this.nuevoUsuario.nombre,
      apellido: this.nuevoUsuario.apellido,
      telefono: this.nuevoUsuario.telefono,
      correo: this.nuevoUsuario.correo,
      rol: this.nuevoUsuario.rol.toString(),
    });

    const url = `http://localhost:8000/api/usuarios?${queryParams.toString()}`;

    console.log('URL generada:', url); // Registro en consola para depuración

    // Realizar la solicitud POST
    this.http.post(url, null, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Usuario creado exitosamente:', response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear el usuario:', error);
      },
    });
  }
}
