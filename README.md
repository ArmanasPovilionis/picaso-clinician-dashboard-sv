express4-skeleton
=================

![Node][node-version]

This is just an example [Express.js 4.x][express] web
application skeleton targeted to demonstrate some of the facilities offered
by the framework. Additionally, it is integrated with a barebones version of
[Bootstrap 4.x][bootstrap].

## Characteristics

- Compatible with Node.js 6.0 or higher
- Fully configurable via JSON file
- Automatic creation of a cluster
- Handling of HTTP errors

## Installation

- Execute:

  ```shell
  git clone https://github.com/webcc/express4-skeleton.git
  ```
  
- Install dependencies

  ```shell
  cd express4-skeleton
  npm install
  ```
  
- Start-up:

  ```shell
  npm start
  ```
  
- Open a web browser with the URL: [https://localhost:8080/](https://localhost:8080/) (self-signed certificate)

## Debugging

Define the environment variable `NODE_DEBUG`:

```shell
export NODE_DEBUG=express4-skeleton
```

## Testing

Unit tests implemented with the [Mocha testing framework][mocha] with the help of the [request][request] module.
Execute

```shell
npm test
```

## TO-DOs

- Check port availability
- Sticky sessions

[bootstrap]: https://getbootstrap.com/
[express]: http://expressjs.com/
[mocha]: https://mochajs.org/
[node-version]: https://img.shields.io/badge/node-6.9.1-orange.svg?style=flat-square
[request]: https://github.com/request/request