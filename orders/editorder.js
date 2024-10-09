import { updateDocument, getDocument, deleteDocument, readAllCustomers, readAllProducts } from "./dbfunctions.js";
import { loaderOn, loaderOff } from "../scripts/functions.js";

const documentForm = document.getElementById("documentform");
documentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loaderOn();
    const documentFormData = new FormData(documentForm);
    const documentData = Object.fromEntries(documentFormData);
    await updateDocument(documentId, documentData);
    loaderOff();
    window.location.replace('/customers/customerlist.html');
})

function presentOrderLines(orderLines) {
    const orderLineDiv = document.getElementById('orderlinediv');
    const olTable = document.createElement('table');
    olTable.classList = ['list-table'];
    const tableHeading = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    olTable.appendChild(tableHeading);    
    olTable.appendChild(tableBody);    
    orderLineDiv.appendChild(olTable);
    const headingRow = tableHeading.insertRow(0);
    const hCell1 = headingRow.insertCell(0);
    hCell1.innerText = 'Dato:';
    const hCell2 = headingRow.insertCell(1);
    hCell2.innerText = 'Produkt:';
    const hCell3 = headingRow.insertCell(2);
    hCell3.innerText = 'Pris:';
    const hCell4 = headingRow.insertCell(3);
    hCell4.innerText = 'Antall:';
    const hCell5 = headingRow.insertCell(4);
    hCell5.innerText = 'Enhet:';
    const hCell6 = headingRow.insertCell(5);
    hCell6.innerText = 'Beløp:';
    const hCell7 = headingRow.insertCell(6);
    hCell7.innerText = 'Kommentar:';
    console.table(orderLines);
    for (let i = 0; i < orderLines.length; i++) {
        const bodyRow = tableBody.insertRow(-1);
        const date = bodyRow.insertCell(0);
        const product = bodyRow.insertCell(1);
        const price = bodyRow.insertCell(2);
        const amount = bodyRow.insertCell(3);
        const unit = bodyRow.insertCell(4);
        const sum = bodyRow.insertCell(5);
        const comment = bodyRow.insertCell(6);
        date.innerText = orderLines[i].date;
        product.innerText = orderLines[i].product;
        price.innerText = orderLines[i].price;
        amount.innerText = orderLines[i].amount;
        unit.innerText = orderLines[i].unit;
        sum.innerText = orderLines[i].sum;
        comment.innerText = orderLines[i].comment;
    }
}

async function orderLineForm() {
    const productList = await readAllProducts();
    const orderLineForm = document.getElementById('orderlineform');

    const dateDiv = document.createElement('div');
    const dateLabel = document.createElement('label');
    dateLabel.for = 'date';
    dateLabel.innerText = 'Dato';
    const emptyOLDate = document.createElement('input');
    emptyOLDate.type = 'date';
    emptyOLDate.id = 'oldate';
    emptyOLDate.name = 'oldate';
    const today = new Date();
    emptyOLDate.valueAsDate = today;
    dateDiv.appendChild(dateLabel);
    dateDiv.appendChild(emptyOLDate);

    const productDiv = document.createElement('div');
    const productIdLabel = document.createElement('label');
    productIdLabel.for = 'productid';
    productIdLabel.innerText = 'Produkt';
    const emptyOLProductId = document.createElement('select');
    emptyOLProductId.id = 'olproductid';
    emptyOLProductId.name = 'olproductid';
    const blankProduct = document.createElement('option');
    blankProduct.textContent = 'Velg produkt';
    emptyOLProductId.appendChild(blankProduct);
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].active) {
            const productOption = document.createElement('option');
            productOption.textContent = productList[i].id.toString() + '-' + productList[i].name;
            productOption.value = productList[i].id;
            emptyOLProductId.appendChild(productOption);
        }
    }
    productDiv.appendChild(productIdLabel);
    productDiv.appendChild(emptyOLProductId);

    const amountDiv = document.createElement('div');
    const amountLabel = document.createElement('label');
    amountLabel.for = 'olamount';
    amountLabel.innerText = 'Antall';
    const emptyOLAmount = document.createElement('input');
    emptyOLAmount.type = 'number';
    emptyOLAmount.id = 'olamount';
    emptyOLAmount.name = 'olamount';
    amountDiv.appendChild(amountLabel);
    amountDiv.appendChild(emptyOLAmount);

    const unitDiv = document.createElement('div');
    const unitLabel = document.createElement('label');
    unitLabel.for = 'olunit';
    unitLabel.innerText = 'Enhet';
    const emptyOLUnit = document.createElement('input');
    emptyOLUnit.type = 'text';
    emptyOLUnit.id = 'olunit';
    emptyOLUnit.name = 'olunit';
    unitDiv.appendChild(unitLabel);
    unitDiv.appendChild(emptyOLUnit);

    const priceDiv = document.createElement('div');
    const priceLabel = document.createElement('label');
    priceLabel.for = 'olprice';
    priceLabel.innerText = 'Pris';
    const emptyOLPrice = document.createElement('input');
    emptyOLPrice.type = 'number';
    emptyOLPrice.id = 'olprice';
    emptyOLPrice.name = 'olprice';
    priceDiv.appendChild(priceLabel);
    priceDiv.appendChild(emptyOLPrice);

    const sumDiv = document.createElement('div');
    const sumLabel = document.createElement('label');
    sumLabel.for = 'olsum';
    sumLabel.innerText = 'Beløp';
    const emptyOLSum = document.createElement('input');
    emptyOLSum.type = 'number';
    emptyOLSum.id = 'olsum';
    emptyOLSum.name = 'olsum';
    sumDiv.appendChild(sumLabel);
    sumDiv.appendChild(emptyOLSum);

    const commentDiv = document.createElement('div');
    const divLabel = document.createElement('label');
    divLabel.for = 'olcomment';
    divLabel.innerText = 'Kommentar';
    const emptyOLComment = document.createElement('input');
    emptyOLComment.type = 'number';
    emptyOLComment.id = 'olcomment';
    emptyOLComment.name = 'olcomment';
    commentDiv.appendChild(divLabel);
    commentDiv.appendChild(emptyOLComment);

    orderLineForm.appendChild(dateDiv);
    orderLineForm.appendChild(productDiv);
    orderLineForm.appendChild(priceDiv);
    orderLineForm.appendChild(amountDiv);
    orderLineForm.appendChild(unitDiv);
    orderLineForm.appendChild(sumDiv);
    orderLineForm.appendChild(commentDiv);
}

async function populatedocumentForm(documentId) {
    loaderOn();
    const documentData = await getDocument(documentId)
    document.getElementById('formheading').textContent = 'Ordrenr: ' + documentData.id;
    document.getElementById('customer').value = documentData.customer;
    const customerList = await readAllCustomers();
    const customerSelect = document.getElementById('customer');
    for (let i = 0; i < customerList.length; i++) {
        if (!customerList[i].deleted) {
            const customerOption = document.createElement('option');
            customerOption.textContent = customerList[i].name;
            customerOption.value = customerList[i].id;
            if (documentData.customer === customerList[i].id) {
                customerOption.selected;
            }
            customerSelect.appendChild(customerOption);
        }
    }
    document.getElementById('name').value = documentData.name;
    document.getElementById('date').value = documentData.date;
    const createdText = document.getElementById('created-text');
    const updatedText = document.getElementById('updated-text');
    const createdTime = new Date(documentData.created);
    createdText.textContent = 'Opprettet: ' + createdTime.toLocaleString() +
        ' av ' + documentData.created_by;
    if (documentData.updated != null) {
        const updatedTime = new Date(documentData.updated);
        updatedText.textContent = 'Sist oppdatert: ' + updatedTime.toLocaleString() + 
            ' av ' + documentData.updated_by;
    }
    else {
        updatedText.remove();
    }
    orderLineForm();
    if (documentData.orderLines.length > 0) {
        presentOrderLines(documentData.orderLines);
    }
    loaderOff();
}

async function deleteDocumentById() {
    if (confirm('Er du sikker på at du vil slette kunden?')) {
        loaderOn();
        await deleteDocument(documentId);
        loaderOff();
        window.location.replace('/customers/customerlist.html');
    }
}

const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');
populatedocumentForm(documentId);
document.getElementById('delBtn').addEventListener('click', deleteDocumentById);