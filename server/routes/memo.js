let dateString = "2024-02-17T10:32:55.067000000Z";
let epochMilliseconds = Date.parse(dateString);
console.log(epochMilliseconds);

let timestamp = 1708165975067;
let date = new Date(timestamp);
let isoString = date.toISOString();
console.log(isoString);


/* let date = new Date();
let isoString = date.toISOString();
console.log(date)
console.log(isoString) */

/* // let strm = "4:f138884b-e3cd-4418-a731-a473db9b2b79:17, 4:f138884b-e3cd-4418-a731-a473db9b2b79:0"
let strm = ""
console.log(strm.length)
let mentionArray = strm.split(', ');
console.log(mentionArray.length);
 */

/* let datetimeTmp = data.records[0]._fields[0];
const datetime = String(datetimeTmp.year.low) + '-' + String(datetimeTmp.month.low).padStart(2, '0') + '-' + String(datetimeTmp.day.low).padStart(2, '0') + 'T' + String(datetimeTmp.hour.low).padStart(2, '0') + ':' + String(datetimeTmp.minute.low).padStart(2, '0') + ':' + String(datetimeTmp.second.low).padStart(2, '0') + '.' + String(datetimeTmp.nanosecond.low) + 'Z'; */
