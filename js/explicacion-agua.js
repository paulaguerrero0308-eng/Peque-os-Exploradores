document.addEventListener('DOMContentLoaded', () => {

    const osoImg = document.getElementById('oso-nico');
    const audioExplicacion = document.getElementById('audio-explicacion');
    
    // Botón de sonido e imágenes de estado
    const btnAudio = document.getElementById('btn-audio-explicacion');
    const imgAudioOn = document.getElementById('img-audio-on');
    const imgAudioOff = document.getElementById('img-audio-off');

    // Rutas de las imágenes de Nico
    const rutaOsoHablando = '../gif/oso hablando.gif';
    const rutaOsoEstatico = '../img/Explorador .png';

    let estaMuteado = false;

    // Función para reproducir el audio y animar a Nico
    function reproducirAudio() {
        if (!estaMuteado && audioExplicacion) {
            osoImg.src = rutaOsoHablando;

            audioExplicacion.play().catch(() => {
                // Si el navegador bloquea el autoplay inicial
                osoImg.src = rutaOsoEstatico;
            });

            audioExplicacion.onended = () => {
                osoImg.src = rutaOsoEstatico;
            };
        }
    }

    // Intentar reproducir al cargar la página
    reproducirAudio();

    // Toggle de reproducir / mutear con el botón de sonido
    btnAudio.addEventListener('click', () => {
        estaMuteado = !estaMuteado;

        // Alternar imágenes de sonido
        imgAudioOn.classList.toggle('oculta', estaMuteado);
        imgAudioOff.classList.toggle('oculta', !estaMuteado);

        if (estaMuteado) {
            if (audioExplicacion) {
                audioExplicacion.pause();
                audioExplicacion.currentTime = 0;
            }
            osoImg.src = rutaOsoEstatico;
        } else {
            reproducirAudio();
        }
    });

});