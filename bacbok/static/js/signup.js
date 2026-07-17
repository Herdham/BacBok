// GSAP Initial Animations
document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    tl.from('.bg-shape', {
        duration: 1.5,
        scale: 0,
        opacity: 0,
        stagger: 0.2
    })
    .from('.auth-card', {
        duration: 0.8,
        y: 60,
        opacity: 0,
        rotationX: 10
    }, "-=0.5")
    .from('.logo-icon', {
        duration: 0.6,
        scale: 0,
        rotation: -180,
        opacity: 0
    }, "-=0.3")
    .from('.auth-header h1', {
        duration: 0.5,
        y: 30,
        opacity: 0
    }, "-=0.2")
    .from('.subtitle', {
        duration: 0.5,
        y: 20,
        opacity: 0
    }, "-=0.2")
    .from('.input-group', {
        duration: 0.5,
        y: 30,
        opacity: 0,
        stagger: 0.1
    }, "-=0.2")
    .from('.form-options, .terms-container', {
        duration: 0.5,
        y: 20,
        opacity: 0,
        stagger: 0.1
    }, "-=0.2")
    .from('.submit-btn', {
        duration: 0.5,
        y: 20,
        opacity: 0,
        scale: 0.9
    }, "-=0.2")
    .from('.auth-footer', {
        duration: 0.5,
        y: 20,
        opacity: 0
    }, "-=0.2");
});

// DOM Elements
const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupBtn');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const pass1Input = document.getElementById('pass1');
const pass2Input = document.getElementById('pass2');
const showPasswordCheckbox = document.getElementById('showPassword');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

// Password Toggle
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = button.querySelector('ion-icon');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.setAttribute('name', 'eye-outline');
        } else {
            input.type = 'password';
            icon.setAttribute('name', 'eye-off-outline');
        }
        
        // Animation
        gsap.from(input, {
            duration: 0.3,
            scale: 0.95,
            ease: "back.out(1.7)"
        });
    });
});

// Show All Passwords Toggle
showPasswordCheckbox.addEventListener('change', () => {
    const type = showPasswordCheckbox.checked ? 'text' : 'password';
    pass1Input.type = type;
    pass2Input.type = type;
    
    document.querySelectorAll('.toggle-password ion-icon').forEach(icon => {
        icon.setAttribute('name', showPasswordCheckbox.checked ? 'eye-outline' : 'eye-off-outline');
    });
});

// Input Focus Animations
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
        gsap.to(input.parentElement.querySelector('.input-icon'), {
            duration: 0.3,
            scale: 1.2,
            color: '#a29bfe',
            ease: "back.out(1.7)"
        });
    });

    input.addEventListener('blur', () => {
        gsap.to(input.parentElement.querySelector('.input-icon'), {
            duration: 0.3,
            scale: 1,
            color: '#6c6f85',
            ease: "power2.out"
        });
    });
});

// Validation Functions
function showError(element, message) {
    errorDiv.style.display = 'flex';
    errorMessage.textContent = message;
    element.classList.add('error');
    element.classList.remove('success');
    
    // Shake animation
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 300);
    
    gsap.from(errorDiv, {
        duration: 0.3,
        y: -10,
        opacity: 0,
        ease: "power2.out"
    });
}

function showSuccess(element) {
    errorDiv.style.display = 'none';
    element.classList.remove('error');
    element.classList.add('success');
}

function clearValidation(element) {
    element.classList.remove('error', 'success');
}

// Password Strength Checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    
    return strength;
}

function updatePasswordStrength(input, strengthFillId, strengthTextId) {
    const password = input.value;
    const strength = checkPasswordStrength(password);
    const strengthFill = document.getElementById(strengthFillId);
    const strengthText = document.getElementById(strengthTextId);
    
    const strengthColors = ['#ff6b6b', '#fdcb6e', '#a29bfe', '#00b894'];
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
    
    if (password.length === 0) {
        strengthFill.style.width = '0';
        strengthText.textContent = '';
        return;
    }
    
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
    
    signupBtn.disabled = !allValid;
    
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