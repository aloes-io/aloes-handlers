/**
 * Oma Object References.
 * @external OmaObjects
 * @see {@link https://supervisor.aloes.io/api/omaObjects}
 */

/**
 * Oma Resources References.
 * @external OmaResources
 * @see {@link https://supervisor.aloes.io/api/omaResources}
 */
/**
 * References used to validate payloads
 * @namespace
 * @property {string}  collectionPattern - The pattern used by Aloes Client Collection [].
 * @property {string}  instancePattern - The pattern used by Aloes Client instance.
 * @property {object}  validators - Check inputs / build outputs
 * @property {array}   validators.userId
 * @property {array}   validators.collection
 * @property {array}   validators.methods - [0, 1, 2, 3, 4].
 */
const protocolRef = {
  collectionPattern: '+userId/+collection/+method',
  instancePattern: '+userId/+collection/+method/+modelId',
  validators: {
    userId: 'string',
    collections: [
      'account',
      'application',
      'device',
      'sensor',
      'measurement',
      'iotagent',
    ],
    modelId: 'string',
    methods: ['HEAD', 'POST', 'GET', 'PUT', 'DELETE', 'STREAM'],
  },
};

module.exports = protocolRef;
