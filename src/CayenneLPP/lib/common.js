/* LPP_TYPE = IPSO_OBJECT_ID - 3200 */
const protocolRef = {
	pattern: '+appEui/+type/+method/+gatewayId/#device',
	pattern2: '+appEui/+gatewayId/+direction/+type/#device',
	validators: {
		appEui: 'string',
		methods: [
			'Join Request',
			'Join Accept',
			'Confirmed Data Up',
			'Unconfirmed Data Up',
			'Confirmed Data Down',
			'Unconfirmed Data Down',
			'Proprietary',
			'Presentation',
		],
		directions: ['RX', 'TX'],
		types: [
			'DECODED',
			'ENCODED',
			'PUSH_DATA',
			'PULL_DATA',
			'PULL_RESP',
			'PUSH_ACK',
			'PULL_ACK',
			'TX_ACK',
		],
		gatewayId: 'string',
		device: ['devEui/devAddr', 'cayenneType'],
		devAddrLength: 8,
		devEuiLength: 16,
	},
	// DIGITAL_INPUT: {
	// 	name: 'digital',
	// 	value: 0x00,
	// 	size: 3,
	// },
	// ANALOG_INPUT: {
	// 	name: 'analog',
	// 	value: 0x02,
	// 	size: 4,
	// },
	DIGITAL_INPUT: 0x00,
	DIGITAL_INPUT_SIZE: 3, // 1 byte
	DIGITAL_OUTPUT: 0x01,
	DIGITAL_OUTPUT_SIZE: 3, // 1 byte
	ANALOG_INPUT: 0x02,
	ANALOG_INPUT_SIZE: 4, // 2 bytes, 0.01 signed
	ANALOG_OUTPUT: 0x03,
	ANALOG_OUTPUT_SIZE: 4, // 2 bytes, 0.01 signed
	LUMINOSITY: 0x65,
	LUMINOSITY_SIZE: 4, // 2 bytes, 1 lux unsigned
	PRESENCE: 0x66,
	PRESENCE_SIZE: 3, // 1 byte, 1
	TEMPERATURE: 0x67,
	TEMPERATURE_SIZE: 4, // 2 bytes, 0.1°C signed
	HUMIDITY: 0x68,
	HUMIDITY_SIZE: 3, // 1 byte, 0.5% unsigned
	ACCELEROMETER: 0x71,
	ACCELEROMETER_SIZE: 8, // 2 bytes per axis, 0.001G
	BAROMETER: 0x73,
	BAROMETER_SIZE: 4, // 2 bytes 0.1 hPa Unsigned
	UNIXTIME: 0x85,
	UNIXTIME_SIZE: 6, // 4 bytes, unsigned uint_32_t
	GYROMETER: 0x86,
	GYROMETER_SIZE: 8, // 2 bytes per axis, 0.01 °/s
	LOCATION: 0x88,
	LOCATION_SIZE: 11, // 3 byte lon/lat 0.0001 °, 3 bytes alt 0.01 meter
	UNIT: {
		UNDEFINED: 'null',
		PASCAL: 'pa', // Pascal
		HECTOPASCAL: 'hpa', // Hectopascal
		PERCENT: 'p', // % (0 to 100)
		RATIO: 'r', // Ratio
		VOLTS: 'v', // Volts
		LUX: 'lux', // Lux
		CENTIMETER: 'cm', // Centimeter
		METER: 'm', // Meter
		DIGITAL: 'd', // Digital (0/1)
		FAHRENHEIT: 'f', // Fahrenheit
		CELSIUS: 'c', // Celsius
		KELVIN: 'k', // Kelvin
		MILLIVOLTS: 'mv', // Millivolts
	},
};

module.exports = protocolRef;
