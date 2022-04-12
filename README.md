<h1 align="center">Nestjs - Food Delivery Backend</h1>
<p align="center">Backend that allows the administration of clients, restaurants, orders, delivery men, mailing and more.</p>
<p align="center">
  🐞 <a href="https://github.com/DavidBarcenas/food-delivery-backend/issues">Report a Bug</a> 
  🙋‍♂️ <a href="https://github.com/DavidBarcenas/food-delivery-backend/issues">Request Feature</a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## The project

- Personalized mailing
- Account confirmation
- Use of graphql and apollo server
- Json web token handling

## Features

- Web scokets with Graphql
- Handlebears for mail templates
- Postgress with TypeORM
- Tasks schedules
- Linters and prettier config
- Node mailer
- Encryptations
- Docker to create the database

## Running the app

From your project directory, start up your application by running

```bash
 docker-compose up
```

```bash
# clone the project
$ git clone https://github.com/DavidBarcenas/food-delivery-backend.git

# enter the folder
$ cd food-delivery-backend

# install dependencies
$ yarn install
```

## Development

Starts the application in development mode with active code reloading, bug reports, and more.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Notes

Don't forget to set your environment variables. In the project there is a file called
**.env.dev.example** there it has all the variables you will need.

# License

Released under the [MIT licensed](LICENSE).\
Feel free to fork this project and improve it. Give a ⭐️ if you like this project!
