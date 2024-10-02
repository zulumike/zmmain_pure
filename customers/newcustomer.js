import { createCustomer } from "/scripts/dbfunctions.js";

const customerForm = document.getElementById("customerform");
customerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const customerFormData = new FormData(customerForm);
    const customerData = Object.fromEntries(customerFormData);
    await createCustomer(customerData);
    window.location.replace('/customers/customerlist.html');
})