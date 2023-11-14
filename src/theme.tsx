import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const dfltTheme = createTheme()

const customShadow = dfltTheme.shadows

customShadow[1] = `rgba(0, 0, 0, 0.24) 0px 3px 8px;`

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  shadows: customShadow,
})

export default theme
