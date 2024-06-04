## Identity Reconciliation Project.

- Link to deployed web service - https://identity-reconciliation-project.onrender.com/identity.
  
- Use postman or any other tool for making the `POST` request.
  
- ###### `POST` request body structure
`{
    "email": "test@github.com",
    "phoneNumber": "123456"
}`

## Assumptions made while working on the task
#### The assumptions are made based in some other test cases that are not listed in the task sheet.
1. When, in the `POST` request, `email` is new but `phoneNumber` exists but for a secondary contact. 
   In this case a new contact will be created, whose `linkedId` will have the same `linkedId` as the secondary contact.

2. When, in the `POST` request, `phoneNumber` is new but `email` exists but for a secondary contact. 
   In this case a new contact will be created, whose `linkedId` will have the same `linkedId` as the secondary contact.

3. When, both the `email` and `phoneNumber` in the `POST` request belongs to separate primary contacts, as listed in the task sheet.
   In this case, the primary contact with the `email` takes precedence and marks the primary contact with `phoneNumber` as secondary.
   Following this, if the primary contact with `phoneNumber`, that was marked as secondary, has secondary contacts, those secondary contacts' `linkedId` 
   will also be changed to the id of primary contact.

4. When both the `email` and `phoneNumber` in the `POST` request belong to separate secondary contacts. For this I have not made any changes. My thinking for not
   making changes for this is because of data consistency issues that might arise.
