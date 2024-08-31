//Lógica para generar un option que contenga el nombre del cliente.
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/api/clients")
    .then((response) => response.json())
    .then((clients) => {
      const select = document.getElementById("clientName");
      clients.forEach((client) => {
        const option = document.createElement("option");
        option.value = client.id;
        option.textContent = client.client_name;
        select.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error al cargar los clientes", error);
    });

  //Lógica para rellenar automáticamente los campos Dirección y CUIL/CUIT en el caso de haber seleccionado un cliente.
  document
    .getElementById("clientName")
    .addEventListener("change", function (event) {
      const clientId = event.target.value;
      if (clientId) {
        fetch(`http://localhost:3000/api/clients/${clientId}`)
          .then((response) => response.json())
          .then((client) => {
            document.getElementById("clientAddress").value =
              client.client_address;
            document.getElementById("clientData").value = client.client_data;
          })
          .catch((error) => {
            console.error(
              "Error al obtener la información del cliente: ",
              error
            );
          });
      } else {
        document.getElementById("clientAddress").value = "";
        document.getElementById("clientData").value = "";
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

document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("add-detail-button");

    addButton.addEventListener("click", function () {
        const concept = document.getElementById("jobDesc").value;
        const amount = document.getElementById("jobPrice").value;

        if (concept && amount) {
            const table = document
                .getElementById("conceptTable")
                .getElementsByTagName("tbody")[0];
            const newRow = table.insertRow();

            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);

            cell1.textContent = concept;
            cell2.textContent = amount;
            cell3.innerHTML = `
                <button type="button" class="icon-button edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="icon-button delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            document.getElementById("jobDesc").value = "";
            document.getElementById("jobPrice").value = "";

            // Agregar event listener para eliminar fila
            cell3.querySelector(".delete-btn").addEventListener("click", function () {
                table.deleteRow(newRow.rowIndex - 1);
            });

            // Agregar event listener para editar fila
            cell3.querySelector(".edit-btn").addEventListener("click", function () {
                const row = this.closest('tr'); // Obtener la fila más cercana
                const cells = row.querySelectorAll('td:not(:last-child)'); // Excluir la última celda (botones)

                // Cambiar cada celda a un input para edición
                cells.forEach(cell => {
                    const originalText = cell.innerText;
                    cell.innerHTML = `<input type="text" value="${originalText}">`;
                });

                // Cambiar el botón de editar a guardar
                this.innerHTML = '<i class="fas fa-save"></i>';
                this.classList.remove('edit-btn');
                this.classList.add('save-btn');
            });

            // Event listener para guardar cambios en la fila
            newRow.addEventListener("click", function (e) {
                if (e.target.closest('.save-btn')) {
                    const cells = this.querySelectorAll('td:not(:last-child)');
                    let hasChanged = false; // Para verificar si algo ha cambiado

                    cells.forEach(cell => {
                        const input = cell.querySelector('input');
                        if (input) {
                            const newValue = input.value.trim();
                            const originalValue = input.defaultValue.trim();

                            if (newValue !== originalValue) {
                                hasChanged = true; // Se ha modificado algo
                                cell.innerText = newValue; // Guardar el nuevo valor
                            } else {
                                cell.innerText = originalValue; // Mantener el valor original
                            }
                        }
                    });

                    // Cambiar el botón de guardar a editar si algo cambió o no
                    const button = this.querySelector('.save-btn');
                    if (hasChanged) {
                        button.innerHTML = '<i class="fas fa-edit"></i>';
                    } else {
                        button.innerHTML = '<i class="fas fa-edit"></i>';
                    }
                    button.classList.remove('save-btn');
                    button.classList.add('edit-btn');
                }
            });
        }
    });
});

//Función para eliminar el recibo.
function reloadPage() {
  location.reload(true);
}

//Botón para volver al menu principal
document.getElementById("back-button").addEventListener("click", function () {
  window.location.href = "/private/mainMenu.html";
});
