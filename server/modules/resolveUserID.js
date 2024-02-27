const getUserID = require('./getUserID')

async function resolveUserID(session, result, errCode){

	// resolve mention userID
	for (let i = 0; i < result.length; i++) {
		let mentionArray = String(result[i]['mention']).split(',')
		if (mentionArray.length != 0) {
			result[i]['mention'] = await getUserID(session, mentionArray, String(result[i]['mention']), errCode, 1, 3);
		} else {
			mentionArray = '';
		}
	}

	// resolve content userID
	for (let i = 0; i < result.length; i++) {
		let contentArray = result[i]['content'].match(/\s@[a-z0-9:-]+/g);
		if (contentArray) {
			contentArray.map((target, i) => {
				contentArray[i] = target.slice(2);
				return target;
			});
			result[i]['content'] = await getUserID(session, contentArray, result[i]['content'], errCode, 2, 3);
		}
	}
	return result, errCode;
}

module.exports = resolveUserID;