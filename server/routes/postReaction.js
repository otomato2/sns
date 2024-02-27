const express = require('express');
const router = express.Router();
const cors = require('cors');
const session = require('../modules/db');

const SLEEP_TIME = require('../modules/sleepConf');

router.use(cors());
const err = 'ERR';

// sleep function for session
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

router.get('/attach/:userIDFromParam/:userIDToParam/:postDateParam/:sentimentParam/', async function(req, res, next) {
	let errCode = 0;
	const userIDFrom = req.params.userIDFromParam;
	const userIDTo = req.params.userIDToParam;
	const postDate = Math.trunc(req.params.postDateParam);
	const sentiment = req.params.sentimentParam;

	let date = new Date(postDate);
	let isoString = date.toISOString();
	
	try {
		await sleep(SLEEP_TIME);

		// setting
    const data = await session.executeWrite(tx => {
      return tx.run(`MATCH (u1:User {userID:'${userIDFrom}'}) WHERE u1 IS NOT NULL MATCH (u2:User {userID:'${userIDTo}'})-[r:POSTED]->(p:Post {datetime:datetime('${isoString}')}) WHERE r IS NOT NULL MERGE (u1)-[:${sentiment.toUpperCase()}]->(p) SET p.${sentiment}Cnt=p.${sentiment}Cnt+1;`)
		});

		let sentimentArray = ['like', 'nutral', 'dislike']
		sentimentArray = sentimentArray.filter(function (sentimentValue) {
			return sentimentValue !== sentiment;
		});
		
		// remove othre sentiment
		// do NOT use something iterator like `for each`
		for (let i = 0; i < sentimentArray.length; i++){
			await session.executeWrite(tx => {
				return tx.run(`MATCH (u1:User {userID:'${userIDFrom}'})-[l:${sentimentArray[i].toUpperCase()}]->(p:Post {datetime:datetime('${isoString}')})<-[:POSTED]-(:User {userID:'${userIDTo}'}) DELETE l SET p.${sentimentArray[i]}Cnt=p.${sentimentArray[i]}Cnt-1;`)
			})
		}
		
		res.send('OK');
	} catch (error) {
		res.send('NG');
	}
});

router.get('/detach/:userIDFromParam/:userIDToParam/:postDateParam/:sentimentParam/', async function(req, res, next) {
	let errCode = 0;
	const userIDFrom = req.params.userIDFromParam;
	const userIDTo = req.params.userIDToParam;
	const postDate = Math.trunc(req.params.postDateParam);
	const sentiment = req.params.sentimentParam;

	let date = new Date(postDate);
	let isoString = date.toISOString();
	
	try {
		await sleep(SLEEP_TIME);
    const data = await session.executeWrite(tx => {
      return tx.run(`MATCH (u1:User {userID:'${userIDFrom}'})-[l:${sentiment.toUpperCase()}]->(p:Post {datetime:datetime('${isoString}')})<-[:POSTED]-(:User {userID:'${userIDTo}'}) DELETE l SET p.${sentiment}Cnt=p.${sentiment}Cnt-1;`)
		});
		
		res.send('OK');
	} catch (error) {
		res.send('NG');
	}
});

module.exports = router;