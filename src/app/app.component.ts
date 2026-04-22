import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
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
  logOutOutline, logOutSharp, 
  logInOutline, logInSharp,
  barChartOutline, barChartSharp // <-- AÑADIDOS LOS ICONOS PARA "INFORMES"
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonApp, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet]
})
export class AppComponent {
  
  // 2. Definimos las páginas exigidas en el documento Krama (¡Ahora sí, idénticas a tu imagen!)
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    // --- Opciones de Configuración ---
    { title: 'Usuarios', url: '/usuarios', icon: 'people' },
    { title: 'Clientes', url: '/clientes', icon: 'briefcase' },
    { title: 'Proyectos', url: '/proyectos', icon: 'folder' },
    // ---------------------------------
    { title: 'Informes', url: '/informes', icon: 'bar-chart' },
    { title: 'Notificaciones', url: '/notificaciones', icon: 'notifications' },
    { title: 'Ajustes', url: '/ajustes', icon: 'settings' }, // <-- AÑADIDO AJUSTES
    { title: 'Acerca de', url: '/acerca', icon: 'information-circle' }
  ];

  constructor() {
    const temaGuardado = localStorage.getItem('modoOscuro');
    if (temaGuardado === 'true') {
      document.documentElement.classList.add('ion-palette-dark'); 
    }
    
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
      logInOutline, logInSharp,
      barChartOutline, barChartSharp // <-- REGISTRADOS LOS DE INFORMES
    });
  }

  get esAdmin(): boolean {
    // ⚠️ CAMBIA 'usuarioLogueado' por la palabra exacta que viste en el F12
    const usuarioStr = localStorage.getItem('usuarioLogueado'); 
    
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      
      // Asegurarnos de que el rol existe y pasarlo a mayúsculas para que 'admin', 'Admin' y 'ADMIN' funcionen igual
      const nombreDelRol = usuario.rol ? usuario.rol.toUpperCase() : '';
      
      return nombreDelRol === 'ADMIN' || nombreDelRol === 'ADMINISTRADOR'; 
    }
    return false;
  }

  get paginasVisibles() {
    return this.appPages.filter(pagina => {
      // Si la página es de configuración O de notificaciones, solo se muestra si el usuario es Admin
      if (
        pagina.url === '/usuarios' || 
        pagina.url === '/clientes' || 
        pagina.url === '/proyectos' || 
        pagina.url === '/notificaciones' // <-- AÑADIDO AQUÍ
      ) {
        return this.esAdmin;
      }
      // El resto de páginas se muestran siempre
      return true; 
    });
  }
}