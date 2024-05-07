const express = require('express');
const router = express.Router();
const cors = require('cors');
const session = require('../modules/db');

const postRecord = require('../modules/postRecord');
const resolveUserID = require('../modules/resolveUserID');
const SLEEP_TIME = require('../modules/sleepConf');

router.use(cors());
const err = 'ERR';

// sleep function for session
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

router.get('/:userIDParam/:postDateParam/', async function(req, res, next) {
	let errCode = 0;
	const userID = req.params.userIDParam;
	const postDate = Math.trunc(req.params.postDateParam);
	let date = new Date(postDate);
	let isoString = date.toISOString();
	try {
		await sleep(SLEEP_TIME);

		const dataPrev = await session.executeRead(tx => {
			return tx.run(`MATCH (:User {userID:'${userID}'})-[:POSTED]->(:Post {status:'valid', datetime:datetime('${isoString}')})-[:REPLY]->(p:Post {status:'valid'})<-[:POSTED]-(u:User) RETURN p.root, u.userID, p.likeCnt, p.nutralCnt, p.dislikeCnt, p.reply, p.datetime, p.mention, p.content ORDER BY p.datetime`)
		});
		let resultPrev = '';
		if (dataPrev.records.length != 0) {
			resultPrev = await postRecord(dataPrev, '', '');
		}
		resultPrev, errCode = await resolveUserID(session, resultPrev, errCode);

		const dataCur = await session.executeRead(tx => {
			return tx.run(`MATCH (:User {userID:'${userID}'})-[:POSTED]->(p:Post {status:'valid', datetime:datetime('${isoString}')}) RETURN p.root, p.likeCnt, p.nutralCnt, p.dislikeCnt, p.reply, p.mention, p.content`)
		});
		let resultCur = '';
		if (dataCur.records.length != 0) {
			resultCur = await postRecord(dataCur, userID, isoString);
		}
		resultCur, errCode = await resolveUserID(session, resultCur, errCode);

		const dataNext = await session.executeRead(tx => {
			return tx.run(`MATCH (:User {userID:'${userID}'})-[:POSTED]->(:Post {status:'valid', datetime:datetime('${isoString}')})<-[:REPLY]-(p:Post {status:'valid'})<-[:POSTED]-(u:User) RETURN p.root, u.userID, p.likeCnt, p.nutralCnt, p.dislikeCnt, p.reply, p.datetime, p.mention, p.content ORDER BY p.datetime`)
		});
		let resultNext = '';
		if (dataNext.records.length != 0) {
			resultNext = await postRecord(dataNext, '', '');
		}
		resultNext, errCode = await resolveUserID(session, resultNext, errCode);

		let result = [...resultPrev, ...resultCur, ...resultNext]

		if (errCode == 0) {
      res.send(result);
    } else {
      res.json({status:'failure', errCode: errCode});
    }
	} catch (error) {
		errCode = 1;
		res.json({status:'failure', errCode: errCode});
	}
});

module.exports = router;