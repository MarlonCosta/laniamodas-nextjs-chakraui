import SideBar from '@/components/SideBar'
import '@/styles/globals.css'
import theme from '@/styles/theme'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SideBar>
        <Component {...pageProps} />
      </SideBar>
    </ChakraProvider>
  )
}
