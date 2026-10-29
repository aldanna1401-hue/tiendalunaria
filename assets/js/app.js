/* =========================================================
   LUNARIA · Lógica de la tienda
   Catálogo, filtros, búsqueda, cesta y favoritos.
   Todo se guarda en localStorage (sin servidor).
   ========================================================= */

(() => {
  "use strict";

  /* ---------------- Datos ---------------- */

  const ICONOS = {
    camiseta: '<path d="M35 22 50 16 65 22 80 29 74 44 65 40V86H35V40l-9 4-6-15z"/>',
    camisa:
      '<path d="M35 22 50 16 65 22 80 29 74 44 65 40V86H35V40l-9 4-6-15z"/>' +
      '<path d="M50 16 43 34l7 8 7-8z" fill="rgba(27,25,23,.16)"/>' +
      '<path d="M50 42v44" stroke="currentColor" stroke-width="1.4" opacity=".35" fill="none"/>',
    vestido: '<path d="M38 18 50 14 62 18l4 12-8 12 16 44H26l16-44-8-12z"/>',
    pantalon: '<path d="M32 18h36l4 68H58L50 52 42 86H28z"/>',
    chaqueta:
      '<path d="M35 22 50 16 65 22 80 29 74 44 65 40V86H35V40l-9 4-6-15z"/>' +
      '<path d="M50 22v64" stroke="currentColor" stroke-width="1.6" opacity=".4" fill="none"/>' +
      '<path d="M50 22 40 36l6 6z" fill="rgba(27,25,23,.16)"/>',
    sudadera:
      '<path d="M35 26 50 20 65 26 80 33 74 48 65 44v42H35V44l-9 4-6-15z"/>' +
      '<path d="M40 26q10 9 20 0" fill="none" stroke="currentColor" stroke-width="2" opacity=".45"/>',
    falda:
      '<path d="M35 24h30l14 62H21z"/>' +
      '<path d="M35 32h30" stroke="currentColor" stroke-width="2" opacity=".3" fill="none"/>',
    zapatilla: '<path d="M18 68q2-14 18-14l14 8 18-8q12 2 14 14v10H18z"/>',
    bolso:
      '<path d="M30 42h40l6 44H24z"/>' +
      '<path d="M38 42q0-20 12-20t12 20" fill="none" stroke="currentColor" stroke-width="3" opacity=".6"/>',
    gorra:
      '<path d="M18 62q0-30 32-30t32 30z"/>' +
      '<path d="M82 62q10 0 12 8H82z"/>',
    jersey:
      '<path d="M35 24 50 18 65 24 80 31 74 46 65 42v44H35V42l-9 4-6-15z"/>' +
      '<path d="M35 42h30M35 58h30" stroke="currentColor" stroke-width="1.2" opacity=".25" fill="none"/>',
    blazer:
      '<path d="M35 22 50 16 65 22 80 29 74 44 65 40V86H35V40l-9 4-6-15z"/>' +
      '<path d="M50 20 38 40l8 6 4-26 4 26 8-6z" fill="rgba(27,25,23,.14)"/>',
  };

  const CATEGORIAS = { mujer: "Mujer", hombre: "Hombre", accesorios: "Accesorios" };

  const PRODUCTOS = [
    { id: "camiseta-alba", nombre: "Camiseta Alba", categoria: "mujer", tipo: "camiseta", tipoNombre: "Camisetas", precio: 24.9, etiqueta: "Nuevo", c1: "#e3cfb4", c2: "#b98a60", tallas: ["XS", "S", "M", "L", "XL"] },
    { id: "camisa-marea", nombre: "Camisa Marea", categoria: "hombre", tipo: "camisa", tipoNombre: "Camisas", precio: 49.9, etiqueta: null, c1: "#cdd6c7", c2: "#84927c", tallas: ["S", "M", "L", "XL", "XXL"] },
    { id: "vestido-luna", nombre: "Vestido Luna", categoria: "mujer", tipo: "vestido", tipoNombre: "Vestidos", precio: 79.9, etiqueta: "Más vendido", c1: "#e2c4bc", c2: "#b57d74", tallas: ["XS", "S", "M", "L"] },
    { id: "pantalon-terra", nombre: "Pantalón Terra", categoria: "mujer", tipo: "pantalon", tipoNombre: "Pantalones", precio: 59.9, etiqueta: null, c1: "#d2c8b5", c2: "#9c8c73", tallas: ["XS", "S", "M", "L", "XL"] },
    { id: "chaqueta-norte", nombre: "Chaqueta Norte", categoria: "hombre", tipo: "chaqueta", tipoNombre: "Chaquetas", precio: 89.9, etiqueta: "Nuevo", c1: "#b8c6d0", c2: "#7b8f9e", tallas: ["S", "M", "L", "XL"] },
    { id: "sudadera-nube", nombre: "Sudadera Nube", categoria: "hombre", tipo: "sudadera", tipoNombre: "Sudaderas", precio: 54.9, etiqueta: null, c1: "#d9d0c4", c2: "#a2937f", tallas: ["S", "M", "L", "XL", "XXL"] },
    { id: "falda-sol", nombre: "Falda Sol", categoria: "mujer", tipo: "falda", tipoNombre: "Faldas", precio: 45.9, etiqueta: null, c1: "#e6cfb2", c2: "#c09268", tallas: ["XS", "S", "M", "L"] },
    { id: "zapatillas-paseo", nombre: "Zapatillas Paseo", categoria: "accesorios", tipo: "zapatilla", tipoNombre: "Calzado", precio: 69.9, etiqueta: "Más vendido", c1: "#cbc3d2", c2: "#8d84a0", tallas: ["36", "37", "38", "39", "40", "41", "42"] },
    { id: "bolso-lino", nombre: "Bolso Lino", categoria: "accesorios", tipo: "bolso", tipoNombre: "Bolsos", precio: 39.9, etiqueta: null, c1: "#d8ccb7", c2: "#a8977c", tallas: ["Única"] },
    { id: "gorra-campo", nombre: "Gorra Campo", categoria: "accesorios", tipo: "gorra", tipoNombre: "Sombreros", precio: 22.9, etiqueta: null, c1: "#c4cdc1", c2: "#87947f", tallas: ["Única"] },
    { id: "jersey-bruma", nombre: "Jersey Bruma", categoria: "hombre", tipo: "jersey", tipoNombre: "Jerséis", precio: 64.9, etiqueta: null, c1: "#dcc2b6", c2: "#a97f6c", tallas: ["S", "M", "L", "XL"] },
    { id: "blazer-ciudad", nombre: "Blazer Ciudad", categoria: "mujer", tipo: "blazer", tipoNombre: "Chaquetas", precio: 99.9, etiqueta: "Edición limitada", c1: "#c2c7ce", c2: "#828b96", tallas: ["XS", "S", "M", "L"] },
  ];

  const CLAVE_CESTA = "lunaria:cesta:v1";
  const CLAVE_FAVORITOS = "lunaria:favoritos:v1";
  const ENVIO_GRATIS = 60;
  const COSTE_ENVIO = 4.95;

  const formatoPrecio = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  });

  const $ = (selector, contexto = document) => contexto.querySelector(selector);
  const $$ = (selector, contexto = document) => [...contexto.querySelectorAll(selector)];

  /* ---------------- Estado ---------------- */

  function leer(clave, respaldo) {
    try {
      const dato = JSON.parse(localStorage.getItem(clave));
      return Array.isArray(dato) ? dato : respaldo;
    } catch {
      return respaldo;
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      /* Almacenamiento no disponible: la tienda sigue funcionando en memoria. */
    }
  }

  const estado = {
    filtro: "todo",
    busqueda: "",
    favoritos: new Set(leer(CLAVE_FAVORITOS, [])),
    cesta: leer(CLAVE_CESTA, []).filter(
      (item) => item && typeof item.id === "string" && typeof item.talla === "string" && Number(item.cantidad) > 0
    ),
  };

  /* ---------------- Referencias del DOM ---------------- */

  const refs = {
    cabecera: $("#cabecera"),
    menuBtn: $("#menu-btn"),
    nav: $("#nav"),
    productos: $("#productos"),
    sinResultados: $("#sin-resultados"),
    cuenta: $("#resultado-cuenta"),
    busqueda: $("#busqueda"),
    filtros: $$(".filtro"),
    abrirCesta: $("#abrir-cesta"),
    contador: $("#contador-cesta"),
    cesta: $("#cesta"),
    cerrarCesta: $("#cerrar-cesta"),
    capa: $("#capa"),
    listaCesta: $("#cesta-lista"),
    cestaVacia: $("#cesta-vacia"),
    cestaCuenta: $("#cesta-cuenta"),
    subtotal: $("#subtotal"),
    envio: $("#envio"),
    total: $("#total"),
    envioNota: $("#envio-nota"),
    pagar: $("#pagar"),
    seguirComprando: $("#seguir-comprando"),
    aviso: $("#aviso-flotante"),
    boletin: $("#boletin"),
    boletinMensaje: $("#boletin-mensaje"),
    anio: $("#anio"),
  };

  let ultimoFoco = null;
  let temporizadorAviso = null;

  /* ---------------- Utilidades ---------------- */

  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const icono = (tipo) => `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${ICONOS[tipo] || ICONOS.camiseta}</svg>`;

  const claveItem = (item) => `${item.id}|${item.talla}`;

  function avisar(mensaje) {
    refs.aviso.textContent = mensaje;
    refs.aviso.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => refs.aviso.classList.remove("visible"), 2600);
  }

  /* ---------------- Catálogo ---------------- */

  function productosVisibles() {
    const busqueda = normalizar(estado.busqueda.trim());

    return PRODUCTOS.filter((producto) => {
      const coincideCategoria = estado.filtro === "todo" || producto.categoria === estado.filtro;
      if (!coincideCategoria) return false;
      if (!busqueda) return true;

      const texto = normalizar(`${producto.nombre} ${producto.tipoNombre} ${CATEGORIAS[producto.categoria]}`);
      return texto.includes(busqueda);
    });
  }

  function crearTarjeta(producto) {
    const esFavorito = estado.favoritos.has(producto.id);
    const tallas = producto.tallas
      .map(
        (talla, i) =>
          `<button class="talla" type="button" data-talla="${talla}" aria-pressed="${i === 0}">${talla}</button>`
      )
      .join("");

    return `
      <article class="producto" data-id="${producto.id}" data-talla="${producto.tallas[0]}">
        <div class="producto__media" style="--c1:${producto.c1};--c2:${producto.c2}">
          ${producto.etiqueta ? `<span class="producto__etiqueta">${producto.etiqueta}</span>` : ""}
          <button class="producto__fav" type="button" aria-pressed="${esFavorito}" aria-label="${
            esFavorito ? "Quitar" : "Añadir"
          } ${producto.nombre} de favoritos">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 20s-7-4.6-7-9.4A4 4 0 0 1 12 7a4 4 0 0 1 7 3.6C19 15.4 12 20 12 20Z" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="producto__icono">${icono(producto.tipo)}</div>
        </div>
        <div class="producto__info">
          <div class="producto__fila">
            <h3 class="producto__nombre">${producto.nombre}</h3>
            <span class="producto__precio">${formatoPrecio.format(producto.precio)}</span>
          </div>
          <p class="producto__cat">${CATEGORIAS[producto.categoria]} · ${producto.tipoNombre}</p>
          <div class="tallas" role="group" aria-label="Talla de ${producto.nombre}">${tallas}</div>
          <button class="producto__anadir" type="button">Añadir a la cesta</button>
        </div>
      </article>
    `;
  }

  function renderProductos() {
    const visibles = productosVisibles();

    refs.productos.innerHTML = visibles.map(crearTarjeta).join("");
    refs.sinResultados.hidden = visibles.length > 0;
    refs.cuenta.textContent = `${visibles.length} ${visibles.length === 1 ? "prenda" : "prendas"}`;
  }

  function aplicarFiltro(filtro) {
    estado.filtro = filtro;
    refs.filtros.forEach((boton) => {
      boton.setAttribute("aria-pressed", String(boton.dataset.filtro === filtro));
    });
    renderProductos();
  }

  /* ---------------- Cesta ---------------- */

  function guardarCesta() {
    guardar(CLAVE_CESTA, estado.cesta);
  }

  function totales() {
    let unidades = 0;
    let subtotal = 0;

    estado.cesta.forEach((item) => {
      const producto = PRODUCTOS.find((p) => p.id === item.id);
      if (!producto) return;
      unidades += item.cantidad;
      subtotal += producto.precio * item.cantidad;
    });

    const envio = subtotal === 0 || subtotal >= ENVIO_GRATIS ? 0 : COSTE_ENVIO;

    return { unidades, subtotal, envio, total: subtotal + envio };
  }

  function agregarAlCarrito(id, talla) {
    const producto = PRODUCTOS.find((p) => p.id === id);
    if (!producto) return;

    const existente = estado.cesta.find((item) => item.id === id && item.talla === talla);

    if (existente) {
      existente.cantidad += 1;
    } else {
      estado.cesta.push({ id, talla, cantidad: 1 });
    }

    guardarCesta();
    renderCesta();
    avisar(`${producto.nombre} (${talla}) añadido a la cesta`);
  }

  function cambiarCantidad(indice, delta) {
    const item = estado.cesta[indice];
    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad <= 0) {
      estado.cesta.splice(indice, 1);
    }

    guardarCesta();
    renderCesta();
  }

  function quitarItem(indice) {
    const item = estado.cesta[indice];
    if (!item) return;

    const producto = PRODUCTOS.find((p) => p.id === item.id);
    estado.cesta.splice(indice, 1);
    guardarCesta();
    renderCesta();
    if (producto) avisar(`${producto.nombre} eliminado de la cesta`);
  }

  function renderCesta() {
    const { unidades, subtotal, envio, total } = totales();

    /* Contador de la cabecera */
    refs.contador.textContent = String(unidades);
    refs.contador.hidden = unidades === 0;
    refs.abrirCesta.setAttribute(
      "aria-label",
      unidades === 0 ? "Abrir cesta" : `Abrir cesta, ${unidades} ${unidades === 1 ? "artículo" : "artículos"}`
    );

    /* Lista */
    refs.listaCesta.innerHTML = estado.cesta
      .map((item, indice) => {
        const producto = PRODUCTOS.find((p) => p.id === item.id);
        if (!producto) return "";

        return `
          <li class="cesta__item">
            <div class="cesta__miniatura" style="--c1:${producto.c1};--c2:${producto.c2}">${icono(producto.tipo)}</div>
            <div class="cesta__detalle">
              <p class="cesta__nombre">${producto.nombre}</p>
              <p class="cesta__meta">Talla ${item.talla}</p>
              <p class="cesta__precio">${formatoPrecio.format(producto.precio * item.cantidad)}</p>
            </div>
            <div class="cesta__acciones">
              <div class="cantidad">
                <button type="button" data-accion="menos" data-indice="${indice}" aria-label="Quitar una unidad de ${producto.nombre}">−</button>
                <span aria-label="Cantidad">${item.cantidad}</span>
                <button type="button" data-accion="mas" data-indice="${indice}" aria-label="Añadir una unidad de ${producto.nombre}">+</button>
              </div>
              <button class="cesta__quitar" type="button" data-accion="quitar" data-indice="${indice}">Quitar</button>
            </div>
          </li>
        `;
      })
      .join("");

    const vacia = estado.cesta.length === 0;
    refs.cestaVacia.hidden = !vacia;
    refs.listaCesta.hidden = vacia;

    /* Totales */
    refs.cestaCuenta.textContent = String(unidades);
    refs.subtotal.textContent = formatoPrecio.format(subtotal);
    refs.envio.textContent = subtotal === 0 ? "—" : envio === 0 ? "Gratis" : formatoPrecio.format(envio);
    refs.total.textContent = formatoPrecio.format(total);
    refs.pagar.disabled = vacia;

    if (subtotal === 0) {
      refs.envioNota.textContent = "";
    } else if (subtotal < ENVIO_GRATIS) {
      refs.envioNota.textContent = `Te faltan ${formatoPrecio.format(ENVIO_GRATIS - subtotal)} para el envío gratis.`;
    } else {
      refs.envioNota.textContent = "¡Envío gratis conseguido!";
    }
  }

  /* ---------------- Abrir / cerrar cesta ---------------- */

  function abrirCesta() {
    ultimoFoco = document.activeElement;
    refs.cesta.classList.add("abierta");
    refs.cesta.setAttribute("aria-hidden", "false");
    refs.capa.hidden = false;
    requestAnimationFrame(() => refs.capa.classList.add("visible"));
    document.body.classList.add("sin-scroll");
    refs.cerrarCesta.focus();
  }

  function cerrarCesta() {
    if (!refs.cesta.classList.contains("abierta")) return;

    refs.cesta.classList.remove("abierta");
    refs.cesta.setAttribute("aria-hidden", "true");
    refs.capa.classList.remove("visible");
    document.body.classList.remove("sin-scroll");

    setTimeout(() => {
      if (!refs.cesta.classList.contains("abierta")) refs.capa.hidden = true;
    }, 320);

    if (ultimoFoco && typeof ultimoFoco.focus === "function") ultimoFoco.focus();
  }

  function atraparFoco(evento) {
    if (evento.key !== "Tab" || !refs.cesta.classList.contains("abierta")) return;

    const enfocables = $$(
      'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
      refs.cesta
    ).filter((elemento) => elemento.offsetParent !== null);

    if (enfocables.length === 0) return;

    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  /* ---------------- Menú móvil ---------------- */

  function cerrarMenu() {
    refs.nav.classList.remove("abierto");
    refs.menuBtn.setAttribute("aria-expanded", "false");
    refs.menuBtn.setAttribute("aria-label", "Abrir menú");
  }

  function alternarMenu() {
    const abierto = refs.nav.classList.toggle("abierto");
    refs.menuBtn.setAttribute("aria-expanded", String(abierto));
    refs.menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  }

  /* ---------------- Eventos ---------------- */

  /* Catálogo: tallas, favoritos y añadir */
  refs.productos.addEventListener("click", (evento) => {
    const tarjeta = evento.target.closest(".producto");
    if (!tarjeta) return;

    const botonTalla = evento.target.closest(".talla");
    if (botonTalla) {
      tarjeta.dataset.talla = botonTalla.dataset.talla;
      $$(".talla", tarjeta).forEach((boton) => {
        boton.setAttribute("aria-pressed", String(boton === botonTalla));
      });
      return;
    }

    const botonFavorito = evento.target.closest(".producto__fav");
    if (botonFavorito) {
      const id = tarjeta.dataset.id;
      const producto = PRODUCTOS.find((p) => p.id === id);
      const ahoraFavorito = !estado.favoritos.has(id);

      if (ahoraFavorito) estado.favoritos.add(id);
      else estado.favoritos.delete(id);

      guardar(CLAVE_FAVORITOS, [...estado.favoritos]);
      botonFavorito.setAttribute("aria-pressed", String(ahoraFavorito));
      botonFavorito.setAttribute("aria-label", `${ahoraFavorito ? "Quitar" : "Añadir"} ${producto.nombre} de favoritos`);
      avisar(ahoraFavorito ? `${producto.nombre} guardado en favoritos` : `${producto.nombre} fuera de favoritos`);
      return;
    }

    const botonAnadir = evento.target.closest(".producto__anadir");
    if (botonAnadir) {
      agregarAlCarrito(tarjeta.dataset.id, tarjeta.dataset.talla);
    }
  });

  /* Filtros */
  refs.filtros.forEach((boton) => {
    boton.addEventListener("click", () => aplicarFiltro(boton.dataset.filtro));
  });

  /* Enlaces de navegación y categorías que filtran el catálogo */
  $$("[data-filtro-nav]").forEach((elemento) => {
    elemento.addEventListener("click", () => {
      aplicarFiltro(elemento.dataset.filtroNav);
      cerrarMenu();
    });
  });

  /* Búsqueda */
  refs.busqueda.addEventListener("input", () => {
    estado.busqueda = refs.busqueda.value;
    renderProductos();
  });

  /* Cesta */
  refs.abrirCesta.addEventListener("click", abrirCesta);
  refs.cerrarCesta.addEventListener("click", cerrarCesta);
  refs.capa.addEventListener("click", cerrarCesta);

  refs.listaCesta.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;

    const indice = Number(boton.dataset.indice);
    const accion = boton.dataset.accion;

    if (accion === "mas") cambiarCantidad(indice, 1);
    else if (accion === "menos") cambiarCantidad(indice, -1);
    else if (accion === "quitar") quitarItem(indice);
  });

  refs.pagar.addEventListener("click", () => {
    const { total } = totales();
    if (estado.cesta.length === 0) return;

    estado.cesta = [];
    guardarCesta();
    renderCesta();
    cerrarCesta();
    avisar(`Pedido de demostración por ${formatoPrecio.format(total)}. ¡Gracias!`);
  });

  refs.seguirComprando.addEventListener("click", () => {
    cerrarCesta();
    $("#catalogo").scrollIntoView({ behavior: "smooth" });
  });

  /* Menú móvil */
  refs.menuBtn.addEventListener("click", alternarMenu);
  $$("a", refs.nav).forEach((enlace) => enlace.addEventListener("click", cerrarMenu));

  /* Teclado */
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      cerrarCesta();
      cerrarMenu();
    }
    atraparFoco(evento);
  });

  /* Cabecera al hacer scroll */
  const alDesplazar = () => refs.cabecera.classList.toggle("compacta", window.scrollY > 8);
  window.addEventListener("scroll", alDesplazar, { passive: true });
  alDesplazar();

  /* Boletín */
  refs.boletin.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const email = $("#email").value.trim();
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    refs.boletinMensaje.classList.toggle("error", !valido);

    if (!valido) {
      refs.boletinMensaje.textContent = "Escribe un correo válido para suscribirte.";
      return;
    }

    refs.boletinMensaje.textContent = "¡Gracias! Te hemos apuntado a la lista (demostración).";
    refs.boletin.reset();
    avisar("Suscripción registrada. Bienvenida a Lunaria.");
  });

  /* ---------------- Arranque ---------------- */

  refs.anio.textContent = String(new Date().getFullYear());
  renderProductos();
  renderCesta();
})();
