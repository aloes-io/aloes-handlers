/* eslint-disable no-console */
//	const test = require("tape");
const aloesHandlers = require("../");

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
let decoded = aloesHandlers.mySensorsDecoder(packet, pattern.params);
console.log("MySensors - test1 - mySensorsDecoder", decoded);
let options = {
	pattern: pattern.name,
	method: "POST",
	data: {
		nativeResource: 18,
		nativeNodeId: pattern.params.nodeId,
		nativeSensorId: pattern.params.sensorId,
		devEui: pattern.params.prefixedDevEui.split("-")[0],
		inputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-in/${pattern.params.nodeId}/${
			pattern.params.sensorId
		}/${pattern.params.method}/1/${pattern.params.subType}`,
		outputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-out/${pattern.params.nodeId}/${
			pattern.params.sensorId
		}/${pattern.params.method}/1/${pattern.params.subType}`,
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
decoded = aloesHandlers.mySensorsDecoder(packet, pattern.params);
console.log("MySensors - test2 - mySensorsDecoder", decoded);
options = {
	pattern: pattern.name,
	method: "PUT",
	data: {
		nativeResource: 18,
		nativeNodeId: pattern.params.nodeId,
		nativeSensorId: pattern.params.sensorId,
		devEui: pattern.params.prefixedDevEui.split("-")[0],
		inputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-in/${pattern.params.nodeId}/${
			pattern.params.sensorId
		}/${pattern.params.method}/1/${pattern.params.subType}`,
		outputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-out/${pattern.params.nodeId}/${
			pattern.params.sensorId
		}/${pattern.params.method}/1/${pattern.params.subType}`,
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
result = aloesHandlers.publish(options);

console.log("MySensors - test3 - publish", result);
console.log("-------- MySensors - test3 ---------");
packet = {topic: "MySensors123-out/10/5/1/0/23", payload: "1"};
pattern = aloesHandlers.patternDetector(packet);
console.log("MySensors - test3 - patternDetector", pattern);
decoded = aloesHandlers.mySensorsDecoder(packet, pattern.params);
console.log("MySensors - test3 - mySensorsDecoder", decoded);
options = {
	pattern: pattern.name,
	method: "PUT",
	data: {
		nativeResource: 18,
		nativeNodeId: pattern.params.nodeId,
		nativeSensorId: pattern.params.sensorId,
		devEui: pattern.params.prefixedDevEui.split("-")[0],
		inputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-in/${pattern.params.nodeId}/${
			pattern.params.sensorId
		}/${pattern.params.method}/1/${pattern.params.subType}`,
		outputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-out/${pattern.params.nodeId}/${
			pattern.params.sensorId
		}/${pattern.params.method}/1/${pattern.params.subType}`,
		inPrefix: "-in",
		outPrefix: "-out",
		value: packet.payload,
	},
};
result = aloesHandlers.publish(options);
console.log("MySensors - test3 - publish", result);
