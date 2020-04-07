//for single page application JS setup
// ref: What is a Single Page Application (SPA) and How Does it Work by Steve Griffith https://www.youtube.com/watch?v=wlVmmsMD28w
const app = {
    pages: [],
    show: new Event('show'),
    init: function(){
        app.pages = document.querySelectorAll('.page')
        app.pages.forEach((pg)=>{
            pg.addEventListener('show', app.pageShown)
        })
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', app.nav);
        })
        history.replaceState({}, 'Home', '#demographics')
        window.addEventListener('popstate', app.poppin)

    }, 
    nav: function(ev){
        ev.preventDefault()
        let currentPage = ev.target.getAttribute('data-target')
        document.querySelector('.activate').classList.remove('activate')
        document.getElementById(currentPage).classList.add('activate')
        history.pushState({}, currentPage, `#${currentPage}`)
        document.getElementById(currentPage).dispatchEvent(app.show)
    },
    pageShown: function(ev){
        console.log('Page', ev.target.id, 'just shown')
    },
    poppin: function(ev){
        console.log(location.hash, 'popstate event')
        let hash = location.hash.replace('#', '')
        document.querySelector('.activate').classList.remove('activate')
        document.getElementById(hash).classList.add('activate')
        console.log(hash)
        document.getElementById(hash).dispatchEvent(app.show)

    }
}
document.addEventListener('DOMContentLoaded', app.init);
