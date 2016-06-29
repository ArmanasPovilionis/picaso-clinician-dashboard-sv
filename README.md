express4-skeleton
=================

[![NPM Version][npm-image]][npm-url]
![Node][node-version]

This is just an example [Express.js 4.x][express] web
application skeleton targeted to demonstrate some of the facilities offered
by the framework. Additionally, it is integrated with a barebones version of
[Bootstrap 4.x][bootstrap].

## Characteristics

- Compatible with Node.js 6.0 or higher
- Fully configurable via JSON file
- Automatic creation of a cluster
- Scalable session storage via [cassandra-store][cassandra-store], including checking of database
  availability at startup
- Handling of HTTP 404 errors

## Installation

Execute:

```shell
npm install express4-skeleton
```

## Start-up

Execute:

```shell
$ node -db:hosts=cass.example.org -db:ks=tests index.js
```

## TO-DOs

- Check port availability
- Sticky sessions

[bootstrap]: https://getbootstrap.com/
[cassandra-store]: https://github.com/webcc/cassandra-store
[express]: http://expressjs.com/
[node-version]: https://img.shields.io/badge/node-6.0.0-orange.svg?style=flat-square
[npm-image]: https://img.shields.io/badge/npm-0.2.0-blue.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/express4-skeleton