let containerCards = document.querySelector(".container__cards");

let templateCards = document.querySelector("#templateCards");

let fragment = document.createDocumentFragment();
let btnVaciarCarrito = document.querySelector(".compra-mensaje");
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fecthDatos();
});

const fecthDatos = async () => {
  try {
    let datos = await fetch("https://fakestoreapi.com/products/");

    let respuesta = await datos.json();
    // console.log(respuesta);
    pintarProductos(respuesta);
  } catch (error) {
    console.log(error);
  }
};

const pintarProductos = (respuesta) => {
  respuesta.forEach((product) => {
    // console.log(product)
    let clone = templateCards.content.cloneNode(true);
    clone.querySelector("img").setAttribute("src", product.image);

    clone.querySelector(".title__product").textContent = product.title;
    clone.querySelector(".btnAgregar").dataset.id = product.id;
    clone.querySelector(".precio").textContent = product.price;
    fragment.appendChild(clone);
  });
  containerCards.appendChild(fragment);
};

containerCards.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnAgregar")) {
    btnVaciarCarrito.style.display = "block";

    let elementos = e.target.parentElement;
    setCarrito(elementos);
  }
});

let setCarrito = (elementos) => {
  let infoCarrito = {
    imagen: elementos.querySelector("img").src,
    id: elementos.querySelector(".btnAgregar").dataset.id,
    title: elementos.querySelector(".title__product").textContent,
    precio: elementos.querySelector(".precio").textContent,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(infoCarrito.id)) {
    //  infoCarrito.cantidad = carrito[infoCarrito.id].cantidad + 1;

    //alert('El  item ya esta en el carrito');
    let modal = document.querySelector(".modal");
    modal.style.transform = "translateY(0)";

    let btnModal = document.querySelector(".btnModal");
    btnModal.addEventListener("click", () => {
      modal.style.transform = "translateY(-100%)";
    });
  }

  carrito[infoCarrito.id] = infoCarrito;

  // console.log(carrito);
  // console.log(infoCarrito)
  pintarLista();
};

//Lista de productos comprados:
let listaProductos = document.querySelector(".container_product-buy");
let templateLista = document.querySelector("#templateLista");
let vaciarCarrito = document.querySelector(".vaciarCart");

let pintarLista = (infoCarrito) => {
  listaProductos.innerHTML = null;

  if (Object.keys(carrito).length === 0) {
    btnVaciarCarrito.style.display = "none";
    pintarLista();
  }
  Object.values(carrito).forEach((item) => {
    let clone = templateLista.content.cloneNode(true);
    clone.querySelector(".imgLista").setAttribute("src", item.imagen);
    clone.querySelector(".nombre").textContent = item.title;
    clone.querySelector(".price").textContent = item.precio;
    clone.querySelector(".btnMas").dataset.id = item.id;
    clone.querySelector(".btnMenos").dataset.id = item.id;
    clone.querySelector(".count").textContent = item.cantidad;
    clone.querySelector(".valorTotal").textContent =
      item.cantidad * item.precio;

    fragment.appendChild(clone);
  });

  listaProductos.appendChild(fragment);

  vaciarCarrito.addEventListener("click", () => {
    carrito = {};
    pintarLista();
  });

  const ncantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );
  console.log(nPrecio);

  let subtotal = document.querySelector(".Subtotal");
  subtotal.innerHTML = `${nPrecio}`
};

listaProductos.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnMas")) {
    const product = carrito[e.target.dataset.id];

    product.cantidad = carrito[e.target.dataset.id].cantidad + 1;

    carrito[e.target.dataset.id] = { ...product };
    pintarLista();
  }

  if (e.target.classList.contains("btnMenos")) {
    const product = carrito[e.target.dataset.id];

    product.cantidad = carrito[e.target.dataset.id].cantidad - 1;

    if (product.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }

    pintarLista();
  }
});
