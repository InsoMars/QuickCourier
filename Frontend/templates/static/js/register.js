
const form = document.getElementById("registerForm");
const inputs = form.querySelectorAll("input");

form.addEventListener("submit", async function (event) {
    event.preventDefault(); 
    
    let valid = true;
    let data = {}; 

   
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
                    data[input.id] = value; 
                    break;
            }
        }
    });

    if (!valid) {
        return; 
    }
    
   
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
            
            let errorMessage = "El usuario ya existe o los datos son incorrectos.";
            try {
                
                const errorData = await response.json();
                if (errorData.message) errorMessage = errorData.message;
            } catch (e) {
               
            }

            console.error(`Error de Registro (${response.status}):`, errorMessage);
            alert(`Error al registrar: ${errorMessage}`); 
            return;
        }

        
        const tokenDTO = await response.json();
        
        localStorage.setItem('accessToken', tokenDTO.accessToken); 
        localStorage.setItem('refreshToken', tokenDTO.refreshToken);
        
        alert("¡Registro exitoso! Serás redirigido.");
        window.location.href = 'index.html'; 

    } catch (error) {
        console.error('Error al intentar registrar (Fallo de red):', error);
       
        alert("Hubo un problema de conexión con el servidor. Inténtalo de nuevo.");
    }
});


function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


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