// Simulación de productos
const productosLibros = [
    {nombre: "Orgullo y Prejuicio", "categoria": "Libros", "img": "static/img/orgullo_prejuicio.jfif" },
    {nombre: "Sentido y Sensibilidad", "categoria": "Libros", "img": "static/img/sentido_sensibilidad.jfif" },
    {nombre: "What on earth am I here for?", img: "static/img/what_on_earth.png"},
    {nombre: "Holy Bible", img: "static/img/holy_bible.jfif"},
    {nombre: "El hombre en busca de sentido", img: "static/img/el_hombre_en_busca_de_sentido.jfif"},
    {nombre: "Vanish", img: "static/img/vanish.jfif"}
];

const productosSnacks = [
    {nombre: "Ferrero Rocher", "categoria": "Snacks", "img": "static/img/ferrero_rocher.jfif" },
    {nombre: "Reese's Pop", "categoria": "Snacks", "img": "static/img/reeses_pop.jpg" },
    {nombre: "Cornitos BBQ", img: "static/img/cornitos_pop.png"},
    {nombre: "Fidmi", img: "static/img/fidmi.jfif"},
    {nombre: "Cornitos Lima", img: "static/img/cornitos_lima.webp"},
    {nombre: "El Especial", img: "static/img/la_especial.webp"}
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
