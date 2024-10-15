import { readAllInvoices, readAllCustomers } from "../scripts/dbfunctions.js";
import { loaderOn, loaderOff } from "../scripts/functions.js";

async function getDocumentList() {
    loaderOn();
    const documentList = await readAllInvoices();
    const customerList = await readAllCustomers();
    const table = document.getElementById("table-body");
    for (let i = 0; i < documentList.length; i++) {
        if (!documentList[i].deleted) {
            const newRow = table.insertRow(-1);
            const orderDate = newRow.insertCell(0);
            const orderNr = newRow.insertCell(1);
            const customerName = newRow.insertCell(2);
            const orderName = newRow.insertCell(3);
            const orderSum = newRow.insertCell(4);
            const orderDueDate = newRow.insertCell(4);
            orderDate.innerText = documentList[i].date;
            orderNr.innerText = documentList[i].id;
            for (let y = 0; y < customerList.length; y++) {
                if (documentList[i].customer == customerList[y].id) {
                    customerName.innerText = customerList[y].name;
                }
            }
            orderName.innerText = documentList[i].name;
            orderSum.innerText = documentList[i].sum.toLocaleString("nb-NO", {minimumFractionDigits: 2});
            orderDueDate.innerText = documentList[i].duedate;
            newRow.addEventListener('click', () => {
                window.location.href = 'editinvoice.html?id=' + documentList[i].id;
            })
        }
    }
    loaderOff();
}

getDocumentList();