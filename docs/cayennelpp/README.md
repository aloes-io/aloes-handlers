## Modules

<dl>
<dt><a href="#module_cayenneDecoder">cayenneDecoder</a></dt>
<dd></dd>
<dt><a href="#module_cayennePatternDetector">cayennePatternDetector</a></dt>
<dd></dd>
<dt><a href="#module_cayenneEncoder">cayenneEncoder</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#protocolRef">protocolRef</a> : <code>object</code></dt>
<dd><p>References used to validate payloads</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_OmaObjects">OmaObjects</a></dt>
<dd><p>Oma Object References.</p>
</dd>
<dt><a href="#external_OmaResources">OmaResources</a></dt>
<dd><p>Oma Resources References.</p>
</dd>
</dl>

<a name="module_cayenneDecoder"></a>

## cayenneDecoder

* [cayenneDecoder](#module_cayenneDecoder)
    * _static_
        * [.getAnalogInput()](#module_cayenneDecoder.getAnalogInput) ⇒
        * [.getDigitalInput()](#module_cayenneDecoder.getDigitalInput) ⇒
        * [.getLuminosity()](#module_cayenneDecoder.getLuminosity) ⇒
        * [.getPresence()](#module_cayenneDecoder.getPresence) ⇒
        * [.getTemperature()](#module_cayenneDecoder.getTemperature) ⇒
        * [.getRelativeHumidity()](#module_cayenneDecoder.getRelativeHumidity) ⇒
        * [.getAccelerometer()](#module_cayenneDecoder.getAccelerometer) ⇒
        * [.getBarometer()](#module_cayenneDecoder.getBarometer) ⇒
        * [.getUnixTime()](#module_cayenneDecoder.getUnixTime) ⇒
        * [.getGyrometer()](#module_cayenneDecoder.getGyrometer) ⇒
        * [.getLocation()](#module_cayenneDecoder.getLocation) ⇒
        * [.cayenneToOmaObject(msg)](#module_cayenneDecoder.cayenneToOmaObject) ⇒ <code>object</code>
        * [.cayenneToOmaResources(msg)](#module_cayenneDecoder.cayenneToOmaResources) ⇒ <code>object</code>
    * _inner_
        * [~cayenneBufferDecoder(buffer)](#module_cayenneDecoder..cayenneBufferDecoder) ⇒ <code>object</code>
        * [~cayenneDecoder(packet, protocol)](#module_cayenneDecoder..cayenneDecoder) ⇒ <code>object</code>

<a name="module_cayenneDecoder.getAnalogInput"></a>

### cayenneDecoder.getAnalogInput() ⇒
Return a float value and
increment the buffer cursor

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: float  
<a name="module_cayenneDecoder.getDigitalInput"></a>

### cayenneDecoder.getDigitalInput() ⇒
Return an integer value

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: integer  
<a name="module_cayenneDecoder.getLuminosity"></a>

### cayenneDecoder.getLuminosity() ⇒
Return a luminosity in Lux and
increment the buffer cursor

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: integer  
<a name="module_cayenneDecoder.getPresence"></a>

### cayenneDecoder.getPresence() ⇒
Return an integer value

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: integer  
<a name="module_cayenneDecoder.getTemperature"></a>

### cayenneDecoder.getTemperature() ⇒
Return a temperature and
increment the buffer cursor

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: float  
<a name="module_cayenneDecoder.getRelativeHumidity"></a>

### cayenneDecoder.getRelativeHumidity() ⇒
Return a relative humidity value in percents and
increment the buffer cursor

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: float  
<a name="module_cayenneDecoder.getAccelerometer"></a>

### cayenneDecoder.getAccelerometer() ⇒
Return axis coordinates and
increment the buffer cursor

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: object  
<a name="module_cayenneDecoder.getBarometer"></a>

### cayenneDecoder.getBarometer() ⇒
Return a pressure and
increment the buffer cursor

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: float  
<a name="module_cayenneDecoder.getUnixTime"></a>

### cayenneDecoder.getUnixTime() ⇒
Return a timestamp and
increment the buffer cursor

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: float  
<a name="module_cayenneDecoder.getGyrometer"></a>

### cayenneDecoder.getGyrometer() ⇒
Return axis coordinates and
increment the buffer cursor

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: object  
<a name="module_cayenneDecoder.getLocation"></a>

### cayenneDecoder.getLocation() ⇒
Return location coordinates and
increment the buffer cursor

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: object  
<a name="module_cayenneDecoder.cayenneToOmaObject"></a>

### cayenneDecoder.cayenneToOmaObject(msg) ⇒ <code>object</code>
Find corresponding OMA object to incoming CayenneLPP datas
pattern - '+appEui/+type/+method/+gatewayId/#device'

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: <code>object</code> - composed instance  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>object</code> | Decoded MQTT packet. |

<a name="module_cayenneDecoder.cayenneToOmaResources"></a>

### cayenneDecoder.cayenneToOmaResources(msg) ⇒ <code>object</code>
Find corresponding OMA resource to incoming CayenneLPP datas
pattern - '+appEui/+type/+method/+gatewayId/#device'

**Kind**: static method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: <code>object</code> - composed instance  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>object</code> | Decoded MQTT packet. |

<a name="module_cayenneDecoder..cayenneBufferDecoder"></a>

### cayenneDecoder~cayenneBufferDecoder(buffer) ⇒ <code>object</code>
Decode LoraWan buffer containing a Cayenne payload

**Kind**: inner method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: <code>object</code> - Decoded channels  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Decoded LoraWan packet. |

<a name="module_cayenneDecoder..cayenneDecoder"></a>

### cayenneDecoder~cayenneDecoder(packet, protocol) ⇒ <code>object</code>
Convert incoming CayenneLPP data to Aloes Client sensor instance
pattern - "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType"

**Kind**: inner method of [<code>cayenneDecoder</code>](#module_cayenneDecoder)  
**Returns**: <code>object</code> - composed sensor instance  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | Incoming MQTT packet. |
| protocol | <code>object</code> | Protocol paramters ( coming from patternDetector ). |

<a name="module_cayennePatternDetector"></a>

## cayennePatternDetector
<a name="module_cayennePatternDetector..cayennePatternDetector"></a>

### cayennePatternDetector~cayennePatternDetector(packet) ⇒ <code>object</code>
Check incoming MQTT packet.payload against CayenneLPP
pattern '+appEui/+type/+method/+gatewayId/#device'

**Kind**: inner method of [<code>cayennePatternDetector</code>](#module_cayennePatternDetector)  
**Returns**: <code>object</code> - found pattern.name and pattern.params  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | The MQTT packet, including LoraWan PHYPayload. |

<a name="module_cayenneEncoder"></a>

## cayenneEncoder

* [cayenneEncoder](#module_cayenneEncoder)
    * _static_
        * [.validate(channel)](#module_cayenneEncoder.validate)
        * [.addAnalogInput(buffer, cursor, channel, value)](#module_cayenneEncoder.addAnalogInput)
        * [.addDigitalInput(buffer, cursor, channel, value)](#module_cayenneEncoder.addDigitalInput)
        * [.addLuminosity(buffer, cursor, channel, value)](#module_cayenneEncoder.addLuminosity)
        * [.addTemperature(buffer, cursor, channel, value)](#module_cayenneEncoder.addTemperature)
        * [.addRelativeHumidity(buffer, cursor, channel, value)](#module_cayenneEncoder.addRelativeHumidity)
        * [.addAccelerometer(buffer, cursor, channel, value)](#module_cayenneEncoder.addAccelerometer)
        * [.addBarometer(buffer, cursor, channel, value)](#module_cayenneEncoder.addBarometer)
        * [.addUnixTime(buffer, cursor, channel, value)](#module_cayenneEncoder.addUnixTime)
        * [.addGyrometer(buffer, cursor, channel, value)](#module_cayenneEncoder.addGyrometer)
        * [.addLocation(buffer, cursor, channel, value)](#module_cayenneEncoder.addLocation)
        * [.getPayload(buffer, cursor)](#module_cayenneEncoder.getPayload)
        * [.cayenneBufferEncoder(buffer, type, channel, value)](#module_cayenneEncoder.cayenneBufferEncoder)
    * _inner_
        * [~cayenneEncoder(packet)](#module_cayenneEncoder..cayenneEncoder)

<a name="module_cayenneEncoder.validate"></a>

### cayenneEncoder.validate(channel)
Validate chosen channel

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>int</code> | The channel selected |

<a name="module_cayenneEncoder.addAnalogInput"></a>

### cayenneEncoder.addAnalogInput(buffer, cursor, channel, value)
Creates a payload with type ANALOG_INPUT.
unit = UNIT.UNDEFINED

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>float</code> | A floating point number accurate to two decimal place. lodash.floor(value, 2) |

<a name="module_cayenneEncoder.addDigitalInput"></a>

### cayenneEncoder.addDigitalInput(buffer, cursor, channel, value)
Creates a payload with type DIGITAL_INPUT.
unit = UNIT.UNDEFINED

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>int</code> | The value, unsigned int8, should be 0 or 1. |

<a name="module_cayenneEncoder.addLuminosity"></a>

### cayenneEncoder.addLuminosity(buffer, cursor, channel, value)
Creates a payload with type LUMINOSITY.
unit = UNIT.LUX

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>float</code> | An unsigned int16 value. 0-65535. |

<a name="module_cayenneEncoder.addTemperature"></a>

### cayenneEncoder.addTemperature(buffer, cursor, channel, value)
Creates a payload with type TEMPERATURE.
unit = UNIT.CELSIUS

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>float</code> | A floating point number accurate to one decimal place. lodash.floor(value, 1) |

<a name="module_cayenneEncoder.addRelativeHumidity"></a>

### cayenneEncoder.addRelativeHumidity(buffer, cursor, channel, value)
Creates a payload with type HUMIDITY.
unit = UNIT.PERCENT

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>float</code> | A floating point number (%) accurate to one decimal place in 0.5 increments. Math.floor10(value, -1) |

<a name="module_cayenneEncoder.addAccelerometer"></a>

### cayenneEncoder.addAccelerometer(buffer, cursor, channel, value)
Creates a payload with type ACCELEROMETER.
unit = UNIT.UNDEFINED

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>object</code> | Object containing X, Y, Z value |

<a name="module_cayenneEncoder.addBarometer"></a>

### cayenneEncoder.addBarometer(buffer, cursor, channel, value)
Creates a payload with type BAROMETER.
unit = UNIT.PRESSURE

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>float</code> | A floating point number accurate to one decimal place. lodash.floor(value, 1) |

<a name="module_cayenneEncoder.addUnixTime"></a>

### cayenneEncoder.addUnixTime(buffer, cursor, channel, value)
Creates a payload with type UNIXTIME.
unit = UNIT.UNDEFINED

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>object</code> | Date() object |

<a name="module_cayenneEncoder.addGyrometer"></a>

### cayenneEncoder.addGyrometer(buffer, cursor, channel, value)
Creates a payload with type GYROMETER.
unit = UNIT.UNDEFINED

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>object</code> | Object containing X, Y, Z value |

<a name="module_cayenneEncoder.addLocation"></a>

### cayenneEncoder.addLocation(buffer, cursor, channel, value)
Creates a payload with type LOCATION.
unit = UNIT.UNDEFINED

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |
| channel | <code>int</code> | The channel for this sensor. |
| value | <code>object</code> | Object containing latitude and longitude value |

<a name="module_cayenneEncoder.getPayload"></a>

### cayenneEncoder.getPayload(buffer, cursor)
Reading the composed buffer from 0 to the cursor position.

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| cursor | <code>int</code> | Writing position. |

<a name="module_cayenneEncoder.cayenneBufferEncoder"></a>

### cayenneEncoder.cayenneBufferEncoder(buffer, type, channel, value)
Filling the buffer with desired sensor parameters and value

**Kind**: static method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>object</code> | Empty buffer. |
| type | <code>int</code> | CayenneLPP type. |
| channel | <code>int</code> | CayenneLPP Channel ( max value: 99 ). |
| value | <code>float</code> | sensor value. |

<a name="module_cayenneEncoder..cayenneEncoder"></a>

### cayenneEncoder~cayenneEncoder(packet)
Convert incoming Aloes Client data to CayenneLPP
pattern - '+appEui/+type/+method/+gatewayId/#device'

**Kind**: inner method of [<code>cayenneEncoder</code>](#module_cayenneEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | Sensor instance. |

<a name="protocolRef"></a>

## protocolRef : <code>object</code>
References used to validate payloads

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | The pattern used by CayenneLPP devices. |
| validators | <code>object</code> | Check inputs / build outputs |
| validators.methods | <code>array</code> | [0, 1, 2, 3, 4]. |

<a name="external_OmaObjects"></a>

## OmaObjects
Oma Object References.

**Kind**: global external  
**See**: [https://api.aloes.io/api/omaObjects](https://api.aloes.io/api/omaObjects)  
<a name="external_OmaResources"></a>

## OmaResources
Oma Resources References.

**Kind**: global external  
**See**: [https://api.aloes.io/api/omaResources](https://api.aloes.io/api/omaResources)  
