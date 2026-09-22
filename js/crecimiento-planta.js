document.addEventListener('DOMContentLoaded', () => {

    const botonesEtapa = document.querySelectorAll('.btn-etapa');
    const globoNico = document.getElementById('globo-nico');
    const osoImg = document.getElementById('oso-nico');
    const imgTextoCentral = document.getElementById('img-texto-explicacion');
    
    // Botón de audio flotante y sus 2 imágenes
    const btnAudioTop = document.getElementById('btn-audio-top');
    const imgAudioOn = document.getElementById('img-audio-on');
    const imgAudioOff = document.getElementById('img-audio-off');

    const rutaOsoEstatico = '../img/Explorador .png';
    const rutaOsoHablando = '../gif/oso hablando.gif';

    let audioActual = null;
    let estaSilenciado = false;

    // Función universal para reproducir sonido
    function reproducirElementoAudio(elementoAudio) {
        if (!elementoAudio) return;

        if (audioActual) {
            audioActual.pause();
            audioActual.currentTime = 0;
        }

        audioActual = elementoAudio;
        audioActual.currentTime = 0;

        if (!estaSilenciado) {
            audioActual.play().then(() => {
                if (osoImg) osoImg.src = rutaOsoHablando;
            }).catch(() => {
                if (osoImg) osoImg.src = rutaOsoHablando;
                setTimeout(() => {
                    if (osoImg) osoImg.src = rutaOsoEstatico;
                }, 2500);
            });
        }

        audioActual.onended = () => {
            if (osoImg) osoImg.src = rutaOsoEstatico;
        };
    }

    // 1. Control de sonido al presionar el botón flotante
    if (btnAudioTop) {
        btnAudioTop.addEventListener('click', (e) => {
            e.stopPropagation();

            estaSilenciado = !estaSilenciado;

            if (estaSilenciado) {
                // Muestra la imagen desactivada
                imgAudioOn.classList.add('oculto');
                imgAudioOff.classList.remove('oculto');

                if (audioActual) audioActual.pause();
                if (osoImg) osoImg.src = rutaOsoEstatico;
            } else {
                // Muestra la imagen activada
                imgAudioOff.classList.add('oculto');
                imgAudioOn.classList.remove('oculto');

                if (audioActual) {
                    audioActual.play().catch(() => {});
                    if (osoImg) osoImg.src = rutaOsoHablando;
                }
            }
        });
    }

    // 2. Audio inicial al cargar la página
    const audioOsoInicial = document.getElementById('audio-oso');
    if (audioOsoInicial) {
        reproducirElementoAudio(audioOsoInicial);
    }

    // 3. Interacción con las etapas del ciclo
    botonesEtapa.forEach(boton => {
        boton.addEventListener('click', () => {
            const idAudio = boton.getAttribute('data-audio-id');
            const rutaTexto = boton.getAttribute('data-texto');

            // Sonido pop al hacer clic
            const audioPop = document.getElementById('audio-pop');
            if (audioPop && !estaSilenciado) {
                audioPop.currentTime = 0;
                audioPop.play().catch(() => {});
            }

            // Cambiar imagen explicativa central
            if (imgTextoCentral && rutaTexto) {
                imgTextoCentral.src = rutaTexto;
                imgTextoCentral.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    imgTextoCentral.style.transform = 'scale(1)';
                }, 200);
            }

            // Reproducir audio del banco por ID
            const elementoAudioEtapa = document.getElementById(idAudio);
            if (elementoAudioEtapa) {
                reproducirElementoAudio(elementoAudioEtapa);
            }
        });
    });

}); 