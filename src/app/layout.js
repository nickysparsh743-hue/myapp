import { Inter, Poppins } from 'next/font/google'
import "./globals.css";
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import AIAssistant from './components/AIAssistant'
const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})

export const metadata = {
  title: 'Algo X - Intelligent Digital Solutions',
  description: 'We build websites, apps, AI systems, secure software, and digital content that help businesses grow.',
  keywords: 'web development, AI, machine learning, cybersecurity, data analytics, digital agency',
  authors: [{ name: 'Algo X' }],
  openGraph: {
    title: 'Algo X - Intelligent Digital Solutions',
    description: 'AI-driven digital solutions agency',
    type: 'website',
  },
}


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} ${poppins.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>

      <body className="bg-dark text-white">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <AIAssistant />
          <ChatWidget />
          <Footer />
        </div>
      </body>
    </html>
  )
}
