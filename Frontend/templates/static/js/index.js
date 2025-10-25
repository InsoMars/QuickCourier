document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", (event) => {
        let valid = true;

        const correo = document.getElementById("correo");
        const password = document.getElementById("password");

        resetErrors();

        if (!validateEmail(correo.value)) {
            showError(correo, "Debes ingresar un correo válido");
            valid = false;
        }

        if (password.value.trim().length < 6) {
            showError(password, "La contraseña debe tener mínimo 6 caracteres");
            valid = false;
        }

        if (!valid) {
            event.preventDefault();
        }
    });
});

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showError(input, message) {
    const group = input.parentElement;
    const messageTag = group.querySelector(".error-msg");
    messageTag.textContent = message;
    input.classList.add("input-error");
}

function resetErrors() {
    document.querySelectorAll(".error-msg").forEach(msg => msg.textContent = "");
    document.querySelectorAll(".input-error").forEach(input => input.classList.remove("input-error"));
}
