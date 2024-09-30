import { createNewCustomer } from "/scripts/dbfunctions.js";

const customerForm = document.getElementById("customerform");
customerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const customerFormData = new FormData(customerForm);
    createNewCustomer(customerFormData);
})