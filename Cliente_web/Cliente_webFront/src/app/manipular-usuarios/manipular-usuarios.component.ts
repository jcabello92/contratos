import {Component, contentChild, OnInit} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-manipular-usuarios',
  imports: [
    NgClass,
    NgStyle,
    FormsModule,
    HttpClientModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './manipular-usuarios.component.html',
  standalone: true,
  styleUrl: './manipular-usuarios.component.css',
})
export class ManipularUsuariosComponent implements OnInit{
  showModal: boolean = false;
  mostrarPrimerModalEliminar: boolean = false;
  mostrarPrimerModalActualizar: boolean = false;
  mostrarSegundoModalEliminar: boolean = false;
  mostrarSegundoModalActualizar: boolean = false;

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
  usuarioSeleccionado: number | null = null;

  usuarioDetalle = {
    id: null,
    usuario: '',
    rut: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    rol: ''
  };

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

    console.log('URL generada:', url); // Registro en consola para depuración

    if(this.nuevoUsuario.usuario && this.nuevoUsuario.contrasena && this.nuevoUsuario.rut && this.nuevoUsuario.nombre && this.nuevoUsuario.apellido && this.nuevoUsuario.telefono && this.nuevoUsuario.correo && this.nuevoUsuario.rol){
      this.http.post(url, null, { responseType: 'text' }).subscribe({
        next: (response) => {
          if(response == "Se encontraron errores en los datos enviados."){
            alert("Un dato ingresado, no fue reconocido por el sistema")
          }else {
            alert("El documento fue creado exitosamente")
            console.log('Usuario creado exitosamente:', response);
            this.closeModal();
            this.ObtenerUsuarios()
          }
        },
        error: (error) => {
          console.error('Error al crear el usuario:', error);
          alert("No se pudo crear el usuario, hay un dato mal ingresado")
        },
      });
    }else{
      alert("No están todos los datos ingresados")
    }
  }


  ObtenerUsuarios() {
    this.http.get<any[]>('http://localhost:8000/api/usuarios/pagina/1').subscribe(
      (response) => {
        this.usuarios = response; // Almacenar usuarios en la variable
        console.log('Usuarios llamados obtenidos', this.usuarios);
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  // Abrir el primer modal
  abrirPrimerModalActualizar(): void {
    this.mostrarPrimerModalActualizar = true;
  }

  // Cerrar el primer modal
  cerrarPrimerModal(): void {
    this.mostrarPrimerModalActualizar = false;
    this.usuarioSeleccionado = null;
  }

  // Seleccionar usuario
  seleccionarUsuario(id: number): void {
    this.usuarioSeleccionado = id;
  }

  // Abrir el segundo modal
  abrirSegundoModal(): void {
    if (this.usuarioSeleccionado) {
      console.log('ID seleccionado:', this.usuarioSeleccionado);

      this.http.get(`http://localhost:8000/api/usuarios/id/${this.usuarioSeleccionado}`).subscribe(
        (data: any) => {
          console.log('Respuesta de la API:', data);

          // Si data es un array y tiene al menos un elemento
          if (Array.isArray(data) && data.length > 0) {
            const usuario = data[0]; // Tomar el primer elemento del array

            if (usuario && usuario.id) {
              this.usuarioDetalle = {
                id: usuario.id || null,
                usuario: usuario.usuario || '',
                rut: usuario.rut || '',
                nombre: usuario.nombre || '',
                apellido: usuario.apellido || '',
                telefono: usuario.telefono || '',
                correo: usuario.correo || '',
                rol: usuario.rol || '',
              };
              this.mostrarPrimerModalActualizar = false;
              this.mostrarSegundoModalActualizar = true;
            } else {
              console.error('El usuario recibido no tiene un ID válido.');
              console.log('Usuario:', usuario);
            }
          } else {
            console.error('La respuesta de la API no contiene un usuario válido.');
            console.log('Respuesta completa:', data);
          }
        },
        (error) => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      );
    } else {
      console.error('No se seleccionó un usuario');
    }
  }


  // Cerrar el segundo modal
  cerrarSegundoModal(): void {
    this.mostrarSegundoModalActualizar = false;
    // Reiniciar usuarioDetalle con una estructura vacía
    this.usuarioDetalle = {
      id: null,
      usuario: '',
      rut: '',
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      rol: '',
    };
  }

  // Actualizar usuario
// Actualizar usuario
  actualizarUsuario(): void {
    if (this.usuarioDetalle && this.usuarioDetalle.id) {
      this.http
        .patch(`http://localhost:8000/api/usuarios/${this.usuarioDetalle.id}`, this.usuarioDetalle, { responseType: 'text' })
        .subscribe(
          (response) => {
            console.log('Respuesta del servidor:', response);
            alert('Usuario actualizado correctamente');
            this.mostrarSegundoModalActualizar = false;
            this.ObtenerUsuarios();
          },
          (error) => {
            console.error('Error al actualizar el usuario:', error);
            console.log('Datos enviados en el PATCH:', this.usuarioDetalle);
          }
        );
    } else {
      console.error('El ID del usuario no está definido');
    }
  }



  abrirModalEliminar(): void {
    this.mostrarPrimerModalEliminar = true;
    this.usuarioSeleccionado = null;
  }

  cerrarModalEliminar(): void {
    this.mostrarPrimerModalEliminar = false;
    this.mostrarSegundoModalEliminar = false;
    this.usuarioSeleccionado = null;
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




}
