import { createDocument } from "./dbfunctions.js";
import { loaderOn, loaderOff } from "../scripts/functions.js";

const documentForm = document.getElementById("documentform");
documentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loaderOn();
    const documentFormData = new FormData(documentForm);
    const documentData = Object.fromEntries(documentFormData);
    documentData.active = true;
    await createDocument(documentData);
    loaderOff();
    window.location.replace('/order/orderlist.html');
});

const dateInput = document.getElementById('date');
const today = new Date();
dateInput.valueAsDate = today;