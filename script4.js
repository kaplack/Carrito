var modelo;

// carrito click para mostrar carrito

const caritoIcon = document.querySelector(".car-icon");
const mobileMenu = document.querySelector(".car-compras");
const closeIcon = document.querySelector(".close");

caritoIcon.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

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
  storageCarrito(carritoArr);
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
  cantFotos.value = fotosNum;

  let st = document.getElementById("sub-total");
  st.value = stotal.toFixed(2);

  let igv = document.getElementById("igv");
  igvVal = stotal * 0.18;
  igv.value = igvVal.toFixed(2);

  let tot = document.getElementById("total");
  total = stotal * 1.18;
  tot.value = total.toFixed(2);
};

// guardar en localstorage
let storageCarrito = (carArr) => {
  let carritoJSON = JSON.stringify(carArr);
  localStorage.setItem("carrito", carritoJSON);
};

//REMOVER VALOR DEL ARRAY DEL CARRITO
let removeValue = (val, arrToRem = carritoArr) => {
  let newArr = arrToRem.filter((ele) => ele != val);
  //storageCarrito(newArr);
  return newArr;
};

let carritoArr = JSON.parse(localStorage.getItem("carrito"))
  ? JSON.parse(localStorage.getItem("carrito"))
  : [];

//lista de productos
let lista = document.getElementById("model-list");

//carrito
let carrito = document.getElementById("CarItems");
let delIcons = document.querySelectorAll(".del-icon");

// MOSTRANDO FOTOS A COMPRAR
const showModelo = () => {
  let modelItem = "";
  for (let i = 0; i < modelo.length; i++) {
    modelItem += `
      <li class="model">
          <img
            class="model__img"
            src="${modelo[i].url}"
            alt="preciosa modelo peruana en buso amarillo"
          />
          <div class="model__content"
            <div class="descripcion">
              <h2>${modelo[i].nombre}</h2>
              <p>${modelo[i].tipo}</p>
            </div>
            <div class="form">
              <form action="#" method="post" id="formAdd">
                <div class="id">
                  <input type="text" name="id" hidden value="${modelo[i].ID}">
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

        if (el.ID == e) {
          // Agrega nuevo item
          itemNode = `
      <div id="${el.ID}" class="item">
        <img
          class="item__img"
          src="${el.url}"
          alt=""
        />
        <div class="item__content">
          <h3>${el.nombre}</h3>
          <p class="descrip">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div class="precio-box">
                  <p>PEN</p>
                  <input id="prc" type="text" value="${el.precio}" readonly />
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

fetch("data/data.json")
  .then((res) => res.json())
  .then((data) => {
    modelo = data;

    showModelo();

    showCarrito(carritoArr);

    //Storage JSON

    //evento submit
    const forms = document.querySelectorAll("#formAdd");
    for (const el of forms) {
      el.addEventListener("submit", (event) => {
        event.preventDefault();
        carrito.innerHTML = "";
        carritoArr.push(parseInt(event.currentTarget.id.value));

        showCarrito(carritoArr);
        calculo();

        storageCarrito(carritoArr);
        Toastify({
          text: "Agregaste un articulo al carrito",
          className: "info",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      });
    }

    //evento eliminar event delegation

    carrito.addEventListener("click", (e) => {
      if (e.target.classList.contains("del-icon")) {
        e.target.parentElement.parentElement.parentElement.remove();
        carritoArr = removeValue(
          parseInt(e.target.parentElement.parentElement.parentElement.id),
          carritoArr
        );
        storageCarrito(carritoArr);
        calculo();
      }
    });
    if (JSON.parse(localStorage.getItem("carrito"))) {
      calculo();
    }
  });

//https://randomuser.me/ web de personas
//https://t.me/+U32Ru8shXAM4ZjAx Telegram de Adrian Escalante
//https://gonzabertinat.github.io/Argencoin-Bertinat/ ejemplo de proyecto final
//

/*
closeIcon.addEventListener("click", () => {
mobileMenu.classList.toggle("active");
});
*/
