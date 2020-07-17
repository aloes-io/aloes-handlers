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
              const buff = Buffer.from(sensor.resources[omaResourceId]);
              assert.ok(Buffer.isBuffer(buff));
              assert.equal(
                Buffer.byteLength(buff),
                Buffer.byteLength(sensorValue),
              );
            } else if (sensor.value) {
              if (sensor.type === 3349 && sensor.resource === 5910) {
                // make an exception for bitmap input hack
                const buff = Buffer.from(sensor.resources[omaResourceId]);
                assert.equal(buff.toString(), sensorValue.toString());
              } else {
                assert.typeOf(
                  sensor.resources[omaResourceId],
                  typeof sensorValue,
                );
                assert.equal(sensor.resources[omaResourceId], sensorValue);
              }
            } else {
              assert.equal(sensor.resources[omaResourceId], sensorValue);
            }
          },
        };
      })
      .filter((test) => test !== null);
  });

  testGen.run(testSuites);
});
