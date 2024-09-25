export async function readAllCustomers() {

    try {
        const response = await fetch('/data/customers.json');
        if (!response.ok) {
            throw new Error('Response status: ${response.status}');
        }
        const json = await response.json();
        return json.customers
    }
    catch (error) {
        console.error(error.message);
    }

    // fetch('/data/customers.json')
    //     .then((res) => {
    //         if (!res.ok) {
    //             throw new Error ('HTTP error! Status: ', res.status);
    //         }
    //         return res.json();
    //     })
    //     .then((data) => {
    //         console.log(data)
    //         return data;
    //     })
    //     .catch((error) => {
    //         console.error('Unable to fetch data: ', error)
    //     });
}