const socket = io();

const agregarProductoAlCarrito = (productId) => {
    socket.emit('agregarAlCarrito', { productId });
    console.log('Producto con id: ' + productId + ' cargado correctamente');
}


const botonAgregarAlCarrito = document.getElementById('agregar-btn');
botonAgregarAlCarrito.addEventListener('click', () => {
    agregarProductoAlCarrito(botonAgregarAlCarrito.dataset.productid);
});


