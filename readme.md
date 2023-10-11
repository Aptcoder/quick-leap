## Quick Leap

### What's different about this submission?

-   I also wrote feature tests for the endpoints, I also wrote unit tests for individual units
-   Uses Dependency Injection to provide extensibility and proper mocking for testing

### Relevant links

-   Live endpoint
-   Documentation - https://documenter.getpostman.com/view/11384363/2s9YJjSf9d

### Project structure

```
-- config (project wide configurations)
-- tests (all tests are here)
-- src
---- controllers (web controllers - they decide what happens with api requests )
---- services (core logic)
---- repositories (Data access layer (or sort of).
---- migrations (database migrations)
---- loaders (things to setup the project; setup the db, DI container, and others...)
---- common
-------- interfaces
-------- dtos
-------- services (external services; cache, logger, mail  )
---- routes (setup routes and routes)

```

### Tools used

-   Node.js
-   Express
-   PostgreSQL
-   TypeORM
-   Docker - for containerization
-   Redis - as a session store and caching
-   Inversify - for Dependency Injection
-   Jest
-   Sendgrid

### Installation and local setup

-   Run the command `git clone https://github.com/Aptcoder/quick-leap` on your terminal to clone this repo to your current directory.

-   Run the command to check out to the project directory; `cd quick-leap`

### Running development server and tests

-   Run `npm install` to install all required dependencies.

-   Create a `.env` file and fill it according to `.env.sample`

-   Run `make migrate-up` to run db migrations

-   Run `npm run test` to run tests.

-   Run `npm run start:dev` to run the project in development mode

You're all set :)
