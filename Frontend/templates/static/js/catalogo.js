

// 1. FUNCIÓN DE ACTUALIZACIÓN VISUAL DEL CONTADOR
function actualizarCarrito() {
    // Usamos 'carritoIds' para mantener el estado del carrito
    const idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
    const contador = document.getElementById("cart-count");
    if (contador) {
        contador.textContent = idsEnCarrito.length;
    }
}

// 2. FUNCIÓN PARA CREAR LAS TARJETAS DE PRODUCTO
function cargarProductos(lista, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return; // Asegurar que el contenedor existe

    contenedor.innerHTML = ''; 
    
    lista.forEach((p) => {
        contenedor.innerHTML += `
            <div class="product-card">
                <img src="${p.rutaImagen}" alt="${p.nombreProd}">
                <p class="product-name">${p.nombreProd}</p>
                <button class="add-btn" data-id="${p.idProducto}" data-nombre="${p.nombreProd}">Agregar 🛒</button>
            </div>
        `;
    });
}

// --- SECCIÓN DE AUTENTICACIÓN Y LOGOUT ---

// 6. FUNCIÓN DE LOGOUT
// Elimina los tokens del localStorage y notifica al backend para invalidar el JWT en la DB.
async function logoutUser() {
    // Usamos la clave consistente 'accessToken'
    const accessToken = localStorage.getItem('accessToken');
    
    // 1. Limpiar el almacenamiento local inmediatamente
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('carritoIds'); // Limpiar el carrito también
    
    // Asegurar que el contador se actualice a 0
    actualizarCarrito(); 

    // 2. Notificar al backend para invalidar el token (si tienes un endpoint de logout)
    if (accessToken) {
        try {
            // Asume que tienes un endpoint /auth/logout configurado en tu SecurityConfig
            const LOGOUT_URL = 'http://localhost:8081/auth/logout';
            
            // Enviamos el token para que el backend pueda revocarlo en la tabla Token
            await fetch(LOGOUT_URL, {
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${accessToken}` 
                }
            });
        } catch (error) {
            console.error("Error al notificar logout al servidor:", error);
            // El flujo continúa; el token expirará solo.
        }
    }
}

// 3. FUNCIÓN PRINCIPAL DE INICIO (Carga de Datos)
document.addEventListener('DOMContentLoaded', async () => {

    const API_URL = 'http://localhost:8081/QuickCourier/Productos/Catalogo'; 
    // CRUCIAL: Obtener el token de localStorage
    const accessToken = localStorage.getItem('accessToken');
    const mensajeContenedor = document.querySelector("main.contenedor");
    
    if (!mensajeContenedor) {
        console.error("No se encontró el contenedor principal del catálogo.");
        return;
    }

    // --- VERIFICACIÓN DE AUTENTICACIÓN ---
    if (!accessToken) {
        // Si no hay token, la sesión no es válida.
        mensajeContenedor.innerHTML = "<p class='text-center text-red-600'>Debes iniciar sesión para ver el catálogo. Redirigiendo...</p>";
        setTimeout(() => {
            // Asegúrate de que esta URL es correcta para tu página de login
            window.location.href = '/frontend/templates/index.html'; 
        }, 2000);
        return; // Detener la ejecución
    }
    
    // --- INCLUSIÓN DEL TOKEN EN LA LLAMADA ---
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // ENVIAR EL TOKEN AL BACKEND
                'Authorization': `Bearer ${accessToken}` 
            }
        });

        if (response.ok) {
            // Petición exitosa (Status 200 OK)
            const productos = await response.json(); 

            // Filtrar y cargar: El JS separa los productos por la categoría
            const libros = productos.filter(p => p.categoriaProd === 'Libros');
            const snacks = productos.filter(p => p.categoriaProd === 'Snacks');
            
            cargarProductos(libros, "libros-container");
            cargarProductos(snacks, "snacks-container");
            
        } else if (response.status === 401 || response.status === 403) {
            // Manejar sesión expirada o token inválido (lo que el JwtAuthFilter te devuelve)
            console.error('Token inválido/expirado:', response.status);
            mensajeContenedor.innerHTML = "<p class='text-center text-red-600'>Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.</p>";
            // Ejecutar logout para limpiar tokens
            await logoutUser(); 
            setTimeout(() => {
                // Redirigir al login
                window.location.href = '/frontend/templates/index.html';
            }, 2000);

        } else {
            // Manejar otros errores HTTP (ej. 500)
            throw new Error(`Error HTTP: ${response.status}`);
        }

    } catch (error) {
        console.error('Error al cargar datos del backend:', error);
        mensajeContenedor.innerHTML = "<p class='text-center text-red-600'>Hubo un problema al cargar el catálogo. Verifique la conexión del servidor o la URL de la API.</p>";
    }
    
    // Al finalizar la carga, actualizamos el contador del carrito
    actualizarCarrito(); 
});


// 4. MANEJADOR DE EVENTOS (Agregar al Carrito)
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
        const idProducto = e.target.getAttribute("data-id"); 
        
        let idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
        idsEnCarrito.push(idProducto); 
        
        localStorage.setItem('carritoIds', JSON.stringify(idsEnCarrito));
        
        actualizarCarrito();
        
        // Mensaje de confirmación visual (en lugar de alert)
        const nombreProd = e.target.getAttribute("data-nombre");
        console.log(`Producto añadido: ${nombreProd}`);
    }
});


// 5. Lógica del Menú 
const menuBtn = document.querySelector(".menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("overlay");

if (menuBtn && sideMenu && closeMenu && overlay) {
    menuBtn.addEventListener("click", () => {
        sideMenu.classList.add("open");
        overlay.classList.add("show");
    });

    closeMenu.addEventListener("click", () => {
        sideMenu.classList.remove("open");
        overlay.classList.remove("show");
    });

    overlay.addEventListener("click", () => {
        sideMenu.classList.remove("open");
        overlay.classList.remove("show");
    });
}


// 7. ASIGNAR EVENTO AL BOTÓN DE CERRAR SESIÓN
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutUser();
        // Nota: Cambiado el alert() a console.log para cumplir con las restricciones
        console.log("Sesión cerrada correctamente."); 
        window.location.href = '/frontend/templates/index.html'; // Redirigir al login
    });
}
