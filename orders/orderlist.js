import { readAllDocuments } from "./dbfunctions.js";

async function getDocumentList() {
    const documentList = await readAllDocuments();
    const table = document.getElementById("table-body");
    for (let i = 0; i < documentList.length; i++) {
        if (!documentList[i].deleted) {
            const newRow = table.insertRow(-1);
            const orderNr = newRow.insertCell(0);
            const orderName = newRow.insertCell(1);
            const orderSum = newRow.insertCell(2);
            orderNr.innerText = documentList[i].id;
            orderName.innerText = documentList[i].name;
            orderSum.innerText = documentList[i].sum;
            newRow.addEventListener('click', () => {
                window.location.href = 'editorder.html?id=' + documentList[i].id;
            })
        }
    }
}

getDocumentList();