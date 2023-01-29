<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

NestJS API for a simple social media app. Utilizes MySQL as a data store

## Prerequisites
- Create `.env` file at root of project
- Example of file contents
```bash
DB_HOST='localhost'
DB_PORT=3306
DB_USERNAME='mysql'
DB_PASSWORD='simple123'
DB_NAME='simple_post_db'
API_PORT=3000
API_NAME='simple_post_api'
JWT_SECRET='secret'
```

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# Start up database with Docker
$ docker-compose up
```

```bash
# Start up backend server in watch mode
$ yarn run start:dev
```

## Endpoints

```bash
# POST /auth/register - register user
BODY: { username: string, email: string, password: string }
RESPONSE: { message: 'User successfully created' } - 201 Created

# POST /auth/login - login user
BODY: { email: string, password: string }
RESPONSE: { token: 'JWT_Token' } - 200 OK

# POST /posts - create post
REQUEST HEADER: Bearer JWT_TOKEN
BODY: { title: string, text: string }
RESPONSE: { id: string, title: string, text: string } - 201 Created

# DELETE /posts/:id - delete post
REQUEST HEADER: Bearer JWT_TOKEN
RESPONSE: 204 No Content

# GET /posts - get user feed
REQUEST HEADER: Bearer JWT_TOKEN
RESPONSE: { id: string, title: string, text: string }[] - 200 OK
```

## Test

```bash
# e2e tests
$ yarn run test:e2e
```
