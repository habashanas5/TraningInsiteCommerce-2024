## TASK1: 
### Please take a look on the Create Account Area & check if OOTB send an activation email when the account is created.
### • If OOTB is sending an email → update this logic to PREVENT sending the email.
### • If the OOTB is not sending an email → please ADD this feature.
## TASK2: 
### Please take a look on the Products on the site & update the price to be (OriginPrice * 10)
### A. Update Product Details Page (PDP)
### B. Update Product Listing Page (PLP)
### C. Update Cart Lines.
### Note: for TASK 2 try to handle it in different ways. (using Handlers, Pipelines & Mappers)
## TASK3:
### Create a new Custom Property on the User Profile entity called (user Rale) using SQL Script & fill this property when the user creates a new account.
## TASK4:
### Please create a custom table called (prodcutExtenstion) using SQL Script, this table will include those extra properties for the product.
### * Alt Number
### * Description
### * Is a special product
### * Has Extra Fees Message
### - you need to fill the above table using a custom API (TEST Data)
### - you need to build another action method to your API, so EF can call it & receive the data in their side 
## TASK5:
### 1- Build an integration job that read products data from Dummy Database and saves it in Opti database in product table
### 2- Build an integration job that read Products data from a flat file and saves it in Opti database in product table
## TASK6:
### You need to build a custom API for Contact Us in the website with the following fields: ( subject, first, LastName, Email, Phone, Address, Message, Country, Zip code)
### 1- Country (this will be a drop-down list that takes its values from the System List. You need to create web API that read system lsit and pass the list name as parameter to filler values)
### 2- The result of adding will be site message
### 3- Please add custom table to save all these fields on it
### 4- An email should be sent to Admin list (the admin list should be website setting list)
### 5- Please add API to handle posting the information and save it in the databsase table 
