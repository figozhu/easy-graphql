'use strict'

const fs = require('fs');
const path  = require('path');
const _ = require('lodash');
const {
    makeExecutableSchema,
} = require('graphql-tools');
const gql = require('graphql-tag');
const {execute, formatError} = require('graphql');

const defaultSchemasFileDir = "schemas";
const defaultResolverFileDir = "resolvers";
const defaultSchemaFileExt = ".graphqls";
const defaultResolverFileExt = ".js";
const defaultAllQueryFileName = "query.graphqls";

class EasyGraphQL {
    constructor (basePath) {
        const subDirs = fs.readdirSync(basePath);
        
        const allSchemas = [];
        const allResolversMap = {};

        // entity schema
        const schemaDir = path.join(basePath, defaultSchemasFileDir);
        const schemaFiles = fs.readdirSync(schemaDir);
        schemaFiles.forEach(filename => {
            if (path.extname(filename).toLowerCase() === defaultSchemaFileExt) {
                const schemaFileName = path.join(basePath, defaultSchemasFileDir, filename);
                const schemaContent = fs.readFileSync(schemaFileName, {encoding: 'utf8'});
                allSchemas.push(schemaContent);
            }
        });

        // all query
        const queryFileName = path.join(basePath, defaultAllQueryFileName);
        if (fs.existsSync(queryFileName)) {
            const queryContent = fs.readFileSync(queryFileName, {encoding: 'utf8'});
            allSchemas.push(queryContent);
        }

        // resolver
        const resolverDir = path.join(basePath, defaultResolverFileDir);
        const resolverFiles = fs.readdirSync(resolverDir);
        resolverFiles.forEach(filename => {
            if (path.extname(filename).toLowerCase() === defaultResolverFileExt) {
                const resolverFileName = path.join(basePath, defaultResolverFileDir, filename);
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

    /**
     * do the GraphQL query execute
     * @param {*} requestObj -  GraphQL query object {query: "..."}
     * @param {*} context - [optional] query context
     * @returns {Promise} - GraphQL execute promise 
     */
    queryGraphQLAsync (requestObj, {context}) {
        return new Promise((resolve, reject) => {
            const {query, variables, operationName} = requestObj;
            const queryAST = gql`${query}`;
            const schema = this._schema;

            execute(
                schema,
                queryAST,
                null,
                context,
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
