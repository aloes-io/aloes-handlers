## Modules

<dl>
<dt><a href="#module_aloesClientDecoder">aloesClientDecoder</a></dt>
<dd></dd>
<dt><a href="#module_aloesClientPatternDetector">aloesClientPatternDetector</a></dt>
<dd></dd>
<dt><a href="#module_aloesClientEncoder">aloesClientEncoder</a></dt>
<dd></dd>
</dl>

<a name="module_aloesClientDecoder"></a>

## aloesClientDecoder
<a name="module_aloesClientDecoder..aloesClientDecoder"></a>

### aloesClientDecoder~aloesClientDecoder(packet, protocol) ⇒ <code>object</code>
Convert compatible incoming data to Aloes Client
pattern - "+prefixedDevEui/+nodeId/+sensorId/+method/+ack/+subType"

**Kind**: inner method of [<code>aloesClientDecoder</code>](#module_aloesClientDecoder)  
**Returns**: <code>object</code> - composed instance  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | Incoming MQTT packet. |
| protocol | <code>object</code> | Protocol paramters ( coming from patternDetector ). |

<a name="module_aloesClientPatternDetector"></a>

## aloesClientPatternDetector
<a name="module_aloesClientPatternDetector..aloesClientPatternDetector"></a>

### aloesClientPatternDetector~aloesClientPatternDetector(packet) ⇒ <code>object</code>
Check incoming MQTT packet against AloesClient API
collectionPattern - '+userId/+collectionName/+method'
instancePattern - '+userId/+collectionName/+method/+modelId'

**Kind**: inner method of [<code>aloesClientPatternDetector</code>](#module_aloesClientPatternDetector)  
**Returns**: <code>object</code> - found pattern.name and pattern.params  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | The MQTT packet. |

<a name="module_aloesClientEncoder"></a>

## aloesClientEncoder
<a name="module_aloesClientEncoder..aloesClientEncoder"></a>

### aloesClientEncoder~aloesClientEncoder(options)
Try to convert incoming route to AloesClient routing
collectionPattern - '+userId/+collectionName/+method'
instancePattern - '+userId/+collectionName/+method/+modelId'

**Kind**: inner method of [<code>aloesClientEncoder</code>](#module_aloesClientEncoder)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Protocol paramters ( coming from patternDetector ). |

