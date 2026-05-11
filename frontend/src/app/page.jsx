import HomeClient from '@/pages/Home'

export const metadata = {
  title: 'Servicio técnico de televisores en Madrid | Reparación profesional',
  description:
    'Servicio técnico profesional de reparación de televisores en Madrid. Más de 20 años de experiencia. Diagnóstico gratuito, reparación rápida y garantía incluida.',
  openGraph: {
    title: 'Servicio técnico de televisores en Madrid',
    description: 'Servicio técnico profesional con más de 20 años de experiencia en reparación de televisores LCD, LED y Plasma.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicio técnico de televisores en Madrid',
    description: 'Servicio técnico profesional con más de 20 años de experiencia.',
  },
}

export default function Page() {
  return <HomeClient />
}
