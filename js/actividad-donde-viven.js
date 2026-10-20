document.addEventListener("DOMContentLoaded", () => {
    const escenarioHabitat = document.getElementById("escenario-habitat");
    const contenedorAnimales = document.getElementById("contenedor-animales");
    const piwiNarrador = document.getElementById("piwi-narrador");

    const audioInstruccion = document.getElementById("audio-instruccion");
    const audioCorrecto = document.getElementById("audio-correcto");
    const audioIncorrecto = document.getElementById("audio-incorrecto");
    
    const btnAudioTop = document.getElementById("btn-audio-top");
    const imgAudioOn = document.getElementById("img-audio-on");
    const imgAudioOff = document.getElementById("img-audio-off");

    const RUTA_PIWI_GIF = "../gif/Pajarito oficial lento.gif";
    const RUTA_PIWI_STATIC = "../img/piwi.png";

    // --- POSICIONES BASE REUTILIZABLES ---
    const posicionesBase = [
        { top: "18%", left: "10%" },
        { top: "20%", left: "62%" },
        { top: "52%", left: "18%" },
        { top: "50%", left: "68%" }
    ];

    // --- CONFIGURACIÓN DE RONDAS ---
    const rondas = [
        {
            nombre: "Agua",
            fondo: "../img/actividaddondeviven/Nadan - fondo .png",
            animales: [
                { src: "../img/nadan/Delfin - grande .png", esIntruso: false, width: "130px" },
                { src: "../img/nadan/Tortuga -Grande .png", esIntruso: false, width: "120px" },
                { src: "../img/nadan/Ballena - grande .png", esIntruso: false, width: "150px" },
                { src: "../img/saltan/Grillo - grande .png", esIntruso: true, width: "90px" }
            ]
        },
        {
            nombre: "Bosque",
            fondo: "../img/actividaddondeviven/bosque - fondo .png",
            animales: [
                { src: "../img/vuelan/Ave -grande .png", esIntruso: false, width: "95px" },
                { src: "../img/vuelan/Loro - grande .png", esIntruso: false, width: "100px" },
                { src: "../img/vuelan/Mariposa - grande .png", esIntruso: false, width: "90px" },
                { src: "../img/nadan/Pez - grande .png", esIntruso: true, width: "110px" }
            ]
        },
        {
            nombre: "Campo",
            fondo: "../img/actividaddondeviven/campo - fondo .png",
            animales: [
                { src: "../img/caminanycorren/Caballo - grande .png", esIntruso: false, width: "135px" },
                { src: "../img/caminanycorren/Cachorrog .png", esIntruso: false, width: "110px" },
                { src: "../img/caminanycorren/Gato - grande .png", esIntruso: false, width: "100px" },
                { src: "../img/nadan/Delfin - grande .png", esIntruso: true, width: "125px" }
            ]
        }
    ];

    let rondaActual = 0;
    let transicionEnProceso = false; // Bandera para evitar múltiples clics rápidos

    function mezclarArreglo(arreglo) {
        return [...arreglo].sort(() => Math.random() - 0.5);
    }

    // Reproducir audio de instrucción al iniciar o al hacer clic en el botón superior
    function reproducirInstruccion() {
        if (audioInstruccion) {
            audioInstruccion.currentTime = 0;
            audioInstruccion.play().catch(error => {
                console.log("El navegador bloqueó la reproducción automática:", error);
            });
        }
    }

    if (btnAudioTop) {
        btnAudioTop.addEventListener("click", () => {
            reproducirInstruccion();
        });
    }

    function cargarRonda(index) {
        transicionEnProceso = false;
        
        if (index >= rondas.length) {
            if (audioCorrecto) audioCorrecto.play().catch(() => {});
            setTimeout(() => {
                window.location.href = "intro-animales.html";
            }, 1500);
            return;
        }

        const ronda = rondas[index];

        escenarioHabitat.style.backgroundImage = `url('${ronda.fondo}')`;
        contenedorAnimales.innerHTML = "";

        const animalesMezclados = mezclarArreglo(ronda.animales);
        const posicionesMezcladas = mezclarArreglo(posicionesBase);

        animalesMezclados.forEach((animalData, i) => {
            const pos = posicionesMezcladas[i];
            const img = document.createElement("img");
            img.src = animalData.src;
            img.classList.add("animal-item");
            img.style.top = pos.top;
            img.style.left = pos.left;
            img.style.width = animalData.width;

            img.addEventListener("click", () => evaluarSeleccion(animalData.esIntruso, img));
            contenedorAnimales.appendChild(img);
        });
    }

    function evaluarSeleccion(esIntruso, elementoImg) {
        if (transicionEnProceso) return; // Si ya se seleccionó una correcta, ignorar clics extra

        if (esIntruso) {
            transicionEnProceso = true;

            if (audioCorrecto) {
                audioCorrecto.currentTime = 0;
                audioCorrecto.play().catch(() => {});
            }

            // Cambiar a GIF de Piwi celebrando/hablando
            if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_GIF;

            elementoImg.style.transform = "scale(1.4) rotate(15deg)";
            elementoImg.style.opacity = "0.3";

            // Esperar a que termine el audio correcto para regresar a estático y cambiar de ronda
            if (audioCorrecto) {
                audioCorrecto.onended = () => {
                    if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_STATIC;
                    rondaActual++;
                    cargarRonda(rondaActual);
                };
            }

            // Seguridad por si el audio falla o tarda demasiado
            setTimeout(() => {
                if (piwiNarrador && piwiNarrador.src.includes("Pajarito oficial lento.gif")) {
                    piwiNarrador.src = RUTA_PIWI_STATIC;
                    rondaActual++;
                    cargarRonda(rondaActual);
                }
            }, 3000);

        } else {
            if (audioIncorrecto) {
                audioIncorrecto.currentTime = 0;
                audioIncorrecto.play().catch(() => {});
            }

            elementoImg.style.transform = "scale(0.9)";
            setTimeout(() => {
                elementoImg.style.transform = "scale(1)";
            }, 200);
        }
    }

    // Iniciar el juego y reproducir la instrucción
    cargarRonda(rondaActual);
    reproducirInstruccion();
});