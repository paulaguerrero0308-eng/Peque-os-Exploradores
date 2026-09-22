document.addEventListener("DOMContentLoaded", () => {
    const audioNico = document.getElementById("audio-nico");
    const btnAudioTop = document.getElementById("btn-audio-top");
    const imgAudioOn = document.getElementById("img-audio-on");
    const imgAudioOff = document.getElementById("img-audio-off");
    const nicoOso = document.getElementById("nico-oso");

    // Rutas de imagen estática y GIF animado de Nico
    const RUTA_NICO_STATIC = "../img/Explorador .png";
    const RUTA_NICO_GIF = "../gif/oso hablando.gif";

    // Funciones para cambiar la imagen según el audio
    function activarGIFNico() {
        if (nicoOso) nicoOso.src = RUTA_NICO_GIF;
    }

    function desactivarGIFNico() {
        if (nicoOso) nicoOso.src = RUTA_NICO_STATIC;
    }

    function reproducirAudio() {
        if (audioNico) {
            audioNico.currentTime = 0;
            audioNico.play().then(() => {
                activarGIFNico();
            }).catch(e => {
                console.log("Autoplay bloqueado por el navegador.");
            });

            if (imgAudioOn && imgAudioOff) {
                imgAudioOn.classList.remove("oculto");
                imgAudioOff.classList.add("oculto");
            }
        }
    }

    // Escuchar eventos del audio para alternar la animación
    if (audioNico) {
        audioNico.addEventListener("ended", desactivarGIFNico);
        audioNico.addEventListener("pause", desactivarGIFNico);
        audioNico.addEventListener("play", activarGIFNico);
    }

    // Reproducir audio al cargar la pantalla
    reproducirAudio();

    // Tocar la imagen de Nico para volver a escuchar las instrucciones
    if (nicoOso) {
        nicoOso.addEventListener("click", reproducirAudio);
    }

    // Control de silencio / reproducción desde el botón superior
    if (btnAudioTop) {
        btnAudioTop.addEventListener("click", () => {
            if (audioNico.paused) {
                audioNico.play();
                imgAudioOn.classList.remove("oculto");
                imgAudioOff.classList.add("oculto");
            } else {
                audioNico.pause();
                imgAudioOn.classList.add("oculto");
                imgAudioOff.classList.remove("oculto");
            }
        });
    }
});