let modelo;

let carritoArr = JSON.parse(localStorage.getItem("carrito"))
  ? JSON.parse(localStorage.getItem("carrito"))
  : [];

const caritoIcon = document.querySelector(".car-icon");
const mobileMenu = document.querySelector(".car-compras");
const closeIcon = document.querySelector(".close");
const carNumber = document.querySelector(".carrito-number");

// carrito click para mostrar carrito
window.addEventListener("click", (ec) => {
  if (
    !mobileMenu.contains(ec.target) &&
    mobileMenu.classList.contains("active")
  ) {
    mobileMenu.classList.remove("active");
  } else if (ec.target == caritoIcon) {
    mobileMenu.classList.add("active");
  }
});

// guardar en localstorage //Storage JSON
let storageCarrito = (name, carArr) => {
  let carritoJSON = JSON.stringify(carArr);
  localStorage.setItem(name, carritoJSON);
};

//CAMBIO EN EL INPUT DE CANTIDAD
let cambioQ = (idFoto) => {
  let qty = 0;
  let carItems = document.querySelectorAll(".item");
  //limpia el array del carrito
  carritoArr = [];
  //re-escribe el array del carrito
  carItems.forEach((car) => {
    qty = car.querySelector(".cantidad").value;
    for (let i = 0; i < qty; i++) {
      carritoArr.push(parseInt(car.id));
    }
  });
  //calcula el total
  calculo();
  storageCarrito("carrito", carritoArr);
};

//Calculo del total e impuesto
let calculo = () => {
  let stotal = 0;
  let igvVal = 0;
  let total = 0;
  let fotosNum = 0;
  let items = document.querySelectorAll("#cant");
  let prices = document.querySelectorAll("#prc");
  //console.log(items.length);
  for (i = 0; i <= items.length - 1; i++) {
    stotal += items[i].value * prices[i].value;
    fotosNum += parseFloat(items[i].value);
  }

  let cantFotos = document.getElementById("cant-hd");
  cantFotos.innerText = fotosNum;

  let st = document.getElementById("sub-total");
  st.value = stotal.toFixed(2);

  let igv = document.getElementById("igv");
  igvVal = stotal * 0.18;
  igv.value = igvVal.toFixed(2);

  let tot = document.getElementById("total");
  total = stotal * 1.18;
  tot.value = total.toFixed(2);
};

//REMOVER VALOR DEL ARRAY DEL CARRITO
let removeValue = (val, arrToRem = carritoArr) => {
  let newArr = arrToRem.filter((ele) => ele != val);
  //storageCarrito(newArr);
  return newArr;
};

//lista de productos
let lista = document.getElementById("model-list");

//carrito
let carrito = document.getElementById("CarItems");
let delIcons = document.querySelectorAll(".del-icon");

// MOSTRANDO FOTOS A COMPRAR
const showModelo = () => {
  lista.innerHTML = "";
  let modelItem = "";
  for (let i = 0; i < modelo.length; i++) {
    let calcPrecio = modelo[i].precio / moneda.value;
    calcPrecio = calcPrecio.toFixed(2);
    modelItem += `
      <li class="model">
          <img
            class="model__img"
            src="${modelo[i].url}"
            alt="${modelo[i].detalle}"
          />
          <div class="model__content">
            <div class="descripcion">
              <h2>${modelo[i].nombre}</h2>
              <p>${modelo[i].tipo}</p>
              <div class="tipo-cambio">
              <span id="cur"> ${
                monedaDiv.querySelector("#tipo_cambio").options[
                  monedaDiv.querySelector("#tipo_cambio").selectedIndex
                ].text
              }</span><input disabled value="${calcPrecio}" />
              </div>
            </div>
            <div class="form">
              <form action="#" method="post" id="formAdd">
                <div class="id">
                  <input class="id-input" type="text" name="id" hidden value="${
                    modelo[i].ID
                  }">
                </div>
                <!--
                <div class="pic-size">
                  <label for="size">Seleciona el tamaño de la foto</label>
                  <select name="size" id="size">
                    <option value="" selected disabled>
                      Selecciona un tamaño
                    </option>
                    <option value="large">1920x1080</option>
                    <option value="medium">1200x675</option>
                    <option value="small">800x450</option>
                  </select>
                </div>
                -->
                <div class="enviar">
                  <input id="agregar" type="submit" value="Agregar al carrito" />
                </div>
              </form>
            </div>
          </div>
        </li>
`;
  }
  lista.insertAdjacentHTML("afterbegin", modelItem);
};

//Carrito
let showCarrito = (arr) => {
  let arrUnic = new Set(arr);
  arrUnic = [...arrUnic];
  //console.log(arrUnic);

  if (arr.length) {
    arrUnic.forEach((e) => {
      //cuenta el id de la modelo, asi obtenemos la cantidad de cada una
      let filter = arr.filter((arrC) => arrC == e);
      let cantidad = filter.length;

      modelo.forEach((el) => {
        let itemNode;
        let result = el.precio / moneda.value;
        result = result.toFixed(2);
        if (el.ID == e) {
          // Agrega nuevo item
          itemNode = `
      <div id="${el.ID}" class="item">
        <img
          class="item__img"
          src="${el.url}"
          alt="${el.detalle}"
        />
        <div class="item__content">
          <h3>${el.nombre}</h3>
          <p class="descrip">
            ${el.detalle}
          </p>
          <div class="precio-box">
                  <p>${
                    monedaDiv.querySelector("#tipo_cambio").options[
                      monedaDiv.querySelector("#tipo_cambio").selectedIndex
                    ].text
                  }</p>
                  <input id="prc" type="text" value="${result}" readonly />
                </div>
          <div class="btns">
            <input
              id="cant"
              class="cantidad"
              type="number"
              value="${cantidad}"
              min="1"
              onchange="cambioQ(${el.ID})"
            />
            <span class="material-icons-outlined del-icon"> delete </span>
          </div>
        </div>
      </div>
        `;

          carrito.insertAdjacentHTML("beforeend", itemNode);

          //Actualiza item existente
        }
      });
    });
  }
};

//AVISO DE COMPRA
let avisoCompra = () => {
  Toastify({
    text: "Agregaste un articulo al carrito",
    className: "info",
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
};

const moneda = document.getElementById("tipo_cambio");
moneda.addEventListener("change", () => {
  console.log(moneda.value);
  showModelo();
  carrito.innerHTML = "";
  showCarrito(carritoArr);
  calculo();
});

//evento eliminar event delegation
carrito.addEventListener("click", (elemento) => {
  if (elemento.target.classList.contains("del-icon")) {
    carritoArr = removeValue(
      parseInt(elemento.target.parentElement.parentElement.parentElement.id),
      carritoArr
    );
    storageCarrito("carrito", carritoArr);
    elemento.target.parentElement.parentElement.parentElement.remove();

    calculo();
  }
});

//evento submit
lista.addEventListener("click", (e) => {
  if (e.target.id == "agregar") {
    e.preventDefault();
    carrito.innerHTML = "";
    carritoArr.push(
      parseInt(
        e.target.parentElement.parentElement.querySelector(".id-input").value
      )
    );
    showCarrito(carritoArr);
    calculo();
    storageCarrito("carrito", carritoArr);
    avisoCompra();
  }
});

const monedaDiv = document.querySelector(".moneda");

let getRate = async () => {
  const resRate = await fetch(
    `http://api.exchangeratesapi.io/v1/latest?access_key=a608b102616209b3068fa0cb3cb43cfd&symbols=USD,PEN,EUR`
  );

  const resData = await resRate.json();
  //La información llega en base al Euro
  //tipo de cambio en base al sol peruano (PEN)
  let penToUSD = resData.rates.PEN / resData.rates.USD;
  let penToEUR = resData.rates.PEN / resData.rates.EUR;
  let htmlTC = `
    <option value=${penToUSD.toFixed(2)} data-usd = ${penToUSD}>USD</option>
    <option value=${penToEUR.toFixed(2)} data-eur = ${penToEUR}>EUR</option>
  `;
  moneda.insertAdjacentHTML("beforeend", htmlTC);

  //storageCarrito("tc", tc);
};
getRate();

// render all
const render = () => {
  fetch("data/data.json")
    .then((res) => res.json())
    .then((data) => {
      modelo = data;

      showModelo();

      showCarrito(carritoArr);

      calculo();
    });
};
render();
