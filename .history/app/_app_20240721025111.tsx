// pages/_app.tsx
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/Layout'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </ThemeProvider>
  )
}

export default MyApp