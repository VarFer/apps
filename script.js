// ========== ⏰ RELOJ ACTUAL ========== //
function updateClock() {
  const now = new Date();
  document.getElementById("reloj").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// ========== 🔄 CONVERSOR DE UNIDADES ========== //
const unidades = {
  metrico: { "metros": 1, "kilómetros": 0.001, "centímetros": 100, "milímetros": 1000 },
  peso: { "kilogramos": 1, "gramos": 1000, "libras": 2.20462 },
  velocidad: { "km/h": 1, "m/s": 0.277778, "mph": 0.621371 }
};

const tipoConversion = document.getElementById("tipoConversion");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const inputValue = document.getElementById("inputValue");
const result = document.getElementById("result");

function cargarUnidades(tipo) {
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";
  Object.keys(unidades[tipo]).forEach(u => {
    const opt1 = new Option(u, u);
    const opt2 = new Option(u, u);
    fromUnit.add(opt1);
    toUnit.add(opt2);
  });
}
tipoConversion.addEventListener("change", () => cargarUnidades(tipoConversion.value));
inputValue.addEventListener("input", convertir);
fromUnit.addEventListener("change", convertir);
toUnit.addEventListener("change", convertir);

function convertir() {
  const tipo = tipoConversion.value;
  const valor = parseFloat(inputValue.value);
  const de = fromUnit.value;
  const a = toUnit.value;

  if (!isNaN(valor)) {
    const resultado = valor * (unidades[tipo][a] / unidades[tipo][de]);
    result.textContent = `Resultado: ${resultado.toFixed(4)}`;
  } else {
    result.textContent = "Resultado: -";
  }
}
cargarUnidades("metrico");

// ========== 🌍 CÁLCULO DE GRAVEDAD ========== //
function calcGravedad() {
  const masa = parseFloat(document.getElementById("mass").value);
  const distancia = parseFloat(document.getElementById("distance").value);
  const G = 6.67430e-11;
  if (masa && distancia) {
    const fuerza = (G * masa) / (distancia * distancia);
    document.getElementById("gravResult").textContent = `Resultado: ${fuerza.toExponential(3)} N`;
  } else {
    document.getElementById("gravResult").textContent = "Por favor completa ambos campos.";
  }
}

// ========== 🔍 VALIDACIÓN DE RUT CHILENO ========== //
function validarRUT() {
  const rutInput = document.getElementById("rutInput");
  const resultado = document.getElementById("rutResultado");
  let rut = rutInput.value.replace(/[^\dkK]/g, "").toUpperCase(); // Eliminar puntos y guiones

  if (!/^\d{7,8}[0-9K]$/.test(rut)) {
    resultado.textContent = "⚠️ Formato inválido. Usa formato 12345678K o 123456785.";
    return;
  }

  const cuerpo = rut.slice(0, -1);
  const dvIngresado = rut.slice(-1);

  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvCalculado = 11 - (suma % 11);
  const dvEsperado = dvCalculado === 11 ? "0" : dvCalculado === 10 ? "K" : dvCalculado.toString();

  if (dvIngresado === dvEsperado) {
    resultado.textContent = "✅ RUT válido";
  } else {
    resultado.textContent = "❌ RUT inválido. Dígito verificador incorrecto.";
  }
}

// Activar validador con ENTER
document.getElementById("rutInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") { // Detecta cuando se presiona la tecla "Enter"
    e.preventDefault(); // Evita el comportamiento predeterminado (como enviar un formulario)
    validarRUT(); // Llama a la función para validar el RUT
  }
});

// ========== 💰 PRODUCTOS Y PRESUPUESTO ========== //
// ========== 💰 PRODUCTOS Y PRESUPUESTO ========== //
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let productoEditando = null;

function actualizarTabla() {
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";
  let total = 0;

  productos.forEach((p, index) => {
    total += p.precio;
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.precio}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editarProducto(${index})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">Eliminar</button>
      </td>`;
    tbody.appendChild(fila);
  });

  document.getElementById("totalProductsAmount").textContent = total;
  const presupuesto = parseFloat(document.getElementById("budget").value) || 0;
  document.getElementById("totalAmount").textContent = total;
  document.getElementById("remainingAmount").textContent = (presupuesto - total).toFixed(2);
}

document.getElementById("productForm").addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("productName").value;
  const precio = parseFloat(document.getElementById("productPrice").value);

  if (!nombre || isNaN(precio)) return;

  if (productoEditando !== null) {
    productos[productoEditando] = { nombre, precio };
    productoEditando = null;
  } else {
    productos.push({ nombre, precio });
  }

  localStorage.setItem("productos", JSON.stringify(productos));
  actualizarTabla();
  e.target.reset();
});

function eliminarProducto(index) {
  productos.splice(index, 1);
  localStorage.setItem("productos", JSON.stringify(productos));
  actualizarTabla();
}

function editarProducto(index) {
  const producto = productos[index];
  document.getElementById("productName").value = producto.nombre;
  document.getElementById("productPrice").value = producto.precio;
  productoEditando = index;
}

document.getElementById("budget").addEventListener("input", actualizarTabla);
actualizarTabla();


// ========== 📝 NOTAS ========== //
const notes = JSON.parse(localStorage.getItem("notas")) || [];
const notesList = document.getElementById("notesList");

function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach((note, index) => {
    const item = document.createElement("div");
    item.className = "list-group-item bg-dark text-light";
    item.innerHTML = `
      <strong>${note.title}</strong><br>${note.content}
      <div class="mt-2">
        <button onclick="editNote(${index})" class="btn btn-sm btn-warning">Editar</button>
        <button onclick="deleteNote(${index})" class="btn btn-sm btn-danger">Eliminar</button>
      </div>`;
    notesList.appendChild(item);
  });
}
document.getElementById("noteForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  notes.push({ title, content });
  localStorage.setItem("notas", JSON.stringify(notes));
  renderNotes();
  e.target.reset();
});
function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notas", JSON.stringify(notes));
  renderNotes();
}
function editNote(index) {
  const note = notes[index];
  document.getElementById("noteTitle").value = note.title;
  document.getElementById("noteContent").value = note.content;
  deleteNote(index);
}
renderNotes();

// ========== ⏳ CUENTA REGRESIVA SALIDA TRABAJO ========== //
let countdownInterval;
function startCountdown() {
  const salida = document.getElementById("hourInput").value;
  if (!salida) return;
  const [h, m] = salida.split(":").map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const now = new Date();
    let diff = Math.floor((target - now) / 1000);
    if (diff <= 0) {
      clearInterval(countdownInterval);
      document.getElementById("countdown").textContent = "¡Hora de salir!";
    } else {
      const hrs = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
      document.getElementById("countdown").textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
  }, 1000);
}
function pad(n) {
  return n < 10 ? "0" + n : n;
}

// ========== 🌎 HORA POR CIUDAD (extra) ========== //
function mostrarHoraPorCiudad() {
  const zona = document.getElementById("ciudad").value;
  const ahora = new Date().toLocaleTimeString("es-CL", { timeZone: zona });
  document.getElementById("horaCiudad").textContent = "Hora actual: " + ahora;
}


let score = 0;
let correctType = "";  // Puede ser 'par' o 'impar'

const balloonArea = document.getElementById("balloonArea");
const scoreDisplay = document.getElementById("score");
const gameInfo = document.getElementById("gameInfo");

// Generar un globo con un número aleatorio
function createBalloon() {
  const balloon = document.createElement("div");
  const balloonNumber = Math.floor(Math.random() * 100) + 1;  // Número aleatorio entre 1 y 100
  balloon.textContent = balloonNumber;
  balloon.classList.add("balloon");

  // Determinar si el número es par o impar y asignar clase
  if (balloonNumber % 2 === 0) {
    balloon.classList.add("even");
  } else {
    balloon.classList.add("odd");
  }

  // Posicionar el globo en una posición aleatoria en el área
  const xPos = Math.random() * (balloonArea.offsetWidth - 60);  // 60 es el ancho del globo
  balloon.style.left = `${xPos}px`;
  balloon.style.animation = "float 3s infinite ease-in-out";  // Animación de flotación

  balloon.addEventListener("click", function () {
    // Verificar si el jugador hizo clic en el globo correcto
    if ((correctType === "par" && balloonNumber % 2 === 0) ||
      (correctType === "impar" && balloonNumber % 2 !== 0)) {
      score += balloonNumber;  // Sumar el valor del globo al puntaje
      gameInfo.textContent = "¡Correcto!";
    } else {
      score -= balloonNumber;  // Restar el valor del globo al puntaje
      gameInfo.textContent = "¡Incorrecto!";
    }

    scoreDisplay.textContent = score;  // Actualizar el puntaje
    balloon.remove();  // Eliminar el globo del área después de hacer clic
  });

  balloonArea.appendChild(balloon);  // Agregar el globo al área
}

// Función para cambiar aleatoriamente si el jugador debe hacer clic en globos pares o impares
function setCorrectType() {
  // Decidir aleatoriamente si debe ser "par" o "impar"
  correctType = Math.random() < 0.5 ? "par" : "impar";

  if (correctType === "par") {
    gameInfo.textContent = "¡Haz clic en los globos con números pares!";
  } else {
    gameInfo.textContent = "¡Haz clic en los globos con números impares!";
  }
}

// Generar globos a intervalos aleatorios
setInterval(() => {
  setCorrectType();  // Cada vez que se genera un nuevo globo, cambia el tipo correcto
  createBalloon();
}, 1500);  // Genera un globo cada 1.5 segundos

