'use strict';

var _ = require('lodash');
var path = require('path');
var util = require('util');

module.exports = function configParser(config) {
    var configPath, defaultConfig;
    if (config.extends) {
        configPath = path.resolve(util.format('node_modules/pug-lint-config-%s', config.extends), 'index.js');

        try {
            defaultConfig = require(configPath);
            return _.extend({}, defaultConfig, _.omit(config, 'extends'));
        } catch (e) {
            // no prob
        }
    }

    return config;
};
