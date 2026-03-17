
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

// 1. IMPORTANTE: Importamos solo los iconos que vamos a usar en nuestro menú
import { homeOutline, homeSharp, personOutline, personSharp, settingsOutline, settingsSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Mi Perfil', url: '/perfil', icon: 'person' },
    { title: 'Configuracion', url: '/configuracion', icon: 'settings' }
  ];

  // Hemos borrado la variable "labels" porque ya no la necesitamos en nuestro proyecto

  constructor() {
    // 2. Registramos los iconos para que Ionic los pueda dibujar en pantalla
    addIcons({ homeOutline, homeSharp, personOutline, personSharp, settingsOutline, settingsSharp });
  }
}