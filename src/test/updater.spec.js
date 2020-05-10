/* Copyright 2020 Edouard Maleix, read LICENSE */

const {assert} = require('chai');
const testGen = require('declarative-test-structure-generator');
const {omaObjects, omaResources} = require('oma-json');
const {updateAloesSensors} = require('../lib/updater');

// collectionPattern: '+userId/+collection/+method',
// instancePattern: '+userId/+collection/+method/+modelId',

const mockSensorValues = {
  Float: 1.5,
  Integer: 2,
  String: 'test',
  Boolean: false,
  Time: new Date().getTime(),
  Opaque: Buffer.alloc(10),
  null: null,
};

const getSensorValue = (omaResourceType) => mockSensorValues[omaResourceType];

describe('aloesClientUpdate', () => {
  const testSuites = {};

  omaObjects.forEach(({name, value: omaObjectId, resourceIds, resources}) => {
    const mainTestName = `TEST Update OmaObject ${name} - ${omaObjectId}`;
    testSuites[mainTestName] = {};

    testSuites[mainTestName].tests = resourceIds
      .split(',')
      .map((resourceId) => {
        const omaResourceId = Number(resourceId.trim());
        const omaResource = omaResources.find(
          ({value}) => value === omaResourceId,
        );
        if (!omaResource) {
          return null;
        }

        const sensorValue = getSensorValue(omaResource.type);
        const nativeSensorId = 4;
        const devEui = '3322321';
        let sensor = {
          transportProtocol: 'aloesLight',
          messageProtocol: 'aloesLight',
          devEui,
          type: omaObjectId,
          nativeSensorId,
          resource: omaResourceId,
          resources,
          inputPath: `${devEui}-in/1/${omaObjectId}/${nativeSensorId}/${omaResourceId}`,
          outputPath: `${devEui}-out/1/${omaObjectId}/${nativeSensorId}/${omaResourceId}`,
          inPrefix: '-in',
          outPrefix: '-out',
          value: sensorValue,
        };

        return {
          name: `Update OmaResource ${omaResource.name} - ${omaResourceId}`,
          test: () => {
            sensor = updateAloesSensors(sensor, omaResourceId, sensorValue);
            if (Buffer.isBuffer(sensorValue)) {
              assert.ok(Buffer.isBuffer(sensor.resources[omaResourceId]));
              assert.equal(
                Buffer.byteLength(sensor.resources[omaResourceId]),
                Buffer.byteLength(sensorValue),
              );
            } else if (sensor.value) {
              if (!sensor.type === 3349 && !sensor.resource === 5910) {
                // make exception for bitmap input hack
                assert.typeOf(
                  sensor.resources[omaResourceId],
                  typeof sensorValue,
                );
              }
              assert.equal(sensor.resources[omaResourceId], sensorValue);
            } else {
              assert.equal(sensor.resources[omaResourceId], sensorValue);
            }
          },
        };
      })
      .filter((test) => test !== null);
  });

  // console.log({testSuites});

  testGen.run(testSuites);
});
