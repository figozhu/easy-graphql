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
