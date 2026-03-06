import React, { useState } from 'react'

const languages = [
  { code: 'FR', label: 'Français' },
  { code: 'EN', label: 'English' },
  { code: 'SW', label: 'Kiswahili' }
]

export default function ChangeLang() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(languages[0])

  return (
    <div style={styles.container}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.button,
          backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.12)' : 'transparent'
        }}
      >
        <span style={styles.langText}>{currentLang.code}</span>
        <span
          style={{
            ...styles.arrow,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          ▾
        </span>
      </div>

      {isOpen && (
        <>
          <div style={styles.overlay} onClick={() => setIsOpen(false)} />
          <ul style={styles.menu}>
            {languages.map((lang) => {
              const isActive = currentLang.code === lang.code
              return (
                <li
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang)
                    setIsOpen(false)
                  }}
                  style={{
                    ...styles.menuItem,
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                    else e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <span
                    style={{
                      ...styles.menuLabel,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#ffffff' : '#e0e0e0'
                    }}
                  >
                    {lang.label}
                  </span>
                  {isActive && <span style={styles.check}>✓</span>}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    display: 'inline-block',
    zIndex: 9999
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.25s ease'
  },
  langText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '1rem',
    letterSpacing: '0.5px'
  },
  arrow: {
    color: '#888',
    fontSize: '0.8rem',
    transition: 'transform 0.3s ease'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000
  },

  menu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    left: '0',
    backgroundColor: '#0b1118',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    listStyle: 'none',
    padding: '8px',
    margin: 0,
    minWidth: '200px',
    zIndex: 1001,
    boxShadow: '0 15px 35px rgba(0,0,0,0.7)'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    color: '#e0e0e0',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    marginBottom: '4px'
  },
  menuLabel: {
    flex: 1
  },
  check: {
    color: '#00ccff',
    fontSize: '1.3rem', // Coche bien visible
    fontWeight: 'bold',
    marginLeft: '15px'
  }
}
