document.addEventListener('DOMContentLoaded', () => {
    // RUTAS DE LAS IMÁGENES DEL OSO
    const OSO_ESTATICO = '../img/Explorador .png'; 
    const OSO_HABLANDO = '../gif/oso hablando.gif'; 

    // ELEMENTOS DEL DOM
    const osoImg = document.getElementById('oso-personaje');
    const btnOso = document.getElementById('btn-oso');
    const cards = document.querySelectorAll('.card-etapa');
    const dropZones = document.querySelectorAll('.drop-zone');
    const btnComprobar = document.getElementById('btn-comprobar');
    const btnAudioInstruccion = document.getElementById('btn-audio-instruccion');
    const imgAudioOn = document.getElementById('img-audio-on');
    const imgAudioOff = document.getElementById('img-audio-off');
    const origenTarjetas = document.getElementById('origen-tarjetas');

    // MODAL
    const modal = document.getElementById('modal-mensaje');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalTexto = document.getElementById('modal-texto');
    const modalBotones = document.getElementById('modal-botones');

    // AUDIOS
    const audioPop = document.getElementById('audio-pop');
    const audioInstruccion = document.getElementById('audio-instruccion');
    const audioError = document.getElementById('audio-error');
    const audioExito = document.getElementById('audio-exito');
    const audioIncompleto = document.getElementById('audio-incompleto');

    let tarjetaSeleccionada = null;
    let sonidoSilenciado = false;

    // REPRODUCCIÓN DE VOZ DEL OSO
    function reproducirAudioConOso(audioElement) {
        detenerAudiosVoz();

        if (sonidoSilenciado || !audioElement) return;

        if (osoImg) osoImg.src = OSO_HABLANDO + '?v=' + new Date().getTime();

        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log('Audio bloqueado:', e));

        audioElement.onended = () => {
            if (osoImg) osoImg.src = OSO_ESTATICO;
        };
    }

    function detenerAudiosVoz() {
        [audioInstruccion, audioError, audioExito, audioIncompleto].forEach(a => {
            if (a) {
                a.pause();
                a.currentTime = 0;
            }
        });
        if (osoImg) osoImg.src = OSO_ESTATICO;
    }

    function reproducirPop() {
        if (audioPop && !sonidoSilenciado) {
            audioPop.currentTime = 0;
            audioPop.play().catch(() => {});
        }
    }

    // MEZCLAR Y COLOCAR DE NUEVO LAS TARJETAS EN DESORDEN
    function desordenarYRegresarTarjetas() {
        const tarjetasArray = Array.from(cards);
        
        // Algoritmo Fisher-Yates para mezcla aleatoria pura
        for (let i = tarjetasArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = tarjetasArray[i];
            tarjetasArray[i] = tarjetasArray[j];
            tarjetasArray[j] = temp;
        }

        // Reinserta las tarjetas directamente en el contenedor inferior en el nuevo orden desordenado
        tarjetasArray.forEach(card => {
            origenTarjetas.appendChild(card);
        });
    }

    // REINICIAR EL JUEGO COMPLETO
    function reiniciarJuego() {
        if (tarjetaSeleccionada) {
            tarjetaSeleccionada.classList.remove('seleccionada');
            tarjetaSeleccionada = null;
        }

        desordenarYRegresarTarjetas();
        detenerAudiosVoz();
    }

    // CONTROL MUTE SUPERIOR
    if (btnAudioInstruccion) {
        btnAudioInstruccion.addEventListener('click', () => {
            const estaHablando = [audioInstruccion, audioError, audioExito, audioIncompleto].some(a => a && !a.paused);

            if (estaHablando || !sonidoSilenciado) {
                detenerAudiosVoz();
                sonidoSilenciado = true;
                imgAudioOn.classList.add('oculta');
                imgAudioOff.classList.remove('oculta');
            } else {
                sonidoSilenciado = false;
                imgAudioOn.classList.remove('oculta');
                imgAudioOff.classList.add('oculta');
                reproducirAudioConOso(audioInstruccion);
            }
        });
    }

    // CLIC EN EL OSO
    if (btnOso) {
        btnOso.addEventListener('click', () => {
            sonidoSilenciado = false;
            imgAudioOn.classList.remove('oculta');
            imgAudioOff.classList.add('oculta');
            reproducirAudioConOso(audioInstruccion);
        });
    }

    // INICIO
    setTimeout(() => {
        desordenarYRegresarTarjetas();
        reproducirAudioConOso(audioInstruccion);
    }, 800);

    // Mover tarjeta a casilla
    function colocarEnCasilla(card, zone) {
        if (zone.children.length > 0) {
            origenTarjetas.appendChild(zone.children[0]);
        }
        zone.appendChild(card);
        reproducirPop();
    }

    // EVENTOS DRAG & DROP Y TAP-TO-SELECT
    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });

        card.addEventListener('click', () => {
            if (tarjetaSeleccionada === card) {
                card.classList.remove('seleccionada');
                tarjetaSeleccionada = null;
            } else {
                cards.forEach(c => c.classList.remove('seleccionada'));
                card.classList.add('seleccionada');
                tarjetaSeleccionada = card;
                reproducirPop();
            }
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('hovered');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('hovered');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('hovered');

            const idCard = e.dataTransfer.getData('text/plain');
            const cardElement = document.getElementById(idCard);

            if (cardElement) {
                colocarEnCasilla(cardElement, zone);
            }
        });

        zone.addEventListener('click', () => {
            if (tarjetaSeleccionada) {
                colocarEnCasilla(tarjetaSeleccionada, zone);
                tarjetaSeleccionada.classList.remove('seleccionada');
                tarjetaSeleccionada = null;
            }
        });
    });

    // MODAL
    function mostrarModal(titulo, texto, tipo) {
        modalTitulo.textContent = titulo;
        modalTexto.textContent = texto;
        modalBotones.innerHTML = '';

        if (tipo === 'incompleto') {
            const btnCerrar = document.createElement('button');
            btnCerrar.className = 'btn-modal btn-aceptar';
            btnCerrar.textContent = 'Continuar';
            btnCerrar.onclick = () => {
                modal.classList.remove('active');
            };
            modalBotones.appendChild(btnCerrar);
        } else if (tipo === 'error') {
            const btnIntentar = document.createElement('button');
            btnIntentar.className = 'btn-modal btn-aceptar';
            btnIntentar.textContent = 'Intentar de nuevo';
            btnIntentar.onclick = () => {
                reiniciarJuego();
                modal.classList.remove('active');
            };
            modalBotones.appendChild(btnIntentar);
        } else if (tipo === 'exito') {
            const btnReiniciar = document.createElement('button');
            btnReiniciar.className = 'btn-modal btn-reiniciar';
            btnReiniciar.textContent = '🔄 Jugar otra vez';
            btnReiniciar.onclick = () => {
                reiniciarJuego();
                modal.classList.remove('active');
            };

            const btnSiguiente = document.createElement('button');
            btnSiguiente.className = 'btn-modal btn-siguiente';
            btnSiguiente.textContent = '➡️ Siguiente lección';
            btnSiguiente.onclick = () => {
              // Apunta al archivo que acabamos de crear con el video de YouTube
            window.location.href = 'explicacionvivos.html'; 
        };

            modalBotones.appendChild(btnReiniciar);
            modalBotones.appendChild(btnSiguiente);
        }

        modal.classList.add('active');
    }

    // BOTÓN COMPROBAR
    if (btnComprobar) {
        btnComprobar.addEventListener('click', () => {
            let completado = true;
            let esCorrecto = true;

            dropZones.forEach(zone => {
                if (zone.children.length === 0) {
                    completado = false;
                } else {
                    const card = zone.children[0];
                    const ordenCasilla = zone.getAttribute('data-orden');
                    const etapaTarjeta = card.getAttribute('data-etapa');

                    if (ordenCasilla !== etapaTarjeta) {
                        esCorrecto = false;
                    }
                }
            });

            if (!completado) {
                reproducirAudioConOso(audioIncompleto);
                mostrarModal('¡Casi listo!', 'Arrastra todas las tarjetas a las casillas numeradas antes de comprobar. ¡Tú puedes Explorador!', 'incompleto');
            } else if (!esCorrecto) {
                reproducirAudioConOso(audioError);
                mostrarModal('¡Sigue intentándolo!', '¡Buen intento! Mira con cuidado y elige otra opción.', 'error');
            } else {
                reproducirAudioConOso(audioExito);
                mostrarModal('¡Excelente trabajo! 🎉', '¡Excelente explorador! Lo lograste.', 'exito');
            }
        });
    }
});