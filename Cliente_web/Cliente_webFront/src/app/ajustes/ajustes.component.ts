import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-ajustes',
  imports: [
    RouterLink
  ],
  templateUrl: './ajustes.component.html',
  standalone: true,
  styleUrl: './ajustes.component.css'
})
export class AjustesComponent {
  constructor(private router: Router) {}

}
