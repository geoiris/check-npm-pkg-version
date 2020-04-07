const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

const defaultRegistry = 'https://registry.npmjs.com/';

module.exports = async (packageName, options = null) => {
	if (!packageName) return;

	//set registry
	let registry = defaultRegistry;
	if (options && options.registry) registry = options.registry;

	//if custom proxy
	if (options && options.proxy) {
		console.log(`Calling ${registry}${packageName} with proxy ${options.proxy}`);
		return fetch(registry + packageName, { agent: new HttpsProxyAgent(options.proxy) });
	}
	console.log(`Calling ${registry}${packageName}`);
	return fetch(registry + packageName);
};
