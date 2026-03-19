import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Importamos todos los componentes nativos de Ionic que vamos a usar
import { IonContent, IonButton, IonInput, MenuController, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';

// Importamos la herramienta para usar los iconos oficiales de Ionic
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton,  IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon]
})
export class LoginPage implements OnInit {

  usuario: string = '';
  contrasena: string = '';

  constructor(
    private router: Router,
    private menuCtrl: MenuController) { 
      // Registramos los iconos que usaremos en los inputs
      addIcons({ personOutline, lockClosedOutline });
    }

  ngOnInit() { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  inciarSesion(){
    if (this.usuario === '' || this.contrasena === '') {
      alert('Por favor, rellene los campos de usuario y contraseña');
      return;
    }

    let rolAsignado = 'usuario'; 
    if (this.usuario.toLowerCase() === 'admin') {
      rolAsignado = 'administrador';
    }
    localStorage.setItem('rol', rolAsignado); 

    console.log('Inicio de sesión exitoso. Rol asignado: ' , rolAsignado);

    this.router.navigate(['/inicio']); 
  }
}