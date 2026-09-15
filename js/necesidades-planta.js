document.addEventListener('DOMContentLoaded', () => {

    const osoImg = document.getElementById('oso-nico');
    const rutaOsoEstatico = '../img/Explorador .png';
    const rutaOsoHablando = '../gif/oso hablando.gif';

    // Obtenemos las referencias usando los IDs reales de tu HTML
    const audioIntro = document.getElementById('audio-intro');
    const btnAudio = document.getElementById('btn-audio-intro');

    // Función para reproducir la voz de Nico y cambiar la animación
    function reproducirAudio() {
        if (!audioIntro) return;

        // Reinicia el audio si ya estaba sonando
        audioIntro.currentTime = 0;

        // Cambia a Nico hablando
        if (osoImg) osoImg.src = rutaOsoHablando;

        audioIntro.play().then(() => {
            console.log("Audio reproduciéndose");
        }).catch(e => {
            console.log("Autoplay bloqueado por el navegador. Esperando clic del usuario:", e);
            if (osoImg) osoImg.src = rutaOsoEstatico;
        });

        // Cuando el audio termina, Nico vuelve a estar estático
        audioIntro.onended = () => {
            if (osoImg) osoImg.src = rutaOsoEstatico;
        };
    }

    // Intentar reproducir al cargar la página
    reproducirAudio();

    // Evento para volver a reproducir al hacer clic en el botón morado
    if (btnAudio) {
        btnAudio.addEventListener('click', () => {
            reproducirAudio();
        });
    }

    // Solución para la política de autoplay: reproduce al primer clic en cualquier parte si el navegador lo bloqueó
    const activarAudioEnPrimerClic = () => {
        if (audioIntro && audioIntro.paused) {
            reproducirAudio();
        }
        document.removeEventListener('click', activarAudioEnPrimerClic);
    };

    document.addEventListener('click', activarAudioEnPrimerClic, { once: true });

});