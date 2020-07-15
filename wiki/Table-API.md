This page contains information on how to use the Table API

## Getting all tables

- Route: **/tables**

- Method: **GET**

- Required parameters / body: **optional**
    - Query Parameters:
        - page?: which page to take tables from (if not set, the API will return all tables)
        - amount?: amount of tables to get (if not set, the API will return all tables)
		- since?: last table Id to get tables after (if not set, the API will return all tables)

- Requires authorization: **no**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/tables`
	- Response:

	```json
    [
        {
            "id": 1,
            "name": "A1",
            "isTaken": false
        },
        {
            "id": 2,
            "name": "B2",
            "isTaken": true
        },
        {
            "id": 3,
            "name": "C3",
            "isTaken": false
        },
        {
            "id": 4,
            "name": "54",
            "isTaken": true
        }
    ]
	```

## Getting a certain table + its products

- Route: **/tables/:tableId**

- Method: **GET**

- Required parameters / body: **yes**
	- Parameter: tableId - specifies which table to get

- Requires authorization: **no**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/tables/2`
		
	- Response:
	```json
    {
        "id": 2,
        "name": "B2",
        "isTaken": true
    }
	```


## Creating a table

- Route: **/tables**

- Method: **POST**

- Required parameters / body: **yes**
	- Body:
		- Name (String)
		- IsTaken (Boolean) - must be a boolean value (either true or false)

- Requires authorization: **yes**

- Example:
	- Request:
		- **POST** at `http://localhost:8000/tables`
		- Body:
	```json
    {
        "name": "A3",
        "isTaken": false
    }
	```

	- Response:

	```json
    {
        "name": "A3",
        "isTaken": true,
        "id": 5
    }
	```

## Editing a table

- Route: **/tables/:tableId**

- Method: **PUT**

- Required parameters / body: **yes**
	- Parameter: tableId - specifies which table to edit
	- Body:
		- Name (String)
		- IsTaken (Boolean) - must be a boolean value (either true or false)

- Requires authorization: **yes**

- Example:
	- Request:
		- **PUT** at `http://localhost:8000/tables/5`
		- Body:
	```json
    {
        "name": "F55",
        "isTaken": true,
        "id": 5
    }
	```

	- Response:

	```json
	"Table updated!"
	```

## Deleting a table

- Route: **/tables/:tableId**

- Method: **DELETE**

- Required parameters / body: **yes**
	- Parameter: tableId - specifies which table to delete

- Requires authorization: **yes**

- Example:
	- Request:
		- **DELETE** at `http://localhost:8000/tables/2`

	- Response:

	```json
	"Table deleted!"
	```
