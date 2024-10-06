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

export async function getDocument(id) {

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

export async function updateDocument(id, data) {
    const oldData = await getDocument(id);
    data.created = oldData.created;
    data.created_by = oldData.created_by;
    data.id = id;
    const timeNow = new Date();
    data.updated = timeNow;

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

export async function createDocument(data) {

    const timeNow = new Date();
    data.created = timeNow;
    
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

//   Soft delete:
  // export async function deleteDocument(id) {
  //   const oldData = await getDocument(id);
  //   const data = oldData;
  //   const timeNow = new Date();
  //   data.updated = timeNow;
  //   data.deleted = true;

  //   const gql = `
  //     mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdateproductsInput!) {
  //       updateproducts(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
  //         id
  //         name
  //         description
  //         unit
  //         price
  //         storage
  //         account
  //         active
  //         webshop
  //         image
  //         created
  //         created_by
  //         updated
  //         updated_by
  //       }
  //     }`;
  
  //   const query = {
  //     query: gql,
  //     variables: {
  //       id: id,
  //       _partitionKeyValue: id,
  //       item: data
  //     } 
  //   };
  
  //   const endpoint = "/data-api/graphql";
  //   const res = await fetch(endpoint, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(query)
  //   });
  
  //   const result = await res.json();
  //   return result.data.updateproducts;
  // }

//   Hard delete:
  export async function deleteDocument(id) {

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