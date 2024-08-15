//Lógica para generar un option que contenga el nombre del cliente.
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/client')
        .then(response => response.json())
        .then(clients => {
            const select = document.getElementById('clientName');
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.client_name;
                option.textContent = client.client_name;
                select.appendChild(option)
            });
        });
    //Lógica para rellenar automáticamente los campos Dirección y CUIL/CUIT en el caso de haber seleccionado un cliente.
    document.getElementById('clientName').addEventListener('change', function(event) {
        const name = event.target.value;
        if(name) {
            fetch(`http://localhost:3000/client/${name}`)
                .then(response => response.json())
                .then(client => {
                    document.getElementById('clientAddress').value = client.client_address;
                    document.getElementById('clientData').value = client.client_data;
                })
                .catch(error => {
                    console.error('Error: ', error);
                });
        } else {
            document.getElementById('clientAddress').value = '';
            document.getElementById('clientData').value = '';
        }
    });
});

//Función para contabilizar la cantidad de caracteres restantes dentro del textarea(concepto).
function updateCharCount(textarea) {
    var currentLength = textarea.value.length;
    var maxLength = textarea.getAttribute("maxlength");
    var charCountElement = document.getElementById("charCount");
    charCountElement.textContent = currentLength + "/" + maxLength;
}

//Función para eliminar el recibo.
function reloadPage() {
    location.reload(true);
}