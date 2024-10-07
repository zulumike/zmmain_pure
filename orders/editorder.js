import { updateDocument, getDocument, deleteDocument } from "./dbfunctions.js";

const documentForm = document.getElementById("documentform");
documentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const documentFormData = new FormData(documentForm);
    const documentData = Object.fromEntries(documentFormData);
    await updateDocument(documentId, documentData);
    window.location.replace('/customers/customerlist.html');
})

async function populatedocumentForm(customerId) {
    const documentData = await getDocument(customerId)
    document.getElementById('formheading').textContent = 'Kundenr: ' + documentData.id;
    document.getElementById('name').value = documentData.name;
    document.getElementById('address').value = documentData.address;
    document.getElementById('zip').value = documentData.zip;
    document.getElementById('city').value = documentData.city;
    document.getElementById('phone').value = documentData.phone;
    document.getElementById('email').value = documentData.email;
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
    if (confirm('Er du sikker på at du vil slette kunden?')) {
        await deleteDocument(documentId);
        window.location.replace('/customers/customerlist.html');
    }
}

const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('id');
populatedocumentForm(documentId);
document.getElementById('delBtn').addEventListener('click', deleteDocumentById);