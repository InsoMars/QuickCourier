// [¡IMPORTANTE! VERIFICA ESTA URL CON TU BACKEND]
// NOTA: Para el resumen del carrito, asumo que el backend necesita la lista completa del catálogo
// para obtener los detalles de los productos.
const API_URL = 'http://localhost:8081/QuickCourier/Productos/Catalogo'; 

// Referencias del DOM
const tbody = document.getElementById('resumen-carrito-body');
const subtotalSpan = document.getElementById('resumen-carrito-subtotal');
const totalSpan = document.getElementById('resumen-carrito-total');
const countSpan = document.getElementById('resumen-carrito-count');

// =======================================================
// 0. FUNCIÓN DE LOGOUT (Necesaria si el token falla)
// =======================================================

// Elimina los tokens del localStorage y notifica al backend (si es necesario).
async function logoutUser() {
    const accessToken = localStorage.getItem('accessToken');
    
    // 1. Limpiar el almacenamiento local inmediatamente
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('carritoIds'); 
    
    // Opcional: Notificar al backend para invalidar el token en la DB
    if (accessToken) {
        try {
            const LOGOUT_URL = 'http://localhost:8081/auth/logout';
            await fetch(LOGOUT_URL, {
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
        } catch (error) {
            console.error("Error al notificar logout al servidor:", error);
        }
    }
}


// =======================================================
// 1. LÓGICA PRINCIPAL DE CARGA Y PROCESAMIENTO
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // Iniciar la carga de datos del carrito
    cargarResumenDelCarrito();
});


async function cargarResumenDelCarrito() {
    const mainContainer = document.querySelector("main.resumen-carrito-main");

    // 1. OBTENER Y VERIFICAR EL TOKEN 🔥
    const accessToken = localStorage.getItem('accessToken'); 
    if (!accessToken) {
        // Redirigir si no hay token (sesión no válida)
        mainContainer.innerHTML = "<p class='text-center text-red-600' style='padding: 2rem;'>Debes iniciar sesión para ver tu carrito. Redirigiendo...</p>";
        setTimeout(() => {
            window.location.href = '/frontend/templates/index.html'; 
        }, 2000);
        return;
    }


    try {
        // A. Obtener IDs del carrito desde localStorage
        const idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
        
        if (idsEnCarrito.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">Tu carrito está vacío. <a href="catalogo.html">¡Añade algo!</a></td></tr>';
            actualizarTotales(0, 0);
            return;
        }

        // B. Llamar a la API para obtener TODOS los detalles de los productos
        // 🔥 INCLUIR EL TOKEN EN EL ENCABEZADO
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // <-- ¡Paso crucial!
            }
        });

        if (response.ok) {
            // Petición exitosa
            const todosLosProductos = await response.json(); // Lista de ProductoDTOs

            // C. Mapear y agrupar: Contar cuántas veces aparece cada ID en el carrito
            const resumenCarrito = agruparProductosYContar(idsEnCarrito, todosLosProductos);
            
            // D. Renderizar la tabla y calcular totales
            renderCarrito(resumenCarrito);

        } else if (response.status === 401 || response.status === 403) {
             // Manejar sesión expirada o token inválido
            console.error('Token inválido/expirado al cargar carrito:', response.status);
            mainContainer.innerHTML = "<p class='text-center text-red-600' style='padding: 2rem;'>Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.</p>";
            await logoutUser(); // Limpiar tokens localmente
            setTimeout(() => {
                window.location.href = '/frontend/templates/index.html';
            }, 2000);
            return;
        } else {
            throw new Error(`Error HTTP: ${response.status}`);
        }

    } catch (error) {
        console.error('Error al cargar el resumen del carrito:', error);
        tbody.innerHTML = '<tr><td colspan="3">Error al cargar el pedido. Intenta más tarde.</td></tr>';
        actualizarTotales(0, 0);
    }
}


/**
 * Recorre la lista de IDs seleccionados y agrupa los productos únicos, contando su cantidad.
 * @param {string[]} idsEnCarrito - IDs de los productos seleccionados.
 * @param {object[]} todosLosProductos - Lista completa de ProductoDTOs del backend.
 * @returns {object[]} Un array de productos únicos con su campo 'cantidad' calculado.
 */
function agruparProductosYContar(idsEnCarrito, todosLosProductos) {
    const resumen = {};
    
    // Crear un mapa para buscar detalles de producto rápidamente
    const mapaProductos = new Map(todosLosProductos.map(p => [String(p.idProducto), p]));

    // Contar la cantidad de cada producto en el carrito (ej: 1, 1, 2, 1, 2, 3)
    idsEnCarrito.forEach(id => {
        const idString = String(id);
        const detalles = mapaProductos.get(idString);
        
        if (detalles) {
            if (!resumen[idString]) {
                // Si es la primera vez que vemos este ID, inicializamos
                resumen[idString] = { 
                    ...detalles, 
                    cantidad: 1 
                };
            } else {
                // Si ya existe en el resumen, solo aumentar la cantidad
                resumen[idString].cantidad += 1;
            }
        }
    });

    // Devolver un array de los productos únicos en el carrito con la cantidad total
    return Object.values(resumen);
}


// =======================================================
// 2. FUNCIONES DE RENDERIZADO Y CÁLCULO
// =======================================================

function renderCarrito(productosEnCarrito) {
    tbody.innerHTML = '';
    let subtotal = 0;
    let totalProductos = 0;
    
    productosEnCarrito.forEach((producto) => {
        // Usamos los nombres de campos del DTO:
        const precioUnitario = producto.precioUniProd;
        const nombre = producto.nombreProd;
        const imagen = producto.rutaImagen;
        const descripcion = producto.descripcionProd;
        const cantidad = producto.cantidad; // Cantidad ya calculada

        const precioTotalProducto = precioUnitario * cantidad;
        subtotal += precioTotalProducto;
        totalProductos += cantidad;

        const row = document.createElement('tr');
        // Nota: se eliminan los botones de control de cantidad por ahora,
        // ya que la lógica de remover/agregar no está implementada.
        row.innerHTML = `
            <td>
                <img src="${imagen}" alt="${nombre}"> 
                <div>
                    <strong>${nombre}</strong><br>
                    <small>${descripcion}</small>
                </div>
            </td>
            <td>$${precioUnitario.toLocaleString()}</td>
            <td>
                <div class="cantidad-display">
                    <span>${cantidad}</span>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Actualizar totales en la interfaz
    actualizarTotales(subtotal, totalProductos);
}

function actualizarTotales(subtotal, totalProductos) {
    subtotalSpan.textContent = `$${subtotal.toLocaleString()}`;
    totalSpan.textContent = `$${subtotal.toLocaleString()}`;
    countSpan.textContent = totalProductos; // Actualiza el contador de productos
}

// =======================================================
// 3. LÓGICA DEL MENÚ Y LOGOUT
// =======================================================

const menuBtn = document.querySelector(".menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logoutBtn"); // Referencia al botón de logout

// Lógica para abrir/cerrar menú
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

// Lógica de Cerrar Sesión (Se mantiene igual, solo llama a la función de arriba)
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutUser();
        console.log("Sesión cerrada correctamente desde el carrito."); 
        window.location.href = '/frontend/templates/index.html'; // Redirigir al login
    });
}
