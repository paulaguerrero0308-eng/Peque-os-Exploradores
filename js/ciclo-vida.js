document.addEventListener('DOMContentLoaded', () => {

    const OSO_ESTATICO = '../img/Explorador .png';
    const OSO_HABLANDO = '../gif/oso hablando.gif';

    const tarjetas = document.querySelectorAll('.card-etapa');
    const btnOso = document.getElementById('btn-oso');
    const osoImg = document.getElementById('oso-img');
    const globoOso = document.getElementById('globo-oso');
    const btnSonidoTop = document.getElementById('btn-audio-top');
    
    const imgAudioOn = document.getElementById('img-audio-on');
    const imgAudioOff = document.getElementById('img-audio-off');

    const sonidoPop = document.getElementById('audio-pop');
    const sonidoOso = document.getElementById('audio-oso');

    const todosLosAudiosVoz = [
        sonidoOso,
        document.getElementById('audio-etapa1'),
        document.getElementById('audio-etapa2'),
        document.getElementById('audio-etapa3'),
        document.getElementById('audio-etapa4'),
        document.getElementById('audio-etapa5')
    ];

    let sonidoSilenciado = false;

    // Detener sonidos y quitar tarjeta seleccionada
    function detenerVoces() {
        todosLosAudiosVoz.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
        if (globoOso) globoOso.classList.remove('visible');
        if (osoImg) osoImg.src = OSO_ESTATICO;
        
        // Quitar la clase agrandada de todas las tarjetas
        tarjetas.forEach(t => t.classList.remove('agrandada'));
    }

    function animarOsoHablando() {
        if (osoImg) osoImg.src = OSO_HABLANDO + '?v=' + new Date().getTime();
    }

    function hablarOso() {
        detenerVoces();
        if (sonidoSilenciado) return;

        if (globoOso) globoOso.classList.add('visible');
        animarOsoHablando();

        if (sonidoOso) {
            sonidoOso.currentTime = 0;
            sonidoOso.play().catch(() => detenerVoces());
        }
    }

    function actualizarIconoSonido(silenciado) {
        if (silenciado) {
            imgAudioOn.classList.add('oculta');
            imgAudioOff.classList.remove('oculta');
        } else {
            imgAudioOff.classList.add('oculta');
            imgAudioOn.classList.remove('oculta');
        }
    }

    // Resetear al terminar audio del oso principal
    if (sonidoOso) {
        sonidoOso.addEventListener('ended', () => detenerVoces());
    }

    setTimeout(() => hablarOso(), 1000);

    // BOTÓN MUTE SUPERIOR
    if (btnSonidoTop) {
        btnSonidoTop.addEventListener('click', () => {
            const estaHablando = todosLosAudiosVoz.some(audio => audio && !audio.paused);

            if (estaHablando || !sonidoSilenciado) {
                detenerVoces();
                sonidoSilenciado = true;
                actualizarIconoSonido(true);
            } else {
                sonidoSilenciado = false;
                actualizarIconoSonido(false);
                hablarOso();
            }
        });
    }

    if (btnOso) {
        btnOso.addEventListener('click', () => {
            sonidoSilenciado = false;
            actualizarIconoSonido(false);
            hablarOso();
        });
    }

    // INTERACCIÓN CON TARJETAS
    tarjetas.forEach(tarjeta => {
        const idAudioVoz = tarjeta.getAttribute('data-audio');
        const audioVoz = document.getElementById(idAudioVoz);

        // Evento cuando TERMINA de hablar la tarjeta
        if (audioVoz) {
            audioVoz.addEventListener('ended', () => {
                // Reproduce el POP al terminar de hablar
                if (sonidoPop && !sonidoSilenciado) {
                    sonidoPop.currentTime = 0;
                    sonidoPop.play().catch(() => {});
                }
                detenerVoces();
            });
        }

        tarjeta.addEventListener('click', () => {
            detenerVoces();

            // Mantiene la tarjeta agrandada durante la explicación
            tarjeta.classList.add('agrandada');

            if (!sonidoSilenciado && audioVoz) {
                animarOsoHablando();
                audioVoz.play().catch(() => detenerVoces());
            } else {
                // Si está silenciado, hace el POP de inmediato y vuelve a su tamaño
                if (sonidoPop) {
                    sonidoPop.currentTime = 0;
                    sonidoPop.play().catch(() => {});
                }
                setTimeout(() => tarjeta.classList.remove('agrandada'), 300);
            }
        });
    });

});