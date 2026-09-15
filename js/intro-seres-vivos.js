document.addEventListener('DOMContentLoaded', () => {
    // 1. Rutas de recursos
    const OSO_ESTATICO = '../img/Explorador .png'; 
    const OSO_HABLANDO = '../gif/oso hablando.gif'; 
    const IMG_SONIDO_ON = '../img/Sonido.png';
    const IMG_SONIDO_OFF = '../img/Sonido desactivado .png';

    // 2. Elementos del DOM
    const osoImg = document.getElementById('oso-intro');
    const btnAudio = document.getElementById('btn-audio-intro');
    const audioIntro = document.getElementById('audio-intro');
    const imgBotonSonido = btnAudio ? btnAudio.querySelector('img') : null;

    // Función para reproducir audio y animar
    function encenderAudio() {
        if (!audioIntro || !osoImg) return;

        audioIntro.currentTime = 0;
        osoImg.src = OSO_HABLANDO + '?v=' + new Date().getTime();
        if (imgBotonSonido) imgBotonSonido.src = IMG_SONIDO_ON;

        audioIntro.play().catch(error => {
            console.log('Autoplay bloqueado por el navegador. Requiere interacción del usuario:', error);
            apagarAudio();
        });
    }

    // Función para apagar audio y detener animación
    function apagarAudio() {
        if (!audioIntro || !osoImg) return;

        audioIntro.pause();
        audioIntro.currentTime = 0;
        osoImg.src = OSO_ESTATICO;
        if (imgBotonSonido) imgBotonSonido.src = IMG_SONIDO_OFF;
    }

    // Alternar encendido/apagado
    function alternarSonido() {
        if (audioIntro.paused) {
            encenderAudio();
        } else {
            apagarAudio();
        }
    }

    // 3. Esperar 1 segundo (1000 ms) al cargar la página para que hable
    setTimeout(() => {
        encenderAudio();
    }, 1000);

    // 4. Eventos
    if (audioIntro) {
        audioIntro.onended = () => {
            apagarAudio();
        };
    }

    if (btnAudio) {
        btnAudio.addEventListener('click', alternarSonido);
    }

    if (osoImg) {
        osoImg.addEventListener('click', alternarSonido);
    }
});