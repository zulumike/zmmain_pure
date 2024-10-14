import { getUserInfo } from "../scripts/auth.js";

// #####################################################################################
// #                                                                        COMPANY    #
// #####################################################################################

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

// #####################################################################################
// #                                                                          PRODUCTS #
// #####################################################################################

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

export async function getProduct(id) {

    const gql = `
      query getById($id: ID!) {
        products_by_pk(id: $id) {
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
    return result.data.products_by_pk;
  }

export async function updateProduct(id, data) {
    const oldData = await getProduct(id);
    data.created = oldData.created;
    data.created_by = oldData.created_by;
    data.id = id;
    const timeNow = new Date();
    data.updated = timeNow;
    const currentUser = await getUserInfo();
    data.updated_by = currentUser.userDetails;

    const gql = `
      mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdateproductsInput!) {
        updateproducts(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
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
    return result.data.updateproducts;
  }

export async function createProduct(data) {

    const timeNow = new Date();
    data.created = timeNow;
    const currentUser = await getUserInfo();
    data.created_by = currentUser.userDetails;
    
    const gql = `
      mutation create($item: CreateproductsInput!) {
        createproducts(item: $item) {
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
    
    return response.data.createproducts;
  }

//   Hard delete:
  export async function deleteProduct(id) {

    const gql = `
      mutation del($id: ID!, $_partitionKeyValue: String!) {
        deleteproducts(id: $id, _partitionKeyValue: $_partitionKeyValue) {
          id
        }
      }`;
  
    const query = {
      query: gql,
      variables: {
        id: id,
      _partitionKeyValue: id
      }
    };
  
    const endpoint = "/data-api/graphql";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });
  
    const result = await response.json();
    console.log(`Record deleted: ${ JSON.stringify(result.data) }`);
  }

// #####################################################################################
// #                                                                         CUSTOMERS #
// #####################################################################################

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

export async function getCustomer(id) {

    const gql = `
      query getById($id: ID!) {
        customers_by_pk(id: $id) {
            id
            name
            address
            zip
            city
            phone
            email
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
    return result.data.customers_by_pk;
  }

export async function updateCustomer(id, data) {
    const oldData = await getCustomer(id);
    data.created = oldData.created;
    data.created_by = oldData.created_by;
    data.id = id;
    const timeNow = new Date();
    data.updated = timeNow;
    const currentUser = await getUserInfo();
    data.updated_by = currentUser.userDetails;

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
    return result.data.updatecustomers;
  }

export async function createCustomer(data) {

    const company = await getCompany('1');
    company.nrSeries.customer++
    data.id = company.nrSeries.customer.toString();
    const timeNow = new Date();
    data.created = timeNow;
    const currentUser = await getUserInfo();
    data.created_by = currentUser.userDetails;
    data.deleted = false;

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

    return response.data.createcustomers;
  }

//   Soft delete:
  export async function deleteCustomer(id) {
    const oldData = await getCustomer(id);
    const data = oldData;
    const timeNow = new Date();
    data.updated = timeNow;
    const currentUser = await getUserInfo();
    data.updated_by = currentUser.userDetails;
    data.deleted = true;

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
    return result.data.updatecustomers;
  }