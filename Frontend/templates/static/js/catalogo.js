
// Carrito
let carrito = [];


function actualizarCarrito() {
    const contador = document.getElementById("cart-count");
    contador.textContent = carrito.length;
}

// Función para crear tarjetas
function cargarProductos(lista, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    lista.forEach((p, index) => {
        contenedor.innerHTML += `
            <div class="product-card">
                <img src="${p.rutaImagen}" alt="${p.nombreProd}">
                <p class="product-name">${p.nombreProd}</p>
                <button class="add-btn" data-id=${p.idProducto}" data-nombre="${p.nombreProd}">Agregar 🛒</button>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', async () => {

    // [MODIFICACIÓN CLAVE 2]: URL de tu API de Spring Boot
    const API_URL = 'http://localhost:8081/QuickCourier/Catalogo';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - No se pudo conectar con la API de productos.`);
        }
        
        // La lista completa de productos del backend (DTOs)
        const productos = await response.json(); 

        // 3. Filtrar y cargar: El JS filtra los productos por la categoría que viene en el DTO
        const libros = productos.filter(p => p.categoriaProd === 'Libros');
        const snacks = productos.filter(p => p.categoriaProd === 'Snacks');
        
        cargarProductos(libros, "libros-container");
        cargarProductos(snacks, "snacks-container");

    } catch (error) {
        console.error('Error al cargar datos del backend:', error);
        // Opcional: Mostrar un mensaje de error en la interfaz
        document.querySelector("main.contenedor").innerHTML = "<p>Hubo un problema al cargar el catálogo. Verifique la conexión del servidor.</p>";
    }
});
// Detectar clicks en los botones "Agregar"
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
        const idProducto = e.target.getAttribute("data-id");
        // const nombreProducto = e.target.getAttribute("data-nombre"); // Si lo necesitas
        carrito.push(idProducto); // Agregamos el ID del producto al carrito
        actualizarCarrito();
    }
});

// Menú
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
