# What's Pokespeare
This is a project about REST API, that given a pokemon name, returns its Shakespearean description.


# Project decisions
The development of the project was organized in a sprint following the SCRUM methodology and the tool used for the project management is `Jira`.
Every branch corresponds to a story created in Jira.

Currently, there is only one endpoint that returns the description for the pokemon of **ruby** generation.
The tech stack used is based on **Node.js** and **Typescript** because Node.js offers a rich ecosystem of libraries and frameworks to develop a web server.
The framework used to develop the server is `fastify` and it's one of the fastest and lowest overhead web frameworks for Node.js. It comes with built-in logging and types so it's a good choice for typescript.
The entry point of the server is located in the root and it's the `index.ts` file where the server gets started.

The project is structured in 4 folders:
- `route` contains all the routes of the server (in this case just one route)
- `controller` contains all the controllers associated with the routes to handle the logic of the route and an httpClient generic that makes http requests.
- `error` contains all the error used in the project
- `utility` currently contains just one file with a utility function

There are also e2e tests implemented and the library used is `tap` that offers simple methods to implement tests and make assertions.

**NOTE**: The project uses Shakespeare translator API (the public version) to get the Shakespearean description and it has 60 API calls a day with a distribution of 5 calls per hour, so you could get easily in a **rate limit error**

# How to start the server

To start the server you need `Docker` and `docker-compose` to be installed (https://www.docker.com/products/docker-desktop  https://docs.docker.com/compose/install/).
You also need to create an .env file with the needed env variables (check the `.env.example` file in the root). If you want to try the public version for Shakespeare Translator API and Pokè API you have to set:

`POKE_BASE_URL=https://pokeapi.co/api/v2`
`SHAKESPEARE_BASE_URL=https://api.funtranslations.com`

Now you're ready to run the server, so move to the root directory of the project and run:
- `docker-compose up`

And the server is up :smile_cat:

# Run the development environment

If you want to try the development environment you have to install:
- yarn (https://classic.yarnpkg.com/en/docs/install/#debian-stable)
- node (you can execute `nvm use` that will suggest you the command to install the correct node version )

First thing first, you have to run `yarn` that will install all the needed packages.
After that, you can run the application with `yarn start:dev` that will start the application in watch mode so it will compile the code every time
you change something.

# Example of use

This is an example to get the shakespearean description for the pokemon Pikachu:

1) Start the application with docker as explained above
2) Send a `GET` request to the route `localhost:8080/pokemon/pikachu`
3) The response will be:

```json
{
  "name": "pikachu",
  "description": "Whenever pikachu cometh acrosssomething new,  't blasts 't with a joltof electricity. If 't be true thee cometh across a blackened berry, 't’s                     evidence yond this pokémonmistook the intensity of its charge."
}
```
# Run tests

The project has also e2e tests and if you want to run it, you simply have to run `yarn test` and all the tests will be executed.

# Future developments

- Add some form of cache to speed up the response elaboration
- Add more tests mocking the Shakespeare Translation API and Pokè API responses
- Integrate a monitoring tool to get metrics for the system
- Make a docker file production-ready
- Add an open api document
