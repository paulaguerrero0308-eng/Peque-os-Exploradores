document.addEventListener("DOMContentLoaded", () => {
    // 1. Asignar evento de clic a todas las tarjetas de forma dinámica
    const tarjetas = document.querySelectorAll(".tarjeta-flip");
    
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            tarjeta.classList.toggle("volteada");
        });
    });

    // 2. Control de audio y personaje
    const audioExplicacion = document.getElementById("audio-explicacion");
    const piwiNarrador = document.getElementById("piwi-narrador");
    const btnAudioTop = document.getElementById("btn-audio-top");
    const imgAudioOn = document.getElementById("img-audio-on");
    const imgAudioOff = document.getElementById("img-audio-off");

    const RUTA_PIWI_GIF = "../gif/Pajarito oficial lento.gif";
    const RUTA_PIWI_STATIC = "../img/piwi.png";

    let audioActivado = true;

    if (audioExplicacion) {
        audioExplicacion.play().catch(() => {
            if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_STATIC;
        });

        audioExplicacion.onended = () => {
            if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_STATIC;
        };
    }

    if (btnAudioTop) {
        btnAudioTop.addEventListener("click", () => {
            audioActivado = !audioActivado;

            if (audioActivado) {
                imgAudioOn.classList.remove("oculto");
                imgAudioOff.classList.add("oculto");
                if (audioExplicacion) {
                    audioExplicacion.currentTime = 0;
                    audioExplicacion.play().catch(() => {});
                    if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_GIF;
                }
            } else {
                imgAudioOn.classList.add("oculto");
                imgAudioOff.classList.remove("oculto");
                if (audioExplicacion) {
                    audioExplicacion.pause();
                }
                if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_STATIC;
            }
        });
    }
});