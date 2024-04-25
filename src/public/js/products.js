const socket = io();

const agregarProductoAlCarrito = (productId) => {
    const cartIdElement = document.getElementById('cart-id');
    const cartId = cartIdElement.dataset.cartId;
    socket.emit('agregarAlCarrito', { productId, cartId });
    console.log('Producto con id: ' + productId + ' cargado al carrito con id:' + cartId + 'correctamente');
}


const botonAgregarAlCarrito = document.getElementById('agregar-btn');
botonAgregarAlCarrito.addEventListener('click', () => {
    agregarProductoAlCarrito(botonAgregarAlCarrito.dataset.productid);
});


