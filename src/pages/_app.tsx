import '../styles/globals.css'
import 'fontsource-roboto'
import { AppProps } from 'next/app'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const appTheme = createMuiTheme({
  palette: {
    common: {
      white: '#dddddd',
    },
    background: {
      default: '#F6F6F6',
      paper: '#E7E7E7',
    },
    primary: {
      main: '#1A2734',
    },
    secondary: {
      main: '#999C9E',
    },
    text: {
      primary: '#2F313A',
      secondary: '#999c9e',
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return <ThemeProvider theme={appTheme}>
    <Component {...pageProps} />
  </ThemeProvider>
}

export default MyApp
