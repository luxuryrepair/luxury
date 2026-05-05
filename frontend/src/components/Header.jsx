'use client'

import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import { useState } from 'react'

const logo = 'https://opcdigtqxrmksmemnugs.supabase.co/storage/v1/object/public/images/logo.svg'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Inicio
          </Link>
          <Link href="/servicios" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Servicios
          </Link>
          <Link href="/contacto" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Contacto
          </Link>
          <Link href="/nosotros" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Nosotros
          </Link>
        </nav>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}
