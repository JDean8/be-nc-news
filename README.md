# News API

## About

Thanks for taking a look into my API, this is a piece of portfolio works emulating a news site's backend.

The **/api** endpoint will return a json with details on each other endpoint and how to use them.

## Accessing hosted site

https://news-api-vzif.onrender.com/api

Please be aware that a hosted version of this site is on a free service that may spin down the connection through inactivity so if you cannot make a connection please reach out.

## Setting up locally

_This API was written using Node.js v20.5.1 and PSQL v16 please make sure that you have both of these installed on the system_

Please follow the below sequence of commands to run api locally,

    git clone https://github.com/JDean8/be-nc-news

    cd be-nc-news

    npm i

After this please add the below files to the root of the repo:

    //.env.development
    PGDATABASE=nc_news

    //.env.test
    PGDATABASE=nc_news_test

    //.env.production
    DATABASE_URL="postgres://umucbcmx:K6hwoTyDehDU4MFbutMsl4IlciEFlP3O@horton.db.elephantsql.com/umucbcmx"

Then to set up the DB's, seed the data and start the server run the below commands:

    npm run setup-dbs

    npm run seed

To run integration tests to confirm that this was successfully pulled down please run the below (without the server in a running state):

    npm test api

Once this are shown to be successful please run the below to start the server:

    npm start
