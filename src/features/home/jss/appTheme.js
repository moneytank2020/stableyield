import { blue } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const createThemeMode = isNightMode =>
  createTheme({
    palette: {
      type: isNightMode ? 'dark' : 'light',
      background: {
        default: isNightMode ? '#FFFFFFFF' : '#FFFFFFFF',
        paper: isNightMode ? '#FFFFFFFF' : '#FFFFFFFF',
        primary: isNightMode ? '#1d1930' : '#1d1930',
        secondary: isNightMode ? '#3B3A4D' : '#1d1930',
        extra: isNightMode ? '#1d1930' : '#1d1930',
        dark: isNightMode ? '#2B2A3D' : '#999',
        paused: isNightMode ? '#2B2A5A' : '#FCE57E',
        retired: isNightMode ? '#d32f2f' : '#e57373',
        hover: isNightMode ? '#2B2A3D' : '#EFE6DC',
        border: isNightMode ? '#121127' : '#121127',
        overlay: isNightMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
      },
      primary: {
        main: isNightMode ? '#fff' : '#000',
      },
      secondary: {
        main: isNightMode ? '#fff' : '#1d1930',
      },
      text: {
        primary: isNightMode ? `#075be8` : `#075be8`,
        secondary: isNightMode ? '#B0B0DD' : '#00000066',
        flipped: isNightMode ? '#000' : '#fff',
      },
      MuiButton:{
        primary: isNightMode ? `#075be8` : `#075be8`,
      }
    },
    overrides: {
      MuiButton: {
        label: {
          color: isNightMode ? '#fff' : '#000',
        },
      },
      // for dropdown menu items
      MuiButtonBase: {
        root: {
          color: isNightMode ? '#fff' : '#000',
        },
      },
      MuiCheckbox: {
        colorPrimary: {
          color: isNightMode ? '#fff' : '#000',
        },
        colorSecondary: {
          color: isNightMode ? '#fff' : '#000',
        },
      },
    },
  });

export default createThemeMode;
