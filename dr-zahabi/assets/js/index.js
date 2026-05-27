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

// Horizontal scroll with mouse wheel
const servicesGrid = document.querySelector('.services__grid')

if (servicesGrid) {
    servicesGrid.addEventListener('wheel', (e) => {
        e.preventDefault()
        servicesGrid.scrollLeft -= e.deltaY
    }, { passive: false })
}