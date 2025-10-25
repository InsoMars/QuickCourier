const form = document.getElementById("registerForm");
const inputs = form.querySelectorAll("input");

form.addEventListener("submit", function (event) {
    let valid = true;

    inputs.forEach(input => {
        let msg = input.nextElementSibling;

        if (!input.checkValidity()) {
            valid = false;
            msg.style.display = "block";
            input.classList.add("user-invalid");
            input.classList.remove("user-valid");

            if (input.validity.valueMissing) {
                msg.textContent = "Este campo es obligatorio";
            } else if (input.validity.tooShort) {
                msg.textContent = `Debe tener al menos ${input.minLength} caracteres`;
            } else if (input.validity.typeMismatch) {
                msg.textContent = "Formato inválido";
            }

        } else {
            msg.style.display = "none";
            input.classList.remove("user-invalid");
            input.classList.add("user-valid");
        }
    });

    if (!valid) {
        event.preventDefault();
    }
});

// Cada vez que el usuario escriba, se revisa el estado
inputs.forEach(input => {
    input.addEventListener("input", () => {
        let msg = input.nextElementSibling;
        if (input.checkValidity()) {
            msg.style.display = "none";
            input.classList.remove("user-invalid");
            input.classList.add("user-valid");
        }
    });
});
