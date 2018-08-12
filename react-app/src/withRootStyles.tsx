import { purple } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import * as React from 'react';

const theme = createMuiTheme({
  palette: {
    primary: purple,
  },
});

function withRootStyles(Component: React.ComponentType) {
  const WithRootStyles = (props: object) => (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...props} />
    </MuiThemeProvider>
  );

  return WithRootStyles;
}

export default withRootStyles;