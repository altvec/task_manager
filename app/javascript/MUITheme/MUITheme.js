import React from 'react';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const MUITheme = (props) => <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;

export default MUITheme;
