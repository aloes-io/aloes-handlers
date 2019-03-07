## Objects

<dl>
<dt><a href="#protocolRef">protocolRef</a> : <code>object</code></dt>
<dd><p>References used to validate payloads</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#aloesClientPatternDetector">aloesClientPatternDetector(packet)</a> ⇒ <code>object</code></dt>
<dd><p>Check incoming MQTT packet against AloesClient API
collectionPattern - &#39;+userId/+collectionName/+method&#39;
instancePattern - &#39;+userId/+collectionName/+method/+modelId&#39;</p>
</dd>
<dt><a href="#aloesClientEncoder">aloesClientEncoder(options)</a></dt>
<dd><p>Try to convert incoming route to AloesClient routing
collectionPattern - &#39;+userId/+collectionName/+method&#39;
instancePattern - &#39;+userId/+collectionName/+method/+modelId&#39;</p>
</dd>
<dt><a href="#parseValue">parseValue(value)</a> ⇒ <code>object</code></dt>
<dd><p>Parse incoming sensor value to get an object instance from it</p>
</dd>
<dt><a href="#updateAloesSensors">updateAloesSensors(sensor, resource, value)</a> ⇒ <code>object</code></dt>
<dd><p>Update and validate AloesClient Sensor instance</p>
</dd>
<dt><a href="#logger">logger(priority, collectionName, command, content)</a></dt>
<dd></dd>
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

<a name="protocolRef"></a>

## protocolRef : <code>object</code>
References used to validate payloads

**Kind**: global namespace  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| collectionPattern | <code>string</code> | The pattern used by Aloes Client Collection []. |
| instancePattern | <code>string</code> | The pattern used by Aloes Client instance. |
| validators | <code>object</code> | Check inputs / build outputs |
| validators.userId | <code>array</code> |  |
| validators.collectionName | <code>array</code> |  |
| validators.methods | <code>array</code> | [0, 1, 2, 3, 4]. |

<a name="aloesClientPatternDetector"></a>

## aloesClientPatternDetector(packet) ⇒ <code>object</code>
Check incoming MQTT packet against AloesClient API
collectionPattern - '+userId/+collectionName/+method'
instancePattern - '+userId/+collectionName/+method/+modelId'

**Kind**: global function  
**Returns**: <code>object</code> - found pattern.name and pattern.params  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | The MQTT packet. |

<a name="aloesClientEncoder"></a>

## aloesClientEncoder(options)
Try to convert incoming route to AloesClient routing
collectionPattern - '+userId/+collectionName/+method'
instancePattern - '+userId/+collectionName/+method/+modelId'

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Protocol paramters ( coming from patternDetector ). |

<a name="parseValue"></a>

## parseValue(value) ⇒ <code>object</code>
Parse incoming sensor value to get an object instance from it

**Kind**: global function  
**Returns**: <code>object</code> - updated sensor value  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | new value to update sensor with |

<a name="updateAloesSensors"></a>

## updateAloesSensors(sensor, resource, value) ⇒ <code>object</code>
Update and validate AloesClient Sensor instance

**Kind**: global function  
**Returns**: <code>object</code> - updated sensor instance  

| Param | Type | Description |
| --- | --- | --- |
| sensor | <code>object</code> | sensor instance formatted as AloesClient protocol |
| resource | <code>number</code> | [OMA Resources](/aloes/#omaresources)  ID to update |
| value | <code>string</code> | new value to update sensor with |

<a name="logger"></a>

## logger(priority, collectionName, command, content)
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| priority | <code>int</code> | Logger mode. |
| collectionName | <code>string</code> | service name. |
| command | <code>string</code> | service command to log. |
| content | <code>string</code> | log content. |

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
