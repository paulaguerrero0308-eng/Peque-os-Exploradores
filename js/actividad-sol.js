document.addEventListener('DOMContentLoaded', () => {

    // Sol y Maceta
    const sol = document.getElementById('sol-arrastrable');
    const maceta = document.getElementById('zona-maceta');

    // Banners
    const bannerInicial = document.getElementById('banner-inicial');
    const bannerExito = document.getElementById('banner-exito');
    const subtituloInicial = document.getElementById('subtitulo-inicial');
    const subtituloExito = document.getElementById('subtitulo-exito');

    // Globos y Plantas
    const globoInicial = document.getElementById('globo-inicial');
    const globoExito = document.getElementById('globo-exito');
    const plantaInicial = document.getElementById('planta-inicial');
    const plantaDestello = document.getElementById('planta-destello');

    // Nico y Audios
    const osoImg = document.getElementById('oso-nico');
    const audioInicial = document.getElementById('audio-inicial');
    const audioExito = document.getElementById('audio-exito');

    // Botón de Audio e Imágenes
    const btnAudio = document.getElementById('btn-audio-top');
    const imgAudioOn = document.getElementById('img-audio-on');
    const imgAudioOff = document.getElementById('img-audio-off');

    // Rutas GIF / PNG Nico
    const rutaOsoHablando = '../gif/oso hablando.gif';
    const rutaOsoEstatico = '../img/Explorador .png';

    let estaMuteado = false;

    // --- 1. AUDIO INICIAL AL CARGAR LA PÁGINA ---
    function reproducirAudioInicial() {
        if (!estaMuteado && audioInicial) {
            osoImg.src = rutaOsoHablando;
            
            audioInicial.play().catch(() => {
                // Si el navegador bloquea el autoplay antes de la interacción del usuario
                osoImg.src = rutaOsoEstatico;
            });

            audioInicial.onended = () => {
                osoImg.src = rutaOsoEstatico;
            };
        }
    }

    reproducirAudioInicial();

    // --- 2. CONTROL DEL BOTÓN DE AUDIO (TOGGLE) ---
    btnAudio.addEventListener('click', () => {
        estaMuteado = !estaMuteado;

        // Alterna la visibilidad de las imágenes on / off
        imgAudioOn.classList.toggle('oculta', estaMuteado);
        imgAudioOff.classList.toggle('oculta', !estaMuteado);

        if (estaMuteado) {
            if (audioInicial) audioInicial.pause();
            if (audioExito) audioExito.pause();
            osoImg.src = rutaOsoEstatico;
        } else {
            // Si activa el audio y la actividad no ha terminado, reproduce la instrucción
            if (bannerExito.classList.contains('oculta')) {
                reproducirAudioInicial();
            }
        }
    });

    // --- 3. EVENTOS DRAG & DROP ---
    sol.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'sol');
        setTimeout(() => {
            sol.style.opacity = '0.3';
        }, 0);
    });

    sol.addEventListener('dragend', () => {
        sol.style.opacity = '1';
    });

    maceta.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    maceta.addEventListener('drop', (e) => {
        e.preventDefault();

        // Pausar audio inicial
        if (audioInicial) {
            audioInicial.pause();
            audioInicial.currentTime = 0;
        }

        // Ocultar elementos iniciales
        sol.style.display = 'none';
        bannerInicial.classList.add('oculta');
        subtituloInicial.classList.add('oculta');
        globoInicial.classList.add('oculta');
        plantaInicial.classList.add('oculta');

        // Mostrar elementos de éxito
        bannerExito.classList.remove('oculta');
        subtituloExito.classList.remove('oculta');
        globoExito.classList.remove('oculta');
        plantaDestello.classList.remove('oculta');

        // Animar a Nico Hablando al lograr el objetivo
        osoImg.src = rutaOsoHablando;

        if (!estaMuteado && audioExito) {
            audioExito.play().catch(err => console.log(err));
            audioExito.onended = () => {
                osoImg.src = rutaOsoEstatico;
            };
        } else {
            setTimeout(() => {
                osoImg.src = rutaOsoEstatico;
            }, 3000);
        }
    });

});