document.addEventListener('DOMContentLoaded', () => {

    const OSO_ESTATICO = '../img/Explorador .png'; 
    const OSO_HABLANDO = '../gif/oso hablando.gif'; 

    // BANCOS DE AUDIOS (Agrega o cambia aquí las rutas de tus audios)
    const audiosBienRutas = [
        '../audios/Felicitaciónactividad2.mp3',
        '../audios/felicitacion2.1.mp3',
        '../audios/felicitacion2.2.mp3'
    ];

    const audiosMalRutas = [
        '../audios/Actividad2mal .mp3',
        '../audios/Actividad 2 mal .mp3'
    ];

    const opcionesBase = [
        { id: 'perro', img: '../img/actividad 2 seres vivos/botonperro.png', esVivo: true },
        { id: 'carro', img: '../img/actividad 2 seres vivos/botoncarro.png', esVivo: false },
        { id: 'arbol', img: '../img/actividad 2 seres vivos/botonarbol.png', esVivo: true },
        { id: 'mariposa', img: '../img/actividad 2 seres vivos/botonmariposa.png', esVivo: true },
        { id: 'piedra', img: '../img/actividad 2 seres vivos/botonpiedra.png', esVivo: false },
        { id: 'nino', img: '../img/actividad 2 seres vivos/botonniño.png', esVivo: true }
    ];

    const grid = document.getElementById('grid-tarjetas');
    const osoImg = document.getElementById('oso-personaje');
    const btnOso = document.getElementById('btn-oso');
    const btnAudio = document.getElementById('btn-audio-instruccion');
    const imgAudioOn = document.getElementById('img-audio-on');
    const imgAudioOff = document.getElementById('img-audio-off');

    const modal = document.getElementById('modal-mensaje');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalTexto = document.getElementById('modal-texto');
    const modalBotones = document.getElementById('modal-botones');

    const audioInstruccion = document.getElementById('audio-instruccion');
    const audioExito = document.getElementById('audio-exito');

    let sonidoSilenciado = false;
    let aciertosContador = 0;
    let audioActual = null;
    const totalSeresVivos = opcionesBase.filter(o => o.esVivo).length;

    function obtenerAudioAleatorio(listaRutas) {
        const ruta = listaRutas[Math.floor(Math.random() * listaRutas.length)];
        return new Audio(ruta);
    }

    function reproducirAudioConOso(audioElement, callbackAlTerminar) {
        detenerAudiosVoz();
        if (sonidoSilenciado || !audioElement) {
            if (callbackAlTerminar) callbackAlTerminar();
            return;
        }

        audioActual = audioElement;
        if (osoImg) osoImg.src = OSO_HABLANDO + '?v=' + new Date().getTime();

        audioActual.currentTime = 0;
        audioActual.play().catch(() => {});

        audioActual.onended = () => {
            if (osoImg) osoImg.src = OSO_ESTATICO;
            if (callbackAlTerminar) callbackAlTerminar();
        };
    }

    function detenerAudiosVoz() {
        if (audioInstruccion) { audioInstruccion.pause(); audioInstruccion.currentTime = 0; }
        if (audioExito) { audioExito.pause(); audioExito.currentTime = 0; }
        if (audioActual) { audioActual.pause(); audioActual.currentTime = 0; }
        if (osoImg) osoImg.src = OSO_ESTATICO;
    }

    function mezclarArray(array) {
        const copia = [...array];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

    function mostrarModalFinal() {
        reproducirAudioConOso(audioExito);
        
        modalTitulo.textContent = '¡Bien hecho Explorador!';
        modalTexto.textContent = '¡Has encontrado todos los seres vivos correctamente!';
        modalBotones.innerHTML = '';

        const btnReintentar = document.createElement('button');
        btnReintentar.className = 'btn-continuar';
        btnReintentar.textContent = 'Reintentar';
        btnReintentar.onclick = () => {
            modal.classList.remove('active');
            cargarJuego();
        };

        const btnMenu = document.createElement('button');
        btnMenu.className = 'btn-menu';
        btnMenu.textContent = 'Volver al Menú';
        btnMenu.onclick = () => {
            window.location.href = 'menu.html';
        };

        modalBotones.appendChild(btnReintentar);
        modalBotones.appendChild(btnMenu);
        modal.classList.add('active');
    }

    function cargarJuego() {
        if (!grid) return;
        grid.innerHTML = '';
        aciertosContador = 0;
        const elementosMezclados = mezclarArray(opcionesBase);

        elementosMezclados.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card-opcion');
            card.dataset.esVivo = item.esVivo;

            const imgResultado = item.esVivo 
                ? '../img/actividad 2 seres vivos/botonbien.png' 
                : '../img/actividad 2 seres vivos/botonmal.png';

            card.innerHTML = `
                <img src="${item.img}" class="img-opcion" alt="Opción">
                <div class="overlay-resultado">
                    <img src="${imgResultado}" alt="Marca">
                </div>
            `;

            card.addEventListener('click', () => {
                if (card.classList.contains('marcada-correcta') || card.classList.contains('marcada-incorrecta')) {
                    return;
                }

                if (item.esVivo) {
                    card.classList.add('marcada-correcta');
                    
                    // Audio aleatorio de bien
                    const audioBien = obtenerAudioAleatorio(audiosBienRutas);
                    reproducirAudioConOso(audioBien);
                    aciertosContador++;

                    if (aciertosContador === totalSeresVivos) {
                        setTimeout(() => {
                            mostrarModalFinal();
                        }, 600);
                    }
                } else {
                    card.classList.add('marcada-incorrecta');
                    
                    // Audio aleatorio de mal y reinicio al terminar
                    const audioMal = obtenerAudioAleatorio(audiosMalRutas);
                    reproducirAudioConOso(audioMal, () => {
                        cargarJuego();
                    });
                }
            });

            grid.appendChild(card);
        });
    }

    // Botón mute superior
    if (btnAudio) {
        btnAudio.addEventListener('click', () => {
            if (!sonidoSilenciado) {
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

    // Clic en el Oso
    if (btnOso) {
        btnOso.addEventListener('click', () => {
            sonidoSilenciado = false;
            imgAudioOn.classList.remove('oculta');
            imgAudioOff.classList.add('oculta');
            reproducirAudioConOso(audioInstruccion);
        });
    }

    // Audio de instrucción inicial
    setTimeout(() => {
        reproducirAudioConOso(audioInstruccion);
    }, 500);

    cargarJuego();
});