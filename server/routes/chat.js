const express = require('express');
const router = express.Router();
const cors = require('cors');
const session = require('../modules/db');

const SLEEP_TIME = require('../modules/sleepConf');
const getUserID = require('../modules/getUserID')

router.use(cors());
const err = 'ERR';

// sleep function for session
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

router.get('/:userIdFromParam/:userIdToParam/', async function(req, res, next) {
  let errCode = 0;
  const userIdFrom = req.params.userIdFromParam;
	const userIdTo = req.params.userIdToParam;
	try {
		await sleep(SLEEP_TIME);
    const data = await session.executeRead(tx => {
      return tx.run(`MATCH (:User {userID:'${userIdFrom}'})-[:CHAT]-(c:Chat {status:'valid'})-[:CHAT]-(:User {userID:'${userIdTo}'}) RETURN c.sender, c.datetime, c.content ORDER BY c.datetime`)
		});
		let result = '';
		if (data.records.length == 0) {
			res.json({status:'failure'});
			return;
		}

		result = data.records.map(item => item._fields);
		const keys = ['sender', 'datetime', 'content'];
		result = await Promise.all(result.map(async (item) => {
			let obj = {};

			obj[keys[0]] = String(item[0]);
			const date = String(item[1].year.low) + '-' + String(item[1].month.low).padStart(2, '0') + '-' + String(item[1].day.low).padStart(2, '0') + 'T' + String(item[1].hour.low).padStart(2, '0') + ':' + String(item[1].minute.low).padStart(2, '0') + ':' + String(item[1].second.low).padStart(2, '0') + '.' + String(item[1].nanosecond.low) + 'Z';
			obj[keys[1]] = date;
			obj[keys[2]] = String(item[2]);

			return obj;
		}));

		for (let i = 0; i < result.length; i++) {
			let contentArray = result[i]['content'].match(/\s@[a-z0-9:-]+/g);
			if (contentArray) {
				contentArray.map((target, i) => {
					contentArray[i] = target.slice(2);
					return target;
				});
				result[i]['content'] = await getUserID(session, contentArray, String(result[i]['content']), errCode, 2, 3);
			}

			result[i]['sender'] = await getUserID(session, Array(result[i]['sender']), String(result[i]['sender']), errCode, 4, 5);
		}



		res.send(result)
	} catch (error) {
		res.send(err);
	}
});

module.exports = router;