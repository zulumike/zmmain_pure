import { updateCustomer, getCustomer } from "/scripts/dbfunctions.js";

const customerForm = document.getElementById("customerform");
customerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const customerFormData = new FormData(customerForm);
    const customerData = Object.fromEntries(customerFormData);
    await createCustomer(customerData);
    window.location.replace('/customers/customerlist.html');
})

async function populateCustomerForm(customerId) {
    const customerData = await getCustomer(customerId)
    console.log(customerData);
    document.getElementById('name').setAttribute('value', customerData.name);
    document.getElementById('address').setAttribute('value', customerData.address);
    document.getElementById('zip').setAttribute('value', customerData.zip);
    document.getElementById('city').setAttribute('value', customerData.city);
    document.getElementById('phone').setAttribute('value', customerData.phone);
    document.getElementById('email').setAttribute('value', customerData.email);
}

const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get('id');
populateCustomerForm(customerId);