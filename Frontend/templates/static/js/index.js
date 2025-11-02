
document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos del DOM
    const form = document.getElementById("loginForm");
    const errorDisplay = document.querySelector('.login-error-message'); // Contenedor para errores generales

    // Manejador del envío del formulario
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        
        let valid = true;

        const correoInput = document.getElementById("correo");
        const passwordInput = document.getElementById("password");
        
        const correo = correoInput.value.trim();
        const password = passwordInput.value;

        resetErrors();

        // 1. Validación del lado del cliente
        if (!validateEmail(correo)) {
            showError(correoInput, "Debes ingresar un correo válido");
            valid = false;
        }

        if (password.length < 6) {
            showError(passwordInput, "La contraseña debe tener mínimo 6 caracteres");
            valid = false;
        }

        if (!valid) {
            return; // Detenemos si la validación falla
        }

        // 2. Llamada asíncrona al API de login
        try {
            const response = await fetch('http://localhost:8081/auth/login', { 
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
                // Manejar errores como 401 (Unauthorized)
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

            // 3. Login Exitoso: Guardar y Redirigir
            const tokenDTO = await response.json();
            
            // 🔥 CORRECCIÓN CLAVE: Leemos la propiedad que envía el backend (access_token)
            const jwtToken = tokenDTO.access_token; 
            
            if (!jwtToken) {
                console.error("Respuesta del servidor no contiene el token JWT esperado:", tokenDTO);
                errorDisplay.textContent = "Error al recibir la clave de sesión. Respuesta inesperada del servidor.";
                return;
            }
            
            // Guardar el token principal con la clave 'accessToken' (para que catalogo.js lo lea)
            localStorage.setItem('accessToken', jwtToken); 
            
            // Guardar el refresh token (si existe)
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

// --- Funciones de Validación y Errores ---

function validateEmail(email) {
    // Regex estándar para validación simple de correo
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
    // Limpia mensajes de error individuales
    document.querySelectorAll(".error-msg").forEach(msg => msg.textContent = "");
    document.querySelectorAll(".input-error").forEach(input => input.classList.remove("input-error"));
    // Limpia el mensaje de error general
    const errorDisplay = document.querySelector('.login-error-message');
    if (errorDisplay) errorDisplay.textContent = "";
}
