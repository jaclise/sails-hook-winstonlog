# Sails Winston Log

A custom Sails.js hook to add support for logging using the popular Winston library. Currently, the module comes with out of the box support for the following trasports:

* Console (will automatically be activated by default)
* DailyRotateFile (based on Winston's [DailyRotateFile](https://github.com/winstonjs/winston/blob/master/docs/transports.md#dailyrotatefile-transport))
* AWS CloudWatch (based on LazyWithClass's [Winston CloudWatch](https://github.com/lazywithclass/winston-cloudwatch))

## Installation
Make sure you have at least Sails.js version v0.11.0 installed.

---

##UPDATE

```0.1.0```  Added Moment timestamp format option. Global *enabled* is also added to the configuration.

---

## Usage
Like all other Sails.js hooks, this module will be instantiaed automatically when the Sails server lifts. It will configure Sails' default [Captain's Log](https://github.com/balderdashy/captains-log) to use a custom logger.

You can control what logging transports are available by creating a config file called ```config/winstonlog.js```.

The default options are shown below, and you only need to include the keys you want to change in your custom config file.

You will have to provide a ```logGroupName``` and a ```logStreamName``` if you are planning to use the ```CloudWatch``` transport. 

```js
module.exports.winstonlog = {

  enabled: true,

	console: {
		enabled: true,
		level: 'info',
		timestamp: true,
		timestampFormat: 'llll',    // http://momentjs.com/docs/#/displaying/
		colorize: true,
		prettyPrint: true
	},

	dailyRotate: {
		enabled: false,
		level: 'info',
		filename: path.join(path.dirname(path.resolve('package.json')), 'logs','winston.log.'),
		timestamp: true,
		timestampFormat: 'llll',    // http://momentjs.com/docs/#/displaying/
		colorize: false,
		maxsize: 1024 * 1024 * 10,
		json: true,
		prettyPrint: true,
		depth: 10,
		tailable: true,
		zippedArchive: true,
		datePattern: 'yyyy-MM-dd.log'
	},

	cloudWatch: {
		enabled: false,
		logGroupName: null,
		logStreamName: null,
		awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
		awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
		awsRegion: process.env.AWS_REGION
	}
}
```

## License
Copyright (c) 2015

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
