# easy-graphql

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

## Step 1
Choose a base directory

## Step 2
Define your entity's schema
1. Create a sub directory under the base directory
2. Each entity must create a file named `schema.graphqls` under the above sub directory

## Step 3
Define your query
All entities' query must create a file named `query.graphqls` under the base directory

## Step 4
Implement your resolvers
Each entity's resolver must create a file named `resolvers.js` under the above sub directory

## Example

An example for using easy-graphql with Express in `test` directory:

```
test
├── express-test.js
├── fakeDB.js
└── graphql
    ├── post
    │   ├── resolver.js
    │   └── schema.graphqls
    ├── query.graphqls
    └── user
        ├── resolver.js
        └── schema.graphqls
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

Define the entities' schema
Create two sub directory `user` and `post`, then create two schema file:

- `user/schema.graphqls` 

```
# user schema
type User {
    uid : ID!
    name : String!
    avatar : String!
}
```

- `post/schema.graphqls`

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

- `user/resolver.js`

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

- `post/resolver.js`

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





