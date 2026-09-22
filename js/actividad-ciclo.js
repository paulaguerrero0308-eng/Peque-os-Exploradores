document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const contenedorSecuencia = document.querySelector('.secuencia-etapas');
    const contenedorOpciones = document.querySelector('.opciones-respuesta');
    const osoImg = document.getElementById('oso-nico');
    const btnAudioTop = document.getElementById('btn-audio-top');

    // AUDIOS
    const audioInstruccion = document.getElementById('audio-instruccion');
    const audioCorrecto = document.getElementById('audio-correcto');
    const audioIncorrecto = document.getElementById('audio-incorrecto');

    // RUTA OSO
    const rutaOsoEstatico = '../img/Explorador .png';
    const rutaOsoHablando = '../gif/oso hablando.gif';

    // BANCO DE ETAPAS DEL CICLO
    const etapasCiclo = [
        { id: 'nace',    img: '../img/actividadciclo/Nace - Selecciona.png',    nombre: 'Nace' },
        { id: 'crece',   img: '../img/actividadciclo/Crece - Selecciona .png',   nombre: 'Crece' },
        { id: 'adulta',  img: '../img/actividadciclo/Es adulta - Selcciona.png', nombre: 'Es adulta' },
        { id: 'florece', img: '../img/actividadciclo/Florece - Selecciona.png',  nombre: 'Florece' },
        { id: 'frutos',  img: '../img/actividadciclo/Frutos ,  semillas - Selecciona .png', nombre: 'Frutos y Semillas' },
        { id: 'muere',   img: '../img/actividadciclo/Muere - Selecciona .png',   nombre: 'Muere' }
    ];

    let etapaRespuestaCorrecta = null;
    let resuelto = false;

    // --- FUNCIÓN SEGURA PARA REPRODUCIR AUDIOS ---
    function reproducirAudioSeguro(audioElement) {
        if (!audioElement) return;

        // Pausar cualquier audio previo
        [audioInstruccion, audioCorrecto, audioIncorrecto].forEach(a => {
            if (a) {
                a.pause();
                a.currentTime = 0;
            }
        });

        // Intentar reproducir
        const promesa = audioElement.play();

        if (promesa !== undefined) {
            promesa.then(() => {
                if (osoImg) osoImg.src = rutaOsoHablando;
            }).catch(error => {
                console.warn("Autoplay bloqueado por el navegador o ruta no encontrada:", error);
                if (osoImg) osoImg.src = rutaOsoEstatico;
            });
        }

        audioElement.onended = () => {
            if (osoImg) osoImg.src = rutaOsoEstatico;
        };
    }

    // --- DESBLOQUEAR AUDIOS CON EL PRIMER CLIC EN CUALQUIER LUGAR ---
    function activarAudiosEnPrimerClic() {
        // Intenta sonar la instrucción en cuanto el niño toque la pantalla o haga clic
        reproducirAudioSeguro(audioInstruccion);
        
        // Quitar los escuchadores para que solo pase una vez
        document.removeEventListener('click', activarAudiosEnPrimerClic);
        document.removeEventListener('touchstart', activarAudiosEnPrimerClic);
    }

    document.addEventListener('click', activarAudiosEnPrimerClic);
    document.addEventListener('touchstart', activarAudiosEnPrimerClic);

    // --- INICIALIZAR ACTIVIDAD ALEATORIA ---
    function iniciarJuegoAleatorio() {
        resuelto = false;
        contenedorSecuencia.innerHTML = '';
        contenedorOpciones.innerHTML = '';

        const maxStartIndex = etapasCiclo.length - 3;
        const indexInicio = Math.floor(Math.random() * (maxStartIndex + 1));

        const etapa1 = etapasCiclo[indexInicio];
        etapaRespuestaCorrecta = etapasCiclo[indexInicio + 1];
        const etapa3 = etapasCiclo[indexInicio + 2];

        // Renderizar Secuencia
        const card1 = crearTarjetaSecuencia(etapa1.img, etapa1.nombre);
        
        const dropZone = document.createElement('div');
        dropZone.className = 'tarjeta-secuencia casilla-incognita';
        dropZone.id = 'casilla-incognita';
        dropZone.innerHTML = `<img src="../img/actividadciclo/Adivina - Tarjeta .png" alt="?" id="img-incognita">`;
        
        const card3 = crearTarjetaSecuencia(etapa3.img, etapa3.nombre);

        contenedorSecuencia.appendChild(card1);
        contenedorSecuencia.appendChild(dropZone);
        contenedorSecuencia.appendChild(card3);

        // Opciones Abajo
        let opciones = [etapaRespuestaCorrecta];
        let incorrectasDisponibles = etapasCiclo.filter(e => e.id !== etapaRespuestaCorrecta.id);
        
        incorrectasDisponibles.sort(() => Math.random() - 0.5);
        opciones = opciones.concat(incorrectasDisponibles.slice(0, 3));
        opciones.sort(() => Math.random() - 0.5);

        opciones.forEach(item => {
            const btn = document.createElement('div');
            btn.className = 'btn-opcion drag-item';
            btn.setAttribute('draggable', 'true');
            btn.setAttribute('data-id', item.id);
            btn.innerHTML = `<img src="${item.img}" alt="${item.nombre}">`;
            
            configurarEventosDrag(btn);
            contenedorOpciones.appendChild(btn);
        });

        configurarEventosDrop(dropZone);
    }

    function crearTarjetaSecuencia(imgSrc, altText) {
        const div = document.createElement('div');
        div.className = 'tarjeta-secuencia';
        div.innerHTML = `<img src="${imgSrc}" alt="${altText}">`;
        return div;
    }

    // --- EVENTOS DRAG ---
    let elementoArrastrado = null;

    function configurarEventosDrag(elem) {
        elem.addEventListener('dragstart', (e) => {
            if (resuelto) return;
            elementoArrastrado = elem;
            elem.classList.add('arrastrando');
            e.dataTransfer.setData('text/plain', elem.getAttribute('data-id'));
        });

        elem.addEventListener('dragend', () => {
            elem.classList.remove('arrastrando');
        });
    }

    // --- EVENTOS DROP ---
    function configurarEventosDrop(dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!resuelto) dropZone.classList.add('hover-drop');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('hover-drop');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('hover-drop');
            if (resuelto || !elementoArrastrado) return;

            const idSeleccionado = elementoArrastrado.getAttribute('data-id');

            if (idSeleccionado === etapaRespuestaCorrecta.id) {
                resuelto = true;
                const imgIncognita = dropZone.querySelector('img');
                imgIncognita.src = etapaRespuestaCorrecta.img;
                
                dropZone.classList.add('correcto');
                elementoArrastrado.classList.add('correcto');
                elementoArrastrado.setAttribute('draggable', 'false');

                reproducirAudioSeguro(audioCorrecto);

            } else {
                elementoArrastrado.classList.add('incorrecto');
                reproducirAudioSeguro(audioIncorrecto);

                setTimeout(() => {
                    elementoArrastrado.classList.remove('incorrecto');
                }, 600);
            }
        });
    }

    // Botón manual de sonido en el globo de Nico
    if (btnAudioTop) {
        btnAudioTop.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar choque de clics
            reproducirAudioSeguro(audioInstruccion);
        });
    }

    // Iniciar el juego
    iniciarJuegoAleatorio();
});