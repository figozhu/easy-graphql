'use strict'

const fs = require('fs');
const path  = require('path');
const _ = require('lodash');
const {
    makeExecutableSchema,
} = require('graphql-tools');
const gql = require('graphql-tag');
const {execute, formatError} = require('graphql');

class EasyGraphQL {
    constructor (basePath) {
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
        
        this._schema = makeExecutableSchema({
            typeDefs: allSchemas,
            resolvers: allResolversMap,
        });
    }

    getSchema () {
        return this._schema;
    }

    queryGraphQL (requestObj) {
        return new Promise((resolve, reject) => {
            const {query, variables, operationName} = requestObj;
            const queryAST = gql`${query}`;
            const schema = this._schema;

            execute(
                schema,
                queryAST,
                null,
                {},
                variables,
                operationName
            ).then(result => {
                if (result && result.errors) {
                    reject(result.errors);
                    return;
                }

                resolve(result);
            }).catch(err => {
                reject(err);
                return;
            });
            
        });
    }
}

module.exports = EasyGraphQL;
