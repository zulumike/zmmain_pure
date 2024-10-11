import { getUserInfo } from "../scripts/auth.js";

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

export async function readAllDocuments() {
    const query = `
        {
            orders {
                items {
                    id
                    name
                    customer
                    date
                    active
                    sum
                    invoices
                    created
                    created_by
                    updated
                    updated_by
                    deleted
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
    return result.data.orders.items;
}

export async function getDocument(id) {

    const gql = `
      query getById($id: ID!) {
        orders_by_pk(id: $id) {
            id
            name
            customer
            date
            active
            sum
            invoices
            orderLines {
              id
              date
              product
              price
              amount
              unit
              comment
              user
            }
            created
            created_by
            updated
            updated_by
            deleted
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
    return result.data.orders_by_pk;
  }

export async function updateDocument(id, data) {
    const oldData = await getDocument(id);
    data.created = oldData.created;
    data.created_by = oldData.created_by;
    data.id = id;
    const timeNow = new Date();
    data.updated = timeNow;
    const currentUser = await getUserInfo();
    data.updated_by = currentUser.userDetails;

    const gql = `
      mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdateordersInput!) {
        updateorders(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
            id
            name
            customer
            date
            active
            sum
            invoices
            orderLines {
              id
              date
              product
              price
              amount
              unit
              comment
              user
            }
            created
            created_by
            updated
            updated_by
            deleted
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
    return result.data.updateorders;
  }

export async function createDocument(data) {

    const company = await getCompany('1');
    company.nrSeries.order++
    data.id = company.nrSeries.order.toString();
    const timeNow = new Date();
    data.created = timeNow;
    const currentUser = await getUserInfo();
    data.created_by = currentUser.userDetails;
    data.deleted = false;
    data.orderLines = [];
    data.sum = 0;

    const gql = `
      mutation create($item: CreateordersInput!) {
        createorders(item: $item) {
            id
            name
            customer
            date
            active
            sum
            invoices
            orderLines {
              id
              date
              product
              price
              amount
              unit
              comment
              user
            }
            created
            created_by
            updated
            updated_by
            deleted
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

    return response.data.createorders;
  }

//   Soft delete:
  export async function deleteDocument(id) {
    const oldData = await getDocument(id);
    const data = oldData;
    const timeNow = new Date();
    data.updated = timeNow;
    const currentUser = await getUserInfo();
    data.updated_by = currentUser.userDetails;
    data.deleted = true;

    const gql = `
      mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdateordersInput!) {
        updateorders(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
            id
            name
            customer
            date
            active
            sum
            invoices
            orderLines {
              id
              date
              product
              price
              amount
              unit
              comment
              user
            }
            created
            created_by
            updated
            updated_by
            deleted
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
    return result.data.updateorders;
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
                    updated
                    updated_by
                    deleted
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

export async function readAllProducts() {
  const query = `
      {
          products {
              items {
                id
                name
                description
                unit
                price
                storage
                account
                active
                webshop
                image
                created
                created_by
                updated
                updated_by
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
  return result.data.products.items;
}