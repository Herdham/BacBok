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
<<<<<<< HEAD
    
    const percentage = (strength / 4) * 100;
    strengthFill.style.width = `${percentage}%`;
    strengthFill.style.backgroundColor = strengthColors[strength - 1] || strengthColors[0];
    strengthText.textContent = strengthLabels[strength - 1] || strengthLabels[0];
    strengthText.style.color = strengthColors[strength - 1] || strengthColors[0];
}

// Email Validation
emailInput.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailInput.value === '') {
        clearValidation(emailInput);
        updateButtonState();
    } else if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        updateButtonState();
    } else {
        showSuccess(emailInput);
        updateButtonState();
    }
});

// Username Validation
usernameInput.addEventListener('input', () => {
    const usernameRegex = /^[A-Z][a-zA-Z0-9]{3,}$/;
    
    if (usernameInput.value === '') {
        clearValidation(usernameInput);
        updateButtonState();
    } else if (!usernameRegex.test(usernameInput.value)) {
        showError(usernameInput, 'Username must start with capital letter & be at least 4 characters');
        updateButtonState();
    } else {
        showSuccess(usernameInput);
        updateButtonState();
    }
});

// Password Validation
pass1Input.addEventListener('input', () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{8,}$/;
    
    updatePasswordStrength(pass1Input, 'strengthFill1', 'strengthText1');
    
    if (pass1Input.value === '') {
        clearValidation(pass1Input);
        updateButtonState();
    } else if (!passwordRegex.test(pass1Input.value)) {
        showError(pass1Input, 'Password must be at least 8 characters with letters and numbers');
        updateButtonState();
    } else {
        showSuccess(pass1Input);
        updateButtonState();
    }
    
    // Check password match
    checkPasswordMatch();
});

// Confirm Password Validation
pass2Input.addEventListener('input', () => {
    if (pass2Input.value === '') {
        clearValidation(pass2Input);
        document.getElementById('passwordMatch').textContent = '';
        updateButtonState();
    } else {
        checkPasswordMatch();
        updateButtonState();
    }
});

function checkPasswordMatch() {
    const matchDiv = document.getElementById('passwordMatch');
    
    if (pass1Input.value !== pass2Input.value) {
        pass2Input.classList.add('error');
        pass2Input.classList.remove('success');
        matchDiv.textContent = 'Passwords do not match';
        matchDiv.style.color = '#ff6b6b';
    } else if (pass2Input.value !== '') {
        pass2Input.classList.remove('error');
        pass2Input.classList.add('success');
        matchDiv.textContent = 'Passwords match ✓';
        matchDiv.style.color = '#00b894';
    }
}

// Update Button State
function updateButtonState() {
    const emailValid = emailInput.classList.contains('success');
    const usernameValid = usernameInput.classList.contains('success');
    const pass1Valid = pass1Input.classList.contains('success');
    const pass2Valid = pass2Input.classList.contains('success');
    
    const allValid = emailValid && usernameValid && pass1Valid && pass2Valid;
    
   
    
    if (allValid) {
        gsap.to(signupBtn, {
            duration: 0.3,
            scale: 1.02,
            ease: "power2.out"
        });
    }
}

// Form Submission
signupForm.addEventListener('submit', (e) => {
    if (signupBtn.disabled) {
        e.preventDefault();
        
        // Shake the form
        gsap.to('.auth-card', {
            duration: 0.1,
            x: [-10, 10, -10, 10, 0],
            ease: "power2.out"
        });
        
        return false;
    }
    
    // Success animation
    gsap.to(signupBtn, {
        duration: 0.3,
        scale: 0.95,
        ease: "power2.out"
    });
});
=======
})
>>>>>>> 6431328d52b86dcdd97352024acc7766295b0363
