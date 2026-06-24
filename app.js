// Variable global para guardar los poemas una vez cargados
let listaDePoemas = [];

// 1. CONTROL DE PESTAÑAS (NAVEGACIÓN)
function configurarNavegacion() {
    const enlaces = document.querySelectorAll('.nav-link');
    const secciones = document.querySelectorAll('.seccion-contenido');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            
            const objetivo = enlace.getAttribute('data-target');

            // Cambiar pestaña activa en el menú
            enlaces.forEach(link => link.classList.remove('active'));
            enlace.classList.add('active');

            // Mostrar la sección correcta y ocultar las demás
            secciones.forEach(seccion => {
                if (seccion.id === objetivo) {
                    seccion.classList.add('active');
                } else {
                    seccion.classList.remove('active');
                }
            });

            // Subir automáticamente al inicio de la página al cambiar de pestaña
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Hacer que la función esté disponible de manera global para el botón del HTML
window.irAPoemas = function() {
    const botonPoemas = document.querySelector('.nav-link[data-target="poemas"]');
    if (botonPoemas) {
        botonPoemas.click();
    }
}

// 2. CARGAR POEMAS DESDE EL ARCHIVO JSON
async function cargarPoemas() {
    try {
        const respuesta = await fetch('./poemas.json');
        listaDePoemas = await respuesta.json();
        
        mostrarPoemas(listaDePoemas);
    } catch (error) {
        const contenedor = document.getElementById('contenedor-poemas');
        if (contenedor) {
            contenedor.innerText = 'Hubo un problema al abrir el libro de poemas.';
        }
        console.error(error);
    }
}

// 3. MOSTRAR EXCLUSIVAMENTE LOS TÍTULOS COMO LINKS EN PESTAÑA NUEVA
function mostrarPoemas(poemasAFiltrar) {
    const contenedor = document.getElementById('contenedor-poemas');
    if (!contenedor) return;
    
    contenedor.innerHTML = ''; // Limpiar contenedor

    if (poemasAFiltrar.length === 0) {
        contenedor.innerHTML = '<p class="cargando">No se encontraron poemas con ese título.</p>';
        return;
    }

    poemasAFiltrar.forEach(poema => {
        // Creamos un enlace (<a>) minimalista
        const enlace = document.createElement('a');
        enlace.classList.add('tarjeta-poema-link');
        
        // Redirecciona a poema.html mandando el ID en la URL y abre en pestaña nueva
        enlace.href = `poema.html?id=${poema.id}`;
        enlace.target = '_blank'; 
        
        enlace.innerHTML = `
            <div class="tarjeta-poema-min">
                <h2>${poema.titulo}</h2>
                <div class="meta-poema">${poema.categoria}</div>
            </div>
        `;
        contenedor.appendChild(enlace);
    });
}

// 4. BUSCADOR Y FILTRO EN TIEMPO REAL
function configurarFiltros() {
    const buscador = document.getElementById('buscador');
    const filtroCategoria = document.getElementById('filtro-categoria');

    if (!buscador || !filtroCategoria) return;

    function filtrar() {
        const textoBusqueda = buscador.value.toLowerCase();
        const categoriaSeleccionada = filtroCategoria.value;

        const poemasFiltrados = listaDePoemas.filter(poema => {
            // Busqueda inteligente: solo por el título (como pediste)
            const coincideTexto = poema.titulo.toLowerCase().includes(textoBusqueda);
            
            // Validar coincidencia de categoría
            const coincideCategoria = categoriaSeleccionada === 'todos' || poema.categoria === categoriaSeleccionada;

            return coincideTexto && coincideCategoria;
        });

        mostrarPoemas(poemasFiltrados);
    }

    // Escuchar eventos de escritura y selección
    buscador.addEventListener('input', filtrar);
    filtroCategoria.addEventListener('change', filtrar);
}

// INICIALIZACIÓN DE TODO EL SITIO
document.addEventListener('DOMContentLoaded', () => {
    configurarNavegacion();
    cargarPoemas();
    configurarFiltros();
});
function configurarModoOscuro() {
    const botonTema = document.getElementById('btn-tema');
    if (!botonTema) return;

    // Guardamos la preferencia en el navegador
    const temaGuardado = localStorage.getItem('tema');
    
    if (temaGuardado === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        botonTema.innerText = '☀️ Modo Claro';
    }

    botonTema.addEventListener('click', () => {
        const temaActual = document.documentElement.getAttribute('data-theme');
        
        if (temaActual === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('tema', 'light');
            botonTema.innerText = '🌙 Modo Oscuro';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('tema', 'dark');
            botonTema.innerText = '☀️ Modo Claro';
        }
    });
}

// Recuerda agregar la llamada dentro del DOMContentLoaded existente de tu app.js:
// Al final de tu app.js asegúrate de incluirlo en la inicialización:
document.addEventListener('DOMContentLoaded', () => {
    configurarNavegacion();
    cargarPoemas();
    configurarFiltros();
    configurarModoOscuro(); // <- Añade esta línea aquí
});