// Simulación de productos
const productosLibros = [
    {nombre: "Orgullo y Prejuicio", img: "static/img/libro1.jpg"},
    {nombre: "Sentido y Sensibilidad", img: "static/img/libro2.jpg"},
    {nombre: "What on earth am I here for?", img: "static/img/libro3.jpg"},
    {nombre: "Holy Bible", img: "static/img/libro4.jpg"},
    {nombre: "El hombre en busca de sentido", img: "static/img/libro5.jpg"},
    {nombre: "Vanish", img: "static/img/libro6.jpg"}
];

const productosSnacks = [
    {nombre: "Ferrero Rocher", img: "static/img/snack1.jpg"},
    {nombre: "Reese's Pop", img: "static/img/snack2.jpg"},
    {nombre: "Cornitos BBQ", img: "static/img/snack3.jpg"},
    {nombre: "Fidmi", img: "static/img/snack4.jpg"},
    {nombre: "Cornitos Lima", img: "static/img/snack5.jpg"},
    {nombre: "El Especial", img: "static/img/snack6.jpg"}
];

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
                <img src="${p.img}" alt="${p.nombre}">
                <p class="product-name">${p.nombre}</p>
                <button class="add-btn" data-nombre="${p.nombre}">Agregar 🛒</button>
            </div>
        `;
    });
}

// Cargar productos
cargarProductos(productosLibros, "libros-container");
cargarProductos(productosSnacks, "snacks-container");

// Detectar clicks en los botones "Agregar"
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
        const nombreProducto = e.target.getAttribute("data-nombre");
        carrito.push(nombreProducto);
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
