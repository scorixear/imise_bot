import fs from 'fs';

const version = JSON.parse(fs.readFileSync('package.json').toString()).version;

export default {
  repository: 'https://github.com/scorixear/imise_bot',
  botPrefix: '/',
  version,
  adminRoles: ['unsuspicious Role', '💻Entwickler💻', '👑Monarch👑']
};
