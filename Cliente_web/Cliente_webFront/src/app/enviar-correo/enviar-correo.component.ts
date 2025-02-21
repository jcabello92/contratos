import { Component, Input } from '@angular/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-enviar-correo',
  templateUrl: './enviar-correo.component.html',
  standalone: true,
  styleUrls: ['./enviar-correo.component.css']
})
export class EnviarCorreoComponent {

  @Input() enviarCorreoFn: (() => void) | undefined; // ✅ Uso correcto de @Input()

  enviarCorreo() {
    const templateParams = {
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      mensaje: 'Tu contrato ha sido generado exitosamente.'
    };

    emailjs.send('service_uxe4xlr', 'template_dy8romm', templateParams, '5t3e8VdfQtWUUB3qM')
      .then(response => {
        //console.log('Correo enviado:', response);
        alert('Correo enviado correctamente.');
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
      });
  }
}
