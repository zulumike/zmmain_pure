import { updateInvoice, getInvoice, deleteInvoice, readAllCustomers, readAllProducts } from "../scripts/dbfunctions.js";
import { loaderOn, loaderOff } from "../scripts/functions.js";

let invoiceData = {};
let productList = [];

const documentForm = document.getElementById("documentform");
documentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loaderOn();
    const documentFormData = new FormData(documentForm);
    const documentData = Object.fromEntries(documentFormData);
    documentData.customer = parseInt(documentData.customer);
    documentData.invoiceLines = invoiceData.invoiceLines;
    documentData.sum = calculateInvoice();
    await updateInvoice(documentId, documentData);
    loaderOff();
    window.location.replace('/invoices/invoicelist.html');
})

function calculateInvoice() {
    let invoiceSum = 0;
    if (invoiceData.invoiceLines.length > 0) {
        for (let i = 0; i < invoiceData.invoiceLines.length; i++) {
            invoiceSum = invoiceSum + invoiceData.invoiceLines[i].price * invoiceData.invoiceLines[i].amount;   
        }
    }
    return invoiceSum;
}

function presentInvoiceLines() {
    const existingTable = document.getElementById('invoicelinetable');
    if (existingTable != null) {
        existingTable.remove();
    }
    const invoiceLineDiv = document.getElementById('invoicelinediv');
    const olTable = document.createElement('table');
    olTable.classList = ['list-table'];
    olTable.id = 'invoicelinetable';
    const tableHeading = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    olTable.appendChild(tableHeading);    
    olTable.appendChild(tableBody);    
    invoiceLineDiv.appendChild(olTable);
    const headingRow = tableHeading.insertRow(0);
    const hCell1 = headingRow.insertCell(0);
    hCell1.innerText = 'Dato:';
    const hCell2 = headingRow.insertCell(1);
    hCell2.innerText = 'Produktnr:';
    const hCell3 = headingRow.insertCell(2);
    hCell3.innerText = 'Produkt-tekst:';
    const hCell4 = headingRow.insertCell(3);
    hCell4.innerText = 'Pris:';
    const hCell5 = headingRow.insertCell(4);
    hCell5.innerText = 'Antall:';
    const hCell6 = headingRow.insertCell(5);
    hCell6.innerText = 'Enhet:';
    const hCell7 = headingRow.insertCell(6);
    hCell7.innerText = 'Beløp:';
    const hCell8 = headingRow.insertCell(7);
    hCell8.innerText = 'Kommentar:';
    for (let i = 0; i < invoiceData.invoiceLines.length; i++) {
        const bodyRow = tableBody.insertRow(-1);
        const date = bodyRow.insertCell(0);
        const product = bodyRow.insertCell(1);
        const productName = bodyRow.insertCell(2);
        const price = bodyRow.insertCell(3);
        const amount = bodyRow.insertCell(4);
        const unit = bodyRow.insertCell(5);
        const sum = bodyRow.insertCell(6);
        const comment = bodyRow.insertCell(7);
        const ilDate = new Date(invoiceData.invoiceLines[i].date);
        date.innerText = ilDate.toLocaleDateString();
        product.innerText = invoiceData.invoiceLines[i].product;
        const selectedProduct = productList.find((element) => element.id == invoiceData.invoiceLines[i].product);
        productName.innerText = selectedProduct.name;
        price.innerText = invoiceData.invoiceLines[i].price.toLocaleString("nb-NO", {minimumFractionDigits: 2});
        amount.innerText = invoiceData.invoiceLines[i].amount.toLocaleString("nb-NO", {minimumFractionDigits: 2});
        unit.innerText = invoiceData.invoiceLines[i].unit;
        sum.innerText = (invoiceData.invoiceLines[i].price * invoiceData.invoiceLines[i].amount).toLocaleString("nb-NO", {minimumFractionDigits: 2});
        comment.innerText = invoiceData.invoiceLines[i].comment;
        bodyRow.addEventListener('click', () => {
            populateInvoiceLineForm(invoiceData.invoiceLines[i]);
            invoiceData.invoiceLines.splice(i, 1);
            presentInvoiceLines();
        });
    }
    const invoiceSumText = document.getElementById('invoicesumtext');
    invoiceSumText.innerText = 'Fakturasum: ' + calculateInvoice().toLocaleString("nb-NO", {minimumFractionDigits: 2});
}
function addInvoiceLine(event, invoiceLineForm) {
    event.preventDefault();
    const invoiceLineFormData = new FormData(invoiceLineForm);
    const invoiceLineData = Object.fromEntries(invoiceLineFormData);
    invoiceLineData.price = parseFloat(invoiceLineData.price);
    invoiceLineData.amount = parseFloat(invoiceLineData.amount);
    invoiceData.invoiceLines.push(invoiceLineData);
    presentInvoiceLines(invoiceData.invoiceLines);
}

async function invoiceLineForm() {
    productList = await readAllProducts();
    const invoiceLineForm = document.getElementById('invoicelineform');
    const dateDiv = document.createElement('div');
    const dateLabel = document.createElement('label');
    dateLabel.for = 'date';
    dateLabel.innerText = 'Dato';
    const emptyILDate = document.createElement('input');
    emptyILDate.type = 'date';
    emptyILDate.id = 'ildate';
    emptyILDate.name = 'date';
    const today = new Date();
    emptyILDate.valueAsDate = today;
    dateDiv.appendChild(dateLabel);
    dateDiv.appendChild(emptyILDate);

    const productDiv = document.createElement('div');
    const productIdLabel = document.createElement('label');
    productIdLabel.for = 'productid';
    productIdLabel.innerText = 'Produkt';
    const emptyILProductId = document.createElement('select');
    emptyILProductId.id = 'ilproductid';
    emptyILProductId.name = 'product';
    const blankProduct = document.createElement('option');
    blankProduct.textContent = 'Velg produkt';
    emptyILProductId.appendChild(blankProduct);
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].active) {
            const productOption = document.createElement('option');
            productOption.textContent = productList[i].id.toString() + '-' + productList[i].name;
            productOption.value = productList[i].id;
            productOption.id = productList[i].id;
            emptyILProductId.appendChild(productOption);
        }
    }
    productDiv.appendChild(productIdLabel);
    productDiv.appendChild(emptyILProductId);

    const amountDiv = document.createElement('div');
    const amountLabel = document.createElement('label');
    amountLabel.for = 'ilamount';
    amountLabel.innerText = 'Antall';
    const emptyILAmount = document.createElement('input');
    emptyILAmount.type = 'number';
    emptyILAmount.id = 'ilamount';
    emptyILAmount.name = 'amount';
    emptyILAmount.value = 1;
    amountDiv.appendChild(amountLabel);
    amountDiv.appendChild(emptyILAmount);

    const unitDiv = document.createElement('div');
    const unitLabel = document.createElement('label');
    unitLabel.for = 'ilunit';
    unitLabel.innerText = 'Enhet';
    const emptyILUnit = document.createElement('input');
    emptyILUnit.type = 'text';
    emptyILUnit.id = 'ilunit';
    emptyILUnit.name = 'unit';
    unitDiv.appendChild(unitLabel);
    unitDiv.appendChild(emptyILUnit);

    const priceDiv = document.createElement('div');
    const priceLabel = document.createElement('label');
    priceLabel.for = 'ilprice';
    priceLabel.innerText = 'Pris';
    const emptyILPrice = document.createElement('input');
    emptyILPrice.type = 'number';
    emptyILPrice.id = 'ilprice';
    emptyILPrice.name = 'price';
    priceDiv.appendChild(priceLabel);
    priceDiv.appendChild(emptyILPrice);

    const commentDiv = document.createElement('div');
    const divLabel = document.createElement('label');
    divLabel.for = 'ilcomment';
    divLabel.innerText = 'Kommentar';
    const emptyILComment = document.createElement('input');
    emptyILComment.type = 'text';
    emptyILComment.id = 'ilcomment';
    emptyILComment.name = 'comment';
    commentDiv.appendChild(divLabel);
    commentDiv.appendChild(emptyILComment);

    // prefill inputs based on selected product
    emptyILProductId.addEventListener('change', (event) => {
        const selectedProduct = productList.find((element) => element.id == event.target.value);
        emptyILPrice.value = selectedProduct.price;
        emptyILUnit.value = selectedProduct.unit;
    })

    const submitInvoiceLine = document.createElement('input');
    submitInvoiceLine.type = 'submit';
    submitInvoiceLine.value = 'Legg til';
    
    invoiceLineForm.addEventListener('submit', (event) => {
        addInvoiceLine(event, invoiceLineForm);
        invoiceLineForm.reset();
        emptyILDate.valueAsDate = today;
    })

    const resetInvoiceLineForm = document.createElement('input');
    resetInvoiceLineForm.type = 'reset';
    
    invoiceLineForm.appendChild(dateDiv);
    invoiceLineForm.appendChild(productDiv);
    invoiceLineForm.appendChild(priceDiv);
    invoiceLineForm.appendChild(amountDiv);
    invoiceLineForm.appendChild(unitDiv);
    invoiceLineForm.appendChild(commentDiv);
    invoiceLineForm.appendChild(submitInvoiceLine);
    invoiceLineForm.appendChild(resetInvoiceLineForm);
}

function populateInvoiceLineForm(invoiceLineData) {
    document.getElementById('ildate').value = invoiceLineData.date;
    document.getElementById(invoiceLineData.product).selected = true;
    document.getElementById('ilprice').value = invoiceLineData.price;
    document.getElementById('ilamount').value = invoiceLineData.amount;
    document.getElementById('ilunit').value = invoiceLineData.unit;
    document.getElementById('ilcomment').value = invoiceLineData.comment;
}

async function populatedocumentForm(documentId) {
    loaderOn();
    invoiceData = await getInvoice(documentId)
    document.getElementById('formheading').textContent = 'Fakturanr: ' + invoiceData.id;
    document.getElementById('customer').value = invoiceData.customer;
    const customerList = await readAllCustomers();
    const customerSelect = document.getElementById('customer');
    for (let i = 0; i < customerList.length; i++) {
        if (!customerList[i].deleted) {
            const customerOption = document.createElement('option');
            customerOption.textContent = customerList[i].name;
            customerOption.value = customerList[i].id;
            if (invoiceData.customer === parseInt(customerList[i].id)) {
                customerOption.selected = true;
            }
            customerSelect.appendChild(customerOption);
        }
    }
    document.getElementById('name').value = invoiceData.name;
    document.getElementById('date').value = invoiceData.date;
    const createdText = document.getElementById('created-text');
    const updatedText = document.getElementById('updated-text');
    const createdTime = new Date(invoiceData.created);
    createdText.textContent = 'Opprettet: ' + createdTime.toLocaleString() +
        ' av ' + invoiceData.created_by;
    if (invoiceData.updated != null) {
        const updatedTime = new Date(invoiceData.updated);
        updatedText.textContent = 'Sist oppdatert: ' + updatedTime.toLocaleString() + 
            ' av ' + invoiceData.updated_by;
    }
    else {
        updatedText.remove();
    }
    await invoiceLineForm();
    if (invoiceData.invoiceLines.length > 0) {
        presentInvoiceLines();
    }
  
    loaderOff();
}

async function deleteDocumentById() {
    if (confirm('Er du sikker på at du vil slette ordren?')) {
        loaderOn();
        await deleteInvoice(documentId);
        loaderOff();
        window.location.replace('/invoices/invoicelist.html');
    }
}

const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');
populatedocumentForm(documentId);
document.getElementById('delBtn').addEventListener('click', deleteDocumentById);