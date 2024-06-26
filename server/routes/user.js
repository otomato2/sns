const express = require('express');
const router = express.Router();
const cors = require('cors');
const session = require('../modules/db');

const getUserID = require('../modules/getUserID');
const postRecord = require('../modules/postRecord');
const resolveUserID = require('../modules/resolveUserID');
const SLEEP_TIME = require('../modules/sleepConf');

router.use(cors());
const err = 'ERR';

// sleep function for session
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

router.get('/:userIdParam/', async function(req, res, next) {
  let errCode = 0;
  const userId = req.params.userIdParam;

	let resultUserInfo = '';
  try {
		await sleep(SLEEP_TIME);
    const dataUserInfo = await session.executeRead(tx => {
      return tx.run(`MATCH (u:User {userID:'${userId}'}) RETURN u.follow, u.follower, u.userName, u.bio`)
		});
		if (dataUserInfo.records.length == 0) {
			res.json({status:'failure', errCode: 1});
			return;
		}
		resultUserInfo = dataUserInfo.records.map(item => item._fields);
		const keys = ['follow', 'follower', 'userName', 'bio'];

		resultUserInfo = await Promise.all(resultUserInfo.map(async (item) => {
			let obj = {};

			obj[keys[0]] = item[0].low;
			obj[keys[1]] = item[1].low;
			obj[keys[2]] = String(item[2]);
			obj[keys[3]] = String(item[3]);

			return obj;
		}));

		let bioArray = resultUserInfo[0]['bio'].match(/\s@[a-z0-9:-]+/g);
		if (bioArray) {
			bioArray.map((target, i) => {
				bioArray[i] = target.slice(2);
				return target;
			});
			resultUserInfo[0]['bio'] = await getUserID(session, bioArray, resultUserInfo[0]['bio'], errCode, 2, 3);
		}

		if (errCode != 0) {
      errCode = 3
    }
  } catch (error) {
    errCode = 4;
  }

	let resultPosts = '';
	try {
		const dataUserPosts = await session.executeRead(tx => {
			return tx.run(`MATCH (:User {userID:'${userId}'})-[:POSTED]->(p:Post) RETURN p.root, p.likeCnt, p.nutralCnt, p.dislikeCnt, p.reply, p.datetime, p.mention, p.content`)
		});
		if (dataUserPosts.records.length != 0) {
			resultPosts = await postRecord(dataUserPosts, userId, '');
		}
		
		resultPosts, errCode = await resolveUserID(session, resultPosts, errCode);
		
		if (errCode != 0) {
      errCode = 3
    }
	} catch (error) {
		errCode = 4;
	}

	let result = [resultUserInfo, ...resultPosts]
	if (errCode == 0) {
		res.send(result);
	} else {
		res.send(err + errCode);
	}

});

module.exports = router;