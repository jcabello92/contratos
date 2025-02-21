import {Component, contentChild, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import emailjs from '@emailjs/browser';
import {EnviarCorreoComponent} from '../enviar-correo/enviar-correo.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgIf],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  user: string = '';
  password: string = '';
  showPassword: boolean = false;
  apiUrl: string = 'http://localhost:8000/api/usuarios'; // Base URL de la API

  // Variables para recuperar contraseña
  usuarioIngresado: string = '';
  codigoGenerado: string = '';
  codigoIngresado: string = '';
  usuarioEncontrado: any = null;
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  mostrarPrimerModal: boolean = false;
  mostrarSegundoModal: boolean = false;
  mostrarTercerModal: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    localStorage.removeItem('loggedInUser');
  }

  // Función de login
  onLogin(event: Event) {
    event.preventDefault();

    const md5 = new Md5();
    const hashedPassword = md5.appendStr(this.password).end(); // Contraseña cifrada
    const url = `${this.apiUrl}?usuario=${this.user}&contrasena=${hashedPassword}`;

    this.http.get<any[]>(url).subscribe(
      (users) => {
        if (users.length > 0) {
          const matchedUser = users[0];
          localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));

          if (matchedUser.rol === 1) {
            this.router.navigate(['/principalPage']);
          } else if (matchedUser.rol === 2) {
            this.router.navigate(['/principalPageUsers']);
          }
        } else {
          alert('Usuario o contraseña no son correctos.');
        }
      },
      (error) => {
        console.error('Error al conectar con la API:', error);
        alert('El usuario o contraseña no son correctos.');
      }
    );
  }

  // 🔹 Abre el primer modal
  abrirPrimerModal() {
    this.mostrarPrimerModal = true;
  }

  // 🔹 Cierra todos los modales
  cerrarModales() {
    this.mostrarPrimerModal = false;
    this.mostrarSegundoModal = false;
    this.mostrarTercerModal = false;
  }

  verificarUsuario() {
    this.http.get<any[]>('http://localhost:8000/api/usuarios/pagina/1').subscribe(
      (usuarios) => {
        //console.log("Estos son los usuarios encontrados:", usuarios);

        // Normalizamos el usuario ingresado y lo comparamos con los usuarios de la base de datos
        const usuarioIngresadoNormalizado = this.usuarioIngresado.trim().toLowerCase();

        // Buscar el usuario en la lista con la comparación insensible al caso
        this.usuarioEncontrado = usuarios.find(user =>
          user.usuario.toLowerCase() === usuarioIngresadoNormalizado
        );

        if (this.usuarioEncontrado) {
          this.codigoGenerado = this.generarCodigo();
          this.enviarCorreo(this.usuarioEncontrado.email, this.codigoGenerado);
          alert('Se ha enviado un código de verificación a tu correo.');
          this.mostrarPrimerModal = false;
          this.mostrarSegundoModal = true;
        } else {
          alert('El usuario no existe.');
        }
      },
      (error) => {
        console.error('Error obteniendo usuarios:', error);
        alert('Error al conectar con la base de datos.');
      }
    );
  }



  // 🔹 Genera un código aleatorio de 4 dígitos
  generarCodigo(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // 🔹 Envía un correo con el código de verificación
  enviarCorreo(email: string, codigo: string) {
    const serviceId = 'service_uxe4xlr';
    const templateId = 'template_i6u9gor';
    const userId = '5t3e8VdfQtWUUB3qM';

    const templateParams = {
      to_email: this.usuarioEncontrado.correo,
      codigo: codigo,
      nombre: this.usuarioEncontrado.nombre
    };

    //console.log("Datos Correo:", templateParams )

    emailjs.send(serviceId, templateId, templateParams, userId)
      .then(() => console.log('Correo enviado exitosamente'))
      .catch((error: any) => console.error('Error enviando correo:', error));
  }

  // 🔹 Verifica el código ingresado
  verificarCodigo() {
    if (this.codigoIngresado === this.codigoGenerado) {
      alert('Tienes permitido modificar tu contraseña.');
      this.mostrarSegundoModal = false;
      this.mostrarTercerModal = true;
    } else {
      alert('El código ingresado es incorrecto.');
      this.mostrarSegundoModal = false;
    }
  }

  // 🔹 Actualiza la contraseña del usuario
  actualizarContrasena() {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const md5 = new Md5();
    const hashedPassword = md5.appendStr(this.nuevaContrasena).end();

    this.http.patch(`http://localhost:8000/api/usuarios/${this.usuarioEncontrado.id}`, { contrasena: hashedPassword }, { responseType: 'text' })
      .subscribe(
        (response) => {
          //console.log(response);  // Verifica si la respuesta es el mensaje correcto.
          alert('Contraseña actualizada correctamente.');
          this.cerrarModales();
        },
        (error) => {
          console.error('Error actualizando la contraseña:', error);
          alert('Error al actualizar la contraseña.');
        }
      );

  }
}
