//Lado del cliente
const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
})

//Funcion para renderizar productos:

const renderProductos = (productos) => {
    const listaProductos = document.getElementById("listaProductos");
    listaProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                        <p> ${item.id} </p>
                        <p> ${item.title} </p>
                        <p> ${item.price} </p>
                        <button> Eliminar </button>
                        `
        listaProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", ()=> {
            eliminarProducto(item.id);
        })

    })
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

const agregarProducto = () => {
    // const producto = {
        title= document.getElementById("name").value,
        description= document.getElementById("description").value,
        price= document.getElementById("price").value,
        thumbnail= document.getElementById("thumbnail").value,
        code= document.getElementById("code").value,
        category= document.getElementById("category").value,
        stock= document.getElementById("stock").value,
    // };

    socket.emit("agregarProducto", title, description, price, thumbnail, code, category, stock);
}

//Agregamos productos desde el formulario
document.getElementById("btnEnviar").addEventListener("click", ()=> {
    agregarProducto();
})

