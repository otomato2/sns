const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://172.21.219.37:7687', neo4j.auth.basic('neo4j', 'helloworld'));

const session = driver.session();

module.exports = session;