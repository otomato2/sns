// userID to elementId
// session: neo4j's session
// data: userID (array)
// str: want to change string (string)
// errCode: current error code
// errCodeSeparate: when single error occured (int)
// errCodeOverlap: when mulitple error occured (int)
async function getElementId (session, data, str, errCode, errCodeSeparate, errCodeOverlap) {
	for (let userID of data) {
		try {
			const elementId = await session.executeRead(async (tx) => {
				return await tx.run(`MATCH (u:User {userID:'${userID}'}) RETURN elementId(u);`)
			});
			if (elementId.records.length != 0) {
				str = str.replace(userID, String(elementId.records[0]._fields));
			}
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

module.exports = getElementId;