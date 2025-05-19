import type { Theme as MuiTheme } from '@mui/material/styles';
import type { ThemeVars } from '@mui/system/cssVars';

declare module '@mui/material/styles' {
  interface Theme extends MuiTheme {
    vars?: ThemeVars;
  }
}
