import React from 'react';
import Login from './pages/Login'
import Menu from './pages/Menu'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { createBrowserHistory } from "history";

const hist = createBrowserHistory();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FF0D00",
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={hist}>
        <Switch>
          <Route path="/Inicio" component={Login} />
          <Route path="/Menu" component={Menu} />
          <Redirect from="/" to="/Inicio" />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
