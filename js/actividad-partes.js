document.addEventListener('DOMContentLoaded', () => {

    const draggables = document.querySelectorAll('.draggable-item');
    const dropzones = document.querySelectorAll('.dropzone');
    const btnSiguiente = document.getElementById('btn-siguiente');
    let aciertos = 0;

    // --- ELEMENTOS DEL OSO Y AUDIOS ---
    const osoImg = document.querySelector('.oso-img');
    const rutaOsoEstatico = '../img/Explorador .png'; // Imagen estática original
    const rutaOsoHablando = '../gif/oso hablando.gif'; // Cambia por la ruta exacta de tu GIF

    const audioInstrucciones = document.getElementById('audio-instrucciones');
    const audioBien = document.getElementById('audio-bien');
    const audioMal = document.getElementById('audio-mal');

    // Función auxiliar para hacer hablar al oso
    function hacerHablarAlOso(audioElement) {
        // Detener cualquier audio previo antes de reproducir uno nuevo
        [audioInstrucciones, audioBien, audioMal].forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        if (audioElement) {
            osoImg.src = rutaOsoHablando; // Cambia a la imagen animada (GIF)

            audioElement.play().catch(error => {
                console.log("El navegador bloqueó la reproducción automática inicial:", error);
            });

            audioElement.onended = () => {
                osoImg.src = rutaOsoEstatico; // Vuelve a la imagen estática al finalizar
            };
        }
    }

    // --- REPRODUCIR INSTRUCCIONES AL INICIO ---
    // Reproducir audio de instrucciones al cargar (o tras la primera interacción si el navegador lo bloquea)
    hacerHablarAlOso(audioInstrucciones);

    // --- MEZCLAR PIEZAS AL INICIO ---
    const contenedorDrag = document.querySelector('.columna-drag');
    const slots = Array.from(document.querySelectorAll('.slot-drag'));

    for (let i = slots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
    }

    slots.forEach(slot => contenedorDrag.appendChild(slot));
    // --------------------------------

    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.dataset.parte);
            e.dataTransfer.setData('element-id', item.id);
            setTimeout(() => item.style.opacity = '0.5', 0);
        });

        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
        });
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');

            const parteArrastrada = e.dataTransfer.getData('text/plain');
            const elemId = e.dataTransfer.getData('element-id');
            const objetivoZone = zone.dataset.target;

            // Validación de Acierto
            if (parteArrastrada === objetivoZone) {
                const elemArrastrado = document.getElementById(elemId);
                
                // Coloca la pieza dentro del objetivo en lugar de la sombra
                zone.innerHTML = '';
                zone.appendChild(elemArrastrado);

                // Estilo para ajustar la pieza encajada
                elemArrastrado.setAttribute('draggable', 'false');
                elemArrastrado.style.cursor = 'default';
                elemArrastrado.style.maxHeight = '85px';

                // Mostrar el letrero/chulito de felicitación
                const feedbackMsg = document.getElementById(`feedback-${objetivoZone}`);
                if (feedbackMsg) feedbackMsg.classList.add('activo');

                aciertos++;

                // Reproducir audio de felicitación
                hacerHablarAlOso(audioBien);

                // Si completa las 4 partes
                if (aciertos === 4 && btnSiguiente) {
                    setTimeout(() => {
                        btnSiguiente.style.display = 'inline-block';
                    }, 400);
                }

            } else {
                // Si la coloca en un lugar incorrecto
                hacerHablarAlOso(audioMal);
            }
        });
    });

});