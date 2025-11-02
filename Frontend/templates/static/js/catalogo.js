// src/main/resources/static/js/catalogo.js

// 1. FUNCIÓN DE ACTUALIZACIÓN VISUAL DEL CONTADOR
function actualizarCarrito() {
    // Lee la lista de IDs de productos del localStorage
    const idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
    
    const contador = document.getElementById("cart-count");
    contador.textContent = idsEnCarrito.length;
}

// 2. FUNCIÓN PARA CREAR LAS TARJETAS DE PRODUCTO
function cargarProductos(lista, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    // Limpiamos el contenedor antes de renderizar
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

// 3. FUNCIÓN PRINCIPAL DE INICIO (Carga de Datos)
document.addEventListener('DOMContentLoaded', async () => {

    // [¡IMPORTANTE! VERIFICA ESTA URL CON TU BACKEND]
    const API_URL = 'http://localhost:8081/QuickCourier/Productos/Catalogo'; 

    try {
        // Realizar la llamada a la API
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // La lista completa de ProductoDTOs
        const productos = await response.json(); 

        // Filtrar y cargar: El JS separa los productos por la categoría que viene en el DTO
        const libros = productos.filter(p => p.categoriaProd === 'Libros');
        const snacks = productos.filter(p => p.categoriaProd === 'Snacks');
        
        
        cargarProductos(libros, "libros-container");
        cargarProductos(snacks, "snacks-container");

    } catch (error) {
        console.error('Error al cargar datos del backend:', error);
        // Mostrar mensaje de error si falla la conexión
        document.querySelector("main.contenedor").innerHTML = "<p>Hubo un problema al cargar el catálogo. Verifique la conexión del servidor.</p>";
    }
    
    // Al finalizar la carga, actualizamos el contador del carrito
    actualizarCarrito(); 
});


// 4. MANEJADOR DE EVENTOS (Agregar al Carrito)
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
        // Obtenemos el ID del producto
        const idProducto = e.target.getAttribute("data-id"); 
        
        // 1. Obtener la lista actual de IDs desde localStorage
        let idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
        
        // 2. Agregar el nuevo ID 
        idsEnCarrito.push(idProducto); 
        
        // 3. Guardar la lista actualizada en localStorage
        localStorage.setItem('carritoIds', JSON.stringify(idsEnCarrito));
        
        // 4. Actualizar el contador visual
        actualizarCarrito();
    }
});


// 5. Lógica del Menú (Se mantiene igual, no necesita conexión con el Back-End)
const menuBtn = document.querySelector(".menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("overlay");

// Abrir menu
menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("open");
    overlay.classList.add("show");
});

// Cerrar menu
closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    overlay.classList.remove("show");
});

// Cerrar si hace click fuera
overlay.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    overlay.classList.remove("show");
});