const { createMapCommand } = require('./mapCommand');
const { deadend } = require('../cards/mapConfigs');

module.exports = createMapCommand('deadend', deadend);
