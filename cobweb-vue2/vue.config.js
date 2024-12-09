const demoBuildConfig = require('./config/config.demo');
const npmBuildConfig = require('./config/config.npm');

module.exports = process.env.ENV === 'npm' ? npmBuildConfig : demoBuildConfig;
