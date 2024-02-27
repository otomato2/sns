/* var str = 'user-1,user-2,user-3';

//「, (カンマ)」で区切って分割する
var result = str.split(',');

console.log( result ); */

array = [ '@4:f138884b-e3cd-4418-a731-a473db9b2b79:17,@4:f138884b-e3cd-4418-a731-a473db9b2b79:2' ]

console.log(String(array).split(',').map((item) => {
	return '@' + String(item);
}))
