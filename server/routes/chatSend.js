const express = require('express');
const router = express.Router();
const cors = require('cors');
const session = require('../modules/db');

const getElementId = require('../modules/getElementId');
const SLEEP_TIME = require('../modules/sleepConf');

router.use(cors());
const err = 'ERR';

// sleep function for session
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

router.get('/:userIDFromParam/:userIDToParam/:contentParam', async function(req, res, next) {
	let errCode = 0;
	const userIDFrom = req.params.userIDFromParam;
	const userIDTo = req.params.userIDToParam;
	let content = req.params.contentParam;

	let userIDFromElementID = userIDFrom;
	
	try {
		await sleep(SLEEP_TIME);

		userIDFromElementID = await getElementId(session, Array(userIDFromElementID), String(userIDFromElementID), errCode, 1, 2);

		let contentArray = content.match(/\s@[a-zA-Z0-9_]+/g);
		console.log(contentArray)
		if (contentArray) {
			contentArray.map((target, i) => {
				contentArray[i] = target.slice(2);
				return target;
			});
			content = await getElementId(session, contentArray, content, errCode, 3, 4);
		}

		console.log(`MATCH (u1:User {userID:'${userIDFrom}'}) WHERE u1 IS NOT NULL MATCH (u2:User {userID:'${userIDTo}'}) WHERE u2 IS NOT NULL CREATE (u1)-[:CHAT {direction:'from'}]->(:Chat {status:'valid', sender:'${userIDFromElementID}', datetime:datetime(), content:'${content}'})-[:CHAT {direction:'to'}]->(u2);`)

		// setting
    const data = await session.executeWrite(tx => {
      return tx.run(`MATCH (u1:User {userID:'${userIDFrom}'}) WHERE u1 IS NOT NULL MATCH (u2:User {userID:'${userIDTo}'}) WHERE u2 IS NOT NULL CREATE (u1)-[:CHAT {direction:'from'}]->(:Chat {status:'valid', sender:'${userIDFromElementID}', datetime:datetime(), content:'${content}'})-[:CHAT {direction:'to'}]->(u2);`)
		});
		
		res.send('OK');
	} catch (error) {
		res.send('NG');
	}
});

module.exports = router;