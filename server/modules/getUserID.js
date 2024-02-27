// elementId to userID
// session: neo4j's session
// data: elementId (array)
// str: want to change string (string)
// errCode: current error code
// errCodeSeparate: when single error occured (int)
// errCodeOverlap: when mulitple error occured (int)
async function getUserID (session, data, str, errCode, errCodeSeparate, errCodeOverlap) {
	for (let elementId of data) {
		try {
			const userID = await session.executeRead(async (tx) => {
				return tx.run(`MATCH (u:User) WHERE elementId(u)='${elementId}' RETURN u.userID;`)
			});
			str = str.replace(elementId, String(userID.records[0]._fields));
		} catch (error) {
			if (errCode == 0) {
				errCode = errCodeSeparate;
			} else {
				errCode = errCodeOverlap;
			}
		}
	}
	return str;
}

module.exports = getUserID;