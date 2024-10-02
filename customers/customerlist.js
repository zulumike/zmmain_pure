import { readAllCustomers, getCustomer, updateCustomer, createCustomer } from "/scripts/dbfunctions.js";

async function getCustomerList() {
    const customerList = await readAllCustomers();
    const table = document.getElementById("cust-table-body");
    for (let i = 0; i < customerList.length; i++) {
        const newRow = table.insertRow(-1);
        const custNr = newRow.insertCell(0);
        const custName = newRow.insertCell(1);
        const custCity = newRow.insertCell(2);
        custNr.innerText = customerList[i].id;
        custName.innerText = customerList[i].name;
        custCity.innerText = customerList[i].city;
        newRow.addEventListener('click', () => {
            window.location.href = 'newcustomer.html';
        })
    }
}

async function getCustomerById(custId) {
    await getCustomer(custId);
}

getCustomerList();