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

router.get('/:userIDParam/:contentParam/', async function(req, res, next) {
	let errCode = 0;
	const userID = req.params.userIDParam;
	let content = req.params.contentParam;

	try {
		await sleep(SLEEP_TIME);

		let contentArray = content.match(/\s@[a-zA-Z0-9_]+/g);
		if (contentArray) {
			contentArray.map((target, i) => {
				contentArray[i] = target.slice(2);
				return target;
			});
			content = await getElementId(session, contentArray, content, errCode, 1, 2);
		}

    const data = await session.executeWrite(tx => {
      return tx.run(`MATCH (u:User {userID:'${userID}'}) CREATE (u)-[:POSTED]->(p:Post {root:true, status:'valid', likeCnt:0, nutralCnt:0, dislikeCnt:0, reply:0, datetime:datetime(), mention:'', content:'${content}'});`)
		});
		
		res.redirect(`/user/${userID}/`);
	} catch (error) {
		res.send('NG');
	}
});

module.exports = router;