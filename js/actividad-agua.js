document.addEventListener('DOMContentLoaded', () => {

    const regadera = document.getElementById('regadera-draggable');
    const contenedorRegadera = document.getElementById('contenedor-regadera');
    const drops = document.querySelectorAll('.target-drop');
    
    const bannerAJugar = document.getElementById('banner-a-jugar');
    const bannerExcelente = document.getElementById('banner-excelente');
    const capsulaInstruccion = document.getElementById('capsula-instruccion');
    const contenedorOpciones = document.getElementById('contenedor-opciones');
    const contenedorFlorecida = document.getElementById('contenedor-planta-florecida');
    
    const globoNico = document.getElementById('globo-nico');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const osoImg = document.getElementById('oso-nico');

    const audioInstruccion = document.getElementById('audio-instruccion');
    const audioCorrecto = document.getElementById('audio-correcto');
    const audioIncorrecto = document.getElementById('audio-incorrecto');
    const audioNicoBien = document.getElementById('audio-nico-bien');

    const rutaOsoEstatico = '../img/Explorador .png';
    const rutaOsoHablando = '../gif/oso hablando.gif';

    // Reproducir audio de explicación al cargar la pantalla
    function reproducirInstruccionInicial() {
        if (audioInstruccion) {
            if (osoImg) osoImg.src = rutaOsoHablando;
            
            const promesaPlay = audioInstruccion.play();
            if (promesaPlay !== undefined) {
                promesaPlay.catch(() => {
                    // Si el navegador bloquea el autoplay, Nico vuelve a estado estático
                    if (osoImg) osoImg.src = rutaOsoEstatico;
                });
            }

            audioInstruccion.onended = () => {
                if (osoImg) osoImg.src = rutaOsoEstatico;
            };
        }
    }

    reproducirInstruccionInicial();

    // Mezclar las tarjetas al cargar
    function mezclarTarjetas() {
        if (!contenedorOpciones) return;
        const arregloOpciones = Array.from(drops);
        for (let i = arregloOpciones.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arregloOpciones[i], arregloOpciones[j]] = [arregloOpciones[j], arregloOpciones[i]];
        }
        arregloOpciones.forEach(opcion => contenedorOpciones.appendChild(opcion));
    }

    mezclarTarjetas();

    // Eventos Drag & Drop
    if (regadera) {
        regadera.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'regadera');
            regadera.style.opacity = '0.5';
        });

        regadera.addEventListener('dragend', () => {
            regadera.style.opacity = '1';
        });
    }

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

    // Transición al acertar
    function activarEstadoExcelente() {
        // Detener audio de instrucción si aún sigue sonando
        if (audioInstruccion) {
            audioInstruccion.pause();
            audioInstruccion.currentTime = 0;
        }

        // Ocultar banner "A jugar" y mostrar "Excelente"
        if (bannerAJugar) bannerAJugar.classList.add('oculto');
        if (bannerExcelente) bannerExcelente.classList.remove('oculto');
        
        // Ocultar la instrucción
        if (capsulaInstruccion) capsulaInstruccion.classList.add('oculto');
        
        // Ocultar tarjetas y mostrar la planta final
        if (contenedorOpciones) contenedorOpciones.classList.add('oculto');
        if (contenedorFlorecida) contenedorFlorecida.classList.remove('oculto');

        // Mover regadera al estante
        if (contenedorRegadera) contenedorRegadera.classList.add('regadera-posicion-final');
        if (regadera) regadera.draggable = false;

        // Mostrar globo de Nico y flecha verde
        if (globoNico) globoNico.classList.remove('oculto');
        if (btnSiguiente) btnSiguiente.classList.remove('oculto');

        // Reproducir audios y animación de Nico
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

    // Respuesta Incorrecta
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