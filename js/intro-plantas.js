document.addEventListener('DOMContentLoaded', () => {

    const OSO_ESTATICO = '../img/Explorador .png'; 
    const OSO_HABLANDO = '../gif/oso hablando.gif'; 

    const osoImg = document.getElementById('oso-personaje');
    const btnOso = document.getElementById('btn-oso');
    const audioIntro = document.getElementById('audio-intro-plantas');
    const btnAudio = document.getElementById('btn-audio');

    let timerEspera = null;
    let estaSilenciado = false;

    // Cancela cualquier reproducción o animación activa
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
            // Verificar de nuevo si se silenció durante la espera
            if (estaSilenciado) return;

            if (osoImg) osoImg.src = OSO_HABLANDO + '?v=' + new Date().getTime();

            audioIntro.play().catch(() => {});
        }, 500);

        audioIntro.onended = () => {
            if (osoImg) osoImg.src = OSO_ESTATICO;
        };
    }

    // Evento de silenciado / activación
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

    // Reproducción al iniciar
    hablarOsoConPausa();
});