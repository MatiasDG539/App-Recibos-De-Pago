//Lógica para generar un option que contenga el nombre del cliente.
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/clients')
        .then(response => response.json())
        .then(clients => {
            const select = document.getElementById('clientName');
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.client_name;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar los clientes', error);
        });

    //Lógica para rellenar automáticamente los campos Dirección y CUIL/CUIT en el caso de haber seleccionado un cliente.
    document.getElementById('clientName').addEventListener('change', function(event) {
        const clientId = event.target.value;
        if (clientId) {
            fetch(`http://localhost:3000/api/clients/${clientId}`)
                .then(response => response.json())
                .then(client => {
                    document.getElementById('clientAddress').value = client.client_address;
                    document.getElementById('clientData').value = client.client_data;
                })
                .catch(error => {
                    console.error('Error al obtener la información del cliente: ', error);
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