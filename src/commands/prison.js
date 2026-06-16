const { createMapCommand } = require('./mapCommand');
const { prison } = require('../cards/mapConfigs');

module.exports = createMapCommand('prison', prison);
