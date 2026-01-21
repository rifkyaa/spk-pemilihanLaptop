import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/layout/Navigation'
import StoreProvider from '@/components/providers/StoreProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SPK Pemilihan Laptop - Metode MPE',
  description: 'Sistem Pendukung Keputusan pemilihan laptop terbaik menggunakan Metode Perbandingan Eksponensial',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <StoreProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto p-4 md:p-6">
              {children}
            </main>
            <footer className="border-t mt-8">
              <div className="container mx-auto p-6 text-center text-gray-600 text-sm">
                <p>Sistem Pendukung Keputusan - Metode Perbandingan Eksponensial (MPE)</p>
                <p className="mt-1">© 2024 - Untuk Tugas UAS SPK</p>
              </div>
            </footer>
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}