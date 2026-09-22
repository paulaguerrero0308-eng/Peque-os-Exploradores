document.addEventListener('DOMContentLoaded', () => {

    const osoImg = document.getElementById('oso-nico');
    const audioBienvenida = document.getElementById('audio-bienvenida');
    const btnAudioTop = document.getElementById('btn-audio-top');
    const imgAudioOn = document.getElementById('img-audio-on');
    const imgAudioOff = document.getElementById('img-audio-off');
    const tarjetas = document.querySelectorAll('.tarjeta-modulo');

    const rutaOsoEstatico = '../img/Explorador .png';
    const rutaOsoHablando = '../gif/oso hablando.gif';

    let estaSilenciado = false;

    // Reproducir audio con animación del GIF de Nico
    function hablarNico() {
        if (!audioBienvenida || estaSilenciado) return;

        audioBienvenida.currentTime = 0;
        audioBienvenida.play().then(() => {
            if (osoImg) osoImg.src = rutaOsoHablando;
        }).catch(() => {});

        audioBienvenida.onended = () => {
            if (osoImg) osoImg.src = rutaOsoEstatico;
        };
    }

    // Reproducción automática al abrir la pantalla
    hablarNico();

    // Toggle silenciar / activar audio desde la esquina superior derecha
    if (btnAudioTop) {
        btnAudioTop.addEventListener('click', () => {
            estaSilenciado = !estaSilenciado;

            if (estaSilenciado) {
                audioBienvenida.pause();
                audioBienvenida.currentTime = 0;
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

    // Repetir voz de Nico al hacer clic sobre el personaje
    if (osoImg) {
        osoImg.addEventListener('click', () => {
            if (!estaSilenciado) {
                hablarNico();
            }
        });
    }

    // Sonido Pop al pasar por las tarjetas
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