# express4-skeleton

This is just an example [Express.js](http://expressjs.com/) web
application skeleton targeted to demonstrate some of the facilities offered
by the framework. Additionally, it is integrated with a barebones version of
[Bootstrap](http://getbootstrap.com/).

## Characteristics

- Compatible with Node.js 4.x or higher
- Fully configurable via JSON file
- Automatic creation of a c4luster
- Scalable session storage via [cassandra-store](https://github.com/webcc/cassandra-store),
including checking of database availability at startup
- Handling of HTTP 404 errors

## Start-up

Execute:

```
$ node index.js
```

## TO-DOs

- Check port availability
- Sticky sessions