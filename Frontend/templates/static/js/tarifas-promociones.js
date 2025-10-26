document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo del botón "Cerrar Sesión"
    const logoutButton = document.getElementById('cerrarSesion');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Lógica real de cierre de sesión (e.g., limpiar tokens, redirigir)
            alert('Sesión cerrada. Redirigiendo...'); 
            // window.location.href = '/login'; // Descomentar para redirección real
        });
    }

    // 2. Manejo básico de la navegación (simulación de cambio de página/estado)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            //e.preventDefault(); // Descomentar si no quieres que el enlace recargue la página

            // Simulación de activación del enlace
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            e.target.closest('.nav-item').classList.add('active');
            
            // Aquí iría la lógica para cargar la vista correspondiente
            console.log(`Navegando a: ${e.target.textContent}`);
        });
    });
});