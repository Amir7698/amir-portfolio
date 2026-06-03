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

// Horizontal scroll with mouse wheel
