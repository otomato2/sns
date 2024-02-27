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

// get
router.get('/:userIdParam/', async function(req, res, next) {
  let errCode = 0;
  const userId = req.params.userIdParam;
  try {
		await sleep(SLEEP_TIME);
    const data = await session.executeRead(tx => {
      return tx.run(`MATCH (:User {userID:'${userId}'})-[:FOLLOW]->(u:User)-[:POSTED]->(p:Post) RETURN p.root, u.userID, p.likeCnt, p.nutralCnt, p.dislikeCnt, p.reply, p.datetime, p.mention, p.content ORDER BY p.datetime;`)
    });
    if (data.records.length == 0) {
      res.json({status: 'none'})
      return;
    }
    let result = '';
		if (data.records.length != 0) {
			result = await postRecord(data, '', '');
		}
    
		result, errCode = await resolveUserID(session, result, errCode);
    
    if (errCode == 0) {
      res.send(result);
    } else {
      res.json({status:'failure', errCode: errCode});
    }
  } catch (error) {
    errCode = 4;
    res.json({status:'failure', errCode: errCode});
  }
});

module.exports = router;