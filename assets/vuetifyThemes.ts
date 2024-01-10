import { twColors } from "./tw-colors"

export const light = {
  dark: false,
  colors: {
    background: "#edf1f4",
    surface: "#FFFFFF",
    primary: "#BF247A",
    secondary: "#812B8C",
    accent: "#2A2359",
    error: twColors.red[500],
    info: twColors.blue[500],
    success: twColors.emerald[500],
    warning: twColors.amber[500],
  },
}

export const dark = {
  dark: true,
  colors: {
    // background: "#edf1f4",
    // surface: "#FFFFFF",
    primary: "#BF247A",
    secondary: "#812B8C",
    accent: "#2A2359",
    error: twColors.red[500],
    info: twColors.blue[500],
    success: twColors.emerald[500],
    warning: twColors.amber[500],
  },
}