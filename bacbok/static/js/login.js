const checkBox = document.getElementById("checkbox")
const loginPass = document.getElementById("pass1")

checkBox.addEventListener("click", (e) => {
   checkBox.checked ? 
   loginPass.type = "text" : 
   loginPass.type = "password"
})

const loginBtn = document.querySelector("#loginBtn")
const email = document.getElementById("email")
const pass = document.getElementById("pass1")

email.addEventListener("keyup", (e) => {
   if (e.target.value == "") {
      loginBtn.disabled = true
      loginBtn.style.backgroundColor = "#dddddd"
      loginBtn.style.color = "#0B1020"
      loginBtn.style.cursor = "default"
   }else{
      loginBtn.disabled = false
      loginBtn.style.backgroundColor = "#0B1020"
      loginBtn.style.color = "#fff"
      loginBtn.style.cursor = "pointer"
   }
})

pass.addEventListener("keyup", (e) => {
   if (e.target.value == "") {
      loginBtn.disabled = true
      loginBtn.style.backgroundColor = "#dddddd"
      loginBtn.style.color = "#0B1020"
      loginBtn.style.cursor = "default"
   }else{
      loginBtn.disabled = false
      loginBtn.style.backgroundColor = "#0B1020"
      loginBtn.style.color = "#fff"
      loginBtn.style.cursor = "pointer"
   }
})

loginBtn.addEventListener("click", function(e){
   loginBtn.disabled = false
})
