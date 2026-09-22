document.addEventListener('DOMContentLoaded', () => {

    const osoImg = document.getElementById('oso-nico');
    
    const rutaOsoEstatico = '../img/Explorador .png';
    const rutaOsoHablando = '../gif/oso hablando.gif';

    const audioExplicacion = document.getElementById('audio-explicacion');
    const btnAudio = document.getElementById('btn-audio-explicacion');

    const imgSonidoOn = btnAudio ? btnAudio.querySelector('.img-sonido-on') : null;
    const imgSonidoOff = btnAudio ? btnAudio.querySelector('.img-sonido-off') : null;

    function pausarAudio() {
        if (!audioExplicacion) return;
        
        audioExplicacion.pause();
        
        if (osoImg) osoImg.src = rutaOsoEstatico;

        if (imgSonidoOn && imgSonidoOff) {
            imgSonidoOn.classList.add('oculto');
            imgSonidoOff.classList.remove('oculto');
        }
    }

    function reproducirAudio() {
        if (!audioExplicacion) return;

        audioExplicacion.currentTime = 0;
        
        if (osoImg) osoImg.src = rutaOsoHablando;

        if (imgSonidoOn && imgSonidoOff) {
            imgSonidoOn.classList.remove('oculto');
            imgSonidoOff.classList.add('oculto');
        }

        audioExplicacion.play().then(() => {
            console.log("Audio de Nico sonando");
        }).catch(e => {
            console.log("Autoplay bloqueado:", e);
            pausarAudio();
        });

        audioExplicacion.onended = () => {
            pausarAudio();
        };
    }

    if (btnAudio) {
        btnAudio.addEventListener('click', (e) => {
            e.stopPropagation();
            if (audioExplicacion.paused) {
                reproducirAudio();
            } else {
                pausarAudio();
            }
        });
    }

    reproducirAudio();

    const activarAudioEnPrimerClic = () => {
        if (audioExplicacion && audioExplicacion.paused) {
            reproducirAudio();
        }
        document.removeEventListener('click', activarAudioEnPrimerClic);
    };

    document.addEventListener('click', activarAudioEnPrimerClic, { once: true });

});