This page contains information on how to use the Staff API

## Getting all staff members

- Route: **/staff**

- Method: **GET**

- Required parameters / body: **optional**
    - Query Parameters:
        - page?: which page to take staff members from (if not set, the API will return all staff members)
        - limit?: amount of staff member to get (if not set, the API will return all staff members)

- Requires authorization: **yes (Admin)**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/staff`
	- Response:
	```json
    [
        {
            "role": "Waiter",
            "name": "Ivancho",
            "email": "ivancho99@deliriumproducts.me",
            "isVerified": false
        },
        {
            "role": "Admin",
            "name": "LuncherBox Admin User",
            "email": "admin@deliriumproducts.me",
            "isVerified": true
        },
        {
            "role": "Cook",
            "name": "Slavi Trifonov",
            "email": "slavi@kukubend.bg",
            "isVerified": true
        }
    ]
	```


## Checking if you are authenticated

- Route: **/staff/auth**

- Method: **GET**

- Required parameters / body: **no**

- Requires authorization: **no**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/staff/auth`
	- Response:
	```json
	{
		"isAuthenticated": true,
		"user": {
			"name": "Slavi Trifonov",
            "email": "slavi@kukubend.bg",
			"role": "Cook"
		}
	}
	```

## Registering a user

- Route: **/staff/auth/register**

- Method: **POST**

- Required parameters / body: **yes**
	- Body: 
		- Name (String) - must be at least 1 character long
		- Email (String) - must be a valid email
		- Password (String) - must contain at least 1 lowercase alphabetical character, 1 numeric character and be at least 8 characters long

- Requires authorization: **no**

- Notes:
	- Will send an email using the `OWNER_EMAIL` and `OWNER_PASS` environment variables to the `VERIFIER_EMAIL`.
	- Will throw an error if there is a duplicate email
	- Will set the default role to `Waiter`

- Example:
	- Request:
		- **POST** at `http://localhost:8000/staff/auth/register`
		- Body:
	```json
	{
		"name": "John Doe",
		"email": "john@yahoo.com",
		"password": "FAKEpassword123"
	}
	```
	- Response:
	```json
	"Verification email sent!"
	```


## Logging in a user
- Route: **/staff/auth/login**

- Method: **POST**

- Required parameters / body: **yes**
	- Body:
		- Email (String) - must be a valid email and must be registered already
		- Password (URL) - must match with the one in the database

- Requires authorization: **no**

- Example:
	- Request:
		- **POST** at `http://localhost:8000/staff/auth/login`
		- Body:
	```json
	{
		"email": "john@yahoo.com",
		"password": "FAKEpassword123"
	}
	```

	- Response:

	```json
	"User logged in!"
	```

## Logging out a user
- Route: **/staff/auth/logout**

- Method: **GET**

- Required parameters / body: **no**

- Requires authorization: **no**

- Example:
	- Request:
		- **GET** at `http://localhost:8000/staff/auth/logout`
	- Response:

	```json
	"User logged out!"
	```
