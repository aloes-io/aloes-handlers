const protocolRef = {
  pattern: '+prefixedDevEui/+method/+omaObjectId/+sensorId/+omaResourceId',
   validators: {
    prefixedDevEui: 'string',
    nodeId: 'number',
    sensorId: 'number',
    subType: 'number',
    methods: [0, 1, 2, 3, 4],
  },
};

module.exports = protocolRef;
