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
