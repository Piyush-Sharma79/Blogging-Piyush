document.addEventListener('DOMContentLoaded',()=>{
    const search = document.querySelectorAll('.searchBtn');
    const searchar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    for(var q=0;q<search.length;q++){
        search[q].addEventListener('click',()=>{
            searchar.style.visibility = 'visible';
            searchar.classList.add('open');
            this.setAttribute('aria-expanded','true');
            searchInput.focus();

        })
    }

    searchClose.addEventListener('click',()=>{
        searchar.style.visibility = 'hidden';
        searchar.classList.remove('open');
        this.setAttribute('aria-expanded','false');

         
    })
})