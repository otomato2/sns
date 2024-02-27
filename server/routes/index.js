const express = require('express');
const router = express.Router();
const cors = require('cors');
const session = require('../modules/db')

router.use(cors());
const err = 'ERR';

// sleep function for session
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

router.get('/', function(req, res, next) {
  res.send(`
    <form method="POST">
      <div>
        <label>user ID</label>
        <input type="text" name="userID" placeholder="Please enter your user ID" />
      </div>
      <div>
        <label>password</label>
        <input type="password" name="password" placeholder="Please enter your password" />
      </div>
      <div>
        <button>send</button>
      </div>
    </form>
  `);
});

router.post('/', async function(req, res, next) {
  const user_id = req.body['userID'];
  const password = req.body['password'];

  await sleep(100);	// sleep 100 ms. it is not good ... I will change later
  const result = await session.executeRead(async tx => {
    return await tx.run(`MATCH (u:User {userID:'${user_id}', password:'${password}'}) WHERE u.status='public' OR u.status='private' RETURN true;`)
  } );
	if (result.records.length != 0) {
		res.json({status:'success'});
    // res.redirect('http://localhost:3000/timeline')
	} else {
		res.json({status:'failure'});
	}
});

module.exports = router;