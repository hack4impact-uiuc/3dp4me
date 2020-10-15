# 3DP4ME API

## Setup

### Install PostgreSQL

Make sure you have [PostgreSQL](https://www.postgresql.org) installed. Start a PostgreSQL server.

### Create local database

Run the `seed_db` script to create and seed the 3dp4me_dev database.

```
cd db/infra
bash -e seed_db.sh
```

### Create `.env` file

Create a file named `.env` in the backend directory with the values below.
```
DB_USER="3dp4me_api_user"
DB_PASSWORD=
DB_HOST="localhost"
DB_DATABASE="3dp4me_dev"
DB_PORT="5432"
```

## Run

In the backend directory, run `yarn && yarn start`. This should start a local server on localhost:5000
