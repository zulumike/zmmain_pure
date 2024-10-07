import { createDocument } from "./dbfunctions.js";

const documentForm = document.getElementById("documentform");
documentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const documentFormData = new FormData(documentForm);
    const documentData = Object.fromEntries(documentFormData);
    documentData.active = true;
    await createDocument(documentData);
    window.location.replace('/order/orderlist.html');
})