// Variables 
let batchSize = 10;
const grids = {
    Libros: document.getElementById("libros-container"),
    Snacks: document.getElementById("snacks-container"),
    Accesorios: document.getElementById("accesorios-container")
};
let productosGlobal = { Libros: [], Snacks: [], Accesorios: [] };
let indices = { Libros: 0, Snacks: 0, Accesorios: 0 };

//carrito
function actualizarCarrito() {
    const idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
    const contador = document.getElementById("cart-count");
    if (contador) contador.textContent = idsEnCarrito.length;
}

// cargar los productos 
function cargarProductosBatch(categoria) {
    const contenedor = grids[categoria];
    const productos = productosGlobal[categoria];
    const start = indices[categoria];
    const end = Math.min(start + batchSize, productos.length);
    for (let i = start; i < end; i++) {
        const p = productos[i];
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
            <img src="${p.rutaImagen}" alt="${p.nombreProd}">
            <p class="product-name">${p.nombreProd}</p>
            <button class="add-btn" data-id="${p.idProducto}" data-nombre="${p.nombreProd}">Agregar 🛒</button>
        `;
        contenedor.appendChild(div);
    }
    indices[categoria] = end;
}

// DOMContentLoaded 
document.addEventListener('DOMContentLoaded', async () => {
    actualizarCarrito();
    const API_URL = 'http://localhost:8081/QuickCourier/Productos/Catalogo';
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) { window.location.href = 'index.html'; return; }

    try {
        const resp = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${accessToken}` } });
        if (!resp.ok) throw new Error("Error al cargar productos");
        const productos = await resp.json();
        productosGlobal.Libros = productos.filter(p => p.categoriaProd === 'Libros');
        productosGlobal.Snacks = productos.filter(p => p.categoriaProd === 'Snacks');
        productosGlobal.Accesorios = productos.filter(p => p.categoriaProd === 'Accesorios');

        cargarProductosBatch("Libros");
        cargarProductosBatch("Snacks");
        cargarProductosBatch("Accesorios");
    } catch (err) { console.error(err); }

   
    Object.keys(grids).forEach(categoria => {
        const grid = grids[categoria];
        grid.addEventListener("scroll", () => {
            if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 5) {
                cargarProductosBatch(categoria);
            }
        });
    });
});

// agregar productos al carrito 

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
        const idProducto = e.target.dataset.id;
        const ids = JSON.parse(localStorage.getItem('carritoIds') || '[]');
        ids.push(idProducto);
        localStorage.setItem('carritoIds', JSON.stringify(ids));
        actualizarCarrito();
    }
});

// lógica del menú lateral 
const menuBtn = document.querySelector(".menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("overlay");
if (menuBtn && sideMenu && closeMenu && overlay) {
    menuBtn.addEventListener("click", () => { sideMenu.classList.add("open"); overlay.classList.add("show"); });
    closeMenu.addEventListener("click", () => { sideMenu.classList.remove("open"); overlay.classList.remove("show"); });
    overlay.addEventListener("click", () => { sideMenu.classList.remove("open"); overlay.classList.remove("show"); });
}

// cerrar sesión 

async function logoutUser() {
    const accessToken = localStorage.getItem('accessToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('carritoIds');
    actualizarCarrito();
    if (accessToken) {
        try { await fetch('http://localhost:8081/auth/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${accessToken}` } }); }
        catch (err) { console.error(err); }
    }
    window.location.href = 'index.html';
}
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
