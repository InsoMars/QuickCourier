console.log("✅ resumen-carrito.js cargado correctamente");

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
        console.log("🚀 DOM cargado, iniciando cargarResumenDelCarrito()");

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

async function renderCarrito(productosEnCarrito) {
    tbody.innerHTML = '';
    let subtotal = 0;
    let totalProductos = 0;
    let pesoTotal = 0;


    productosEnCarrito.forEach((producto) => {
        const precioUnitario = producto.precioUniProd;
        const cantidad = producto.cantidad;
        const peso = producto.pesoProd;
        const precioTotalProducto = precioUnitario * cantidad;
        
        subtotal += precioTotalProducto;
        totalProductos += cantidad;
        pesoTotal += peso * cantidad;


        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="product-info-wrap">
                    <img src="${producto.rutaImagen}" alt="${producto.nombreProd}"> 
                    <div>
                        <strong>${producto.nombreProd}</strong><br>
                        <small>${producto.descripcionProd}</small>
                    </div>
                </div>
            </td>
            <td>$${precioUnitario.toLocaleString()}</td>
            <td>
                <div class="cantidad-controls">
                    <button class="control-btn minus-btn" data-id="${producto.idProducto}">-</button>
                    <span class="cantidad-display">${cantidad}</span>
                    <button class="control-btn plus-btn" data-id="${producto.idProducto}">+</button>
                </div>
            </td>
            <td><button class="remove-all-btn" data-id="${producto.idProducto}">Eliminar</button></td>
        `;
        tbody.appendChild(row);


                    // Al final de renderCarrito()
            const pedidoParcial = {
            productos: productosEnCarrito.map(p => ({
                idProducto: p.idProducto,
                cantidadProducto: p.cantidad
            }))
            };

            // Guardar en localStorage para que info-pedido.js lo complete
            localStorage.setItem("pedidoParcial", JSON.stringify(pedidoParcial));

            console.log("🗃️ Pedido parcial guardado en localStorage:", pedidoParcial);

    });


    

    // 🔹 Calcular el envío real desde backend
    const totalPedido = await calcularEnvio(productosEnCarrito);

    // 🔹 Actualizar totales
    subtotalSpan.textContent = `$${subtotal.toLocaleString()}`;
    totalSpan.textContent = `$${totalPedido.toLocaleString()}`;
    countSpan.textContent = totalProductos;
}


async function calcularEnvio(productos) {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return 0;

    const datosEnvio = {
        ciudad: "Bogota",  // luego puedes cambiarlo según la dirección del usuario
        empaqueRegalo: false,
        envioExpress: false,
        envioSeguro: false,
        manejoFragil: false,
        productos: productos.map(p => ({
            idProducto: p.idProducto,
            cantidadProducto: p.cantidad
        }))
    };

    try {
        const response = await fetch("http://localhost:8081/pedido/calcular-envio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(datosEnvio)
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();

        // Mostrar el peso total en el HTML
        const pesoSpan = document.getElementById('resumen-carrito-peso');
        pesoSpan.textContent = `${data.pesoTotal.toFixed(2)} kg`;

        // Retornar el total final
        return data.totalFinal;

    } catch (error) {
        console.error("Error al calcular envío:", error);
        return 0;
    }
}


function actualizarTotales(subtotal, totalProductos) {
    subtotalSpan.textContent = `$${subtotal.toLocaleString()}`;
    totalSpan.textContent = `$${subtotal.toLocaleString()}`;
    countSpan.textContent = totalProductos; // Actualiza el contador de productos
}

// =======================================================
// 3. MANIPULACIÓN DEL CARRITO (Aumentar/Disminuir/Eliminar)
// =======================================================

/**
 * Agrega una instancia del producto al carrito (almacenamiento local)
 * @param {string} id - ID del producto a aumentar.
 */
function aumentarCantidad(id) {
    const idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
    idsEnCarrito.push(id); // Simplemente añade el ID al final
    localStorage.setItem('carritoIds', JSON.stringify(idsEnCarrito));
    // Vuelve a cargar el resumen para refrescar la vista
    cargarResumenDelCarrito();
}

/**
 * Remueve la primera instancia encontrada del producto del carrito.
 * @param {string} id - ID del producto a disminuir.
 */
function disminuirCantidad(id) {
    let idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
    
    // Encuentra el índice del primer elemento que coincide con el ID
    const indexToRemove = idsEnCarrito.findIndex(itemId => itemId === id);
    
    if (indexToRemove !== -1) {
        // Elimina solo ese elemento
        idsEnCarrito.splice(indexToRemove, 1); 
        localStorage.setItem('carritoIds', JSON.stringify(idsEnCarrito));
        // Vuelve a cargar el resumen para refrescar la vista
        cargarResumenDelCarrito();
    } else {
        // Opcional: Si el producto no se encuentra (no debería pasar), se puede limpiar o notificar.
        console.warn(`Intento de disminuir la cantidad de ID ${id}, pero no se encontró en el carrito.`);
    }
}

/**
 * Elimina TODAS las instancias de un producto específico del carrito.
 * @param {string} id - ID del producto a eliminar completamente.
 */
function eliminarProducto(id) {
    let idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
    
    // Filtra el array, manteniendo solo los IDs que NO coinciden con el ID a eliminar
    idsEnCarrito = idsEnCarrito.filter(itemId => itemId !== id);
    
    localStorage.setItem('carritoIds', JSON.stringify(idsEnCarrito));
    // Vuelve a cargar el resumen para refrescar la vista
    cargarResumenDelCarrito();
}


// =======================================================
// 4. MANEJADOR DE CLICKS DE BOTONES
// =======================================================

document.addEventListener("click", (e) => {
    const target = e.target;
    const id = target.getAttribute("data-id");

    if (!id) return; // Si no tiene data-id, no es un botón de control de producto

    if (target.classList.contains("plus-btn")) {
        aumentarCantidad(id);
    } else if (target.classList.contains("minus-btn")) {
        disminuirCantidad(id);
    } else if (target.classList.contains("remove-all-btn")) {
        eliminarProducto(id);
    }
    // Lógica del Menú y Logout (se mantiene abajo)
});


// =======================================================
// 5. LÓGICA DEL MENÚ Y LOGOUT
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