import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };

const colors = {
  black: "#16161D",
  purple: "#5f4d7d",
  lightBlue: "#82c5df",
  darkBlue: "#293d49",
  green: "#419D78",
  darkGreen: "#347E60",
  gold: "#EAA855",
  darkGold: "#DB9D4F",
  lightOrange: "#FFDBB5",
  orange: "#E7B581",
  lightPurple: "#9FA4C4",
  superLightBlue: "#dff0f7",
  rose: "#f45b69",
};

const breakpoints = createBreakpoints({
  sm: "32em",
  md: "48em",
  lg: "64em",
  xl: "80em",
});

const theme = extendTheme({
  components: {
    MenuItem: {
      baseStyle: {
        color: "red",
      },
    },
    Spinner: {
      baseStyle: {
        color: "gray.200",
      },
    },
    Text: {
      baseStyle: {
        fontSize: "md",
        letterSpacing: "tight",
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "monospace",
      },
    },
    Table: {
      parts: ["th", "td"],
      baseStyle: {
        th: {
          bg: colors.lightPurple,
        },
        td: {
          color: colors.superLightBlue,
        },
      },
      defaultProps: {
        size: "lg",
        variant: "simple",
      },
    },
    Button: {
      defaultProps: {
        // size: "lg",
        // variant: "unstyled",
        _hover: { bg: "red" },
      },
      baseStyle: {
        // bgColor: "red",
      },
    },
  },
  styles: {
    global: () => ({
      "html, body": {
        fontSize: "md",
        fontFamily: "monospace",
        // color: "white",
        background: "#5f4d7d",
        textColor: "gray.200",
      },
      "span.swiper-pagination-bullet": {
        height: 3,
        width: 3,
      },
      "span.swiper-pagination-bullet.swiper-pagination-bullet-active": {
        bgColor: colors.lightBlue,
        opacity: 1,
      },
      ".swiper-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet, .swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet":
        {
          marginX: 1.5,
        },
    }),
  },
  colors: colors,
  fonts,
  breakpoints,
  icons: {
    logo: {
      path: (
        <svg
          width="3000"
          height="3163"
          viewBox="0 0 3000 3163"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="3000" height="3162.95" fill="none" />
          <path
            d="M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z"
            fill="currentColor"
          />
        </svg>
      ),
      viewBox: "0 0 3000 3163",
    },
  },
  initialColorMode: "dark",
  // useSystemColorMode: false,
});

export default theme;
