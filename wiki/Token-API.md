This page contains information on how to use the Category API

## Verifying a user

- Route: **/confirm/:tokenId**

- Method: **GET**

- Required parameters / body: **yes**
	- Parameters: tokenId - token to verify

- Requires authorization: **no**

- Note: removes the token after it has been verified

- Example:
	- Request:
		- **GET** at `http://localhost:8000/confirm/ddb97637-93a9-403a-ad69-d115ba88b886`
	- Response:
		Redirects to the frontend
	