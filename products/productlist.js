import { readAllDocuments } from "./dbfunctions.js";

async function getDocumentList() {
    const documentList = await readAllDocuments();
    const table = document.getElementById("table-body");
    for (let i = 0; i < documentList.length; i++) {
        if (!documentList[i].deleted) {
            const newRow = table.insertRow(-1);
            const productNr = newRow.insertCell(0);
            const productName = newRow.insertCell(1);
            const productPrice = newRow.insertCell(2);
            productNr.innerText = documentList[i].id;
            productName.innerText = documentList[i].name;
            productPrice.innerText = documentList[i].price;
            newRow.addEventListener('click', () => {
                window.location.href = 'editproduct.html?id=' + documentList[i].id;
            })
        }
    }
}

getDocumentList();