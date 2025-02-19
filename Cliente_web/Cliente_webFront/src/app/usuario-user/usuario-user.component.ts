import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import { Md5 } from 'ts-md5';
import {HttpClient} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-usuario-user',
  imports: [
    RouterLink,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './usuario-user.component.html',
  standalone: true,
  styleUrl: './usuario-user.component.css'
})
export class UsuarioUserComponent implements OnInit {
  usuarioActual: any = null;
  nuevaContrasena: string = '';
  repetirContrasena: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.detectarUsuario();
  }

  detectarUsuario() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (!usuarioLogueado || !usuarioLogueado.usuario) {
      console.error('No hay un usuario logueado en localStorage.');
      return;
    }

    let pagina = 1;
    const buscarUsuario = () => {
      const url = `http://localhost:8000/api/usuarios/pagina/${pagina}`;

      this.http.get<any[]>(url).subscribe(
        (usuarios) => {
          const usuarioEncontrado = usuarios.find(user => user.usuario === usuarioLogueado.usuario);

          if (usuarioEncontrado) {
            this.usuarioActual = usuarioEncontrado;
          } else if (usuarios.length > 0) {
            pagina++;
            buscarUsuario(); // Llamamos recursivamente hasta encontrar el usuario o que no haya más usuarios
          }
        },
        (error) => console.error('Error al obtener usuarios:', error)
      );
    };

    buscarUsuario();
  }

  cambiarContrasena() {
    if (!this.usuarioActual) {
      alert('No se ha detectado un usuario válido.');
      return;
    }

    if (this.nuevaContrasena !== this.repetirContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const md5 = new Md5();
    const hashedPassword = md5.appendStr(this.nuevaContrasena).end(); // Contraseña cifrada

    const body = { contrasena: hashedPassword };

    this.http.patch(`http://localhost:8000/api/usuarios/${this.usuarioActual.id}`, body, { responseType: 'text' })
      .subscribe(
      () => alert('Contraseña actualizada correctamente.'),
      (error) => console.error('Error al actualizar la contraseña:', error)
    );
  }
}
