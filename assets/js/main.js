document.addEventListener("DOMContentLoaded",()=>{
const navToggle=document.querySelector(".nav-toggle")
const navMenu=document.querySelector("nav ul")
if(navToggle){
navToggle.addEventListener("click",()=>{navMenu.classList.toggle("open")})
}
})
