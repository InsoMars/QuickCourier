
document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos del DOM
    const form = document.getElementById("loginForm");
    const errorDisplay = document.querySelector('.login-error-message'); // Contenedor para errores generales

    // envió del inicio de sesión 

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        
        let valid = true;

        const correoInput = document.getElementById("correo");
        const passwordInput = document.getElementById("password");
        
        const correo = correoInput.value.trim();
        const password = passwordInput.value;

        resetErrors();

        // validaciónes correo y contraseña 

        if (!validateEmail(correo)) {
            showError(correoInput, "Debes ingresar un correo válido");
            valid = false;
        }

        if (password.length < 6) {
            showError(passwordInput, "La contraseña debe tener mínimo 6 caracteres");
            valid = false;
        }

        if (!valid) {
            return;
        }

        // API login
        try {
            const response = await fetch('http://backend:8081/auth/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    correoElectronico: correo, 
                    contrasena: password 
                })
            });

            if (!response.ok) {
                
                const status = response.status;
                let errorMessage = "Verifica tu correo y contraseña.";
                
                if (status === 401) {
                    errorMessage = "Credenciales incorrectas. Inténtalo de nuevo.";
                } else if (status === 500) {
                    errorMessage = "Error interno del servidor. Contacta al administrador.";
                }
                
                console.error(`Error de inicio de sesión: Status ${status}`);
                errorDisplay.textContent = errorMessage;
                return;
            }

        
            const tokenDTO = await response.json();
            const jwtToken = tokenDTO.access_token; 
            
            if (!jwtToken) {
                console.error("Respuesta del servidor no contiene el token JWT esperado:", tokenDTO);
                errorDisplay.textContent = "Error al recibir la clave de sesión. Respuesta inesperada del servidor.";
                return;
            }
            
            // Guardar el token principal
            localStorage.setItem('accessToken', jwtToken); 
            
            // Guardar el refresh token
            if (tokenDTO.refresh_token) {
                 localStorage.setItem('refreshToken', tokenDTO.refresh_token);
            }
            
            // Redirigir al usuario
            window.location.href = '/frontend/templates/catalogo.html'; 

        } catch (error) {
            console.error('Error de conexión o del servidor:', error);
            errorDisplay.textContent = "No se pudo conectar con el servidor. Verifica que esté activo.";
        }
    });
});

// Validación y Errores

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showError(input, message) {
    const group = input.parentElement;
    const messageTag = group.querySelector(".error-msg");
    if (messageTag) messageTag.textContent = message;
    input.classList.add("input-error");
}

function resetErrors() {
    document.querySelectorAll(".error-msg").forEach(msg => msg.textContent = "");
    document.querySelectorAll(".input-error").forEach(input => input.classList.remove("input-error"));
    
    const errorDisplay = document.querySelector('.login-error-message');
    if (errorDisplay) errorDisplay.textContent = "";
}
