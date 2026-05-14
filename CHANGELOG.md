## [v1.6.0] - 2026-05-14

### Añadido
- README.md con iconos de tecnologías, badges SEO, favicon y logo del proyecto.
- Licencia de uso libre (MIT) en doc/LICENSE.md.
- Iconos de robots.txt y sitemap.xml enlazados en README.
- Enlaces directos a frontend, backend, sitemap y robots.txt.

### Mejorado
- robots.txt: directiva Sitemap en primera línea para máxima eficiencia SEO.
- sitemap.xml y robots.txt: generación robusta, nunca más URLs localhost en producción.
- Fallback automático a GitHub Pages si faltan variables de entorno.

### Corregido
- Evita duplicados de basePath en URLs SEO.
- Host en robots.txt siempre correcto.