import { updateDocument, getDocument, deleteDocument } from "./dbfunctions.js";

const documentForm = document.getElementById("documentform");
documentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const documentFormData = new FormData(documentForm);
    const documentData = Object.fromEntries(documentFormData);
    documentData.price = parseFloat(documentData.price);
    documentData.storage = parseFloat(documentData.storage);
    documentData.account = parseInt(documentData.account);
    if (documentData.active === 'on') {
        documentData.active = true
    } 
    else {
        documentData.active = false;
    }
    if (documentData.webshop === 'on') {
        documentData.webshop = true
    }
    else {
        documentData.webshop = false;
    }
    await updateDocument(documentId, documentData);
    window.location.replace('/products/productlist.html');
})

async function populatedocumentForm(customerId) {
    const documentData = await getDocument(customerId)
    document.getElementById('id').value = documentData.id;
    document.getElementById('name').value = documentData.name;
    document.getElementById('description').value = documentData.description;
    document.getElementById('unit').value = documentData.unit;
    document.getElementById('price').value = documentData.price;
    document.getElementById('storage').value = documentData.storage;
    document.getElementById('account').value = documentData.account;
    document.getElementById('active').checked = documentData.active;
    document.getElementById('webshop').checked = documentData.webshop;
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
}

async function deleteDocumentById() {
    if (confirm('Er du sikker på at du vil slette produktet?')) {
        await deleteDocument(documentId);
        window.location.replace('/products/productlist.html');
    }
}

const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');
populatedocumentForm(documentId);
document.getElementById('delBtn').addEventListener('click', deleteDocumentById);