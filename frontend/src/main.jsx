import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@mantine/core/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  colors: {
    dark: [
      '#f5f5f5', // 0 - Lightest gray (background)
      '#e0e0e0', // 1
      '#bdbdbd', // 2
      '#9e9e9e', // 3
      '#757575', // 4
      '#616161', // 5
      '#424242', // 6
      '#212121', // 7
      '#1a1a1a', // 8
      '#0a0a0a', // 9 - Darkest (text)
    ],
  },
  primaryColor: 'dark',
  primaryShade: 9,
});

createRoot(document.getElementById("root")).render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);
