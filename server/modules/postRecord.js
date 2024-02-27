async function postRecord(data, userID, isoString){
	let newData = data.records.map(item => item._fields);
	const keys = ['root', 'userID', 'likeCnt', 'nutralCnt', 'dislikeCnt', 'reply', 'datetime', 'mention', 'content'];
	newData = await Promise.all(newData.map(async (item) => {
		let obj = {};
		let i = 1;

		obj[keys[0]] = item[0];	// root

		if (userID != '') {
			obj[keys[1]] = userID;	// userId
		} else {
			obj[keys[1]] = item[1];	// userId
			i++;
		}

		obj[keys[2]] = item[i + 0].low;	// likeCnt
		obj[keys[3]] = item[i + 1].low;	// nutralCnt
		obj[keys[4]] = item[i + 2].low;	// dislikeCnt
		obj[keys[5]] = item[i + 3].low;	// reply

		if (isoString != '') {
			obj[keys[6]] = isoString;	//date (ISO 8601)
		} else {
			const date = String(item[i + 4].year.low) + '-' + String(item[i + 4].month.low).padStart(2, '0') + '-' + String(item[i + 4].day.low).padStart(2, '0') + 'T' + String(item[i + 4].hour.low).padStart(2, '0') + ':' + String(item[i + 4].minute.low).padStart(2, '0') + ':' + String(item[i + 4].second.low).padStart(2, '0') + '.' + String(item[i + 4].nanosecond.low) + 'Z';
      obj[keys[6]] = date;	// date (ISO 8601)
			i++;
		}

		let strm = ''
		strm = String(item[i + 4]);
		if (strm.length != 0) {
			let mentionArray = strm.split(', ');
			obj[keys[7]] = mentionArray;	// mention
		} else {
			obj[keys[7]] = '';	// mention
		}
		
		obj[keys[8]] = String(item[i + 5]);	// content

		return obj;
	}));
	return newData;
}

module.exports = postRecord;