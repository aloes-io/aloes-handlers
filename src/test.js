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
let packet = {topic: "MySensors-out/0/2/1/0/4", payload: "test"};
let pattern = aloesHandlers.patternDetector(packet);
console.log("MySensors - test1 - patternDetector", pattern);
let options = {
	pattern: pattern.name,
	method: "POST",
	data: {
		nativeResource: 18,
		nativeNodeId: pattern.value.nodeId,
		nativeSensorId: pattern.value.sensorId,
		nativeGwId: pattern.value.prefixedDevEui.split("-")[0],
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
let decoded = aloesHandlers.mySensorsDecoder(packet, pattern.value);
console.log("MySensors - test1 - mySensorsDecoder", decoded);
let result = aloesHandlers.publish(options);
console.log("MySensors - test1 - publish", result);

console.log("-------- MySensors - test2 ---------");
packet = {topic: "MySensors-out/0/2/0/0/4", payload: "test"};
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
		nativeGwId: pattern.value.prefixedDevEui.split("-")[0],
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
decoded = aloesHandlers.mySensorsDecoder(packet, pattern.value);
console.log("MySensors - test2 - mySensorsDecoder", decoded);
result = aloesHandlers.publish(options);
console.log("MySensors - test2 - publish", result);

// Aloes IoT tests
//	const aloesPattern = "+prefixedDevEui/+method/+ipsoObjectId/+sensorId/+ipsoResourcesId";
console.log("-------- Aloes IoT - test1 ---------");
packet = {topic: "Aloes-out/POST/3300/3/5700", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes IoT - test1 - patternDetector", pattern);

console.log("-------- Aloes IoT - test2 ---------");
packet = {topic: "Aloes-out/PUT/3300/3/5700", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes IoT - test2 - patternDetector", pattern);

// Aloes Client tests
// const collectionPattern = "+userId/+collectionName/+method";
// const instancePattern = "+userId/+collectionName/+method/+modelId";
console.log("-------- Aloes Client - test1 ---------");
packet = {topic: "1/Account/POST", payload: Buffer.from(JSON.stringify({content: "yolo"}))};
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
packet = {topic: "1/Account/PUT/1", payload: Buffer.from(JSON.stringify({id: 1, content: "yolo"}))};
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
packet = {topic: "1/Device/PUT/1", payload: Buffer.from(JSON.stringify({id: 1, content: "loyo"}))};
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
