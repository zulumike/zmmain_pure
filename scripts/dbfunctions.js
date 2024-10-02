export async function getCompany(id) {

    const gql = `
      query getById($id: ID!) {
        company_by_pk(id: $id) {
            id
            name
            address
            city
            phone
            email
            nrSeries {
                customer
                order
                invoice
                cost    
            }
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    const result = await response.json();
    return result.data.company_by_pk;
  }

  export async function updateCompany(id, data) {

    const gql = `
      mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdatecompanyInput!) {
        updatecompany(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
            id
            name
            address
            city
            phone
            email
            nrSeries {
                customer
                order
                invoice
                cost    
            }
        }
      }`;
  
    const query = {
      query: gql,
      variables: {
        id: id,
        _partitionKeyValue: id,
        item: data
      } 
    };
  
    const endpoint = "/data-api/graphql";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });
  
    const result = await res.json();
    return result.data.updatecompany;
  }

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
    return result.data.customers.items;
}

export async function getCustomer(id) {

    const gql = `
      query getById($id: ID!) {
        customers_by_pk(id: $id) {
            id
            name
            address
            city
            phone
            email
            created
            created_by
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    const result = await response.json();
    return result.data.customers_by_pk;
  }

export async function updateCustomer(id, data) {

    const gql = `
      mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdatecustomersInput!) {
        updatecustomers(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
            id
            name
            address
            city
            phone
            email
            created
            created_by
        }
      }`;
  
    const query = {
      query: gql,
      variables: {
        id: id,
        _partitionKeyValue: id,
        item: data
      } 
    };
  
    const endpoint = "/data-api/graphql";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });
  
    const result = await res.json();
    return result.data.updatecustomers;
  }

export async function createCustomer(data) {

    const company = await getCompany('1');
    console.log(company);
    company.nrSeries.customer++
    console.log(company.nrSeries.customer);
    data.id = company.nrSeries.customer.toString();
    const timeNow = new Date();
    data.created = timeNow;

    const gql = `
      mutation create($item: CreatecustomersInput!) {
        createcustomers(item: $item) {
            id
            name
            address
            city
            phone
            email
            created
            created_by
        }
      }`;
    
    const query = {
      query: gql,
      variables: {
        item: data
      } 
    };
    
    const endpoint = "/data-api/graphql";
    const result = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });
  
    const response = await result.json();
    
    await updateCompany('1', company)
    
    return response.data.createcustomers;
  }