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
