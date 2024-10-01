// export async function readAllCustomers() {

//     try {
//         const response = await fetch('/data/customers.json');
//         if (!response.ok) {
//             throw new Error('Response status: ${response.status}');
//         }
//         const json = await response.json();
//         return json.customers
//     }
//     catch (error) {
//         console.error(error.message);
//     }
// }

export async function readAllCustomers() {
    const query = `
        {
            customers {
                items {
                    id
                    name
                    address
                    city
                    phone
                    email
                    created
                    created_by
                }
            }
        }`;
    const endpoint = '/data-api/graphql';
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
    });
    const result = await response.json();
    console.table(result.data.customers.items);
    return result.data.customers.items;
}

export async function createNewCustomer(customerData) {
    try {
        const response = await fetch('/data/customers.json', {
            method: "POST",
            body: customerData,
        });
        if (!response.ok) {
            throw new Error('Response status: ${response.status}');
        }
    }
    catch (error) {
        console.error(error.message);
    }
}