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
    // Nav
    nav_home: 'صفحه اصلی', nav_services: 'خدمات', nav_about: 'درباره دکتر زهابی',
    nav_gallery: 'گالری', nav_contact: 'تماس و رزرو وقت',
    // Home
    home_title_span: 'زیباییت را', home_title_main: 'کشف کن',
    home_desc: 'تزریق بوتاکس، فیلر و خدمات تخصصی پوست با دکتر پگاه زهابی',
    btn_book: 'رزرو وقت', btn_contact: 'ارتباط با ما',
    doctor_name: 'دکتر پگاه زهابی', doctor_title: 'متخصص زیبایی و پزشکی زیباشناختی',
    // Services
    services_title: 'خدمات', services_subtitle: 'تخصصی ما', services_desc: 'زیبایی با علم و تجربه',
    svc1_name: 'بوتاکس',          svc1_desc: 'بوتاکس تخصصی صورت',
    svc2_name: 'فیلر',            svc2_desc: 'فول فیس و کانتورینگ صورت',
    svc3_name: 'مزوتراپی',        svc3_desc: 'مو، دست، صورت و دکلته',
    svc4_name: 'نخ لیفت',         svc4_desc: 'نخ لیفت و جوانساز',
    svc5_name: 'اسکین بوستر',     svc5_desc: 'جوانسازی صورت، دست و بدن',
    svc6_name: 'PRP و هیرفیلر',   svc6_desc: 'PRP و هیرفیلر',
    svc7_name: 'دستگاه‌های تخصصی', svc7_desc: 'هایفو، RF، فتونا و ویرچو',
    // About
    about_heading: 'درباره', about_heading2: 'دکتر پگاه زهابی',
    about_subtitle: 'فارغ‌التحصیل دکترای حرفه‌ای پزشکی | متخصص زیبایی و پزشکی زیباشناختی',
    about_desc: 'دکتر پگاه زهابی با بیش از ۱۰ سال سابقه در حوزه زیبایی و رضایت بالای مراجعین در بیش از ۴۰۰۰ پرونده، مسلط به تزریق فیلر فول‌فیس و کانتورینگ تخصصی صورت، انواع بوتاکس، مزوتراپی مو، دست، صورت و دکلته، تزریق انواع اسکین بوسترها و جوانسازهای صورت، دست و بدن، PRP، هیرفیلر، کارگذاری انواع نخ‌های تخصصی لیفت و جوانساز، و کار تخصصی با دستگاه‌های اندولیفت، هایفو، کیوسوئیج، RF، فتونا و ویرچو می‌باشد. دارای پروانه معتبر تهران و آشنا با فناوری‌های جدید و دانش به‌روز تخصصی در علم زیبایی.',
    stat1: 'سال تجربه', stat2: 'پرونده موفق', stat3: 'خدمت تخصصی',
    // Gallery
    gallery_title: 'گالری', gallery_subtitle: 'نمونه کارها',
    gal1: 'بوتاکس', gal2: 'فیلر لب', gal3: 'مزوتراپی',
    gal4: 'لیفتینگ', gal5: 'پاکسازی پوست', gal6: 'جوانسازی',
    // Contact
    contact_title: 'تماس و', contact_subtitle: 'رزرو وقت',
    form_title: 'فرم رزرو وقت', form_name: 'نام و نام خانوادگی',
    form_name_ph: 'نام خود را وارد کنید', form_phone: 'شماره تلفن',
    form_service: 'انتخاب خدمت', form_service_ph: 'خدمت مورد نظر را انتخاب کنید',
    form_msg: 'پیام', form_msg_ph: 'پیام یا سوال خود را بنویسید...',
    form_submit: 'ارسال درخواست',
    info_title: 'اطلاعات کلینیک', info_phone: 'تلفن', info_address: 'آدرس',
    info_address_val: 'تهران، خیابان کلینیک زیبایی دکتر زهابی',
    info_insta: 'اینستاگرام', info_hours: 'ساعت کاری',
    info_hours_val: 'شنبه تا چهارشنبه، ۱۰ صبح تا ۷ شب',
    // Footer
    footer_about: 'درباره ما', footer_contact: 'تماس',
    footer_copy: '© ۱۴۰۴ کلینیک زیبایی دکتر پگاه زهابی — تمامی حقوق محفوظ است.',
  },
  en: {
    // Nav
    nav_home: 'Home', nav_services: 'Services', nav_about: 'About Dr. Zahabi',
    nav_gallery: 'Gallery', nav_contact: 'Contact & Book',
    // Home
    home_title_span: 'Discover Your', home_title_main: 'Beauty',
    home_desc: 'Botox, filler & specialist skin treatments with Dr. Pegah Zahabi',
    btn_book: 'Book Appointment', btn_contact: 'Contact Us',
    doctor_name: 'Dr. Pegah Zahabi', doctor_title: 'Aesthetic Medicine Specialist',
    // Services
    services_title: 'Our', services_subtitle: 'Services', services_desc: 'Beauty through science & experience',
    svc1_name: 'Botox',           svc1_desc: 'Specialist facial botox',
    svc2_name: 'Filler',          svc2_desc: 'Full face & contouring',
    svc3_name: 'Mesotherapy',     svc3_desc: 'Hair, hands, face & décolletage',
    svc4_name: 'Thread Lift',     svc4_desc: 'Lift & rejuvenating threads',
    svc5_name: 'Skin Booster',    svc5_desc: 'Face, hands & body rejuvenation',
    svc6_name: 'PRP & Hair Filler', svc6_desc: 'PRP & hair filler',
    svc7_name: 'Laser Devices',   svc7_desc: 'HIFU, RF, Fotona & Virtuo',
    // About
    about_heading: 'About', about_heading2: 'Dr. Pegah Zahabi',
    about_subtitle: 'Professional Medical Doctor | Aesthetic Medicine Specialist',
    about_desc: 'Dr. Pegah Zahabi has over 10 years of experience in aesthetic medicine with a high satisfaction rate across more than 4,000 cases. She specialises in full-face filler & facial contouring, botox, mesotherapy for hair/hands/face/décolletage, skin boosters, PRP, hair filler, specialist lift & rejuvenating threads, and advanced devices including Endolift, HIFU, CoolSculpting, RF, Fotona, and Virtuo. Licensed in Tehran and up to date with the latest innovations in aesthetic science.',
    stat1: 'Years Experience', stat2: 'Successful Cases', stat3: 'Specialist Services',
    // Gallery
    gallery_title: 'Gallery', gallery_subtitle: 'Our Work',
    gal1: 'Botox', gal2: 'Lip Filler', gal3: 'Mesotherapy',
    gal4: 'Lifting', gal5: 'Skin Cleansing', gal6: 'Rejuvenation',
    // Contact
    contact_title: 'Contact &', contact_subtitle: 'Book Now',
    form_title: 'Booking Form', form_name: 'Full Name',
    form_name_ph: 'Enter your name', form_phone: 'Phone Number',
    form_service: 'Select Service', form_service_ph: 'Choose a service',
    form_msg: 'Message', form_msg_ph: 'Write your message or question...',
    form_submit: 'Send Request',
    info_title: 'Clinic Info', info_phone: 'Phone', info_address: 'Address',
    info_address_val: 'Tehran — Dr. Zahabi Aesthetic Clinic',
    info_insta: 'Instagram', info_hours: 'Working Hours',
    info_hours_val: 'Sat – Wed, 10 AM to 7 PM',
    // Footer
    footer_about: 'About', footer_contact: 'Contact',
    footer_copy: '© 2025 Dr. Pegah Zahabi Aesthetic Clinic — All rights reserved.',
  }
}

const applyLang = (lang) => {
  const t = translations[lang]
  // Translate text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (t[key]) el.textContent = t[key]
  })
  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')
    if (t[key]) el.setAttribute('placeholder', t[key])
  })
  document.getElementById('lang-label').textContent = lang.toUpperCase()
  document.documentElement.setAttribute('lang', lang)
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
