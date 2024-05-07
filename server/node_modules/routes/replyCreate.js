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

router.get('/:userIDFromParam/:userIDToParam/:postDateParam/:mentionParam/:contentParam/', async function(req, res, next) {
	let errCode = 0;
	const userIDFrom = req.params.userIDFromParam;
	const userIDTo = req.params.userIDToParam;
	const postDate = Math.trunc(req.params.postDateParam);
	let date = new Date(postDate);
	let isoString = date.toISOString();
	const mentionParam = req.params.mentionParam;
	let content = req.params.contentParam;

	let mention = '';
	if (mentionParam == 'none') {
		mention = userIDTo;
	} else {
		mention = userIDTo + ',' + mentionParam;
	}
	let mentionArray = mention.split(',');

	try {
		await sleep(SLEEP_TIME);

		if (mentionArray) {
			mention = await getElementId(session, mentionArray, mention, errCode, 1, 2);
		}

		let contentArray = content.match(/\s@[a-zA-Z0-9_]+/g);
		if (contentArray) {
			contentArray.map((target, i) => {
				contentArray[i] = target.slice(2);
				return target;
			});
			content = await getElementId(session, contentArray, content, errCode, 1, 2);
		}

    const data = await session.executeWrite(tx => {
      return tx.run(`MATCH (:User {userID:'${userIDTo}'})-[:POSTED]->(p1:Post {datetime:datetime('${isoString}')}) MATCH (u:User {userID:'${userIDFrom}'}) CREATE (u)-[:POSTED]->(p2:Post {root:false, status:'valid', likeCnt:0, nutralCnt:0, dislikeCnt:0, reply:0, datetime:datetime(), mention:'${mention}', content:'${content}'})-[:REPLY]->(p1) SET p1.reply=p1.reply+1 RETURN p2.datetime;`)
		});
		
		res.send('OK');
	} catch (error) {
		res.send('NG');
	}
});

module.exports = router;