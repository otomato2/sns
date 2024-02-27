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

// userId
router.post('/userid/', async function(req, res, next) {
	let errCode = 0;
	const userID = req.body['userID'];
	const chgUserID = req.body['chgUserID'];
	
	try {
		await sleep(SLEEP_TIME);

		// setting
    const resultScan = await session.executeWrite(tx => {
      return tx.run(`MATCH (u1:User {userID:'${userID}'}) WHERE u1 IS NOT NULL MATCH (u2:User {userID:'${chgUserID}'}) RETURN false;`)
		});

		if (resultScan.records.length == 0) {
			await session.executeWrite(tx => {
				return tx.run(`MATCH (u:User {userID:'${userID}'}) SET u.userID='${chgUserID}' RETURN true;`)
			});
			res.json({status:'success'});;
		} else {
			res.json({status:'failure'});
		}
	} catch (error) {
		res.send(err);
	}
});

// bio
router.post('/bio/', async function(req, res, next) {
	let errCode = 0;
	const userID = req.body['userID'];
	let chgBio = req.body['chgBio'];

	console.log('hi')

	try {
		await sleep(SLEEP_TIME);

		let bioArray = chgBio.match(/\s@[a-zA-Z0-9_]+/g);
		if (bioArray) {
			bioArray.map((target, i) => {
				bioArray[i] = target.slice(2);
				return target;
			});
			chgBio = await getElementId(session, bioArray, chgBio, errCode, 1, 2);
		}

		// setting
    await session.executeWrite(tx => {
      return tx.run(`MATCH (u:User {userID:'${userID}'}) SET u.bio='${chgBio}' RETURN true;`)
		});
		res.json({status:'success'});
	} catch (error) {
		res.send(err);
	}
});

// user name, password
router.post('/', async function(req, res, next) {
	let errCode = 0;
	const settingName = req.body['settingName'];
	const userID = req.body['userID'];
	const chgSetting = req.body['chgSetting'];

	console.log(settingName, userID, chgSetting)

	try {
		await sleep(SLEEP_TIME);

		// setting
    await session.executeWrite(tx => {
      return tx.run(`MATCH (u:User {userID:'${userID}'}) SET u.${settingName}='${chgSetting}' RETURN true;`)
		});
		res.json({status:'success'});
	} catch (error) {
		res.send(err);
	}
});

module.exports = router;