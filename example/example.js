const npv = require('../npm-pkg-version');

async function checkVersion(name, actualVersion) {
	let result = await npv(name, { proxy: 'http://127.0.0.1:5000' });
	let actualFormated = actualVersion
		.replace('^', '')
		.replace('~', '')
		.replace('<', '')
		.replace('>', '')
		.replace('=', '')
		.replace('-', '')
		.replace('|', '');
	if (result) {
		let detail = await result.json();
		return {
			package: name,
			actual: actualFormated,
			latest: detail && detail['dist-tags'] ? detail['dist-tags'].latest : 'Not Found',
			diff: detail && detail['dist-tags'] ? detail['dist-tags'].latest != actualFormated : true,
		};
	}
	return {
		package: name,
		actual: actualFormated,
		latest: 'Not Found',
	};
}

(async () => {
	const dependencies = {
		lodash: '4.17.15',
		eslint: '6.1.0',
		moment: '2.24.0',
	};

	let promises = [];
	for (let [key, value] of Object.entries(dependencies)) {
		console.log(`${key}: ${value}`);

		promises.push(checkVersion(key, value));
	}
	Promise.all(promises).then((r) => {
		console.log('Result : ', r);
	});
})();
