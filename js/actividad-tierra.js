document.addEventListener('DOMContentLoaded', () => {

    const planta = document.getElementById('planta-draggable');
    const contenedorPlanta = document.getElementById('contenedor-planta');
    const contenedorMacetas = document.getElementById('contenedor-macetas');
    const drops = document.querySelectorAll('.target-drop');
    
    const bannerTitulo = document.getElementById('banner-titulo');
    const capsulaInstruccion = document.getElementById('capsula-instruccion');
    const capsulaExplicacion = document.getElementById('capsula-explicacion');
    const contenedorSembrada = document.getElementById('contenedor-planta-sembrada');
    
    const globoNico = document.getElementById('globo-nico');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const osoImg = document.getElementById('oso-nico');

    // Audios
    const audioInstruccion = document.getElementById('audio-instruccion');
    const audioCorrecto = document.getElementById('audio-correcto');
    const audioIncorrecto = document.getElementById('audio-incorrecto');
    const audioNicoBien = document.getElementById('audio-nico-bien');

    const rutaOsoEstatico = '../img/Explorador .png';
    const rutaOsoHablando = '../gif/oso hablando.gif';

    // 0. REPRODUCIR EXPLICACIÓN INICIAL
    function reproducirInstruccionInicial() {
        if (audioInstruccion) {
            if (osoImg) osoImg.src = rutaOsoHablando;

            const promesaPlay = audioInstruccion.play();
            if (promesaPlay !== undefined) {
                promesaPlay.catch(() => {
                    // Si el navegador bloquea el autoplay, Nico vuelve al GIF estático
                    if (osoImg) osoImg.src = rutaOsoEstatico;
                });
            }

            audioInstruccion.onended = () => {
                if (osoImg) osoImg.src = rutaOsoEstatico;
            };
        }
    }

    reproducirInstruccionInicial();

    // 1. MEZCLAR POSICIONES ALEATORIAMENTE
    function desordenarMacetas() {
        if (!contenedorMacetas) return;
        const macetasArray = Array.from(contenedorMacetas.children);
        macetasArray.sort(() => Math.random() - 0.5);
        macetasArray.forEach(maceta => contenedorMacetas.appendChild(maceta));
    }
    desordenarMacetas();

    // 2. EVENTOS DRAG
    if (planta) {
        planta.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'planta');
            planta.style.opacity = '0.5';
        });

        planta.addEventListener('dragend', () => {
            planta.style.opacity = '1';
        });
    }

    // 3. EVENTOS DROP
    drops.forEach(drop => {
        drop.addEventListener('dragover', (e) => {
            e.preventDefault();
            drop.classList.add('drag-over');
        });

        drop.addEventListener('dragleave', () => {
            drop.classList.remove('drag-over');
        });

        drop.addEventListener('drop', (e) => {
            e.preventDefault();
            drop.classList.remove('drag-over');

            const esCorrecta = drop.getAttribute('data-es-correcta') === 'true';

            if (esCorrecta) {
                activarEstadoExcelente();
            } else {
                manejarRespuestaIncorrecta(drop);
            }
        });
    });

    // 4. TRANSICIÓN A ESTADO EXCELENTE
    function activarEstadoExcelente() {
        // Detener audio de instrucción si aún se encuentra reproduciéndose
        if (audioInstruccion) {
            audioInstruccion.pause();
            audioInstruccion.currentTime = 0;
        }

        // Cambiar título a Excelente
        if (bannerTitulo) {
            bannerTitulo.src = '../img/actividadtierra/Excelente .png';
        }

        // Ocultar pregunta inicial y mostrar imagen explicativa
        if (capsulaInstruccion) capsulaInstruccion.classList.add('oculto');
        if (capsulaExplicacion) capsulaExplicacion.classList.remove('oculto');

        // Ocultar macetas y mostrar la planta sembrada
        if (contenedorPlanta) contenedorPlanta.classList.add('oculto');
        if (contenedorMacetas) contenedorMacetas.classList.add('oculto');
        if (contenedorSembrada) contenedorSembrada.classList.remove('oculto');

        // Mostrar Globo de diálogo de Nico y Botón Siguiente
        if (globoNico) globoNico.classList.remove('oculto');
        if (btnSiguiente) btnSiguiente.classList.remove('oculto');

        // Reproducir audios y animación
        if (audioCorrecto) {
            audioCorrecto.currentTime = 0;
            audioCorrecto.play();
        }

        if (osoImg) osoImg.src = rutaOsoHablando;
        if (audioNicoBien) {
            audioNicoBien.currentTime = 0;
            audioNicoBien.play();
            audioNicoBien.onended = () => {
                if (osoImg) osoImg.src = rutaOsoEstatico;
            };
        }
    }

    // 5. RESPUESTA INCORRECTA
    function manejarRespuestaIncorrecta(contenedorTarget) {
        contenedorTarget.classList.add('incorrecto-anim');

        if (audioIncorrecto) {
            audioIncorrecto.currentTime = 0;
            audioIncorrecto.play();
        }

        setTimeout(() => {
            contenedorTarget.classList.remove('incorrecto-anim');
        }, 500);
    }

});