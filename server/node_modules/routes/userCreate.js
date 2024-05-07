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

router.post('/', async function(req, res, next) {
	let errCode = 0;
	const userID = req.body['userID'];
	const userName = req.body['userName'];
	const password = req.body['password'];
	const birthday = req.body['birthday'];
	let bio = req.body['bio'];

	try {
		await sleep(SLEEP_TIME);

		if (bio == 'none') {
			bio = '';
		} else {
			// resolve userID
			let bioArray = bio.match(/\s@[a-zA-Z0-9_]+/g);
			if (bioArray) {
				bioArray.map((target, i) => {
					bioArray[i] = target.slice(2);
					return target;
				});
				bio = await getElementId(session, bioArray, bio, errCode, 1, 2);
			}
		}

		// userID check
		const resultScan = await session.executeWrite(async tx => {
			return await tx.run(`MATCH (u:User {userID:'${userID}'}) RETURN false;`)
		});

		if (resultScan.records.length == 0) {
			await session.executeWrite(async tx => {
				return await tx.run(`CREATE (:User {status:'public', userID:'${userID}', userName:'${userName}', userType:'individual', follow:0, follower:0, birthday:date('${birthday}'), wellcomeDay:date(), password:'${password}', bio:'${bio}', iconPath:''});`)
			});
			res.json({status:'success'});
		} else {
			res.json({status:'failure'});
		}
	} catch (error) {
		res.send(err);
	}
});

module.exports = router;