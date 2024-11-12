import { readAllCustomers, createInvoice } from "../scripts/dbfunctions.js";
import { loaderOn, loaderOff } from "../scripts/functions.js";

let customers = [];

function calculatePrice() {
    let invoiceData = [];
    let totalAmount = 0;
    let invoiceAmount = 0;
    const formData = new FormData(costForm);
    const formObjects = Object.fromEntries(formData);
    const objectArray = Object.keys(formObjects);
    for (let i = 0; i < (objectArray.length - 2); i++) {
        const custInvoice = {
            customer: parseInt(objectArray[i]),
            amount: parseFloat(formObjects[objectArray[i]])
        };
        if (custInvoice.amount > 0) {
            invoiceAmount++;
        }
        totalAmount = totalAmount + custInvoice.amount;
        invoiceData.push(custInvoice);
    }
    const returnData = {
        invoiceData: invoiceData,
        totalAmount: totalAmount,
        invoiceAmount: invoiceAmount
    }
    return returnData;
}

function calculateInvoices(pricePerCust) {
    const returnedData = calculatePrice();
    const invoicesSum = pricePerCust * returnedData.totalAmount;
    invoiceInfoText.innerText = 'Antall faktura: ' + returnedData.invoiceAmount + ' Totalsum fakturaer: ' + invoicesSum;
}

async function alterForm() {
    customers = await readAllCustomers();
    for (let i = 0; i < customers.length; i++) {
        if (!customers[i].deleted) {
            const nrLabel = document.createElement('label');
            nrLabel.innerText = customers[i].name;
            nrLabel.for = customers[i].id.toString(); 
            const nrInput = document.createElement('input');
            nrInput.type = 'number';
            nrInput.step = '0.01';
            nrInput.value = 0;
            nrInput.id = customers[i].id.toString();
            nrInput.name = customers[i].id.toString();
            costForm.appendChild(nrLabel);
            costForm.appendChild(nrInput);
            nrInput.addEventListener('change', () => {
                const returnedData = calculatePrice();
                pricePerCustomerInput.value = costSum / returnedData.totalAmount;
                calculateInvoices(costSum / returnedData.totalAmount)
            })
        }
    }

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Lag fakturaer';
    costForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        loaderOn();
        loaderOff();
        // window.location.replace('/costs/costlist.html');
    });
    const cancelBtn = document.createElement('input');
    cancelBtn.type = 'button';
    cancelBtn.value = 'Avbryt';
    cancelBtn.id = 'cancelbtn';
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'editcost.html?id=' + costId;
    })
    costForm.appendChild(submitBtn);
    costForm.appendChild(cancelBtn);
}

const urlParams = new URLSearchParams(window.location.search);
const costId = parseInt(urlParams.get('id'));
const costSum = parseFloat(urlParams.get('sum'));

const costInfo = document.getElementById('costinfo');
costInfo.innerText = 'Bilagsnr: ' + costId + ' Sum: ' + costSum.toLocaleString("nb-NO", {minimumFractionDigits: 2});

const costForm = document.getElementById('costform');

const invoiceInfoText = document.getElementById('invoiceinfo');
const pricePerCustomerInput = document.getElementById('price');
pricePerCustomerInput.addEventListener('change', (event) => {
    calculateInvoices(event.target.value);
})

alterForm();