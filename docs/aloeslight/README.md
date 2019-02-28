## Modules

<dl>
<dt><a href="#module_aloesLightDecoder">aloesLightDecoder</a></dt>
<dd></dd>
<dt><a href="#module_aloesLightPatternDetector">aloesLightPatternDetector</a></dt>
<dd></dd>
<dt><a href="#module_aloesLightEncoder">aloesLightEncoder</a></dt>
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

<a name="module_aloesLightDecoder"></a>

## aloesLightDecoder

* [aloesLightDecoder](#module_aloesLightDecoder)
    * _static_
        * [.aloesLightToOmaObject(msg)](#module_aloesLightDecoder.aloesLightToOmaObject) ⇒ <code>object</code>
    * _inner_
        * [~aloesLightDecoder(packet, protocol)](#module_aloesLightDecoder..aloesLightDecoder) ⇒ <code>object</code>

<a name="module_aloesLightDecoder.aloesLightToOmaObject"></a>

### aloesLightDecoder.aloesLightToOmaObject(msg) ⇒ <code>object</code>
Find corresponding OMA object following a AloesLight presentation message

**Kind**: static method of [<code>aloesLightDecoder</code>](#module_aloesLightDecoder)  
**Returns**: <code>object</code> - composed instance  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>object</code> | Decoded MQTT packet. |

<a name="module_aloesLightDecoder..aloesLightDecoder"></a>

### aloesLightDecoder~aloesLightDecoder(packet, protocol) ⇒ <code>object</code>
Convert incoming AloesLight data to Aloes Client
pattern - '+prefixedDevEui/+method/+omaObjectId/+sensorId/+omaResourceId'

**Kind**: inner method of [<code>aloesLightDecoder</code>](#module_aloesLightDecoder)  
**Returns**: <code>object</code> - composed instance  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | Incoming MQTT packet. |
| protocol | <code>object</code> | Protocol paramters ( coming from patternDetector ). |

<a name="module_aloesLightPatternDetector"></a>

## aloesLightPatternDetector

* [aloesLightPatternDetector](#module_aloesLightPatternDetector)
    * [~extractProtocol(pattern, topic)](#module_aloesLightPatternDetector..extractProtocol) ⇒ <code>Promise.&lt;object&gt;</code>
    * [~aloesLightPatternDetector(packet)](#module_aloesLightPatternDetector..aloesLightPatternDetector) ⇒ <code>object</code>

<a name="module_aloesLightPatternDetector..extractProtocol"></a>

### aloesLightPatternDetector~extractProtocol(pattern, topic) ⇒ <code>Promise.&lt;object&gt;</code>
Extract protocol paramters from incoming topic.

**Kind**: inner method of [<code>aloesLightPatternDetector</code>](#module_aloesLightPatternDetector)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Extracted paramters.  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | Name of the protocol pattern. |
| topic | <code>string</code> | MQTT topic. |

<a name="module_aloesLightPatternDetector..aloesLightPatternDetector"></a>

### aloesLightPatternDetector~aloesLightPatternDetector(packet) ⇒ <code>object</code>
Check incoming MQTT packet against AloesLight API
pattern - '+prefixedDevEui/+method/+omaObjectId/+sensorId/+omaResourceId'

**Kind**: inner method of [<code>aloesLightPatternDetector</code>](#module_aloesLightPatternDetector)  
**Returns**: <code>object</code> - found pattern.name and pattern.params  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | The MQTT packet. |

<a name="module_aloesLightEncoder"></a>

## aloesLightEncoder
<a name="module_aloesLightEncoder..aloesLightEncoder"></a>

### aloesLightEncoder~aloesLightEncoder(packet, protocol)
Convert incoming Aloes Client data to AloesLight protocol
pattern - '+prefixedDevEui/+method/+omaObjectId/+sensorId/+omaResourceId'

**Kind**: inner method of [<code>aloesLightEncoder</code>](#module_aloesLightEncoder)  

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
| pattern | <code>string</code> | The pattern used by Aloes Light devices. |
| validators | <code>object</code> | Check inputs / build outputs |
| validators.prefixedDevEui | <code>array</code> |  |
| validators.nodeId | <code>array</code> |  |
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
