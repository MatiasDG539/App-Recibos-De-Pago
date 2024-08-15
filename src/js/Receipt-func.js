//Función que controla que los montos de los trabajos sean solamente números.
$(document).ready(function() {
    $('#jobPrice').on('keydown', function() {
        let key = event.which || event.keyCode;

        let value = $(this).val();
        let cursorPosition = this.selectionStart;

        if (value.length >= $(this).attr('maxlength') && (key >= 48 && key <= 57 || key >= 96 && key <= 105)) {
            event.preventDefault();
            return;
        }

        if (key === 8 || key === 9 || key === 13 || key === 27 || key === 46 || 
            (key >= 35 && key <= 40)) {
            return;
        }

        if ((key < 48 || key > 57) && (key < 96 || key > 105)) {
            event.preventDefault();
        }
    });
});