// ==============================|| PRESET THEME - THEME SELECTOR ||============================== //

const Theme = (colors) => {
  const { gold, cyan, grey } = colors;
  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16],
  };
  const contrastText = "#fff";

  return {
    primary: {
      lighter: "#FFDFB3",
      100: "#FFD08D",
      200: "#FFC067",
      light: "#FFB042",
      400: "#FFA01C",
      main: "#f58f00",
      dark: "#D27A00",
      700: "#AF6600",
      darker: "#8C5200",
      900: "#693D00",
      contrastText,
    },
    secondary: {
      lighter: "#C8CCDF",
      100: "#ACB3CE",
      200: "#9199BE",
      light: "#7580AE",
      400: "#5C679C",
      main: "#4c5680",
      600: "#41496E",
      dark: "#363D5C",
      800: "#2B3149",
      darker: "#2B3149",
      contrastText,
    },
    error: {
      lighter: "#FF155B",
      light: "#F30049",
      main: "#d3003f",
      dark: "#BA0038",
      darker: "#BA0038",
      contrastText,
    },
    warning: {
      lighter: gold[0],
      light: gold[3],
      main: gold[5],
      dark: gold[7],
      darker: gold[9],
      contrastText: greyColors[100],
    },
    info: {
      lighter: cyan[0],
      light: cyan[3],
      main: cyan[5],
      dark: cyan[7],
      darker: cyan[9],
      contrastText,
    },
    success: {
      lighter: "#407770",
      light: "#207367",
      main: "#006e5f",
      dark: "#005449",
      darker: "#003831",
      contrastText,
    },
    grey: greyColors,
  };
};

export default Theme;
