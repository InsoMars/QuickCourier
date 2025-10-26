document.addEventListener('DOMContentLoaded', () => {
    
    // Lógica para el botón "Cerrar Sesión"
    const logoutButton = document.getElementById('cerrarSesion');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Aquí iría la lógica para enviar una petición al backend de Spring Boot para cerrar la sesión (JWA)
            alert('Sesión cerrada. Redirigiendo...'); 
            // window.location.href = '/login.html'; // Redirige a la página de login
        });
    }

    // FUTURO: Aquí agregarías la lógica para:
    // 1. Cargar las tarifas al inicio (fetch('API/tarifas')).
    // 2. Manejar la búsqueda y el filtro.
    // 3. Manejar el clic en "+ Crear Tarifa".
});