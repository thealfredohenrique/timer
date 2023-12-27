import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Router from "./Router";
import CyclesContextProvider from "./contexts/CyclesContext";
import GlobalStyle from "./styles/global";
import defaultTheme from "./styles/themes/default";

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <HashRouter>
        <CyclesContextProvider>
          <Router />
        </CyclesContextProvider>
      </HashRouter>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
