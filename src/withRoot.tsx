import { green, purple } from 'material-ui/colors';
import CssBaseline from 'material-ui/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import * as React from 'react';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: green,
  },
});

function withRoot(Component: React.ComponentType) {
  function WithRoot(props: object) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;