import { readAllCustomers } from "/scripts/dbfunctions.js";

async function getCustomerList() {
    const customerList = await readAllCustomers();
    console.log(customerList);
    const table = document.getElementById("cust-table-body");
    for (let i = 0; i < customerList.length; i++) {
        const newRow = table.insertRow(-1);
        const custNr = newRow.insertCell(0);
        const custName = newRow.insertCell(1);
        custNr.innerText = customerList[i].id;
        custName.innerText = customerList[i].name;
        newRow.addEventListener('click', () => {
            window.location.href = 'newcustomer.html';
        })
    }
}

getCustomerList();