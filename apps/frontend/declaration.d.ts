import { PaletteColorOptions, PaletteOptions } from '@mui/material/styles';
declare module 'react-map-gl-geocoder';
declare module 'mic-recorder-to-mp3';

interface Window {
    webkitAudioContext: typeof AudioContext
}

declare module '@mui/material/styles' {
    interface PaletteOptions {
        paper?: PaletteColorOptions
    }
    // allow configuration using `createTheme()`
    // interface ThemeOptions {
    //   status?: {
    //     danger?: string;
    //   };
    // }
  }
