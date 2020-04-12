// This function handles the functionality of the hamburger icon.
const navToggle = () => 
{
    const hamburger = document.querySelector('.hamburger')
    const nav = document.querySelector('.nav-main-ul')
    hamburger.addEventListener('click', () => 
    {
        nav.classList.toggle('nav-active')
        if (nav.classList.contains('nav-active')) {
            const body = document.querySelector('body').style.overflowY = 'hidden'
        } else {
            const body = document.querySelector('body').style.overflowY = 'visible'
        }
    })
}

navToggle()