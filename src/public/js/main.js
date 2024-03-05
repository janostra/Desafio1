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
                        <p> ${item._id} </p>
                        <p> ${item.title} </p>
                        <p> ${item.price} </p>
                        <button> Eliminar </button>
                        `
        listaProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", ()=> {
            eliminarProducto(item._id);
        })

    })
}

//Funcion para eliminar productos:

const eliminarProducto = (_id) => {
    socket.emit("eliminarProducto", _id);
}

//Funcion para Agregar productos:

const agregarProducto = () => {
        title= document.getElementById("name").value,
        description= document.getElementById("description").value,
        price= document.getElementById("price").value,
        img= document.getElementById("img").value,
        code= document.getElementById("code").value,
        stock= document.getElementById("stock").value,
        category= document.getElementById("category").value,
        thumbnail= document.getElementById("thumbnail").value

    socket.emit("agregarProducto", title, description, price, img, code, stock ,category, thumbnail);
}

//Agregamos productos desde el formulario
document.getElementById("btnEnviar").addEventListener("click", ()=> {
    agregarProducto();
})

