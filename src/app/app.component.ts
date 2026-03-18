import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

// 1. IMPORTANTE: Importamos todos los iconos que usaremos en el nuevo menú
import { 
  homeOutline, homeSharp, 
  documentTextOutline, documentTextSharp, 
  notificationsOutline, notificationsSharp, 
  peopleOutline, peopleSharp, 
  briefcaseOutline, briefcaseSharp, 
  folderOutline, folderSharp, 
  settingsOutline, settingsSharp, 
  informationCircleOutline, informationCircleSharp,
  logOutOutline, logOutSharp, // Para un futuro botón de cerrar sesión
  logInOutline,logInSharp
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet]
})
export class AppComponent {
  
  // 2. Definimos las páginas exigidas en el documento Krama
  public appPages = [
    { title: 'Inicio Sesion', url: '/login', icon: 'log-in' },
    { title: 'Tabla principal', url: '/inicio', icon: 'home' },
    { title: 'Informes', url: '/informes', icon: 'document-text' },
    { title: 'Notificaciones', url: '/notificaciones', icon: 'notifications' },
    { title: 'Config. Usuarios', url: '/usuarios', icon: 'people' },
    { title: 'Config. Clientes', url: '/clientes', icon: 'briefcase' },
    { title: 'Config. Proyectos', url: '/proyectos', icon: 'folder' },
    { title: 'Ajustes', url: '/ajustes', icon: 'settings' },
    { title: 'Acerca de', url: '/acerca', icon: 'information-circle' }
  ];

  constructor() {
    // 3. Registramos los iconos para que Ionic los dibuje en el HTML
    addIcons({ 
      homeOutline, homeSharp, 
      documentTextOutline, documentTextSharp, 
      notificationsOutline, notificationsSharp, 
      peopleOutline, peopleSharp, 
      briefcaseOutline, briefcaseSharp, 
      folderOutline, folderSharp, 
      settingsOutline, settingsSharp, 
      informationCircleOutline, informationCircleSharp,
      logOutOutline, logOutSharp,
      logInOutline,logInSharp
    });
  }
}