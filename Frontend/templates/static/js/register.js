// register.js (Versión Corregida para Registro)

const form = document.getElementById("registerForm");
const inputs = form.querySelectorAll("input");

form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitamos el envío de formulario tradicional
    
    let valid = true;
    let data = {}; // Objeto para almacenar los datos a enviar

    // --- 1. Validación y Recolección de Datos ---
    
    // Función de ayuda para obtener el valor y validar
    const getAndValidate = (input) => {
        let msg = input.nextElementSibling;
        
        let isInputValid = input.checkValidity();
        if (input.id === 'correo') {
            isInputValid = isInputValid && validateEmail(input.value);
        }
        
        if (!isInputValid) {
            valid = false;
            msg.style.display = "block";
            input.classList.add("user-invalid");
            input.classList.remove("user-valid");

            if (input.validity.valueMissing) {
                msg.textContent = "Este campo es obligatorio";
            } else if (input.validity.tooShort) {
                msg.textContent = `Debe tener al menos ${input.minLength} caracteres`;
            } else {
                 msg.textContent = input.id === 'correo' ? "Formato de correo inválido" : "Formato inválido";
            }
            return null;
        } else {
            msg.style.display = "none";
            input.classList.remove("user-invalid");
            input.classList.add("user-valid");
            return input.value;
        }
    };
    
    inputs.forEach(input => {
        const value = getAndValidate(input);
        if (value !== null) {
            // Mapeo de IDs del HTML a propiedades de RegistroDTO (Java)
            switch (input.id) {
                case 'nombre':
                    data.nombreCompleto = value; 
                    break;
                case 'correo':
                    data.correoElectronico = value; 
                    break;
                case 'password':
                    data.contrasena = value; 
                    break;
                default:
                    data[input.id] = value; // Otros campos (cedula, telefono, direccion)
                    break;
            }
        }
    });

    if (!valid) {
        return; // Detenemos el proceso si la validación falla
    }
    
    // --- 2. Comunicación con el Backend (API REST) ---
    // USAMOS LA URL ABSOLUTA CORREGIDA: http://localhost:8081/auth/register
    const REGISTER_URL = 'http://localhost:8081/auth/register'; 
    try {
        const response = await fetch(REGISTER_URL, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        });

        if (!response.ok) {
            // Manejar errores de registro (ej: 400 Bad Request por usuario existente)
            let errorMessage = "El usuario ya existe o los datos son incorrectos.";
            try {
                // Intenta obtener un mensaje de error detallado si el servidor lo envía en el cuerpo
                const errorData = await response.json();
                if (errorData.message) errorMessage = errorData.message;
            } catch (e) {
                // Si falla al parsear JSON, se mantiene el mensaje genérico
            }

            console.error(`Error de Registro (${response.status}):`, errorMessage);
            alert(`Error al registrar: ${errorMessage}`); 
            return;
        }

        // 3. Registro Exitoso: Manejar el Token y Redirigir
        const tokenDTO = await response.json();
        
        localStorage.setItem('accessToken', tokenDTO.accessToken); 
        localStorage.setItem('refreshToken', tokenDTO.refreshToken);
        
        alert("¡Registro exitoso! Serás redirigido.");
        window.location.href = '/dashboard.html'; 

    } catch (error) {
        console.error('Error al intentar registrar (Fallo de red):', error);
        // Este catch se ejecuta si el servidor no responde
        alert("Hubo un problema de conexión con el servidor. Inténtalo de nuevo.");
    }
});

// Función de validación de correo
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Input listener para validación en tiempo real
inputs.forEach(input => {
    input.addEventListener("input", () => {
        let msg = input.nextElementSibling;
        
        let isInputValid = input.checkValidity();
        if (input.id === 'correo') {
            isInputValid = isInputValid && validateEmail(input.value);
        }

        if (isInputValid) {
            msg.style.display = "none";
            input.classList.remove("user-invalid");
            input.classList.add("user-valid");
        }
    });
});