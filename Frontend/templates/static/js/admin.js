document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. MANEJO DEL BOTÓN "Cerrar Sesión"
    // =======================================================
    const logoutButton = document.getElementById('cerrarSesion');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Lógica real para limpiar la sesión y redirigir
            alert('Sesión administrativa cerrada. Redirigiendo...'); 
            // window.location.href = '/login.html'; 
        });
    }

    // =======================================================
    // 2. LÓGICA DEL BOTÓN 'GESTIONAR EXTRAS'
    // =======================================================
    // Debe estar DENTRO de DOMContentLoaded para asegurar que el botón exista.
    
    // Obtener una referencia al botón usando el ID del HTML
    const gestionarExtrasBtn = document.getElementById('gestionarExtras');

    // Agregar el "escuchador" solo si encontramos el botón
    if (gestionarExtrasBtn) {
        gestionarExtrasBtn.addEventListener('click', () => {
            // Redireccionar a la página extras.html
            window.location.href = "Frontend/templates/extras.html"; 
        });
    }
    
    // OPCIONAL: Si quieres conectar el botón 'Impuestos' a 'impuestos.html'
    // Debes agregar un ID (ej: id="gestionarImpuestos") al botón de Impuestos en el HTML
    /*
    const gestionarImpuestosBtn = document.getElementById('gestionarImpuestos');
    if (gestionarImpuestosBtn) {
        gestionarImpuestosBtn.addEventListener('click', () => {
            window.location.href = 'impuestos.html'; 
        });
    }
    */
});