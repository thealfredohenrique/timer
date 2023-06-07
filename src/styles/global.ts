import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${(props) => props.theme["green-500"]};
  }

  body {
    -webkit-font-smoothing: antialiased;
    background-color: ${(props) => props.theme["gray-900"]};
    color: ${(props) => props.theme["gray-300"]};
  }

  body,
  button,
  input,
  textarea {
    font-family: "Roboto", sans-serif;
    font-size: 1rem;
    font-weight: 400;
  }
`;

export default GlobalStyle;
