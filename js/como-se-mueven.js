document.addEventListener('DOMContentLoaded', () => {

    const osoImg = document.getElementById('oso-nico');
    const audioInstruccion = document.getElementById('audio-instruccion');
    const btnAudioTop = document.getElementById('btn-audio-top');
    const imgAudioOn = document.getElementById('img-audio-on');
    const imgAudioOff = document.getElementById('img-audio-off');
    const tarjetas = document.querySelectorAll('.tarjeta-movimiento');

    const rutaOsoEstatico = '../img/Explorador .png';
    const rutaOsoHablando = '../gif/oso hablando.gif';

    let estaSilenciado = false;

    // Hablar y animar a Nico
    function hablarNico() {
        if (!audioInstruccion || estaSilenciado) return;

        audioInstruccion.currentTime = 0;
        audioInstruccion.play().then(() => {
            if (osoImg) osoImg.src = rutaOsoHablando;
        }).catch(() => {});

        audioInstruccion.onended = () => {
            if (osoImg) osoImg.src = rutaOsoEstatico;
        };
    }

    // Auto-reproducir voz de Nico al cargar
    hablarNico();

    // Toggle Mute / Unmute
    if (btnAudioTop) {
        btnAudioTop.addEventListener('click', () => {
            estaSilenciado = !estaSilenciado;

            if (estaSilenciado) {
                audioInstruccion.pause();
                audioInstruccion.currentTime = 0;
                if (osoImg) osoImg.src = rutaOsoEstatico;

                imgAudioOn.classList.add('oculto');
                imgAudioOff.classList.remove('oculto');
            } else {
                imgAudioOff.classList.add('oculto');
                imgAudioOn.classList.remove('oculto');
                hablarNico();
            }
        });
    }

    // Clic en Nico para repetir instrucción
    if (osoImg) {
        osoImg.addEventListener('click', () => {
            if (!estaSilenciado) {
                hablarNico();
            }
        });
    }

    // Sonido hover pop
    const audioPop = document.getElementById('audio-pop');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('mouseenter', () => {
            if (audioPop) {
                audioPop.currentTime = 0;
                audioPop.play().catch(() => {});
            }
        });
    });

});