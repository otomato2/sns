require('dotenv').config();

const neo4j = require('neo4j-driver');
const driver = neo4j.driver(`bolt://${process.env.NEO4J_IP_ADDR}:7687`, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

const session = driver.session();

// console.log(`bolt://${process.env.NEO4J_IP_ADDR}:7687`, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD))

module.exports = session;