/**
 * Oma Object References.
 * @external OmaObjects
 * @see {@link https://api.aloes.io/api/omaObjects}
 */

/**
 * Oma Resources References.
 * @external OmaResources
 * @see {@link https://api.aloes.io/api/omaResources}
 */

/**
 * References used to validate payloads
 * @namespace
 * @property {string}  pattern - The pattern used by Aloes Light devices.
 * @property {object}  validators - Check inputs / build outputs
 * @property {array}   validators.prefixedDevEui
 * @property {array}   validators.nodeId
 * @property {array}   validators.methods - [0, 1, 2, 3, 4].
 */
const protocolRef = {
  pattern: '+prefixedDevEui/+method/+omaObjectId/+sensorId/+omaResourceId',
  validators: {
    prefixedDevEui: 'string',
    suffixedDevEui: 'string',
    nodeId: 'number',
    sensorId: 'number',
    subType: 'number',
    methods: [0, 1, 2, 3, 4],
    directions: ['-in', '-out'],
  },
};

module.exports = protocolRef;
