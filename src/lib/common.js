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
 * @property {string}  collectionPattern - The pattern used by Aloes Client Collection [].
 * @property {string}  instancePattern - The pattern used by Aloes Client instance.
 * @property {object}  validators - Check inputs / build outputs
 * @property {array}   validators.userId
 * @property {array}   validators.collectionName
 * @property {array}   validators.methods - [0, 1, 2, 3, 4].
 */
const protocolRef = {
  collectionPattern: '+userId/+collectionName/+method',
  instancePattern: '+userId/+collectionName/+method/+modelId',
  validators: {
    userId: 'string',
    collectionName: [
      'Account',
      'Device',
      'Sensor',
      'VirtualObject',
      'IoTAgent',
    ],
    modelId: 'string',
    methods: ['HEAD', 'POST', 'GET', 'PUT', 'DELETE', 'STREAM'],
  },
};

module.exports = protocolRef;
