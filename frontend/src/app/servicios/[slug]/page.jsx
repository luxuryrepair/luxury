import ServicioDetalleClient from '@/pages/ServicioDetalle'
import { getServiceBySlug, getServices } from '@/lib/supabase'

const fallbackServiceSlugs = [
  'reparacion-tv-lcd-led',
  'reparacion-tv-plasma',
  'garantia-incluida',
  'diagnostico-gratuito',
  'reparacion-monitores',
  'venta-repuestos',
]

export async function generateStaticParams() {
  const services = await getServices()
  if (services && services.length > 0) {
    return services
      .filter((service) => service?.slug)
      .map((service) => ({ slug: service.slug }))
  }

  return fallbackServiceSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const service = await getServiceBySlug(params.slug)
  if (!service) {
    return {
      title: 'Servicio',
      description: 'Servicio técnico especializado en reparación de televisores en Madrid.',
    }
  }
  return {
    title: service.title,
    description: service.description || `${service.title} - Servicio técnico especializado en Madrid.`,
  }
}

export default function ServicioDetallePage() {
  return <ServicioDetalleClient />
}
