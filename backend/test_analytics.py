# Script de prueba para verificar datos de analytics
import os
import sys
from pathlib import Path

# Asegurarse de que podemos importar desde app
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.supabase_client import SupabaseClient

print("=" * 60)
print("VERIFICACIÓN DE DATOS DE ANALYTICS")
print("=" * 60)

try:
    # 0. Verificar datos directos de Supabase
    print("\n0. DATOS DIRECTOS DE SUPABASE:")
    client = SupabaseClient.get_client()
    
    # Consultar directamente los últimos 10 eventos
    response = client.table('analytics_events').select('event_type, page, created_at').order('created_at', desc=True).limit(10).execute()
    print(f"   Últimos 10 eventos en la tabla:")
    if response.data:
        for i, event in enumerate(response.data, 1):
            page = event.get('page', 'NULL')
            event_type = event.get('event_type', 'NULL')
            created_at = event.get('created_at', 'NULL')
            print(f"   {i}. [{event_type}] {page} - {created_at[:19] if created_at != 'NULL' else 'NULL'}")
    else:
        print("   ⚠️  No hay eventos en la tabla")
    
    # Consultar solo pageviews
    response = client.table('analytics_events').select('page').eq('event_type', 'pageview').execute()
    print(f"\n   Total de pageviews encontrados: {len(response.data)}")
    if response.data:
        # Mostrar primeros 5
        print(f"   Primeros 5 valores del campo 'page':")
        for i, event in enumerate(response.data[:5], 1):
            page = event.get('page')
            page_repr = repr(page)  # Mostrar representación exacta incluyendo None, '', etc.
            print(f"   {i}. {page_repr}")
    
    # 1. Obtener resumen
    print("\n1. Resumen de Analytics:")
    summary = SupabaseClient.get_analytics_summary()
    print(f"   Total eventos: {summary.get('total_events', 0)}")
    print(f"   Total pageviews: {summary.get('total_pageviews', 0)}")
    print(f"   Páginas únicas: {summary.get('unique_pages', 0)}")
    
    # 2. Obtener pageviews por día
    print("\n2. Pageviews por día (últimos 30 días):")
    pageviews_by_day = SupabaseClient.get_pageviews_by_day(days=30)
    print(f"   Total de días con datos: {len(pageviews_by_day)}")
    
    if pageviews_by_day:
        print("\n   Últimos 5 días:")
        for item in pageviews_by_day[-5:]:
            print(f"   - {item['date']}: {item['count']} visitas")
    else:
        print("   ⚠️  No hay datos de pageviews")
    
    # 3. Top páginas
    print("\n3. Top 5 páginas más visitadas:")
    top_pages = SupabaseClient.get_top_pages(limit=5)
    if top_pages:
        for i, item in enumerate(top_pages, 1):
            print(f"   {i}. {item['page']}: {item['count']} visitas")
        
        # Diagnóstico si solo hay raíz
        if len(top_pages) == 1 and top_pages[0]['page'] == '/':
            print("\n   ⚠️  PROBLEMA DETECTADO: Solo se registra la página raíz '/'")
            print("   Esto puede suceder si:")
            print("   1. Solo se visita la página de inicio")
            print("   2. React Router no está actualizando location.pathname")
            print("   3. Hay un problema con la navegación en el frontend")
            print("\n   Verifica en la consola del navegador:")
            print("   - Abre DevTools (F12) → Consola")
            print("   - Navega por el sitio web")
            print("   - Busca logs que digan: '[Analytics] Enviando evento:'")
            print("   - Confirma que 'page' tenga valores como '/servicios', '/contacto', etc.")
    else:
        print("   ⚠️  No hay datos de páginas")
    
    # 4. Dispositivos
    print("\n4. Distribución por dispositivos:")
    device_stats = SupabaseClient.get_device_stats()
    if device_stats:
        for item in device_stats:
            print(f"   - {item['device']}: {item['count']}")
    else:
        print("   ⚠️  No hay datos de dispositivos")
    
    # 5. Orígenes de tráfico
    print("\n5. Orígenes de tráfico:")
    traffic_origins = SupabaseClient.get_traffic_origins(limit=5)
    if traffic_origins:
        for item in traffic_origins:
            print(f"   - {item['origin']}: {item['count']}")
    else:
        print("   ⚠️  No hay datos de orígenes")
    
    print("\n" + "=" * 60)
    print("✅ Verificación completada")
    print("=" * 60)
    
    # Diagnóstico
    print("\n📊 DIAGNÓSTICO:")
    if summary.get('total_pageviews', 0) == 0:
        print("⚠️  No hay pageviews registrados.")
        print("   Posibles causas:")
        print("   1. La tabla 'analytics_events' no se ha creado en Supabase")
        print("   2. El frontend no está enviando eventos")
        print("   3. Hay un problema con useAnalytics.js")
        print("\n   Solución:")
        print("   1. Verifica que el script doc/supabase_analytics.sql se haya ejecutado")
        print("   2. Abre el sitio web frontend y navega por las páginas")
        print("   3. Revisa la consola del navegador para ver si hay errores")
    else:
        print("✅ Hay datos de pageviews disponibles")
        if not pageviews_by_day:
            print("⚠️  Pero no se pudieron agrupar por día")
            print("   Revisa los logs del servidor Flask para más detalles")

except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    import traceback
    traceback.print_exc()

print()
