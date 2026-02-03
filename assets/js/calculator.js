document.addEventListener("DOMContentLoaded",()=>{
const form=document.querySelector("#quote-form")
if(form){
form.addEventListener("submit",e=>{
e.preventDefault()
const result=document.getElementById("quote-result")
result.textContent="Estimated quote: ₹"+(Math.floor(Math.random()*10000)+1000)
})
}
})
