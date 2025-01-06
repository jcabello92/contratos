import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //Variables declaradas
  user: string = '';
  password: string = '';
  showPassword: boolean = false;



  // Función para alternar entre mostrar y ocultar la contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Función de login, para guardar el usuario y la contraseña más adelante (será usada más adelante)
  onLogin() {
    console.log('User:', this.user);
    console.log('Password:', this.password);
  }
}
