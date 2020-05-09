export type Value = string | number | object;

export type Sensor = {
  name: string;
  devEui: string;
  value: Value;
  type: number;
  resources?: object;
  resource: number;
  createdAt: Date;
  lastSignal: Date;
  frameCounter: number;
  icons?: string[];
  colors?: object;
  transportProtocol: string;
  transportProtocolVersion?: string;
  messageProtocol: string;
  messageProtocolVersion?: string;
  nativeSensorId: string;
  nativeNodeId?: string;
  nativeType: number;
  nativeResource?: number;
  inputPath?: string;
  outputPath?: string;
  inPrefix?: string;
  outPrefix?: string;
};

export enum Methods {
  'HEAD',
  'POST',
  'GET',
  'PUT',
  'DELETE',
  'STREAM',
}

export enum Directions {
  'rx',
  'tx',
}

export enum Collections {
  'user',
  'application',
  'device',
  'sensor',
  'measurement',
  'scheduler',
  'iotagent',
}

export type CollectionProtocolRef = {
  pattern?: string;
  userId: string;
  collection: Collections;
  method: Methods;
  data: Value;
};

export type InstanceProtocolRef = {
  pattern?: string;
  userId: string;
  collection: Collections;
  method: Methods;
  modelId: string;
  data: Value;
};

export type Pattern = {
  name: string;
  params: CollectionProtocolRef | InstanceProtocolRef;
  direction: Directions;
  subType: string;
};

export type Packet = {
  topic: string;
  payload: Value;
};

export declare function aloesClientEncoder(
  options: CollectionProtocolRef | InstanceProtocolRef,
): Packet;

export declare function updateAloesSensors(
  sensor: Sensor,
  resource: number,
  value: Value,
): Sensor | null;

export declare function aloesClientPatternDetector(
  packet: Packet,
): Pattern | null;
