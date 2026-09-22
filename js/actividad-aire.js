document.addEventListener('DOMContentLoaded', () => {

    const contenedorOpciones = document.getElementById('contenedor-opciones');
    const opciones = document.querySelectorAll('.tarjeta-opcion');
    const modalExplicacion = document.getElementById('modal-explicacion');
    const todosLosLetreros = document.querySelectorAll('.img-letrero');
    const btnReintentar = document.getElementById('btn-reintentar');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const bannerTitulo = document.getElementById('banner-titulo');
    const osoImg = document.getElementById('oso-nico');
    const globoNico = document.getElementById('globo-nico');

    const audioCorrecto = document.getElementById('audio-correcto');
    const audioIncorrecto = document.getElementById('audio-incorrecto');

    const audiosExplicacion = {
        'viento': document.getElementById('audio-viento'),
        'fuego': document.getElementById('audio-fuego'),
        'ventilador': document.getElementById('audio-ventilador'),
        'aire': document.getElementById('audio-aire')
    };

    let audioActual = null;

    const rutaOsoEstatico = '../img/Explorador .png';
    const rutaOsoHablando = '../gif/oso hablando.gif';

    // Desordenar tarjetas aleatoriamente al cargar
    function mezclarTarjetas() {
        if (!contenedorOpciones) return;
        const arregloOpciones = Array.from(opciones);
        for (let i = arregloOpciones.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arregloOpciones[i], arregloOpciones[j]] = [arregloOpciones[j], arregloOpciones[i]];
        }
        arregloOpciones.forEach(opcion => contenedorOpciones.appendChild(opcion));
    }

    mezclarTarjetas();

    function detenerAudios() {
        if (audioActual) {
            audioActual.pause();
            audioActual.currentTime = 0;
        }
    }

    function hacerHablarANico(audioAProducir) {
        detenerAudios();

        if (osoImg) osoImg.src = rutaOsoHablando;

        if (audioAProducir) {
            audioActual = audioAProducir;
            audioActual.currentTime = 0;
            audioActual.play();
            audioActual.onended = () => {
                if (osoImg) osoImg.src = rutaOsoEstatico;
            };
        }
    }

    opciones.forEach(opcion => {
        opcion.addEventListener('click', () => {
            const tipoOpcion = opcion.getAttribute('data-opcion');
            const esCorrecta = opcion.getAttribute('data-es-correcta') === 'true';

            // Ocultar globo inicial
            if (globoNico) globoNico.classList.add('oculto');

            // Mostrar retroalimentación
            todosLosLetreros.forEach(letrero => letrero.classList.add('oculto'));
            const letreroActivo = document.getElementById(`letrero-${tipoOpcion}`);
            if (letreroActivo) {
                letreroActivo.classList.remove('oculto');
            }

            // Mostrar modal y voz
            modalExplicacion.classList.remove('oculto');
            hacerHablarANico(audiosExplicacion[tipoOpcion]);

            // Evaluación
            if (esCorrecta) {
                if (btnReintentar) btnReintentar.classList.add('oculto');
                
                // Hace visible la flecha flotante sobre el modal
                if (btnSiguiente) btnSiguiente.classList.remove('oculto');

                if (bannerTitulo) bannerTitulo.src = '../img/actividad 2 seres vivos/Excelente .png';

                if (audioCorrecto) {
                    audioCorrecto.currentTime = 0;
                    audioCorrecto.play();
                }
            } else {
                if (btnReintentar) btnReintentar.classList.remove('oculto');

                if (audioIncorrecto) {
                    audioIncorrecto.currentTime = 0;
                    audioIncorrecto.play();
                }
            }
        });
    });

    if (btnReintentar) {
        btnReintentar.addEventListener('click', () => {
            modalExplicacion.classList.add('oculto');
            detenerAudios();
            if (osoImg) osoImg.src = rutaOsoEstatico;
            if (globoNico) globoNico.classList.remove('oculto');
        });
    }

});