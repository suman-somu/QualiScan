import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@mantine/core/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  colors: {
    blue: [
      '#e6f7ff', // 0 - Lightest blue
      '#bae7ff', // 1
      '#91d5ff', // 2
      '#69c0ff', // 3
      '#40a9ff', // 4
      '#1890ff', // 5
      '#096dd9', // 6
      '#0050b3', // 7
      '#003a8c', // 8
      '#002766', // 9 - Darkest blue
    ],
  },
  primaryColor: 'blue',
  primaryShade: 7,
});

createRoot(document.getElementById("root")).render(
  <MantineProvider theme={theme} defaultColorScheme="light">
    <App />
  </MantineProvider>
);
