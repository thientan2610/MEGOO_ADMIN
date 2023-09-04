import React from "react";
import ScrollTop from "./components/ScrollTop";
import Routes from "./routes";
import ThemeCustomization from "themes";

// vendor styles
import "react-datetime/css/react-datetime.css";

const App = () => (
  <body className="bg-soft">
    <ThemeCustomization>
      <ScrollTop>
        <Routes />
      </ScrollTop>
    </ThemeCustomization>
  </body>
);

export default App;
