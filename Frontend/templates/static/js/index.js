// index.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorDisplay = document.querySelector('.login-error-message'); // Asegúrate de que este elemento exista en tu HTML

    // Prevenimos el envío tradicional del formulario y realizamos la llamada asíncrona
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
            // Verifica que el servidor de Spring Boot esté corriendo en el puerto 8081
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
                errorDisplay.textContent = errorMessage; // Usamos el contenedor de errores
                return;
            }

            // 3. Login Exitoso: Guardar y Redirigir
            const tokenDTO = await response.json();
            
            // AJUSTE CLAVE: Usamos tokenDTO.accessToken, que es la clave que sabes que funciona
            // y es consistente con el código del catálogo.
            const jwtToken = tokenDTO.accessToken; 
            
            if (!jwtToken) {
                console.error("Respuesta del servidor no contiene el token JWT esperado:", tokenDTO);
                errorDisplay.textContent = "Error al recibir la clave de sesión. Respuesta inesperada del servidor.";
                return;
            }
            
            // Guardar el token principal
            localStorage.setItem('accessToken', jwtToken); 
            
            // Si el backend también devuelve refreshToken, guárdalo (Opcional)
            if (tokenDTO.refreshToken) {
                 localStorage.setItem('refreshToken', tokenDTO.refreshToken);
            }
            
            // Redirigir al usuario
            window.location.href = '/frontend/templates/catalogo.html'; 

        } catch (error) {
            console.error('Error de conexión o del servidor:', error);
            // Este catch se ejecuta si el servidor está apagado o la URL es incorrecta
            errorDisplay.textContent = "No se pudo conectar con el servidor. Verifica que esté activo.";
        }
    });
});

// --- Funciones de Validación y Errores ---

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
