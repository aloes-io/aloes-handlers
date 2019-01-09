/* eslint-disable no-console */
//	const test = require("tape");
const aloesHandlers = require("./");

// test("matches() supports patterns with no wildcards", function (t) {
// 	t.plan(1);
// 	t.ok(aloesHandlers.matches("foo/bar/baz", "foo/bar/baz"), "Matched topic");
// });
//	console.log(aloesHandlers.protocolPatterns);

// MySensors tests
//	const mySensorsPattern = "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType";
console.log("-------- MySensors - test1 ---------");
let packet = {topic: "MySensors123-out/0/2/1/0/4", payload: "test"};
let pattern = aloesHandlers.patternDetector(packet);
console.log("MySensors - test1 - patternDetector", pattern);
let decoded = aloesHandlers.mySensorsDecoder(packet, pattern.value);
console.log("MySensors - test1 - mySensorsDecoder", decoded);
let options = {
	pattern: pattern.name,
	method: "POST",
	data: {
		nativeResource: 18,
		nativeNodeId: pattern.value.nodeId,
		nativeSensorId: pattern.value.sensorId,
		devEui: pattern.value.prefixedDevEui.split("-")[0],
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
let result = aloesHandlers.publish(options);
console.log("MySensors - test1 - publish", result);

console.log("-------- MySensors - test2 ---------");
packet = {topic: "MySensors123-out/0/2/0/0/4", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("MySensors - test2 - patternDetector", pattern);
decoded = aloesHandlers.mySensorsDecoder(packet, pattern.value);
console.log("MySensors - test2 - mySensorsDecoder", decoded);
options = {
	pattern: pattern.name,
	method: "PUT",
	data: {
		nativeResource: 18,
		nativeNodeId: pattern.value.nodeId,
		nativeSensorId: pattern.value.sensorId,
		devEui: pattern.value.prefixedDevEui.split("-")[0],
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
result = aloesHandlers.publish(options);
console.log("MySensors - test2 - publish", result);

// Aloes IoT tests
//	const aloesPattern = "+prefixedDevEui/+method/+ipsoObjectId/+sensorId/+ipsoResourcesId";
console.log("-------- Aloes IoT - test1 ---------");
packet = {topic: "Aloes123-out/0/3349/3/5910", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes IoT - test1 - patternDetector", pattern);
decoded = aloesHandlers.aloesDecoder(packet, pattern.value);
console.log("Aloes IoT - test1 - aloesDecoder", decoded);
options = {
	pattern: pattern.name,
	method: "HEAD",
	data: {
		devEui: pattern.value.prefixedDevEui.split("-")[0],
		type: pattern.value.ipsoObjectId,
		nativeSensorId: pattern.value.sensorId,
		mainResourceId: pattern.value.ipsoResourcesId,
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
result = aloesHandlers.publish(options);
console.log("Aloes IoT - test1 - publish", result);

console.log("-------- Aloes IoT - test2 ---------");
packet = {topic: "Aloes123-out/0/3300/4/5700", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes IoT - test2 - patternDetector", pattern);
decoded = aloesHandlers.aloesDecoder(packet, pattern.value);
console.log("Aloes IoT - test2 - aloesDecoder", decoded);
options = {
	pattern: pattern.name,
	method: "HEAD",
	data: {
		devEui: pattern.value.prefixedDevEui.split("-")[0],
		type: pattern.value.ipsoObjectId,
		nativeSensorId: pattern.value.sensorId,
		mainResourceId: pattern.value.ipsoResourcesId,
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
result = aloesHandlers.publish(options);
console.log("Aloes IoT - test2 - publish", result);

console.log("-------- Aloes IoT - test3 ---------");
packet = {topic: "Aloes123-out/1/3349/3/5910", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes IoT - test3 - patternDetector", pattern);
decoded = aloesHandlers.aloesDecoder(packet, pattern.value);
console.log("Aloes IoT - test3 - aloesDecoder", decoded);
options = {
	pattern: pattern.name,
	method: "POST",
	data: {
		devEui: pattern.value.prefixedDevEui.split("-")[0],
		type: pattern.value.ipsoObjectId,
		nativeSensorId: pattern.value.sensorId,
		mainResourceId: pattern.value.ipsoResourcesId,
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
result = aloesHandlers.publish(options);
console.log("Aloes IoT - test3 - publish", result);

console.log("-------- Aloes IoT - test4 ---------");
packet = {topic: "Aloes123-out/1/3300/4/5700", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes IoT - test4 - patternDetector", pattern);
decoded = aloesHandlers.aloesDecoder(packet, pattern.value);
console.log("Aloes IoT - test4 - aloesDecoder", decoded);
options = {
	pattern: pattern.name,
	method: "POST",
	data: {
		devEui: pattern.value.prefixedDevEui.split("-")[0],
		type: pattern.value.ipsoObjectId,
		nativeSensorId: pattern.value.sensorId,
		mainResourceId: pattern.value.ipsoResourcesId,
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
result = aloesHandlers.publish(options);
console.log("Aloes IoT - test4 - publish", result);

// Aloes Client tests
// const collectionPattern = "+userId/+collectionName/+method";
// const instancePattern = "+userId/+collectionName/+method/+modelId";
console.log("-------- Aloes Client - test1 ---------");
packet = {
	topic: "1/Sensor/POST",
	payload: Buffer.from(
		JSON.stringify({
			protocolName: "aloes",
			devEui: "3322321",
			type: 3300,
			nativeSensorId: 4,
			mainResourceId: 5700,
			resources: {"5700": 1},
			inPrefix: "-in",
			outPrefix: "-out",
			value: 5,
		}),
	),
};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Client - test1 - patternDetector", pattern);
decoded = aloesHandlers.aloesClientDecoder(packet, pattern.value);
console.log("Aloes Client - test1 - aloesClientDecoder", decoded);
options = {
	pattern: pattern.name,
	userId: pattern.value.userId,
	collectionName: pattern.value.collectionName,
	modelId: pattern.value.modelId,
	method: pattern.value.method,
	data: JSON.parse(packet.payload),
};
result = aloesHandlers.publish(options);
console.log("Aloes Client - test1 - publish", result);

console.log("-------- Aloes Client - test2 ---------");
packet = {
	topic: "1/Sensor/PUT/1",
	payload: Buffer.from(
		JSON.stringify({
			id: 1,
			protocolName: "aloes",
			devEui: "3322321",
			type: 3300,
			nativeSensorId: 4,
			mainResourceId: 5700,
			resources: {"5700": 1},
			inPrefix: "-in",
			outPrefix: "-out",
			value: 5,
		}),
	),
};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Client - test2 - patternDetector", pattern);
decoded = aloesHandlers.aloesClientDecoder(packet, pattern.value);
console.log("Aloes Client - test2 - aloesClientDecoder", decoded);
options = {
	pattern: pattern.name,
	userId: pattern.value.userId,
	collectionName: pattern.value.collectionName,
	modelId: pattern.value.modelId,
	method: pattern.value.method,
	data: JSON.parse(packet.payload),
};
result = aloesHandlers.publish(options);
console.log("Aloes Client - test2 - publish", result);

console.log("-------- Aloes Client - test3 ---------");
packet = {
	topic: "1/Sensor/PUT/1",
	payload: Buffer.from(
		JSON.stringify({
			id: 1,
			protocolName: "mySensors",
			devEui: "3322321",
			type: 3300,
			nativeNodeId: 3,
			nativeSensorId: 4,
			nativeResource: 48,
			mainResourceId: 5700,
			resources: {"5700": 1},
			inPrefix: "-in",
			outPrefix: "-out",
			value: 5,
		}),
	),
};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Client - test3 - patternDetector", pattern);
decoded = aloesHandlers.aloesClientDecoder(packet, pattern.value);
console.log("Aloes Client - test3 - aloesClientDecoder", decoded);
options = {
	pattern: pattern.name,
	userId: pattern.value.userId,
	collectionName: pattern.value.collectionName,
	modelId: pattern.value.modelId,
	method: pattern.value.method,
	data: JSON.parse(packet.payload),
};
result = aloesHandlers.publish(options);
console.log("Aloes Client - test3 - publish", result);
