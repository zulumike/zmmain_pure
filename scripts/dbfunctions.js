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

export async function getCustomer(custId) {
    const id = '1';
    const gql = `
    query getById($id: ID!) {
      customer_by_pk(id: $id) {
        id
        name
      }
    }`;

    const query = {
        query: gql,
        variables: {
            id: id,
        },
    };

    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
    });
    const result = await response.json();
    console.table(result.data.customer_by_pk);
    return result.data.customer_by_pk;
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