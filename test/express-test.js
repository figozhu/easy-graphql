'use strict'

    const path = require('path');

const express = require('express');
const graphqlHTTP = require('express-graphql');
const easyGraphqlModule = require('../');

const basePath = path.join(__dirname, 'graphql');
const easyGraphqlObj = new easyGraphqlModule(basePath);
const allSchema = easyGraphqlObj.getSchema();

const app = express();

app.use('/graphql', graphqlHTTP({
    schema : allSchema,
    graphiql : true,
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/restful', async (req, res) => {
    let queryObj = req.body;
    
    let result;
    try {
        result = await easyGraphqlObj.queryGraphQL(queryObj);
    } catch (err) {
        console.error(err);
        res.json({code : -1, reason : "GraphQL error"});
        return;
    }
    
    res.json({
        code : 0,
        reason : "success",
        data : result.data,
    });
});

app.listen(8000, () => {
    console.log("open http://127.0.0.1:8000/graphql in your browser");
});