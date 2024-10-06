import { readAllDocuments } from "./dbfunctions.js";

async function getDocumentList() {
    const documentList = await readAllDocuments();
    const table = document.getElementById("table-body");
    for (let i = 0; i < documentList.length; i++) {
        if (!documentList[i].deleted) {
            const newRow = table.insertRow(-1);
            const custNr = newRow.insertCell(0);
            const custName = newRow.insertCell(1);
            const custCity = newRow.insertCell(2);
            custNr.innerText = documentList[i].id;
            custName.innerText = documentList[i].name;
            custCity.innerText = documentList[i].price;
            newRow.addEventListener('click', () => {
                window.location.href = 'editproduct.html?id=' + documentList[i].id;
            })
        }
    }
}

getDocumentList();