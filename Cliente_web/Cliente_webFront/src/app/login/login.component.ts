import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {}

  // Función para alternar entre mostrar y ocultar la contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Función de login, para guardar el usuario y la contraseña cifrada
  onLogin(event: Event) {
    event.preventDefault();

    const md5 = new Md5();
    const hashedPassword = md5.appendStr(this.password).end();

    // Mostrar en consola para verificar
    console.log('User:', this.user);
    console.log("password",this.password)
     console.log('Hashed Password:', hashedPassword);

    // Aquí puedes enviar el usuario y la contraseña cifrada a tu backend
    this.router.navigate(['/principalPage']);
    //this.router.navigate(['/principalPageUsers']);
  }
}
