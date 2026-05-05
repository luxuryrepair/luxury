import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'

// Importar todos los estilos globalmente
import '@/styles/index.css'
import '@/styles/App.css'
import '@/styles/Layout.css'
import '@/styles/Header.css'
import '@/styles/Footer.css'
import '@/styles/Hero.css'
import '@/styles/CookieConsent.css'
import '@/styles/Home.css'
import '@/styles/Servicios.css'
import '@/styles/ServicioDetalle.css'
import '@/styles/Contacto.css'
import '@/styles/Nosotros.css'
import '@/styles/Login.css'
import '@/styles/Dashboard.css'
import '@/styles/PrivacyPolicy.css'
import '@/styles/TermsOfService.css'

export const metadata = {
  title: {
    template: '%s | Luxury Repair',
    default: 'Luxury Repair | Reparación de Televisores en Madrid',
  },
  description:
    'Servicio técnico premium en reparación de televisores en Madrid. Diagnóstico gratuito y garantía en todas nuestras reparaciones.',
  metadataBase: new URL('https://telerayo.com'),
  icons: {
    icon: 'https://opcdigtqxrmksmemnugs.supabase.co/storage/v1/object/public/images/icono.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CookieConsent />
        <div className="layout">
          <Header />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
