/* eslint-disable no-console */
//  const test = require("tape");
const aloesHandlers = require("../");

// Aloes IoT tests
//  const aloesPattern = "+prefixedDevEui/+method/+ipsoObjectId/+sensorId/+ipsoResourcesId";
console.log("-------- Aloes Light - test1 ---------");
let packet = {topic: "Aloes123-out/0/3349/3/5910", payload: "test"};
let pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Light - test1 - patternDetector", pattern);
let decoded = aloesHandlers.aloesLightDecoder(packet, pattern.params);
console.log("Aloes Light - test1 - aloesLightDecoder", decoded);
let options = {
  pattern: pattern.name,
  method: "HEAD",
  data: {
    devEui: pattern.params.prefixedDevEui.split("-")[0],
    type: pattern.params.ipsoObjectId,
    nativeSensorId: pattern.params.sensorId,
    mainResourceId: pattern.params.ipsoResourcesId,
    inputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-in/${pattern.params.method}/${
      pattern.params.ipsoObjectId
    }/${pattern.params.sensorId}/${pattern.params.ipsoResourcesId}`,
    outputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-out/${pattern.params.method}/${
      pattern.params.ipsoObjectId
    }/${pattern.params.sensorId}/${pattern.params.ipsoResourcesId}`,
    inPrefix: "-in",
    outPrefix: "-out",
    value: packet.payload,
  },
};
let result = aloesHandlers.publish(options);
console.log("Aloes Light - test1 - publish", result);

console.log("-------- Aloes Light - test2 ---------");
packet = {topic: "Aloes123-out/0/3300/4/5700", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Light - test2 - patternDetector", pattern);
decoded = aloesHandlers.aloesLightDecoder(packet, pattern.params);
console.log("Aloes Light - test2 - aloesLightDecoder", decoded);
options = {
  pattern: pattern.name,
  method: "HEAD",
  data: {
    devEui: pattern.params.prefixedDevEui.split("-")[0],
    type: pattern.params.ipsoObjectId,
    nativeSensorId: pattern.params.sensorId,
    mainResourceId: pattern.params.ipsoResourcesId,
    inputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-in/${pattern.params.method}/${
      pattern.params.ipsoObjectId
    }/${pattern.params.sensorId}/${pattern.params.ipsoResourcesId}`,
    outputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-out/${pattern.params.method}/${
      pattern.params.ipsoObjectId
    }/${pattern.params.sensorId}/${pattern.params.ipsoResourcesId}`,
    inPrefix: "-in",
    outPrefix: "-out",
    value: packet.payload,
  },
};
result = aloesHandlers.publish(options);
console.log("Aloes Light - test2 - publish", result);

console.log("-------- Aloes Light - test3 ---------");
packet = {topic: "Aloes123-out/1/3349/3/5910", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Light - test3 - patternDetector", pattern);
decoded = aloesHandlers.aloesLightDecoder(packet, pattern.params);
console.log("Aloes Light - test3 - aloesLightDecoder", decoded);
options = {
  pattern: pattern.name,
  method: "POST",
  data: {
    devEui: pattern.params.prefixedDevEui.split("-")[0],
    type: pattern.params.ipsoObjectId,
    nativeSensorId: pattern.params.sensorId,
    mainResourceId: pattern.params.ipsoResourcesId,
    inputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-in/${pattern.params.method}/${
      pattern.params.ipsoObjectId
    }/${pattern.params.sensorId}/${pattern.params.ipsoResourcesId}`,
    outputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-out/${pattern.params.method}/${
      pattern.params.ipsoObjectId
    }/${pattern.params.sensorId}/${pattern.params.ipsoResourcesId}`,
    inPrefix: "-in",
    outPrefix: "-out",
    value: packet.payload,
  },
};
result = aloesHandlers.publish(options);
console.log("Aloes Light - test3 - publish", result);

console.log("-------- Aloes Light - test4 ---------");
packet = {topic: "Aloes123-out/1/3300/4/5700", payload: "test"};
pattern = aloesHandlers.patternDetector(packet);
console.log("Aloes Light - test4 - patternDetector", pattern);
decoded = aloesHandlers.aloesLightDecoder(packet, pattern.params);
console.log("Aloes Light - test4 - aloesLightDecoder", decoded);
options = {
  pattern: pattern.name,
  method: "POST",
  data: {
    devEui: pattern.params.prefixedDevEui.split("-")[0],
    type: pattern.params.ipsoObjectId,
    nativeSensorId: pattern.params.sensorId,
    mainResourceId: pattern.params.ipsoResourcesId,
    inputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-in/${pattern.params.method}/${
      pattern.params.ipsoObjectId
    }/${pattern.params.sensorId}/${pattern.params.ipsoResourcesId}`,
    outputPath: `${pattern.params.prefixedDevEui.split("-")[0]}-out/${pattern.params.method}/${
      pattern.params.ipsoObjectId
    }/${pattern.params.sensorId}/${pattern.params.ipsoResourcesId}`,
    inPrefix: "-in",
    outPrefix: "-out",
    value: packet.payload,
  },
};
result = aloesHandlers.publish(options);
console.log("Aloes Light - test4 - publish", result);
