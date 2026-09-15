document.addEventListener('DOMContentLoaded', () => {
    const btnSiguiente = document.getElementById('btn-siguiente-actividad');

    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', () => {
            // Cambia este nombre por el de tu archivo real
            window.location.href = 'actividad2vivos.html'; 
        });
    }
});