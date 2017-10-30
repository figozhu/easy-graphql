# easy-graphql

[![npm version](https://badge.fury.io/js/easy-graphql.svg)](https://badge.fury.io/js/easy-graphql)

Easy way for using GraphQL.

Star is welcome.

## Using easy-graphql

Install easy-graphql from npm

With yarn:

```sh
yarn add easy-graphql
```

or alternatively using npm:

```sh
npm install --save easy-graphql
```

### Step 1
Choose a base directory

### Step 2
Create schemas directory
1. Create a sub directory named `schemas` under the base directory
2. Each entity must create a file named `xxx_schema.graphqls` under the above sub directory

### Step 3
Define your query
All entities' query must create a file named `query.graphqls` under the base directory

### Step 4
Create resolvers directory
Each entity's resolver must create a file named `resolvers.js` under the above sub directory

## API

- Init

new an easy-graphql object:

```javascript
const path = require('path');

const easyGraphqlModule = require('easy-graphql');

const basePath = path.join(__dirname, 'graphql');
const easyGraphqlObj = new easyGraphqlModule(basePath);
```

- Get the GraphQL Schema Object:

```getSchema()```

Using with `express-graphql` middleware:

```javascript
const express = require('express');
const graphqlHTTP = require('express-graphql');

const allSchema = easyGraphqlObj.getSchema();

// using with express-graphql middleware
app.use('/graphql', graphqlHTTP({
    schema : allSchema,
    graphiql : true,
}));
```

- Execute the GraphQL query

```javascript
/**
 * do the GraphQL query execute
 * @param {*} requestObj -  GraphQL query object {query: "..."}
 * @param {*} context - [optional] query context
 * @returns {Promise} - GraphQL execute promise 
 */
queryGraphQLAsync(requestObj, {context})
```

For example, in your system, the response format is:

```
{
    "code" : 0,
    "reason" : "success",
    "data" : {...}
}
```

So you cannot use `express-graphql` middleware, then you need an function can do the GraphQL query.

```javascript
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/restful', async (req, res) => {
    let queryObj = req.body;
    
    let result;
    try {
        // using with your restful service
        result = await easyGraphqlObj.queryGraphQL(queryObj, {context: req});
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
```

## Example

An example for using easy-graphql with Express in `test` directory(`express-test.js`):

```
test
├── express-test.js
├── fakeDB.js
└── graphql
    ├── query.graphqls
    ├── resolvers
    │   ├── post_resolver.js
    │   └── user_resolver.js
    └── schemas
        ├── post_schema.graphqls
        └── user_schema.graphqls
```

For example, we have some simple blog system with two entities (`post` and `user`)

`user`'s data:

| uid | name | avatar |
| :-- | :-- | :-- |
| 1 | Tom | https://pre00.deviantart.net/2930/th/pre/i/2014/182/a/2/tom_cat_by_1997ael-d7ougoa.png |
| 2 | Jerry | https://vignette.wikia.nocookie.net/tomandjerry/images/2/29/Jerry_2.png |

`post`'s data:

| pid | title | content | authorId |
| --- | --- | --- | --- |
| 1 | foo | xxx | 1 |
| 2 | bar | yyy | 2 |

### Step 1

Create the base directory `graphql`

### Step 2

Create two sub directory `user` and `post`, then define the entities' schema by create two schema file:

- `schemas/user_schema.graphqls` 

```
# user schema
type User {
    uid : ID!
    name : String!
    avatar : String!
}
```

- `schemas/post_schema.graphqls`

```
# post schema
type Post {
    pid : ID!
    title : String!
    content : String!
    auhtor : User!
}
```


### Step 3

Define the Query, create the `query.graphqls` under the base directory (`graphql`)

```
type Query {
    user(id: ID): User

    post(id: ID): Post
}
```

### Step 4

Implement two resolvers:

- `resolvers/user_resolver.js`

```javascript
'use strict'

const fakeDB = require('../../fakeDB');

function fetchUserById (root, {id}, ctx) {
    let uid = parseInt(id);
    return fakeDB.getUserById(uid);
}

const userReolvers = {
    Query : {
        user : fetchUserById,
    },
    
};
module.exports = userReolvers;
```

- `resolvers/post_resolver.js`

```javascript
'use strict'

const fakeDB = require('../../fakeDB');

function fetchPostById (root, {id}, ctx) {
    let pid = parseInt(id);
    return fakeDB.getPostById(pid);
}

function fetchUserByAuthorId (root, args, ctx) {
    let uid = root.authorId;
    return fakeDB.getUserById(uid);
}

const postReolvers = {
    Query : {
        post : fetchPostById,
    },

    Post : {
        auhtor : fetchUserByAuthorId,
    },
};
module.exports = postReolvers;
```

### Done

Now we can run the example under `test` directory:

```sh
# under test directory
node express-test.js
open http://127.0.0.1:8000/graphql in your browser
```

Then open the above url in your browser, and test with GraphQL query:

```
query {
  user(id:1) {
    uid
    name
    avatar
  }
  
  post(id:2) {
    pid
    title
    content
    auhtor {
      uid
      name
      avatar
    }
  }
}
```

The result is:

```
{
  "data": {
    "user": {
      "uid": "1",
      "name": "Tom",
      "avatar": "https://pre00.deviantart.net/2930/th/pre/i/2014/182/a/2/tom_cat_by_1997ael-d7ougoa.png"
    },
    "post": {
      "pid": "2",
      "title": "bar",
      "content": "yyy",
      "auhtor": {
        "uid": "2",
        "name": "Jerry",
        "avatar": "https://vignette.wikia.nocookie.net/tomandjerry/images/2/29/Jerry_2.png"
      }
    }
  }
}
```

And also you can test the restful service by following curl command:

```sh
curl -i -H "Content-Type: application/json" -X POST -d '{"query":"\nquery {\n    user(id:1) {\n      uid\n      name\n      avatar\n    }\n    \n    post(id:2) {\n      pid\n      title\n      content\n      auhtor {\n        uid\n        name\n        avatar\n      }\n    }\n  }\n","variables":null}' http://127.0.0.1:8000/restful
```


