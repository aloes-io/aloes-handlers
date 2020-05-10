/*  
Aloes-handlers encode / decode MQTT stream from IoT devices to Web browsers to/from aloes client format

Copyright 2020 Edouard Maleix

Aloes-handlers is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

Aloes-handlers is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Aloes-handlers. If not, see <https://www.gnu.org/licenses/>.
*/

const {aloesClientEncoder} = require('./lib/encoder');
const {aloesClientPatternDetector} = require('./lib/detector');
const {updateAloesSensors} = require('./lib/updater');
const version = require('../package.json').version;

module.exports = {
  version,
  aloesClientEncoder,
  updateAloesSensors,
  aloesClientPatternDetector,
};
