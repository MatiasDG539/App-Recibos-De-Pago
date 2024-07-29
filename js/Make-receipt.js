//Lógica para generar un option que contenga el nombre del cliente.
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/datos')
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
    //Lógica para rellenar los campos Dirección y CUIL/CUIT en el caso de haber seleccionado un cliente.
    document.getElementById('clientName').addEventListener('change', function(event) {
        const name = event.target.value;
        if(name) {
            fetch(`http://localhost:3000/datos/${name}`)
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

//Función que permite que se agreguen nuevos conceptos de trabajos realizados.
document.getElementById('add-detail-button').addEventListener('click', function() {
    // Obtener el contenedor principal
    const jobDetails = document.getElementById('jobDetails');

    const currentDetailCount = jobDetails.getElementsByClassName('detail-item').length;

    if (currentDetailCount > 4) {
        alert('Se ha alcanzado el limite de 4 conceptos por recibo.');
        return;
    }
    
    // Obtener los valores de los inputs actuales
    const jobDescValue = document.getElementById('jobDesc').value;
    const jobPriceValue = document.getElementById('jobPrice').value;

    if (jobDescValue === '' || jobPriceValue === '') {
        alert('Por favor, complete ambos campos antes de agregar un nuevo concepto.');
        return;
    }

    // Crear nuevos elementos para el concepto y monto anteriores
    const detailItemDiv = document.createElement('div');
    detailItemDiv.classList.add('detail-item');

    const conceptoLabel = document.createElement('label');
    conceptoLabel.textContent = "Concepto: ";
    const conceptoTextarea = document.createElement('textarea');
    conceptoTextarea.rows = 2;
    conceptoTextarea.cols = 50;
    conceptoTextarea.value = jobDescValue;
    conceptoTextarea.readOnly = true;

    const montoLabel = document.createElement('label');
    montoLabel.textContent = "Monto: ";
    const montoInput = document.createElement('input');
    montoInput.type = 'number';
    montoInput.value = jobPriceValue;
    montoInput.readOnly = true;

    // Agregar los elementos al div de detalle
    detailItemDiv.appendChild(conceptoLabel);
    detailItemDiv.appendChild(conceptoTextarea);
    detailItemDiv.appendChild(document.createElement('br'));
    detailItemDiv.appendChild(montoLabel);
    detailItemDiv.appendChild(montoInput);

    // Agregar el div de detalle al contenedor principal
    jobDetails.appendChild(detailItemDiv);

    // Limpiar los inputs actuales
    document.getElementById('jobDesc').value = '';
    document.getElementById('jobPrice').value = '';
    document.getElementById('charCount').textContent = '0/300';
});

//Función para eliminar el recibo.
function reloadPage() {
    location.reload(true);
}