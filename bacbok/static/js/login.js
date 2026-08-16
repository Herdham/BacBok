// removed legacy checkbox-based show-password support; use side toggle button only

// Safe DOMContentLoaded animations (only if GSAP is available)
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && gsap.timeline) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    try {
      tl.from(".bg-shape", {
        duration: 1.5,
        scale: 0,
        opacity: 0,
        stagger: 0.2,
      })
        .from(
          ".auth-card",
          { duration: 0.8, y: 60, opacity: 0, rotationX: 10 },
          "-=0.5",
        )
        .from(
          ".logo-icon",
          { duration: 0.6, scale: 0, rotation: -180, opacity: 0 },
          "-=0.3",
        )
        .from(".auth-header h1", { duration: 0.5, y: 30, opacity: 0 }, "-=0.2")
        .from(".subtitle", { duration: 0.5, y: 20, opacity: 0 }, "-=0.2")
        .from(
          ".input-group",
          { duration: 0.5, y: 30, opacity: 0, stagger: 0.1 },
          "-=0.2",
        )
        .from(".form-options", { duration: 0.5, y: 20, opacity: 0 }, "-=0.2")
        .from(
          ".submit-btn",
          { duration: 0.5, y: 20, opacity: 0, scale: 0.9 },
          "-=0.2",
        )
        .from(".auth-footer", { duration: 0.5, y: 20, opacity: 0 }, "-=0.2");
    } catch (e) {
      // animation failed - ignore to avoid blocking login functionality
      console.warn("GSAP animation failed", e);
    }
  }
});

// debug: confirm script loaded
try {
  console.log("login.js loaded");
} catch (e) {}

// Elements with guards
const loginForm = document.getElementById("loginForm");
const loginBtn =
  document.getElementById("loginBtn") || document.querySelector("#loginBtn");
const passwordInput = document.getElementById("pass1");
const togglePasswordBtn = document.getElementById("togglePassword");
const emailInput = document.getElementById("email");

// Toggle password button (eye icon)
if (togglePasswordBtn && passwordInput) {
  console.log(
    "login: togglePassword element found",
    !!togglePasswordBtn,
    !!passwordInput,
  );
  // use pointer events to support touch and mouse in one handler
  const _toggle = (e) => {
    try {
      e.preventDefault();
    } catch (err) {}
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    const icon = togglePasswordBtn.querySelector("ion-icon");
    if (icon)
      icon.setAttribute("name", isPassword ? "eye-outline" : "eye-off-outline");
    try {
      console.log("login: toggle clicked, type now:", passwordInput.type);
    } catch (err) {}
  };

  togglePasswordBtn.addEventListener("pointerdown", _toggle);
  // also attach click as a fallback
  togglePasswordBtn.addEventListener("click", _toggle);
}

// Input focus animations (guarded)
document.querySelectorAll(".form-input").forEach((input) => {
  input.addEventListener("focus", () => {
    const iconElement =
      input.parentElement && input.parentElement.querySelector(".input-icon");
    if (iconElement && typeof gsap !== "undefined") {
      gsap.to(iconElement, {
        duration: 0.3,
        scale: 1.2,
        color: "#a29bfe",
        ease: "back.out(1.7)",
      });
    }
  });
  input.addEventListener("blur", () => {
    const iconElement =
      input.parentElement && input.parentElement.querySelector(".input-icon");
    if (iconElement && typeof gsap !== "undefined") {
      gsap.to(iconElement, {
        duration: 0.3,
        scale: 1,
        color: "#6c6f85",
        ease: "power2.out",
      });
    }
  });
});

// Enable/disable login button based on input
if (loginBtn && emailInput && passwordInput) {
  function updateLoginBtnState() {
    const empty = !emailInput.value.trim() || !passwordInput.value.trim();
    loginBtn.disabled = empty;
    if (empty) {
      loginBtn.style.backgroundColor = "#dddddd";
      loginBtn.style.color = "#0B1020";
      loginBtn.style.cursor = "default";
    } else {
      loginBtn.style.backgroundColor = "#0B1020";
      loginBtn.style.color = "#fff";
      loginBtn.style.cursor = "pointer";
    }
  }
  emailInput.addEventListener("input", updateLoginBtnState);
  passwordInput.addEventListener("input", updateLoginBtnState);
  updateLoginBtnState();
}

// Form submit: show loading state if present
if (loginForm && loginBtn) {
  loginForm.addEventListener("submit", function (e) {
    try {
      loginBtn.classList.add("loading");
      const btnText = loginBtn.querySelector(".btn-text");
      if (btnText) btnText.textContent = "Signing in...";
    } catch (err) {
      // ignore UI update errors
    }
  });
}
