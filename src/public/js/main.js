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
                        <p> ${item.stock} </p>
                        <button id="eliminar-btn-${item._id}"> Eliminar </button>
                        <button id="actualizar-btn-${item._id}"> Actualizar </button>
                        `
        listaProductos.appendChild(card);

        const eliminarBtn = document.getElementById(`eliminar-btn-${item._id}`);
        const actualizarBtn = document.getElementById(`actualizar-btn-${item._id}`);

        eliminarBtn.addEventListener("click", ()=> {
            eliminarProducto(item._id);
        })

        actualizarBtn.addEventListener("click", () => {
            actualizarProducto(item);
        });

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

//actualizar producto

const actualizarProducto = (item) => {

    nuevoProducto = {
        title: document.getElementById("name").value || item.title,
        description: document.getElementById("description").value || item.description,
        price: document.getElementById("price").value || item.price,
        img: document.getElementById("img").value || item.img,
        code: document.getElementById("code").value || item.code,
        stock: document.getElementById("stock").value || item.stock,
        category: document.getElementById("category").value || item.category,
        thumbnail: document.getElementById("thumbnail").value || item.thumbnail
    }

    socket.emit("actualizarProducto", item._id, nuevoProducto);
}