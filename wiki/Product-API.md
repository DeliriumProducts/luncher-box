This page contains information on how to use the Product API

## Getting all products

- Route: **/products/**

- Method: **GET**

- Required parameters / body: **optional**
    - Query Parameters:
        - page?: which page to take products from (if not set, the API will return all products)
        - amount?: amount of products to get (if not set, the API will return all products)
		- since?: last product Id to get products after (if not set, the API will return all products)

- Requires authorization: **no**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/products/`
	- Response:
	```json
	[
		{
			"name": "Hamburger",
			"description": "Tasty hamburger with 100% real meat!",
			"image": "https://some-images.com/hamburger.png",
			"price": 4.99
		},
		{
			"name": "Cheeseburger",
			"description": "Tasty Cheeseburger with 100% real cheese!",
			"image": "https://some-images.com/cheeseburger.png",
			"price": 8.99
		}
	]
	```

## Getting a certain product

- Route: **/products/:productId**

- Method: **GET**

- Required parameters / body: **yes**
	- Parameter: productId - specifies which product to get

- Requires authorization: **no**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/products/2`
		
	- Response:
	```json
	{
		"name": "Hamburger",
		"description": "Tasty hamburger with 100% real meat!",
		"image": "https://some-images.com/hamburger.png",
		"price": 4.99
	}
	```


## Creating a product

- Route: **/products/**

- Method: **POST**

- Required parameters / body: **yes**
	- Body:
		- Name (String)- must be between 3 and 50 characters long
		- Description (String) must be between 5 and 255 characters long
		- Image (URL) - must be a valid URL, from 5 to 255 characters long
		- Categories (Array of category Ids) - must be existing categories, with the syntax given in the example section

- Requires authorization: **yes**

- Example:
	- Request:
		- **POST** at `http://localhost:8000/products/`
		- Body:
	```json
	{
		"name": "Hamburger",
		"description": "Tasty hamburger with 100% real meat!",
		"image": "https://some-images.com/hamburger.png",
		"price": 4.99,
		"categories": [
			{
				"id": 1
			},
			{
				"id": 2
			}
		]
	}
	```

	- Response:

	```json
	{
    	"name": "Hamburger",
    	"description": "Tasty hamburger with 100% real meat!",
   		"image": "https://some-images.com/hamburger.png",
    	"price": 4.99,
    	"categories": [
        	{
            	"id": 1
        	},
        	{
            	"id": 2
        	}
    	],
    	"id": 21
	}
	```

## Editing a product

- Route: **/products/:productId**

- Method: **PUT**

- Required parameters / body: **yes**
	- Parameter: productId - specifies which product to edit
	- Body:
		- Name (String)- must be between 3 and 50 characters long
		- Description (String) must be between 5 and 255 characters long
		- Image (URL) - must be a valid URL, from 5 to 255 characters long
		- Categories (Array of category Ids) - must be existing categories, with the syntax given in the example section

- Requires authorization: **yes**

- Example:
	- Request:
		- **PUT** at `http://localhost:8000/categories/2`
		- Body:
	```json
	{
		"name": "New Hamburger",
		"description": "New Tasty hamburger with 100% real meat!",
		"image": "https://some-images.com/hamburger.png",
		"price": 4.99,
		"categories": [
			{
				"id": 2
			},
			{
				"id": 3
			}
		]
	}
	```

	- Response:

	```json
	{
    	"name": "New Hamburger",
    	"description": "New Tasty hamburger with 100% real meat!",
    	"image": "https://some-images.com/hamburger.png",
    	"price": 4.99,
    	"categories": [
        	{
            	"id": 2
        	},
        	{
            	"id": 3
        	}
    	],
    	"id": 2
	}
	```

## Deleting a product

- Route: **/products/:productId**

- Method: **DELETE**

- Required parameters / body: **yes**
	- Parameter: productId - specifies which product to delete

- Requires authorization: **yes**

- Example:
	- Request:
		- **DELETE** at `http://localhost:8000/products/2`

	- Response:

	```json
	"Product deleted!"
	```
