const checkBox = document.getElementById("checkbox")
const pass1 = document.getElementById("pass1")
const pass2 = document.getElementById("pass2")

checkBox.addEventListener("click", function(e){
    if (checkBox.checked) {
        pass1.type = "text"
        pass2.type = "text"
    }else{
        pass1.type = "password"
        pass2.type = "password"
    }
})

const signupBtn = document.getElementById("signupBtn")
const input_text = document.querySelectorAll(".type_text")
const input_password = document.querySelectorAll(".type_password")
const signupForm = document.getElementById("signupForm")


signupBtn.addEventListener("submit", function(e){
    signupBtn.disabled = true
    signupBtn.style.backgroundColor = "#dddddd"
    signupBtn.style.color = "#0B1020"
})


input_text.forEach(input => {
    const parent = input.closest(".type_text")
    const inputText = parent.querySelector("input")
    inputText.addEventListener("input", function(e){
        if (inputText.value == "") {
            signupBtn.disabled = true
            signupBtn.style.backgroundColor = "#dddddd"
            signupBtn.style.color = "#0B1020"
            signupBtn.style.cursor = "default"
        }else{
            signupBtn.disabled = false
            signupBtn.style.backgroundColor = "#0B1020"
            signupBtn.style.color = "#fff"
            signupBtn.style.cursor = "pointer"
        }
    })
})

input_password.forEach(input => {
    const parent = input.closest(".type_password")
    const inputPassword = parent.querySelector("input")
    inputPassword.addEventListener("input", function(e){
        if (inputPassword.value == "") {
            signupBtn.disabled = true
            signupBtn.style.backgroundColor = "#dddddd"
            signupBtn.style.color = "#0B1020"
            signupBtn.style.cursor = "default"
        }else{
            signupBtn.disabled = false
            signupBtn.style.backgroundColor = "#0B1020"
            signupBtn.style.color = "#fff"
            signupBtn.style.cursor = "pointer"
        }
    })
})

const email = document.getElementById("email")
const username = document.getElementById("username")
const error = document.getElementById("error")

email.addEventListener("input", function(e){
   if (email.validity.valueMissing){
        error_msg(email, "email required, type a valid email")
        signupBtn.disabled = true
        signupBtn.style.backgroundColor = "#dddddd"
        signupBtn.style.color = "#0B1020"
        signupBtn.style.cursor = "default"
   }else if(email.validity.typeMismatch){
        error_msg(email, "Invalid email address")
        signupBtn.disabled = true
        signupBtn.style.backgroundColor = "#dddddd"
        signupBtn.style.color = "#0B1020"
       signupBtn.style.cursor = "default"
    }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.toLowerCase().trim())){
        error_msg(email, "Invalid email address")
        signupBtn.disabled = true
        signupBtn.style.backgroundColor = "#dddddd"
        signupBtn.style.color = "#0B1020"
       signupBtn.style.cursor = "default"
   }else{
        clear_msg(email, "")
        signupBtn.disabled = false
        signupBtn.style.backgroundColor = "#0B1020"
        signupBtn.style.color = "#fff"
       signupBtn.style.cursor = "pointer"
    }
})

username.addEventListener("input", function(e){
    if (!(/^[A-Z][a-zA-Z0-9]{3,}$/.test(username.value))) {
        error_msg(username, "Username name must start with capital letter and atleast 4 character")
        signupBtn.disabled = true
        signupBtn.style.backgroundColor = "#dddddd"
        signupBtn.style.color = "#0B1020"
        signupBtn.style.cursor = "default"
    }else{
        clear_msg(username, "")
        signupBtn.disabled = false
        signupBtn.style.backgroundColor = "#0B1020"
        signupBtn.style.color = "#fff"
        signupBtn.style.cursor = "pointer"
    }
})

pass1.addEventListener("input", function(e) {
    if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{8,}$/.test(pass1.value))) {
        error_msg(pass1, "password must be at least 8 character with number")
        signupBtn.disabled = true
        signupBtn.style.backgroundColor = "#dddddd"
        signupBtn.style.color = "#0B1020"
        signupBtn.style.cursor = "default"
    }else{
        clear_msg(pass1, "")
        signupBtn.disabled = false
        signupBtn.style.backgroundColor = "#0B1020"
        signupBtn.style.color = "#fff"
        signupBtn.style.cursor = "pointer"
    }
})

pass2.addEventListener("input", function(e) {
    if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{8,}$/.test(pass2.value))) {
        error_msg(pass2, "password must be at least 8 character with number")
        signupBtn.disabled = true
        signupBtn.style.backgroundColor = "#dddddd"
        signupBtn.style.color = "#0B1020"
        signupBtn.style.cursor = "default"
    }else{
        clear_msg(pass2, "")
        signupBtn.disabled = false
        signupBtn.style.backgroundColor = "#0B1020"
        signupBtn.style.color = "#fff"
        signupBtn.style.cursor = "pointer"
    }
})

function error_msg(element, msg){
    error.style.display = "block"
    error.innerText = msg
    error.style.textAlign = "center"
    error.style.color = "red"
    element.style.border = "1px solid red"
}

function clear_msg(element, msg){
    error.style.display = "none"
    element.style.border = "none"
}

signupForm.addEventListener("submit", (e) => {
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))) {
        e.preventDefault()
        error_msg(email, "invalids email address")
    }else if(!(/^[A-Z][a-zA-Z0-9]{3,}$/.test(username.value))){
        e.preventDefault()
        error_msg(username, "Username name must start with capital letter and atleast 4 character")
    }else if(!(/^(?=.*[a-zA-Z0-9])(?=.*\d)[a-zA-Z0-9]{8,}$/.test(pass1.value))){
        e.preventDefault()
        error_msg(pass1, "password must be at least 8 character with number")
    } else if (!(/^(?=.*[a-zA-Z0-9])(?=.*\d)[a-zA-Z0-9]{8,}$/.test(pass2.value))){
        e.preventDefault()
        error_msg(pass2, "password must be at least 8 character with number")
    }
})