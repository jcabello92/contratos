import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: string = '';
  password: string = '';
  showPassword: boolean = false;
  apiUrl: string = 'http://localhost:8000/api/usuarios'; // Base URL de la API

  constructor(private router: Router, private http: HttpClient) {}

  // Función para alternar entre mostrar y ocultar la contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Función de login, para validar el usuario y la contraseña
  onLogin(event: Event) {
    event.preventDefault();

    const md5 = new Md5();
    const hashedPassword = md5.appendStr(this.password).end(); // Contraseña cifrada

    // Construimos la URL con los parámetros ingresados por el usuario
    const url = `${this.apiUrl}?usuario=${this.user}&contrasena=${hashedPassword}`;

    // Llamada a la API para verificar las credenciales
    this.http.get<any[]>(url).subscribe(
      (users) => {
        console.log('Usuarios obtenidos:', users); // Para depuración

        // La API debería devolver un array con un solo usuario si las credenciales son correctas
        if (users.length > 0) {
          const matchedUser = users[0];
          console.log('Usuario encontrado:', matchedUser);

          // Guardar el usuario autenticado en el localStorage
          localStorage.setItem('loggedInUser', JSON.stringify(matchedUser)); // Almacena el usuario en localStorage

          // Redirigir según el rol del usuario
          if (matchedUser.rol === 1) {
            this.router.navigate(['/principalPage']); // Página de administrador
          } else if (matchedUser.rol === 2) {
            this.router.navigate(['/principalPageUsers']); // Página de usuario
          }
        } else {
          alert('Usuario o contraseña no son correctos.');
        }
      },
      (error) => {
        console.error('Error al llamar a la API:', error);
        alert('Error al conectar con el servidor.');
      }
    );
  }

}
