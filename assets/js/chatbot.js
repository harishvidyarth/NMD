document.addEventListener("DOMContentLoaded",()=>{
const chatForm=document.querySelector("#chat-form")
const chatBox=document.querySelector("#chat-box")
if(chatForm && chatBox){
chatForm.addEventListener("submit",e=>{
e.preventDefault()
const input=chatForm.querySelector("input")
if(input.value.trim()!==""){
const userMsg=document.createElement("div")
userMsg.textContent="You: "+input.value
chatBox.appendChild(userMsg)
const botMsg=document.createElement("div")
botMsg.textContent="Bot: Sorry, I'm under development."
chatBox.appendChild(botMsg)
chatBox.scrollTop=chatBox.scrollHeight
input.value=""
}
})
}
})
