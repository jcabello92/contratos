import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgForOf} from "@angular/common";
import {HttpClient, HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-notificaciones-user',
    imports: [
        RouterLink,
        NgForOf,
        HttpClientModule
    ],
  templateUrl: './notificaciones-user.component.html',
  standalone: true,
  styleUrl: './notificaciones-user.component.css'
})
export class NotificacionesUserComponent implements OnInit {
  contratos: any[] = [];
  proveedores: any[] = [];
  itos: any[] = [];

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.obtenerProveedores();
    await this.obtenerItos();
    await this.obtenerContratos();
    this.mostrarContratosANotificar();
  }

  async obtenerContratos() {
    let pagina = 1;
    let continuar = true;
    this.contratos = []; // Reiniciar lista

    while (continuar) {
      try {
        const url = `http://localhost:8000/api/contratos/pagina/${pagina}`;
        const data: any[] = (await this.http.get<any[]>(url).toPromise()) ?? [];

        if (data.length > 0) {
          this.contratos = [...this.contratos, ...data]; // Concatenar resultados
          pagina++;
        } else {
          continuar = false; // Detener cuando no haya más datos
        }
      } catch (error) {
        console.error('Error al obtener contratos:', error);
        continuar = false;
      }
    }

    // Obtener nombres de proveedores e ITOS para los contratos
    await this.ObtenerProveedoresEItosEnContratos();
  }

  async ObtenerProveedoresEItosEnContratos() {
    const peticiones = this.contratos.map(async (contrato) => {
      try {
        const proveedorUrl = `http://localhost:8000/api/proveedores/id/${contrato.proveedor}`;
        const itoUrl = `http://localhost:8000/api/itos/id/${contrato.ito}`;

        const [proveedorData, itoData] = await Promise.all([
          this.http.get<any[]>(proveedorUrl).toPromise().catch(() => []),
          this.http.get<any[]>(itoUrl).toPromise().catch(() => [])
        ]);

        contrato.proveedor = (Array.isArray(proveedorData) && proveedorData.length > 0)
          ? proveedorData[0].razon_social
          : 'Desconocido';

        contrato.ito = (Array.isArray(itoData) && itoData.length > 0)
          ? `${itoData[0].nombre} ${itoData[0].apellido}`
          : 'Desconocido';

      } catch (error) {
        console.error(`Error al obtener datos para contrato ID ${contrato.id}:`, error);
      }
    });

    await Promise.all(peticiones);
  }

  mostrarContratosANotificar() {
    const fechaActual = new Date();
    const tresMesesDespues = new Date();
    tresMesesDespues.setMonth(fechaActual.getMonth() + 3);

    this.contratos = this.contratos
      .filter(contrato => {
        const fechaTermino = new Date(contrato.fecha_termino.replace(/-/g, '/'));
        return fechaTermino >= fechaActual && fechaTermino <= tresMesesDespues;
      })
      .map(contrato => {
        const fechaTermino = new Date(contrato.fecha_termino.replace(/-/g, '/'));
        const diferenciaDias = Math.ceil((fechaTermino.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24));
        return { ...contrato, diasRestantes: diferenciaDias };
      })
      .sort((a, b) => a.diasRestantes - b.diasRestantes); // Ordenar por días restantes
  }

  async obtenerProveedores() {
    let pagina = 1;
    this.proveedores = [];
    let continuar = true;

    while (continuar) {
      try {
        const respuesta: any = await this.http.get(`http://localhost:8000/api/proveedores/pagina/${pagina}`).toPromise();
        if (!respuesta || (typeof respuesta === 'string' && respuesta.includes('No se encontraron proveedores'))) {
          continuar = false;
        } else if (Array.isArray(respuesta)) {
          this.proveedores = [...this.proveedores, ...respuesta];
          pagina++;
        } else {
          continuar = false;
        }
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
        continuar = false;
      }
    }
  }

  async obtenerItos() {
    let pagina = 1;
    this.itos = [];
    let continuar = true;

    while (continuar) {
      try {
        const respuesta: any = await this.http.get(`http://localhost:8000/api/itos/pagina/${pagina}`).toPromise();
        if (!respuesta || (typeof respuesta === 'string' && respuesta.includes('No se encontraron itos'))) {
          continuar = false;
        } else if (Array.isArray(respuesta)) {
          this.itos = [...this.itos, ...respuesta];
          pagina++;
        } else {
          continuar = false;
        }
      } catch (error) {
        console.error('Error al obtener itos:', error);
        continuar = false;
      }
    }
  }
}
