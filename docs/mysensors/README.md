## Modules

<dl>
<dt><a href="#module_mySensorsDecoder">mySensorsDecoder</a></dt>
<dd></dd>
<dt><a href="#module_mySensorsPatternDetector">mySensorsPatternDetector</a></dt>
<dd></dd>
<dt><a href="#module_mySensorsEncoder">mySensorsEncoder</a></dt>
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

<a name="module_mySensorsDecoder"></a>

## mySensorsDecoder

* [mySensorsDecoder](#module_mySensorsDecoder)
    * _static_
        * [.mySensorsToOmaObject(msg)](#module_mySensorsDecoder.mySensorsToOmaObject) ⇒ <code>object</code>
        * [.mySensorsToOmaResources(msg)](#module_mySensorsDecoder.mySensorsToOmaResources) ⇒ <code>object</code>
    * _inner_
        * [~mySensorsDecoder(packet, protocol)](#module_mySensorsDecoder..mySensorsDecoder) ⇒ <code>object</code>

<a name="module_mySensorsDecoder.mySensorsToOmaObject"></a>

### mySensorsDecoder.mySensorsToOmaObject(msg) ⇒ <code>object</code>
Find corresponding OMA object following a MySensors presentation message

**Kind**: static method of [<code>mySensorsDecoder</code>](#module_mySensorsDecoder)  
**Returns**: <code>object</code> - composed instance  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>object</code> | Decoded MQTT packet. |

<a name="module_mySensorsDecoder.mySensorsToOmaResources"></a>

### mySensorsDecoder.mySensorsToOmaResources(msg) ⇒ <code>object</code>
Find corresponding OMA resource to incoming MySensors datas

**Kind**: static method of [<code>mySensorsDecoder</code>](#module_mySensorsDecoder)  
**Returns**: <code>object</code> - composed instance  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>object</code> | Decoded MQTT packet. |

<a name="module_mySensorsDecoder..mySensorsDecoder"></a>

### mySensorsDecoder~mySensorsDecoder(packet, protocol) ⇒ <code>object</code>
Convert incoming MySensors data to Aloes Client
pattern - "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType"

**Kind**: inner method of [<code>mySensorsDecoder</code>](#module_mySensorsDecoder)  
**Returns**: <code>object</code> - composed instance  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | Incoming MQTT packet. |
| protocol | <code>object</code> | Protocol paramters ( coming from patternDetector ). |

<a name="module_mySensorsPatternDetector"></a>

## mySensorsPatternDetector
<a name="module_mySensorsPatternDetector..mySensorsPatternDetector"></a>

### mySensorsPatternDetector~mySensorsPatternDetector(packet) ⇒ <code>object</code>
Check incoming MQTT packet against MySensors Serial API
pattern - "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType"

**Kind**: inner method of [<code>mySensorsPatternDetector</code>](#module_mySensorsPatternDetector)  
**Returns**: <code>object</code> - found pattern.name and pattern.params  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | The MQTT packet. |

<a name="module_mySensorsEncoder"></a>

## mySensorsEncoder
<a name="module_mySensorsEncoder..mySensorsEncoder"></a>

### mySensorsEncoder~mySensorsEncoder(packet, protocol)
Convert incoming Aloes Client data to MySensors protocol
pattern - "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType"

**Kind**: inner method of [<code>mySensorsEncoder</code>](#module_mySensorsEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | Sensor instance. |
| protocol | <code>object</code> | Protocol paramters ( coming from patternDetector ). |

<a name="protocolRef"></a>

## protocolRef : <code>object</code>
References used to validate payloads

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | The pattern used by MySensors devices. |
| validators | <code>object</code> | Check inputs / build outputs |
| validators.nodeId | <code>array</code> |  |
| validators.methods | <code>array</code> | [0, 1, 2, 3, 4]. |
| labelsPresentation | <code>array</code> | Labels used by Mysensors to identify sensor type in presentation commands. |
| labelsSet | <code>array</code> | Labels used by Mysensors to identify sensor type in Set/req commands. |

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
