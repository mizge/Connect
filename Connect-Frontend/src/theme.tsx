import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#9b9bca",
      contrastText:"white"
    },
    secondary: {
      main: "#cba23f",
      contrastText:"white"
    },
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontFamily: 
    [
        'Open Sans', 'Lato', "sans-serif"
      ].join(','),
  },
});

export default theme ;