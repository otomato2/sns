const express = require('express');
const router = express.Router();
const cors = require('cors');
const session = require('../modules/db');

const SLEEP_TIME = require('../modules/sleepConf');

router.use(cors());
const err = 'ERR';

// sleep function for session
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

router.get('/attach/:userIDFromParam/:userIDToParam/', async function(req, res, next) {
	let errCode = 0;
	const userIDFrom = req.params.userIDFromParam;
	const userIDTo = req.params.userIDToParam;
	
	try {
		await sleep(SLEEP_TIME);

		// setting
    const data = await session.executeWrite(tx => {
      return tx.run(`MATCH (u1:User {userID:'${userIDFrom}'}) WHERE u1 IS NOT NULL MATCH (u2:User {userID:'${userIDTo}'}) WHERE u2 IS NOT NULL MERGE (u1)-[:FOLLOW {glimpse:false}]->(u2) SET u1.follow=u1.follow+1, u2.follower=u2.follower+1;`)
		});
		
		res.send('OK');
	} catch (error) {
		res.send('NG');
	}
});

router.get('/detach/:userIDFromParam/:userIDToParam/', async function(req, res, next) {
	let errCode = 0;
	const userIDFrom = req.params.userIDFromParam;
	const userIDTo = req.params.userIDToParam;
	
	try {
		await sleep(SLEEP_TIME);
    const data = await session.executeWrite(tx => {
      return tx.run(`MATCH (u1:User {userID:'${userIDFrom}'}) WHERE u1 IS NOT NULL MATCH (u2:User {userID:'${userIDTo}'}) WHERE u2 IS NOT NULL MATCH (u1)-[f:FOLLOW]->(u2) DELETE f SET u1.follow=u1.follow-1, u2.follower=u2.follower-1;`)
		});
		
		res.send('OK');
	} catch (error) {
		res.send('NG');
	}
});

module.exports = router;