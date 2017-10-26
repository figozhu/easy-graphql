'use strict'

const fakeDB = {};
module.exports = fakeDB;

const userData = [
    {uid: 1, name: "Tom", avatar: "https://pre00.deviantart.net/2930/th/pre/i/2014/182/a/2/tom_cat_by_1997ael-d7ougoa.png"},
    {uid: 2, name: "Jerry", avatar: "https://vignette.wikia.nocookie.net/tomandjerry/images/2/29/Jerry_2.png"},
];

const postData = [
    {pid: 1, title: "foo", content: "xxx", authorId: 1},
    {pid: 2, title: "bar", content: "yyy", authorId: 2},
];

fakeDB.getUserById = (uid) => {    
    return userData.find(user => {
        return user.uid === uid;
    });
};

fakeDB.getPostById = (pid) => {
    return postData.find(post => {
        return post.pid === pid;
    });
}
