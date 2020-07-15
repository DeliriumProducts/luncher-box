# Status Codes and Errors

When attempting to use the APIs, you might come across errors. Here you'll find some examples.

# EntityNotFoundError

When trying to get, update or delete any entity (category, product or user), and it isn't in the database, you will be given an `EntityNotFoundError`

- Status code: 404

- Example:
	```json
	{
		"name": "NotFoundError",
    	"message": "Category not found!"
	}
	```

# EntityNotValidError

When trying to create or update any entity (category, product or user), and the provided data isn't valid, you will be given an `EntityNotValidError`

- Status code: 400

- Example
	```json
	{
    	"errors": [
				"name must be longer than or equal to 4 characters",
				"image must be longer than or equal to 5 characters", 
			    "image must be an URL address"
	    ],
    	"name": "Product not valid!",
		"message": "NotValidError"
	}
	```

# DuplicateEntityError

When trying to create any entity (users in our case), with some of the provided data supposed to be unique you and it happens that is isn't, you will be given a `DuplicateEntityError`

- Status code: 422

- Example:
	```json
	{
		"name": "DuplicateError",
    	"message": "Duplicate User entry!"
	}
	```
