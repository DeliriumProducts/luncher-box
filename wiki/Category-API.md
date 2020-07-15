This page contains information on how to use the Category API

## Getting all categories

- Route: **/categories**

- Method: **GET**

- Required parameters / body: **optional**
    - Query Parameters:
        - page?: which page to take categories from (if not set, the API will return all categories)
        - amount?: amount of categories to get (if not set, the API will return all categories)
		- since?: last category Id to get categories after (if not set, the API will return all categories)

- Requires authorization: **no**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/categories`
	- Response:
	```json
	[
		{
			"name": "Burgers",
			"image": "https://some-images.com/burgers.png"
		},
		{
			"name": "Soups",
			"image": "https://some-images.com/soup.png"
		}
	]
	```

## Getting a certain category + its products

- Route: **/categories/:categoryId**

- Method: **GET**

- Required parameters / body: **yes**
	- Parameter: categoryId - specifies which category to get
    - Query Parameters:
        - relations?: whether to get nested relations or not

- Requires authorization: **no**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/categories/2`
		
	- Response:
	```json
	{
		"name": "Burgers",
		"image": "https://some-images.com/burgers.png",
		"products": [
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
	}
	```


## Creating a category

- Route: **/categories**

- Method: **POST**

- Required parameters / body: **yes**
	- Body:
		- Name (String) - must be between 3 and 50 characters long
		- Image (URL) - must be a valid URL, from 5 to 255 characters long

- Requires authorization: **yes**

- Example:
	- Request:
		- **POST** at `http://localhost:8000/categories`
		- Body:
	```json
	{
		"name": "Burgers",
		"image": "https://some-images.com/burgers.png"
	}
	```

	- Response:

	```json
	{
    	"name": "Burgers",
    	"image": "https://some-images.com/burgers.png",
    	"id": 11
	}
	```

## Editing a category

- Route: **/categories/:categoryId**

- Method: **PUT**

- Required parameters / body: **yes**
	- Parameter: categoryId - specifies which category to edit
	- Body:
		- Name (String) - must be between 3 and 50 characters long
		- Image (URL) - must be a valid URL, from 5 to 255 characters long

- Requires authorization: **yes**

- Example:
	- Request:
		- **PUT** at `http://localhost:8000/categories/2`
		- Body:
	```json
	{
    	"name": "New Burgers",
    	"image": "https://some-images.com/burgers.png",
    	"id": 2
	}
	```

	- Response:

	```json
	"Category updated!"
	```

## Deleting a category

- Route: **/categories/:categoryId**

- Method: **DELETE**

- Required parameters / body: **yes**
	- Parameter: categoryId - specifies which category to delete

- Requires authorization: **yes**

- Note: will only delete the products if they don't belong to any other category

- Example:
	- Request:
		- **DELETE** at `http://localhost:8000/categories/2`

	- Response:

	```json
	"Category deleted!"
	```
