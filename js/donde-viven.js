document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTOS DEL DOM ---
    const tarjetas = document.querySelectorAll(".tarjeta-flip");
    const piwiNarrador = document.getElementById("piwi-narrador");
    const btnAudioTop = document.getElementById("btn-audio-top");
    const imgAudioOn = document.getElementById("img-audio-on");
    const imgAudioOff = document.getElementById("img-audio-off");

    // AUDIOS
    const audioExplicacionGeneral = document.getElementById("audio-explicacion-general");
    const audioFlip = document.getElementById("audio-flip");
    
    const audiosTarjetas = {
        bosque: document.getElementById("audio-bosque"),
        agua: document.getElementById("audio-agua"),
        campo: document.getElementById("audio-campo")
    };

    // RUTAS IMAGEN / GIF PIWI
    const RUTA_PIWI_GIF = "../gif/Pajarito oficial lento.gif";
    const RUTA_PIWI_STATIC = "../img/piwi.png";

    let audioActivado = true;

    // --- FUNCIÓN PARA REPRODUCIR AUDIO CON PIWI HABLANDO ---
    function reproducirConPiwi(audioElement) {
        if (!audioActivado || !audioElement) return;

        detenerAudios();

        audioElement.currentTime = 0;
        const promesa = audioElement.play();

        if (promesa !== undefined) {
            promesa.then(() => {
                if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_GIF;
            }).catch(() => {
                if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_STATIC;
            });
        }

        audioElement.onended = () => {
            if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_STATIC;
        };
    }

    // --- FUNCIÓN PARA DETENER AUDIOS ---
    function detenerAudios() {
        if (audioExplicacionGeneral) {
            audioExplicacionGeneral.pause();
            audioExplicacionGeneral.currentTime = 0;
        }

        Object.values(audiosTarjetas).forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_STATIC;
    }

    // --- EVENTO CLIC EN TARJETAS ---
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            const habitat = tarjeta.getAttribute("data-habitat");

            // 1. Efecto pop al voltear
            if (audioFlip && audioActivado) {
                audioFlip.currentTime = 0;
                audioFlip.play().catch(() => {});
            }

            // 2. Girar la tarjeta
            tarjeta.classList.toggle("volteada");

            // 3. Explicar el hábitat si quedó de cara trasera
            if (tarjeta.classList.contains("volteada")) {
                if (audiosTarjetas[habitat]) {
                    reproducirConPiwi(audiosTarjetas[habitat]);
                }
            } else {
                detenerAudios();
            }
        });
    });

    // --- BOTÓN DE SONIDO MUTE / UNMUTE ---
    if (btnAudioTop) {
        btnAudioTop.addEventListener("click", () => {
            audioActivado = !audioActivado;

            if (audioActivado) {
                imgAudioOn.classList.remove("oculto");
                imgAudioOff.classList.add("oculto");
                reproducirConPiwi(audioExplicacionGeneral);
            } else {
                imgAudioOn.classList.add("oculto");
                imgAudioOff.classList.remove("oculto");
                detenerAudios();
            }
        });
    }

    // Activar el audio inicial tras el primer clic en la pantalla (para saltar el bloqueo de navegadores)
    document.body.addEventListener('click', () => {
        if (audioActivado && audioExplicacionGeneral && audioExplicacionGeneral.paused) {
            reproducirConPiwi(audioExplicacionGeneral);
        }
    }, { once: true });
});