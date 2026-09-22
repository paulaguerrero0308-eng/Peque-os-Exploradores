document.addEventListener('DOMContentLoaded', () => {

    const piwiImg = document.getElementById('piwi-pajaro');
    const audioPiwi = document.getElementById('audio-piwi');
    const btnAudioTop = document.getElementById('btn-audio-top');
    const imgAudioOn = document.getElementById('img-audio-on');
    const imgAudioOff = document.getElementById('img-audio-off');

    const animalGrande = document.getElementById('animal-grande');
    const btnsMini = document.querySelectorAll('.btn-mini');

    const rutaPiwiEstatico = '../img/Piwi.png';
    const rutaPiwiHablando = '../gif/Pajarito oficial lento.gif';

    let estaSilenciado = false;

    // Función para reproducir voz de Piwi y animarlo
    function hablarPiwi() {
        if (!audioPiwi || estaSilenciado) return;

        audioPiwi.currentTime = 0;
        audioPiwi.play().then(() => {
            if (piwiImg) piwiImg.src = rutaPiwiHablando;
        }).catch(() => {});

        audioPiwi.onended = () => {
            if (piwiImg) piwiImg.src = rutaPiwiEstatico;
        };
    }

    // Auto-reproducir voz de Piwi al cargar la página
    hablarPiwi();

    // Activar/desactivar el sonido con el botón flotante
    if (btnAudioTop) {
        btnAudioTop.addEventListener('click', () => {
            estaSilenciado = !estaSilenciado;

            if (estaSilenciado) {
                audioPiwi.pause();
                audioPiwi.currentTime = 0;
                if (piwiImg) piwiImg.src = rutaPiwiEstatico;

                imgAudioOn.classList.add('oculto');
                imgAudioOff.classList.remove('oculto');
            } else {
                imgAudioOff.classList.add('oculto');
                imgAudioOn.classList.remove('oculto');
                hablarPiwi();
            }
        });
    }

    // Clic en Piwi para repetir su voz
    if (piwiImg) {
        piwiImg.addEventListener('click', () => {
            if (!estaSilenciado) {
                hablarPiwi();
            }
        });
    }

    // Cambiar imagen grande al hacer clic en los círculos
    btnsMini.forEach(btn => {
        btn.addEventListener('click', () => {
            btnsMini.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');

            const nuevaImg = btn.getAttribute('data-img');
            if (animalGrande && nuevaImg) {
                animalGrande.style.opacity = '0';
                setTimeout(() => {
                    animalGrande.src = nuevaImg;
                    animalGrande.style.opacity = '1';
                }, 150);
            }
        });
    });

});