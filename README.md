# check-npm-pkg-version

This package is made to help you to verify the latest version of one specific package by code.

My original problem, i have an app who check many things in a specified git repository. But, when y want check if a package is up to date, I have not found package who make that (or i'am probably a looser :P). So, yes we can check the latest version whith the npm outdated command, but for that, we have clone the repository. It's not that i want. So, it was fun to dev this module for help me.

## Install the module

With npm

```
npm install check-npm-pkg-version
```

or yarn

```
yarn add check-npm-pkg-version
```

## Use the module

first time, add the module in your code :

```
const npv = require('check-npm-pkg-version')
```

After, just use it with the package name that you want check, example :

```
let result = await npv('check-npm-pkg-version');
```

The check-npm-pkg-version function return a promise. This promise was mage by node-fetch lib to call the npm registry API for find your search. So, i don't manage node-fetch return, you have to check the result by yourself.

In my example, i call npv function, and i check if the result is here. After that i call the res.json() function to convert the response in JSON and make my own control.

```
let result = await npv(name);

if (result) {
    let detail = await result.json();
    //Do something here with detail
}
```

You can find an example of return here : https://registry.npmjs.com/lodash

It's this URI that i use in my package.

## Use custom proxy or custom registry

One part of this module it's the parameters. You can use a proxy if, like me, your are in enterprise.

How set the proxy configuration ? The npv function take optionnals params

```
npv('package name', options);
```

options is an object, you can set your custom proxy, your custom registry or both of them.

Example :

```
let options : {
    proxy : "http://mycustomproxy",
    registry : "http://mycustomregistry.com"
}
```

By default, i don't use proxy, and use registry.npmjs.com as default registry.

## Run tests

You can clone my repo for check i'am not vilain whith i don't know why, but if you have the local sources, please, if you add code to contribute, test your code :P

You have two commands for run the unit tests :

```
npm test

or

npm run test-coverage
```

I use Jest for test my package.
Goal : 100% coverage.

```
--------------------------|---------|----------|---------|---------|-------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|-------------------
All files                 |     100 |      100 |     100 |     100 |
 check-npm-pkg-version.js |     100 |      100 |     100 |     100 |
--------------------------|---------|----------|---------|---------|-------------------
```

## One example

You can run the example in the 'example' folder, from root :

```
nodex example/example.js
```

In this example, i have a function who take the package name and this actual version. I call the npv method for check the latest version and i compare the result for return an object with, the package name checked, the actual version, the latest version and a boolean for the diff (true if diff) :

```
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
```

I call this function in my code for check many packages (extract from dependencies object from package.json) and show the result (in web page IRL) in console (for this example) :

```
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
		console.log('Resultat : ', r);
	});
})();
```

Here, i just console.log the JSON result :

```
Result :  [
  {
    package: 'lodash',
    actual: '4.17.15',
    latest: '4.17.15',
    diff: false
  },
  {
      package: 'eslint',
      actual: '6.1.0',
      latest: '6.8.0',
      diff: true
  },
  {
    package: 'moment',
    actual: '2.24.0',
    latest: '2.24.0',
    diff: false
  }
]
```

## Thank for read

I hope this package help you. I will try to check your comments (if you comment...)

Enjoy
