document.addEventListener("DOMContentLoaded", () => {
    
    // Rutas de imágenes del oso
    const OSO_ESTATICO = "../img/Explorador .png";
    const OSO_HABLANDO = "../gif/oso hablando.gif";

    // Elementos del DOM
    const osoImg = document.getElementById("oso-personaje");
    const globoImg = document.getElementById("globo-texto");
    const btnMascota = document.getElementById("btn-oso");
    const audioBienvenida = document.getElementById("audio-bienvenida");

    let timerEspera = null;

    // Función principal para iniciar la locución y animación con pausa inicial
    function hablarOsoConPausa() {
        if (!audioBienvenida) return;

        // Reiniciamos cualquier reproducción o temporizador anterior
        clearTimeout(timerEspera);
        audioBienvenida.pause();
        audioBienvenida.currentTime = 0;
        
        // Mantiene el estado inicial estático y oculto durante el retraso
        if (globoImg) globoImg.classList.add("oculto");
        if (osoImg) osoImg.src = OSO_ESTATICO;

        // Espera MEDIO SEGUNDO (500 ms) antes de activar el GIF y la voz
        timerEspera = setTimeout(() => {
            // 1. Muestra el globo de texto y activa el GIF animado
            if (globoImg) globoImg.classList.remove("oculto");
            if (osoImg) osoImg.src = OSO_HABLANDO + "?v=" + new Date().getTime();

            // 2. Reproduce la voz
            audioBienvenida.play().catch(() => {
                // Manejo si el navegador bloquea la autoreproducción
            });
        }, 500); // 500 milisegundos = medio segundo

        // 3. Al finalizar el audio, vuelve a la imagen fija y oculta el globo
        audioBienvenida.onended = () => {
            if (globoImg) globoImg.classList.add("oculto");
            if (osoImg) osoImg.src = OSO_ESTATICO;
        };
    }

    // Al hacer clic sobre la mascota, ejecuta la secuencia con la pausa de medio segundo
    if (btnMascota) {
        btnMascota.addEventListener("click", () => {
            hablarOsoConPausa();
        });
    }

    // Ejecución inicial al cargar el menú
    hablarOsoConPausa();
});