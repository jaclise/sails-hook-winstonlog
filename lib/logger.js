/**
 * sails-hook-winstonlog
 *
 * Author: John Kim @johnkimdev
 * License: MIT
 *
 * A Sails.js hook for integrating Winston logging into the system.
 **/

var Winston = require('winston');
var WinstonCloudWatch = require('winston-cloudwatch');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mkdirp = require('mkdirp');
var _ = require('lodash');

module.exports = function winstonlog(sails) {

	var transportsOpt = {
		console: Winston.transports.Console,
		dailyRotate: Winston.transports.DailyRotateFile,
		cloudWatch: WinstonCloudWatch,
	};

	var cKey = null;

	return {

		defaults: {
			__configKey__: {

				enabled: true,

				console: {
					enabled: true,
					level: 'info',
					timestamp: true,
					timestampFormat: 'llll',	// http://momentjs.com/docs/#/displaying/
					colorize: true,
					prettyPrint: true
				},

				dailyRotate: {
					enabled: false,
					level: 'info',
					filename: path.join(path.dirname(path.resolve('package.json')), 'logs', 'winston.log'),
					timestamp: true,
					timestampFormat: 'YYYY-MM-DD HH:mm:ss:SSS',	// http://momentjs.com/docs/#/displaying/
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
		},

		configure: function() {
			cKey = this.configKey;

			if (sails.config[cKey].console.timestamp === true &&
				sails.config[cKey].console.timestampFormat !== null &&
				sails.config[cKey].console.timestampFormat !== '') {
				sails.config[cKey].console.timestamp = function() {
					return moment().format(sails.config[cKey].console.timestampFormat);
				};
			}

			if (sails.config[cKey].dailyRotate.timestamp === true &&
				sails.config[cKey].dailyRotate.timestampFormat !== null &&
				sails.config[cKey].dailyRotate.timestampFormat !== '') {
				sails.config[cKey].dailyRotate.timestamp = function() {
					return moment().format(sails.config[cKey].dailyRotate.timestampFormat);
				};
			}

			for (var key in sails.config[cKey]) {
				sails.config[cKey][key] = _.extend(this.defaults[cKey][key], sails.config[cKey][key]);
			}
		},

		initialize: function (cb) {
			//		sails.log.info(sails.config[cKey]);

			sails.after(['hook:logger:loaded'], function () {
				var transports = [];
				var transportsOptArray = Object.keys(transportsOpt);

				var addTransport = function (transport, config) {

					if (!config.enabled) {
						return;
					}

					delete config.enabled;

					if (transport === Winston.transports.DailyRotateFile || transport === Winston.transports.File) {

						var dir = path.dirname(config.filename);

						if (!fs.existsSync(dir)) {
							mkdirp.sync(dir);
						}
					}

					transports.push(new transport(config));
				};

				for (var key in sails.config[cKey]) {

					if (transportsOptArray.indexOf(key) >= 0) {
						addTransport(transportsOpt[key], sails.config[cKey][key]);
					}
				}

				var logger = new Winston.Logger({
					transports: transports
				});

				var CaptainsLog = require('captains-log');
				sails.log = new CaptainsLog({ custom: logger });

				//			sails.log.info('Using Winston as the default logger');

				return cb();
			});
		}
	};
};
