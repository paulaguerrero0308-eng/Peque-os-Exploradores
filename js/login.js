document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector(".form-register");

    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            event.preventDefault();

            alert("¡Sesión iniciada con éxito!");
            // Redirige directo a menu.html
            window.location.href = "menu.html";
        });
    }
});