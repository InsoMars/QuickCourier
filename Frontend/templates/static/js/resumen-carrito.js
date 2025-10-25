// Productos de ejemplo
const productos = [
    {
        nombre: "Orgullo y Prejuicio",
        descripcion: "Penguin Random House",
        precio: 65000,
        img: "static/img/libro1.jpg",
        cantidad: 1
    },
    {
        nombre: "Bombones FERRERO ROCHER",
        descripcion: "FERRERO ROCHER",
        precio: 50000,
        img: "static/img/chocolates.jpg",
        cantidad: 1
    }
];

const tbody = document.getElementById('resumen-carrito-body');
const subtotalSpan = document.getElementById('resumen-carrito-subtotal');
const totalSpan = document.getElementById('resumen-carrito-total');
const countSpan = document.getElementById('resumen-carrito-count');

function renderCarrito() {
    tbody.innerHTML = '';
    let subtotal = 0;
    productos.forEach((producto, index) => {
        subtotal += producto.precio * producto.cantidad;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.img}" alt="${producto.nombre}">
                <div>
                    <strong>${producto.nombre}</strong><br>
                    <small>${producto.descripcion}</small>
                </div>
            </td>
            <td>$${producto.precio.toLocaleString()}</td>
            <td>
                <div class="cantidad-btn">
                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span>${producto.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    subtotalSpan.textContent = `$${subtotal.toLocaleString()}`;
    totalSpan.textContent = `$${subtotal.toLocaleString()}`;
    countSpan.textContent = productos.length;
}

function cambiarCantidad(index, delta) {
    productos[index].cantidad += delta;
    if (productos[index].cantidad < 1) productos[index].cantidad = 1;
    renderCarrito();
}

// Inicializar
renderCarrito();


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
