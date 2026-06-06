window.onload = () => {
    window.scrollTo(0, 0)
}
// Page load animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0'
    document.body.style.transition = 'opacity 0.8s ease'
    
    setTimeout(() => {
        document.body.style.opacity = '1'
    }, 100)
})

// Scroll up button
const scrollUpBtn = document.getElementById('scroll-up')
window.addEventListener('scroll', () => {
  if (window.scrollY >= 350) {
    scrollUpBtn.classList.add('show-scroll')
  } else {
    scrollUpBtn.classList.remove('show-scroll')
  }
})

// Nav toggle
const navToggle = document.getElementById('nav-toggle')
const navClose = document.getElementById('nav-close')
const navMenu = document.getElementById('nav--menu')
if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'))
if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'))

// Close menu on link click
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('show-menu'))
})

// Shadow on scroll header
const header = document.getElementById('header')
window.addEventListener('scroll', () => {
  if (window.scrollY >= 50) {
    header.classList.add('shadow-header')
  } else {
    header.classList.remove('shadow-header')
  }
})

// ==================== DARK MODE ====================
const themeBtn = document.getElementById('theme-button')
const savedTheme = localStorage.getItem('theme') || 'light'

const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme')
    themeBtn.classList.replace('fa-moon', 'fa-sun')
  } else {
    document.body.classList.remove('dark-theme')
    themeBtn.classList.replace('fa-sun', 'fa-moon')
  }
  localStorage.setItem('theme', theme)
}

applyTheme(savedTheme)
themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-theme')
  applyTheme(isDark ? 'light' : 'dark')
})

// ==================== TRANSLATIONS ====================
const translations = {
  fa: {
    nav_home:     'صفحه اصلی',
    nav_services: 'خدمات',
    nav_about:    'درباره دکتر زهابی',
    nav_gallery:  'گالری',
    nav_contact:  'تماس و رزرو وقت',
  },
  en: {
    nav_home:     'Home',
    nav_services: 'Services',
    nav_about:    'About Dr. Zahabi',
    nav_gallery:  'Gallery',
    nav_contact:  'Contact & Book',
  }
}

const applyLang = (lang) => {
  const t = translations[lang]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (t[key]) el.textContent = t[key]
  })
  document.getElementById('lang-label').textContent = lang.toUpperCase()
  document.documentElement.setAttribute('lang', lang)
  document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl')
  document.body.classList.toggle('ltr-lang', lang === 'en')
  document.querySelectorAll('.nav__lang-item').forEach(item => {
    item.classList.toggle('active', item.dataset.lang === lang)
  })
  localStorage.setItem('lang', lang)
}

// Language dropdown toggle
const langDropdown = document.getElementById('lang-dropdown')
const langBtn      = document.getElementById('lang-btn')
const langMenu     = document.getElementById('lang-menu')

langBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  langDropdown.classList.toggle('open')
})
document.addEventListener('click', () => langDropdown.classList.remove('open'))

document.querySelectorAll('.nav__lang-item').forEach(item => {
  item.addEventListener('click', () => {
    applyLang(item.dataset.lang)
    langDropdown.classList.remove('open')
  })
})

// Apply saved language on load
applyLang(localStorage.getItem('lang') || 'fa')

// Horizontal scroll with mouse wheel
