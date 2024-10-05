import { updateCustomer, getCustomer, deleteCustomer } from "/scripts/dbfunctions.js";

const customerForm = document.getElementById("customerform");
customerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const customerFormData = new FormData(customerForm);
    const customerData = Object.fromEntries(customerFormData);
    await updateCustomer(customerId, customerData);
    window.location.replace('/customers/customerlist.html');
})

async function populateCustomerForm(customerId) {
    const customerData = await getCustomer(customerId)
    document.getElementById('name').setAttribute('value', customerData.name);
    document.getElementById('address').setAttribute('value', customerData.address);
    document.getElementById('zip').setAttribute('value', customerData.zip);
    document.getElementById('city').setAttribute('value', customerData.city);
    document.getElementById('phone').setAttribute('value', customerData.phone);
    document.getElementById('email').setAttribute('value', customerData.email);
    const createdText = document.getElementById('created-text');
    const updatedText = document.getElementById('updated-text');
    createdText.textContent = 'Opprettet: ' + customerData.created;
    if (customerData.updated != null) {
        updatedText.textContent = 'Sist oppdatert: ' + customerData.updated;
    }
    else {
        updatedText.remove();
    }
}

async function deleteCustomerById() {
    if (confirm('Er du sikker på at du vil slette kunden?')) {
        await deleteCustomer(customerId);
        window.location.replace('/customers/customerlist.html');
    }
}

const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get('id');
populateCustomerForm(customerId);
document.getElementById('delBtn').addEventListener('click', deleteCustomerById);