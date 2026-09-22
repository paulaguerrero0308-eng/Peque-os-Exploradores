document.addEventListener("DOMContentLoaded", () => {
    // Lista de animales con las rutas corregidas
    const animales = [
        { nombre: "Conejo", imagen: "../img/saltan/Conejo - grande .png", tipo: "herbivoro" },
        { nombre: "Caracol", imagen: "../img/arrastran/Caracol - grande .png", tipo: "herbivoro" },
        { nombre: "Mariposa", imagen: "../img/vuelan/Mariposa - Grande .png", tipo: "herbivoro" },
        { nombre: "Rana", imagen: "../img/saltan/Rana - Grande .png", tipo: "carnivoro" },
        { nombre: "Serpiente", imagen: "../img/arrastran/Serpiente - grande .png", tipo: "carnivoro" },
        { nombre: "Vaca", imagen: "../img/actividadcomida/Vaca grande .png", tipo: "herbivoro" }
    ];

    let indiceActual = 0;

    // Elementos del DOM
    const imgAnimal = document.getElementById("img-animal");
    const contenedorOpciones = document.getElementById("contenedor-opciones");
    const botonesOpciones = document.querySelectorAll(".btn-opcion");
    
    const modalCorrecto = document.getElementById("modal-correcto");
    const modalIncorrecto = document.getElementById("modal-incorrecto");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const btnReintentar = document.getElementById("btn-reintentar");

    const piwiCorrecto = document.getElementById("piwi-modal-correcto");
    const piwiIncorrecto = document.getElementById("piwi-modal-incorrecto");

    const audioCorrecto = document.getElementById("audio-correcto");
    const audioIncorrecto = document.getElementById("audio-incorrecto");

    // Rutas para alternar GIF y estático de Piwi
    const RUTA_PIWI_GIF = "../gif/Pajarito oficial lento.gif";
    const RUTA_PIWI_STATIC = "../img/Nico.png";

    // Mezclar posiciones de las tarjetas de forma aleatoria
    function mezclarTarjetas() {
        const opcionesArray = Array.from(contenedorOpciones.children);
        for (let i = opcionesArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [opcionesArray[i], opcionesArray[j]] = [opcionesArray[j], opcionesArray[i]];
        }
        opcionesArray.forEach(opcion => contenedorOpciones.appendChild(opcion));
    }

    // Cargar el animal actual
    function cargarAnimal() {
        const animal = animales[indiceActual];
        imgAnimal.src = animal.imagen;
        imgAnimal.alt = animal.nombre;
        mezclarTarjetas();
    }

    // Manejo del modal Correcto
    function mostrarModalCorrecto() {
        piwiCorrecto.src = RUTA_PIWI_GIF;
        modalCorrecto.classList.remove("oculto");

        if (audioCorrecto) {
            audioCorrecto.currentTime = 0;
            audioCorrecto.play().catch(() => {});
            audioCorrecto.onended = () => {
                piwiCorrecto.src = RUTA_PIWI_STATIC;
            };
        }
    }

    // Manejo del modal Incorrecto
    function mostrarModalIncorrecto() {
        piwiIncorrecto.src = RUTA_PIWI_GIF;
        modalIncorrecto.classList.remove("oculto");

        if (audioIncorrecto) {
            audioIncorrecto.currentTime = 0;
            audioIncorrecto.play().catch(() => {});
            audioIncorrecto.onended = () => {
                piwiIncorrecto.src = RUTA_PIWI_STATIC;
            };
        }
    }

    // Eventos al hacer clic en las opciones
    botonesOpciones.forEach(btn => {
        btn.addEventListener("click", () => {
            const seleccion = btn.getAttribute("data-tipo");
            const correcto = animales[indiceActual].tipo;

            if (seleccion === correcto) {
                mostrarModalCorrecto();
            } else {
                mostrarModalIncorrecto();
            }
        });
    });

    // Botón Siguiente (Éxito)
    btnSiguiente.addEventListener("click", () => {
        modalCorrecto.classList.add("oculto");
        indiceActual++;

        if (indiceActual < animales.length) {
            cargarAnimal();
        } else {
            window.location.href = "intro-animales.html";
        }
    });

    // Botón Reintentar (Error)
    btnReintentar.addEventListener("click", () => {
        modalIncorrecto.classList.add("oculto");
        mezclarTarjetas();
    });

    // Iniciar la actividad
    cargarAnimal();
});