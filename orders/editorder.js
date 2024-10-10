import { updateDocument, getDocument, deleteDocument, readAllCustomers, readAllProducts } from "./dbfunctions.js";
import { loaderOn, loaderOff } from "../scripts/functions.js";

let orderData = {};

const documentForm = document.getElementById("documentform");
documentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loaderOn();
    const documentFormData = new FormData(documentForm);
    const documentData = Object.fromEntries(documentFormData);
    documentData.customer = parseInt(documentData.customer);
    documentData.orderLines = orderData.orderLines;
    await updateDocument(documentId, documentData);
    loaderOff();
    window.location.replace('/orders/orderlist.html');
})

function presentOrderLines(orderLines) {
    const existingTable = document.getElementById('orderlinetable');
    if (existingTable != null) {
        existingTable.remove();
    }
    const orderLineDiv = document.getElementById('orderlinediv');
    const olTable = document.createElement('table');
    olTable.classList = ['list-table'];
    olTable.id = 'orderlinetable';
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
        sum.innerText = orderLines[i].price * orderLines[i].amount;
        comment.innerText = orderLines[i].comment;
        bodyRow.addEventListener('click', () => {
            populateOrderLineForm(orderLines[i]);
        });
    }
}
function addOrderLine(event, orderLineForm) {
    event.preventDefault();
    const orderLineFormData = new FormData(orderLineForm);
    const orderLineData = Object.fromEntries(orderLineFormData);
    orderLineData.price = parseFloat(orderLineData.price);
    orderLineData.amount = parseFloat(orderLineData.amount);
    orderData.orderLines.push(orderLineData);
    presentOrderLines(orderData.orderLines);
    console.table(orderLineData);
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
    emptyOLDate.name = 'date';
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
    emptyOLProductId.name = 'product';
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
    emptyOLAmount.name = 'amount';
    amountDiv.appendChild(amountLabel);
    amountDiv.appendChild(emptyOLAmount);

    const unitDiv = document.createElement('div');
    const unitLabel = document.createElement('label');
    unitLabel.for = 'olunit';
    unitLabel.innerText = 'Enhet';
    const emptyOLUnit = document.createElement('input');
    emptyOLUnit.type = 'text';
    emptyOLUnit.id = 'olunit';
    emptyOLUnit.name = 'unit';
    unitDiv.appendChild(unitLabel);
    unitDiv.appendChild(emptyOLUnit);

    const priceDiv = document.createElement('div');
    const priceLabel = document.createElement('label');
    priceLabel.for = 'olprice';
    priceLabel.innerText = 'Pris';
    const emptyOLPrice = document.createElement('input');
    emptyOLPrice.type = 'number';
    emptyOLPrice.id = 'olprice';
    emptyOLPrice.name = 'price';
    priceDiv.appendChild(priceLabel);
    priceDiv.appendChild(emptyOLPrice);

    const commentDiv = document.createElement('div');
    const divLabel = document.createElement('label');
    divLabel.for = 'olcomment';
    divLabel.innerText = 'Kommentar';
    const emptyOLComment = document.createElement('input');
    emptyOLComment.type = 'text';
    emptyOLComment.id = 'olcomment';
    emptyOLComment.name = 'comment';
    commentDiv.appendChild(divLabel);
    commentDiv.appendChild(emptyOLComment);

    const submitOrderLine = document.createElement('input');
    submitOrderLine.type = 'submit';
    submitOrderLine.value = 'Legg til';
    
    orderLineForm.addEventListener('submit', (event) => {
        addOrderLine(event, orderLineForm);
        orderLineForm.reset();
    })

    const resetOrderLineForm = document.createElement('input');
    resetOrderLineForm.type = 'reset';
    
    orderLineForm.appendChild(dateDiv);
    orderLineForm.appendChild(productDiv);
    orderLineForm.appendChild(priceDiv);
    orderLineForm.appendChild(amountDiv);
    orderLineForm.appendChild(unitDiv);
    orderLineForm.appendChild(commentDiv);
    orderLineForm.appendChild(submitOrderLine);
    orderLineForm.appendChild(resetOrderLineForm);
}

function populateOrderLineForm(orderLineData) {
    document.getElementById('oldate').value = orderLineData.date;
    document.getElementById('olproductid').value = orderLineData.product;
    document.getElementById('olprice').value = orderLineData.price;
    document.getElementById('olamount').value = orderLineData.amount;
    document.getElementById('olunit').value = orderLineData.unit;
    document.getElementById('olcomment').value = orderLineData.comment;
    console.log(typeof(document.getElementById('olproductid').value));
}

async function populatedocumentForm(documentId) {
    loaderOn();
    orderData = await getDocument(documentId)
    document.getElementById('formheading').textContent = 'Ordrenr: ' + orderData.id;
    document.getElementById('customer').value = orderData.customer;
    const customerList = await readAllCustomers();
    const customerSelect = document.getElementById('customer');
    for (let i = 0; i < customerList.length; i++) {
        if (!customerList[i].deleted) {
            const customerOption = document.createElement('option');
            customerOption.textContent = customerList[i].name;
            customerOption.value = customerList[i].id;
            if (orderData.customer === parseInt(customerList[i].id)) {
                customerOption.selected = true;
            }
            customerSelect.appendChild(customerOption);
        }
    }
    document.getElementById('name').value = orderData.name;
    document.getElementById('date').value = orderData.date;
    const createdText = document.getElementById('created-text');
    const updatedText = document.getElementById('updated-text');
    const createdTime = new Date(orderData.created);
    createdText.textContent = 'Opprettet: ' + createdTime.toLocaleString() +
        ' av ' + orderData.created_by;
    if (orderData.updated != null) {
        const updatedTime = new Date(orderData.updated);
        updatedText.textContent = 'Sist oppdatert: ' + updatedTime.toLocaleString() + 
            ' av ' + orderData.updated_by;
    }
    else {
        updatedText.remove();
    }
    orderLineForm();
    if (orderData.orderLines.length > 0) {
        presentOrderLines(orderData.orderLines);
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