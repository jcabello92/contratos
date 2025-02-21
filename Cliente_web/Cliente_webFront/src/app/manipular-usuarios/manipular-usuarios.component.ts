import {Component, contentChild, OnInit} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Md5 } from 'ts-md5';
import emailjs from '@emailjs/browser';
import {EnviarCorreoComponent} from '../enviar-correo/enviar-correo.component';

@Component({
  selector: 'app-manipular-usuarios',
  imports: [
    NgClass,
    NgStyle,
    FormsModule,
    HttpClientModule,
    NgIf,
    NgForOf,
    EnviarCorreoComponent,
  ],
  templateUrl: './manipular-usuarios.component.html',
  standalone: true,
  styleUrl: './manipular-usuarios.component.css',
})
export class ManipularUsuariosComponent implements OnInit{
  showModal: boolean = false;
  mostrarPrimerModalEliminar: boolean = false;
  mostrarSegundoModalEliminar: boolean = false;

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

  protected usuarios: any[] = [];
  usuarioSeleccionado: boolean[] = [];
  usuarioDetalle: any = {}; // Datos del usuario seleccionado
  showModalEditar: boolean = false; // Control del modal

  codigoDeCreacion: number = 0;  // Inicializar con un valor predeterminado
  codigoIngresado: string = '';  // Inicializar con un valor predeterminado
  showModalCodigo: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.ObtenerUsuarios()
  }

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

    //console.log('URL generada:', url); // Registro en consola para depuración

    if (this.nuevoUsuario.usuario && this.nuevoUsuario.contrasena && this.nuevoUsuario.rut && this.nuevoUsuario.nombre && this.nuevoUsuario.apellido && this.nuevoUsuario.telefono && this.nuevoUsuario.correo && this.nuevoUsuario.rol) {
      if (this.validarCodigo()) {  // Aquí llamamos a validarCodigo antes de proceder
        this.http.post(url, null, { responseType: 'text' }).subscribe({
          next: (response) => {
            if (response == "Se encontraron errores en los datos enviados.") {
              alert("Un dato ingresado, no fue reconocido por el sistema");
            } else {
              alert("El usuario fue creado exitosamente");
              //console.log('Usuario creado exitosamente:', response);
              this.closeModal();
              this.closeModalCodigo();

              setTimeout(() => {
                this.ObtenerUsuarios();
              }, 2000);

            }
          },
          error: (error) => {
            console.error('Error al crear el usuario:', error);
            alert("No se pudo crear el usuario, hay un dato mal ingresado");
          },
        });
      } else {
        alert("Los códigos no eran exactamente iguales, intente nuevamente");
      }
    } else {
      alert("No están todos los datos ingresados");
    }
  }


  ObtenerUsuarios() {
    this.http.get<any[]>('http://localhost:8000/api/usuarios/pagina/1').subscribe(
      (response) => {
        this.usuarios = response; // Almacenar usuarios en la variable
        //console.log('Usuarios llamados obtenidos', this.usuarios);
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  // Manejar selección con checkboxes
  onCheckboxChange(index: number) {
    this.usuarioSeleccionado[index] = !this.usuarioSeleccionado[index];
  }

  // Método para actualizar usuario
  actualizarUsuario() {
    const seleccionados = this.usuarios.filter((_, index) => this.usuarioSeleccionado[index]);

    if (seleccionados.length === 1) {
      this.usuarioDetalle = { ...seleccionados[0] }; // Copiar datos del usuario seleccionado
      this.showModalEditar = true;
    } else if (seleccionados.length > 1) {
      alert('Solo puedes seleccionar un usuario para actualizar.');
    } else {
      alert('Por favor selecciona un usuario para actualizar.');
    }
  }

  // Cerrar modal
  cancelarActualizacion() {
    this.showModalEditar = false;
  }

  // Enviar actualización a la API
  actualizarElUsuario() {
    if (!this.usuarioDetalle.id) {
      alert("El usuario seleccionado no tiene un ID válido.");
      return;
    }

    const url = `http://localhost:8000/api/usuarios/${this.usuarioDetalle.id}`;
    this.http.patch(url, this.usuarioDetalle, { responseType: 'text' })
      .subscribe(
        (response) => {
          if (response === "Se encontraron errores en los datos enviados.") {
            alert("Un dato ingresado no fue reconocido por el sistema");
          } else {
            alert('Usuario actualizado correctamente');
            this.showModalEditar = false;
            this.ObtenerUsuarios(); // Recargar lista de usuarios
          }
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
          alert("No se pudo actualizar el usuario, hay un dato mal ingresado");
        }
      );
  }


  abrirModalEliminar(): void {
    this.mostrarPrimerModalEliminar = true;
    this.usuarioSeleccionado = new Array(this.usuarios.length).fill(false);
  }

  cerrarModalEliminar(): void {
    this.mostrarPrimerModalEliminar = false;
    this.mostrarSegundoModalEliminar = false;
    this.usuarioSeleccionado = new Array(this.usuarios.length).fill(false);

  }

  validarUsuarioEliminar(): void {
    if (!this.usuarioSeleccionado) {
      alert('Por favor, ingresa un ID válido.');
      return;
    }

    this.ObtenerUsuarios(); // Llamada para obtener los usuarios
    const usuarioExiste = this.usuarios.some(usuario => usuario.id === this.usuarioSeleccionado);

    if (usuarioExiste) {
      this.mostrarPrimerModalEliminar = false;
      this.mostrarSegundoModalEliminar = true;
    } else {
      this.cerrarModalEliminar();
      alert('El ID del usuario ingresado no existe.');
    }
  }

  confirmarEliminarUsuario(): void {
    if (!this.usuarioSeleccionado) {
      alert('No se ha seleccionado un usuario para eliminar.');
      return;
    }

    this.http.delete(`http://localhost:8000/api/usuarios/${this.usuarioSeleccionado}`, { responseType: 'text' }).subscribe(
      (response) => {
        alert(`Usuario con ID ${this.usuarioSeleccionado} eliminado correctamente.`);
        this.mostrarSegundoModalEliminar = false;
        this.ObtenerUsuarios(); // Actualizar la lista de usuarios
      },
      (error) => {
        console.error('Error al eliminar el usuario:', error);
        alert('Ocurrió un error al intentar eliminar el usuario.');
      }
    );
  }

  enviarCorreo() {
    // Generar un código aleatorio de 4 dígitos
    const codigoGenerado = Math.floor(1000 + Math.random() * 9000);  // Genera un número de 4 dígitos

    // Guardar el código generado en la variable temporal
    this.codigoDeCreacion = codigoGenerado;

    const templateParams = {
      nombre: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.correo,
      from_email: 'NoContestar@gmail.com',
      codigo: this.codigoDeCreacion,  // Enviar el código generado al correo
    };

    emailjs.send('service_uxe4xlr', 'template_dy8romm', templateParams, '5t3e8VdfQtWUUB3qM')
      .then(response => {
        //console.log('Correo enviado:', response);
        alert('Correo enviado correctamente. Revisa tu bandeja de entrada para el código de confirmación.');
        this.showModalCodigo = true;  // Mostrar el modal para ingresar el código
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
      });
  }

  validarCodigo(): boolean {
    if (this.codigoIngresado === this.codigoDeCreacion.toString()) {
      // Obtener la lista de usuarios con estado 2
      this.http.get<any[]>('http://localhost:8000/api/usuarios/activar/pagina/1')
        .subscribe(
          (usuarios) => {
            //console.log("Usuarios obtenidos:", usuarios); // ✅ Verificar la lista completa

            if (Array.isArray(usuarios)) {
              usuarios.forEach(usuario => {
                //console.log(`Intentando activar usuario ID: ${usuario.id}`); // 🔍 Depuración

                if (usuario.id) {
                  //console.log("IdLocura:",usuario.id)
                  this.http.patch(`http://localhost:8000/api/usuarios/activar/${usuario.id}`, {}, { responseType: 'text' })
                    .subscribe(
                      () => console.log(`✅ Usuario ${usuario.id} activado`),
                      (error) => console.error(`❌ Error activando usuario ${usuario.id}:`, error)
                    );
                }
              });
            }
          },
          (error) => console.error('❌ Error obteniendo usuarios con estado 2:', error)
        );

      return true;
    }

    return false;
  }

  closeModalCodigo() {
    this.showModalCodigo = false;
  }

}
