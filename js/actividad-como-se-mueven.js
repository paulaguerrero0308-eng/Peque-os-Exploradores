document.addEventListener("DOMContentLoaded", () => {
    const animales = document.querySelectorAll(".item-animal");
    const tarjetas = document.querySelectorAll(".tarjeta-destino");
    const contenedorAnimales = document.getElementById("columna-animales");
    const contenedorDestinos = document.getElementById("columna-destinos");
    const modalVictoria = document.getElementById("modal-victoria");
    const btnReiniciar = document.getElementById("btn-reiniciar");

    // Audio Elements
    const audioPiwi = document.getElementById("audio-piwi");
    const btnAudioTop = document.getElementById("btn-audio-top");
    const imgAudioOn = document.getElementById("img-audio-on");
    const imgAudioOff = document.getElementById("img-audio-off");
    const piwiPajaro = document.getElementById("piwi-pajaro");

    // Rutas de Piwi Estático y Animado (GIF)
    const RUTA_PIWI_STATIC = "../img/Piwi.png";
    const RUTA_PIWI_GIF = "../gif/Pajarito oficial lento.gif"; // Cambia esta ruta si tu GIF tiene otro nombre

    let animalArrastrado = null;
    let aciertos = 0;
    const totalAciertos = animales.length;

    // --- CONTROL DE GIF Y AUDIO DE PIWI ---
    function activarGIFPiwi() {
        if (piwiPajaro) piwiPajaro.src = RUTA_PIWI_GIF;
    }

    function desactivarGIFPiwi() {
        if (piwiPajaro) piwiPajaro.src = RUTA_PIWI_STATIC;
    }

    function reproducirAudio() {
        if (audioPiwi) {
            audioPiwi.currentTime = 0;
            audioPiwi.play().then(() => {
                activarGIFPiwi();
            }).catch(e => {
                console.log("Autoplay bloqueado por el navegador.");
            });

            if (imgAudioOn && imgAudioOff) {
                imgAudioOn.classList.remove("oculto");
                imgAudioOff.classList.add("oculto");
            }
        }
    }

    // Cuando el audio termina, Piwi vuelve a su estado estático
    if (audioPiwi) {
        audioPiwi.addEventListener("ended", desactivarGIFPiwi);
        audioPiwi.addEventListener("pause", desactivarGIFPiwi);
        audioPiwi.addEventListener("play", activarGIFPiwi);
    }

    // Intentar reproducir al cargar la página
    reproducirAudio();

    // Reproducir y animar al hacer clic sobre Piwi
    if (piwiPajaro) {
        piwiPajaro.addEventListener("click", reproducirAudio);
    }

    // Botón Mute/Unmute
    if (btnAudioTop) {
        btnAudioTop.addEventListener("click", () => {
            if (audioPiwi.paused) {
                audioPiwi.play();
                imgAudioOn.classList.remove("oculto");
                imgAudioOff.classList.add("oculto");
            } else {
                audioPiwi.pause();
                imgAudioOn.classList.add("oculto");
                imgAudioOff.classList.remove("oculto");
            }
        });
    }

    // --- EVENTOS DRAG & DROP ---
    animales.forEach(animal => {
        animal.addEventListener("dragstart", dragStart);
        animal.addEventListener("dragend", dragEnd);
    });

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("dragover", dragOver);
        tarjeta.addEventListener("dragenter", dragEnter);
        tarjeta.addEventListener("dragleave", dragLeave);
        tarjeta.addEventListener("drop", dragDrop);
    });

    function dragStart(e) {
        animalArrastrado = this;
        this.classList.add("arrastrando");
        e.dataTransfer.setData("text/plain", this.dataset.tipo);
    }

    function dragEnd() {
        this.classList.remove("arrastrando");
        animalArrastrado = null;
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add("drag-over");
    }

    function dragLeave() {
        this.classList.remove("drag-over");
    }

    function dragDrop(e) {
        this.classList.remove("drag-over");
        const tipoAnimal = e.dataTransfer.getData("text/plain");
        const tipoDestino = this.dataset.match;

        if (!animalArrastrado) return;

        if (tipoAnimal === tipoDestino) {
            const overlayAcierto = this.querySelector(".overlay-feedback.acierto");
            overlayAcierto.classList.remove("oculto");

            animalArrastrado.classList.add("completado");
            animalArrastrado.setAttribute("draggable", "false");

            aciertos++;

            if (aciertos === totalAciertos) {
                setTimeout(() => {
                    modalVictoria.classList.remove("oculto");
                }, 500);
            }
        } else {
            const overlayError = this.querySelector(".overlay-feedback.error");
            overlayError.classList.remove("oculto");

            setTimeout(() => {
                overlayError.classList.add("oculto");
                mezclarElementos(contenedorDestinos);
                mezclarElementos(contenedorAnimales);
            }, 800);
        }
    }

    function mezclarElementos(contenedor) {
        const elementos = Array.from(contenedor.children);
        for (let i = elementos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            contenedor.appendChild(elementos[j]);
        }
    }

    function desordenarTodo() {
        mezclarElementos(contenedorAnimales);
        mezclarElementos(contenedorDestinos);
    }

    btnReiniciar.addEventListener("click", () => {
        aciertos = 0;
        modalVictoria.classList.add("oculto");

        animales.forEach(animal => {
            animal.classList.remove("completado");
            animal.setAttribute("draggable", "true");
        });

        document.querySelectorAll(".overlay-feedback").forEach(overlay => {
            overlay.classList.add("oculto");
        });

        desordenarTodo();
        reproducirAudio();
    });

    desordenarTodo();
});