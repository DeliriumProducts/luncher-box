# Welcome to the luncher-box wiki!
:poultry_leg: Cheap to setup web application for making orders without having to wait for waiters.

This is the documentation for the rewrite of luncher-box. The older and unfinished version can be checked out at the [old](https://github.com/DeliriumProducts/luncher-box/tree/old) branch

## Requirements

* [node.js](http://nodejs.org) - the recommended version is LTS
* [yarn](https://yarnpkg.com) or npm - npm comes preinstalled with node.js, but we prefer using yarn
* [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.com/) - we use MariaDB, but as it's a drop-in replacement for MySQL, it should work too
* [Redis](http://redis.io)
* [Docker](https://www.docker.com/)

## Getting started (without Docker)

1. Clone and change into the repository
2. Start your **MySQL** / **MariaDB** and services - for Arch Linux or other systemd based distros, you'd use `systemctl`:

```sh
sudo systemctl start mysqld
sudo systemctl start redis
```

3. Create a database using the **MySQL** / **MariaDB** CLI
```sh
mysql -u root -p
```
```sql
CREATE DATABASE luncherbox_development CHARACTER SET UTF8 COLLATE UTF8_GENERAL_CI;
CREATE DATABASE luncherbox_production CHARACTER SET UTF8 COLLATE UTF8_GENERAL_CI;
CREATE DATABASE luncherbox_test CHARACTER SET UTF8 COLLATE UTF8_GENERAL_CI;
```

3. Install all the dependencies using your package manager of choice (**yarn** or **npm**)

```sh
yarn # for yarn
npm install # for npm
```

4. Fill in the .env variables

```bash
# Used as secret for hashing sessions
SESSION_SECRET=example-secret
# The location of the database
DB_HOST=localhost
# Default port for MySQL / MariaDB
DB_PORT=3306
# User for database connection
DB_USER=joe
# Password for database connection
DB_PASS=123456 
# The location of redis
REDIS_HOST=127.0.0.1
# Default port for Redis
REDIS_PORT=6379
# Verification email
OWNER_EMAIL=dumb@me.com
# Verification email password
OWNER_PASS=123456 
# Verifications will be sent to this email
VERIFIER_EMAIL=owner@foo.com
# Port of frontend
FRONTEND_PORT=30
# Port of backend
BACKEND_PORT=8000
# Location to the frontend
FRONTEND_URL=http://localhost:3000
# The URL for cookies
COOKIE_URL=localhost
# Location to the backend
BACKEND_URL=http://localhost:8000
# Location to the socket connection
SOCKET_URL=http://localhost:8000
```

5. Start the backend and frontend servers on seperate terminals using your package manager of choice (**yarn** or **npm**)

- Backend
```sh
cd backend
yarn dev # for development
yarn prod # for production

npm run dev # for development
npm run prod # for production
```

- Frontend
```sh
cd frontend
yarn dev # for development
yarn build # pre-production command
yarn start # for production

npm run dev # for development
npm run build # pre-production command
npm run start # for production
```

6. The backend will be running at [localhost:8000](http://localhost:8000) and the frontend at [localhost:3000](http://localhost:3000)

## Getting started (with Docker) - RECOMMENDED

1. Clone and change into the repository

2. Fill in the .env variables
```bash
# Used as secret for hashing sessions
SESSION_SECRET=example-secret
# The location of the database
DB_HOST=db
# Default port for MySQL / MariaDB
DB_PORT=3306
# User for database connection
DB_USER=root
# Password for database connection
DB_PASS=toor
# The location of redis
REDIS_HOST=redis
# Default port for Redis
REDIS_PORT=6379
# Verification email
OWNER_EMAIL=dumb@me.com
# Verification email password
OWNER_PASS=123456 
# Verifications will be sent to this email
VERIFIER_EMAIL=owner@foo.com
# Initial Admin default password
INITIAL_ADMIN_PASS=FAKEpassword123
# Port of frontend
FRONTEND_PORT=3000
# Port of backend
BACKEND_PORT=8000
# Location to the frontend
FRONTEND_URL=http://localhost:3000
# Location to the backend
BACKEND_URL=http://backend:8000
# Location to the socket connection
SOCKET_URL=http://backend:8000
```

3. Use `docker-compose` to start the server
```sh
docker-compose up # for dev
docker-compose -f docker-compose.prod.yaml # for prod
```