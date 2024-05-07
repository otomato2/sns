const express = require('express');
const router = express.Router();
const cors = require('cors');
const session = require('../modules/db');

const SLEEP_TIME = require('../modules/sleepConf');

router.use(cors());
const err = 'ERR';

// sleep function for session
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

router.post('/', async function(req, res, next) {
	let errCode = 0;
	const userID = req.body['userID'];
	const password = req.body['password'];

	try {
		await sleep(SLEEP_TIME);

		const result = await session.executeWrite(async tx => {
			return await tx.run(`MATCH (u:User {userID:'${userID}', password:'${password}'}) WHERE u IS NOT NULL SET u.status='deleted' RETURN true;`)
		});
		if (result.records.length != 0) {
			res.json({status:'success'});
		} else {
			res.json({status:'failure'});
		}
	} catch (error) {
		res.send(err);
	}
});

module.exports = router;