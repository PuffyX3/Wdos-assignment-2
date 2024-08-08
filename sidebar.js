const showSidebar =document.getElementById('showSidebar');
const hideSidebar =document.getElementById('hideSidebar');

showSidebar.addEventListener('click',()=>{
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
})

hideSidebar.addEventListener('click',()=>{
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
})

