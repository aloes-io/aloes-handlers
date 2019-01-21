/* eslint-disable no-console */
//	const test = require("tape");
const aloesHandlers = require("../");
// test("matches() supports patterns with no wildcards", function (t) {
// 	t.plan(1);
// 	t.ok(aloesHandlers.matches("foo/bar/baz", "foo/bar/baz"), "Matched topic");
// });
//	console.log(aloesHandlers.protocolPatterns);

// Aloes Client tests
// const collectionPattern = "+userId/+collectionName/+method";
// const instancePattern = "+userId/+collectionName/+method/+modelId";
console.log("-------- Aloes Client - test1 ---------");
let packet = {
	topic: "1/Sensor/POST",
	payload: Buffer.from(
		JSON.stringify({
			protocolName: "aloesLight",
			devEui: "3322321",
			type: 3300,
			nativeSensorId: 4,
			mainResourceId: 5700,
			resources: {"5700": 1},
			inputPath: `3322321-in/1/3300/4/5700`,
			outputPath: `3322321-out/1/3300/4/5700`,
			inPrefix: "-in",
			outPrefix: "-out",
			value: 5,
		}),
	),
};
let pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Client - test1 - patternDetector", pattern);
let decoded = aloesHandlers.aloesClientDecoder(packet, pattern.params);
console.log("Aloes Client - test1 - aloesClientDecoder", decoded);
let options = {
	pattern: pattern.name,
	userId: pattern.params.userId,
	collectionName: pattern.params.collectionName,
	modelId: pattern.params.modelId,
	method: pattern.params.method,
	data: JSON.parse(packet.payload),
};
let result = aloesHandlers.publish(options);
console.log("Aloes Client - test1 - publish", result);
// let native = aloesHandlers.publishToNative(options);
// console.log("Aloes Client - test1 - publishToNative", native);

console.log("-------- Aloes Client - test2 ---------");
packet = {
	topic: "1/Sensor/PUT/1",
	payload: Buffer.from(
		JSON.stringify({
			id: 1,
			protocolName: "aloesLight",
			devEui: "3322321",
			type: 3300,
			nativeSensorId: 4,
			mainResourceId: 5700,
			resources: {"5700": 1},
			inputPath: `3322321-in/1/3300/4/5700`,
			outputPath: `3322321-out/1/3300/4/5700`,
			inPrefix: "-in",
			outPrefix: "-out",
			value: 5,
		}),
	),
};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Client - test2 - patternDetector", pattern);
decoded = aloesHandlers.aloesClientDecoder(packet, pattern.params);
console.log("Aloes Client - test2 - aloesClientDecoder", decoded);
options = {
	pattern: pattern.name,
	userId: pattern.params.userId,
	collectionName: pattern.params.collectionName,
	modelId: pattern.params.modelId,
	method: pattern.params.method,
	data: JSON.parse(packet.payload),
};
result = aloesHandlers.publish(options);
console.log("Aloes Client - test2 - publish", result);
// native = aloesHandlers.publishToNative(options);
// console.log("Aloes Client - test2 - publishToNative", native);

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
			inputPath: `3322321-in/1/3300/4/5700`,
			outputPath: `3322321-out/1/3300/4/5700`,
			inPrefix: "-in",
			outPrefix: "-out",
			value: 5,
		}),
	),
};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Client - test3 - patternDetector", pattern);
decoded = aloesHandlers.aloesClientDecoder(packet, pattern.params);
console.log("Aloes Client - test3 - aloesClientDecoder", decoded);
options = {
	pattern: pattern.name,
	userId: pattern.params.userId,
	collectionName: pattern.params.collectionName,
	modelId: pattern.params.modelId,
	method: pattern.params.method,
	data: JSON.parse(packet.payload),
};
result = aloesHandlers.publish(options);
console.log("Aloes Client - test3 - publish", result);
// native = aloesHandlers.publishToNative(options);
// console.log("Aloes Client - test3 - publishToNative", native);

console.log("-------- Aloes Client - test4 ---------");
packet = {
	topic: "1/IoTAgent/PUT/2",
	payload: Buffer.from(
		JSON.stringify({
			protocolName: "aloesLight",
			devEui: "3322321",
			type: 3300,
			nativeSensorId: 4,
			mainResourceId: 5700,
			resources: {"5700": 1},
			inputPath: `3322321-in/1/3300/4/5700`,
			outputPath: `3322321-out/1/3300/4/5700`,
			inPrefix: "-in",
			outPrefix: "-out",
			value: 5,
		}),
	),
};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Client - test4 - patternDetector", pattern);
decoded = aloesHandlers.aloesClientDecoder(packet, pattern.params);
console.log("Aloes Client - test4 - aloesClientDecoder", decoded);
options = {
	pattern: pattern.name,
	userId: pattern.params.userId,
	collectionName: pattern.params.collectionName,
	modelId: pattern.params.modelId,
	method: pattern.params.method,
	data: JSON.parse(packet.payload),
};
result = aloesHandlers.publish(options);
console.log("Aloes Client - test4 - publish", result);
// native = aloesHandlers.publishToNative(options);
// console.log("Aloes Client - test4 - publishToNative", native);
