'use strict'

const path = require('path');

const express = require('express');
const graphqlHTTP = require('express-graphql');
const easyGraphql = require('../');

const basePath = path.join(__dirname, 'graphql');
const allSchema = easyGraphql.getSchema(basePath);

const app = express();

app.use('/graphql', graphqlHTTP({
    schema : allSchema,
    graphiql : true,
}));

app.listen(8000, () => {
    console.log("open http://127.0.0.1:8000/graphql in your browser");
});