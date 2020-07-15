This page contains information on how to use the Order API

## Getting all orders

- Route: **/orders**

- Method: **GET**

- Requires authorization: **yes**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/orders`
	- Response:
	```json
    [
        {
            "products": [
                {
                    "id": 13,
                    "name": "Blood Bear",
                    "description": "The best red wine.",
                    "image": "https://i.imgur.com/ibZbu9m.png",
                    "price": 1.99,
                    "quantity": 2
                },
                {
                    "id": 18,
                    "name": "Baklava",
                    "description": "A Turkish delicious dessert",
                    "image": "https://www.fifteenspatulas.com/wp-content/uploads/2012/03/Baklava-Fifteen-Spatulas-11.jpg",
                    "price": 3.99,
                    "quantity": 3
                }
            ],
            "comment": "dd",
            "table": "wtf",
            "state": 0,
            "id": "89e3c2fc-77a8-4227-9cfd-13cc957f1ed8",
            "customerId": "E-CXYsPJICpkfjZIAAAN"
        },
        {
            "products": [
                {
                    "id": 19,
                    "name": "Triple Chocolate Layer Cake",
                    "description": "The fudgiest homemade chocolate cake ever!",
                    "image": "https://sallysbakingaddiction.com/wp-content/uploads/2013/04/triple-chocolate-cake-4.jpg",
                    "price": 6.99,
                    "quantity": 1
                }
            ],
            "comment": "dasd",
            "table": "wtf",
            "state": 0,
            "id": "056d0bdb-ed9c-47f1-9412-91119b98df26",
            "customerId": "fn9As3wKdtds83RgAAAP"
        }
    ]
	```

## Placing an order

- Message: **place_order**

- Method: **Socket Emit**

- Required parameters / body: **yes**
	- Body:
		- Comment (String) - must be between 0 and 255 characters
		- Products (Array of Products) - must be existing products
		- Table (String) - must be an existing table

- Requires authorization: **no**

- Example:
	- Request:
		- **Socket Emit** at `http://localhost:8000/socket.io/` with `place_order`
		- Body:
	```json
    {
        "products": [
            {
                "id": 19,
                "quantity": 2
            },
            {
                "id": 20,
                "quantity": 1
            }
        ],
        "comment": "This is a comment",
        "table": "5"
    }
	```

	- Response:

	```json
    {
        "products": [
                {
                "id": 5,
                "name": "Chicken Soup",
                "description": "Chicken soup is a soup made from chicken, simmered in water, usually with various other ingredients. ",
                "image": "https://nutritiouslife.com/wp-content/uploads/2012/03/homemade-chicken-soup-1302x904.jpg",
                "price": 7.99,
                "quantity": 1
                },
                {
                "id": 7,
                "name": "Tarator",
                "description": "Cold, refreshing tarator.",
                "image": "https://supabar.com/plovdiv/wp-content/uploads/2018/01/tarator.jpg",
                "price": 1.99,
                "quantity": 2
                }
        ],
        "comment": "",
        "table": "5",
        "id": "2204777f-8301-4648-a447-b7cd7b8d9eb6",
        "state": 0,
        "customerId": "mPQ5P-jamx4MpfCbAAAT"
    }
	```

## Updating customer IDs

Sets the customerId of the sent orderIds to the newest customerId (updates socket connection).

- Message: **update_customer_id**

- Method: **Socket Emit**

- Required parameters / body: **yes**
	- Body:
		- OrderIds (array of Order IDs (UUIDs))

- Requires authorization: **no**

- Example:
	- Request:
		- **Socket Emit** at `http://localhost:8000/socket.io/` with `update_customer_id`
		- Body:
	```json
    [
		"2204777f-8301-4648-a447-b7cd7b8d9eb6",
		"1b80f1cc-b2f0-4f07-b8a5-6c5ef138ea8b",
    ]
	```

	- Response:

	```json
	[
        {
            "products": [
                {
                    "id": 13,
                    "name": "Blood Bear",
                    "description": "The best red wine.",
                    "image": "https://i.imgur.com/ibZbu9m.png",
                    "price": 1.99,
                    "quantity": 2
                },
                {
                    "id": 18,
                    "name": "Baklava",
                    "description": "A Turkish delicious dessert",
                    "image": "https://www.fifteenspatulas.com/wp-content/uploads/2012/03/Baklava-Fifteen-Spatulas-11.jpg",
                    "price": 3.99,
                    "quantity": 3
                }
            ],
            "comment": "dd",
            "table": "wtf",
            "state": 0,
            "id": "2204777f-8301-4648-a447-b7cd7b8d9eb6",
            "customerId": "E-CXYsPJICpkfjZIAAAN"
        },
        {
            "products": [
                {
                    "id": 19,
                    "name": "Triple Chocolate Layer Cake",
                    "description": "The fudgiest homemade chocolate cake ever!",
                    "image": "https://sallysbakingaddiction.com/wp-content/uploads/2013/04/triple-chocolate-cake-4.jpg",
                    "price": 6.99,
                    "quantity": 1
                }
            ],
            "comment": "dasd",
            "table": "wtf",
            "state": 0,
            "id": "1b80f1cc-b2f0-4f07-b8a5-6c5ef138ea8b",
            "customerId": "fn9As3wKdtds83RgAAAP"
        }
    ]
	```

## Accepting an order

- Route: **/orders/accept/:orderId**

- Method: **PUT**

- Required parameters / body: **yes**
	- Parameter: orderId - specifies which order to accept

- Requires authorization: **yes**

- Example:
	- Request:
		- **PUT** at `http://localhost:8000/orders/accept/2`

	- Response:

	```json
    {
        "products": [
                {
                "id": 5,
                "name": "Chicken Soup",
                "description": "Chicken soup is a soup made from chicken, simmered in water, usually with various other ingredients. ",
                "image": "https://nutritiouslife.com/wp-content/uploads/2012/03/homemade-chicken-soup-1302x904.jpg",
                "price": 7.99,
                "quantity": 1
                },
                {
                "id": 7,
                "name": "Tarator",
                "description": "Cold, refreshing tarator.",
                "image": "https://supabar.com/plovdiv/wp-content/uploads/2018/01/tarator.jpg",
                "price": 1.99,
                "quantity": 2
                }
        ],
        "comment": "",
        "table": "5",
        "id": "e4fbcfc3-b72d-405f-a5a8-ec8ba0006d26",
        "state": 1,
        "customerId": "mPQ5P-jamx4MpfCbAAAT"
    }
	```

## Finishing an order

- Route: **/orders/finish/:orderId**

- Method: **PUT**

- Required parameters / body: **yes**
	- Parameter: orderId - specifies which order to decline

- Requires authorization: **yes**

- Example:
	- Request:
		- **PUT** at `http://localhost:8000/orders/decline/2`

	- Response:

	```json
    {
        "products": [
                {
                "id": 5,
                "name": "Chicken Soup",
                "description": "Chicken soup is a soup made from chicken, simmered in water, usually with various other ingredients. ",
                "image": "https://nutritiouslife.com/wp-content/uploads/2012/03/homemade-chicken-soup-1302x904.jpg",
                "price": 7.99,
                "quantity": 1
                },
                {
                "id": 7,
                "name": "Tarator",
                "description": "Cold, refreshing tarator.",
                "image": "https://supabar.com/plovdiv/wp-content/uploads/2018/01/tarator.jpg",
                "price": 1.99,
                "quantity": 2
                }
        ],
        "comment": "",
        "table": "5",
        "id": "e4fbcfc3-b72d-405f-a5a8-ec8ba0006d26",
        "state": 2,
        "customerId": "mPQ5P-jamx4MpfCbAAAT"
    }
	```

## Declining an order

- Route: **/orders/decline/:orderId**

- Method: **PUT**

- Required parameters / body: **yes**
	- Parameter: orderId - specifies which order to finish

- Requires authorization: **yes**

- Example:
	- Request:
		- **PUT** at `http://localhost:8000/orders/finish/2`

	- Response:

	```json
	"Order declined!"
	```
