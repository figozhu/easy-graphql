'use strict'

const fs = require('fs');
const path  = require('path');
const _ = require('lodash');
const {
    makeExecutableSchema,
} = require('graphql-tools');

const easyGraphQL = {};
module.exports = easyGraphQL;

easyGraphQL.getSchema = (basePath) => {
    const subDirs = fs.readdirSync(basePath);

    const allSchemas = [];
    const allResolversMap = {};

    // load all schame and resolver
    subDirs.forEach(dirName => {
        // entity schema
        const schemaFileName = path.join(basePath, dirName, 'schema.graphqls');
        if (fs.existsSync(schemaFileName)) {
            const schemaContent = fs.readFileSync(schemaFileName, {encoding: 'utf8'});
            allSchemas.push(schemaContent);
        }

        // all query
        const queryFileName = path.join(basePath, 'query.graphqls');
        if (fs.existsSync(queryFileName)) {
            const queryContent = fs.readFileSync(queryFileName, {encoding: 'utf8'});
            allSchemas.push(queryContent);
        }

        // resolver
        const resolverFileName = path.join(basePath, dirName, 'resolver.js');
        if (fs.existsSync(resolverFileName)) {
            const resolveContent = require(resolverFileName);
            _.merge(allResolversMap, resolveContent);
        }
    });
    
    return makeExecutableSchema({
        typeDefs: allSchemas,
        resolvers: allResolversMap,
    });
}
