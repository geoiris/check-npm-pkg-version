const npv = require('./npm-pkg-version');
const npmlodashmock = require('./mock/npmregistry_lodash_mock.json');
const otherregistrylodashmock = require('./mock/otherregistry_lodash_mock.json');
const fetch = require('node-fetch');

beforeEach(() => {
	fetch.resetMocks();
	fetch.doMock();
});

it('get lodash package version to json with proxy', async () => {
	fetch.mockResponse(JSON.stringify(npmlodashmock));
	const moduleName = 'lodash';

	let result = await npv(moduleName, { proxy: 'http://myproxy.com' });
	let detail = await result.json();

	expect(detail).toBeDefined();
	expect(detail['dist-tags']).toBeDefined();
	expect(detail['dist-tags'].latest).not.toBeNull();
	expect(detail['dist-tags'].latest).toBe('12.12.12');
});

it('get lodash package version to json without proxy', async () => {
	fetch.mockResponse(JSON.stringify(npmlodashmock));
	const moduleName = 'lodash';

	let result = await npv(moduleName);
	let detail = await result.json();

	expect(detail).toBeDefined();
	expect(detail['dist-tags']).toBeDefined();
	expect(detail['dist-tags'].latest).not.toBeNull();
	expect(detail['dist-tags'].latest).toBe('12.12.12');
});

it('Should get undefined when have no module name', async () => {
	let result = await npv(null);
	expect(result).not.toBeDefined;
});

it('get lodash package version to json with other registry', async () => {
	fetch.mockResponse(JSON.stringify(otherregistrylodashmock));
	const moduleName = 'lodash';

	let result = await npv(moduleName, { registry: 'http://mycustomregistry.com/' });
	let detail = await result.json();

	expect(detail).toBeDefined();
	expect(detail['dist-tags']).toBeDefined();
	expect(detail['dist-tags'].latest).not.toBeNull();
	expect(detail['dist-tags'].latest).toBe('1.1.1');
});
