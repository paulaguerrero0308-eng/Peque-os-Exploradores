document.addEventListener('DOMContentLoaded', () => {

    const OSO_ESTATICO = '../img/Explorador .png'; 
    const OSO_HABLANDO = '../gif/oso hablando.gif'; 

    const osoImg = document.getElementById('oso-personaje');
    const btnOso = document.getElementById('btn-oso');
    const audioIntro = document.getElementById('audio-intro');
    const btnAudio = document.getElementById('btn-audio');

    const modalVideo = document.getElementById('modal-video');
    const iframeReproductor = document.getElementById('iframe-reproductor');
    const btnCerrar = document.getElementById('btn-cerrar');
    const botonesTarjeta = document.querySelectorAll('.card-btn');

    let timerEspera = null;
    let estaSilenciado = false;

    function detenerAudioYAnimacion() {
        if (timerEspera) clearTimeout(timerEspera);
        if (audioIntro) {
            audioIntro.pause();
            audioIntro.currentTime = 0;
        }
        if (osoImg) osoImg.src = OSO_ESTATICO;
    }

    function hablarOsoConPausa() {
        detenerAudioYAnimacion();
        if (!audioIntro || estaSilenciado) return;

        timerEspera = setTimeout(() => {
            if (estaSilenciado) return;
            if (osoImg) osoImg.src = OSO_HABLANDO + '?v=' + new Date().getTime();

            audioIntro.play().catch(() => {});
        }, 500);

        audioIntro.onended = () => {
            if (osoImg) osoImg.src = OSO_ESTATICO;
        };
    }

    // Abrir modal e inyectar el video de YouTube
    botonesTarjeta.forEach(btn => {
        btn.addEventListener('click', () => {
            const urlVideo = btn.getAttribute('data-video');
            
            // Pausar locución del oso
            detenerAudioYAnimacion();

            if (iframeReproductor && modalVideo) {
                iframeReproductor.src = urlVideo;
                modalVideo.classList.add('activo');
            }
        });
    });

    // Cerrar el modal y detener la reproducción de YouTube
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            if (modalVideo && iframeReproductor) {
                iframeReproductor.src = ""; // Limpia el iframe para cortar el audio/video
                modalVideo.classList.remove('activo');
            }
        });
    }

    // Botón Mute / Unmute
    if (btnAudio) {
        btnAudio.addEventListener('click', () => {
            estaSilenciado = !estaSilenciado;

            if (estaSilenciado) {
                detenerAudioYAnimacion();
                btnAudio.classList.add('muted');
            } else {
                btnAudio.classList.remove('muted');
                hablarOsoConPausa();
            }
        });
    }

    // Clic en el oso
    if (btnOso) {
        btnOso.addEventListener('click', () => {
            if (!estaSilenciado) hablarOsoConPausa();
        });
    }

    hablarOsoConPausa();
});