import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-proyecto-detalle',
  templateUrl: './proyecto-detalle.page.html',
  styleUrls: ['./proyecto-detalle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProyectoDetallePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
