import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'practicas-krama-2026-front',
  webDir: 'www',
  // Añade este bloque de servidor:
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;