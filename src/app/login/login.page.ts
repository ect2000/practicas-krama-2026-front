import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem,IonInput,MenuController } from '@ionic/angular/standalone';
import { Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput]
})
export class LoginPage implements OnInit {

  usuario: string = '';
  contrasena: string = '';


  constructor(
    private router: Router,
    private menuCtrl: MenuController) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  inciarSesion(){

    if (this.usuario === '' || this.contrasena === '') {
      // Aquí puedes redirigir al usuario a la página de inicio o a otra página protegida
      alert('Porfavor, rellene los cmapos de usuario y contraseña');
      return;
    }

    let rolAsignado = 'usuario'; // Aquí puedes asignar el rol que corresponda al usuario
    if (this.usuario.toLowerCase() === 'admin') {
      rolAsignado = 'administrador';
    }
    localStorage.setItem('rol', rolAsignado); // Guardamos el rol en el almacenamiento local

    console.log('Inicio de sesión exitoso. Rol asignado: ' , rolAsignado);

    this.router.navigate(['/inicio']); // Redirige a la página de inicio después del inicio de sesión exitoso
  }
}
