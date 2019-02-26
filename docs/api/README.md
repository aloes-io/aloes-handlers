## Modules

<dl>
<dt><a href="#module_aloesHandlers">aloesHandlers</a></dt>
<dd></dd>
<dt><a href="#module_logger">logger</a></dt>
<dd></dd>
</dl>

<a name="module_aloesHandlers"></a>

## aloesHandlers

* [aloesHandlers](#module_aloesHandlers)
    * [.patternDetector(packet)](#module_aloesHandlers.patternDetector) ⇒ <code>object</code>
    * [.publish(options)](#module_aloesHandlers.publish) ⇒ <code>object</code>
    * [.updateAloesSensors(sensor, resource, value)](#module_aloesHandlers.updateAloesSensors) ⇒ <code>object</code>

<a name="module_aloesHandlers.patternDetector"></a>

### aloesHandlers.patternDetector(packet) ⇒ <code>object</code>
Retrieve routing pattern from MQTT packet.topic and supported protocols

**Kind**: static method of [<code>aloesHandlers</code>](#module_aloesHandlers)  
**Returns**: <code>object</code> - found pattern.name and pattern.params  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | The MQTT packet. |

<a name="module_aloesHandlers.publish"></a>

### aloesHandlers.publish(options) ⇒ <code>object</code>
Encode incoming supported protocol

**Kind**: static method of [<code>aloesHandlers</code>](#module_aloesHandlers)  
**Returns**: <code>object</code> - encoded MQTT route  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | .data being the instance, pattern being the description of the source protocol |

<a name="module_aloesHandlers.updateAloesSensors"></a>

### aloesHandlers.updateAloesSensors(sensor, resource, value) ⇒ <code>object</code>
Update and validate AloesClient Sensor instance

**Kind**: static method of [<code>aloesHandlers</code>](#module_aloesHandlers)  
**Returns**: <code>object</code> - updated sensor instance  

| Param | Type | Description |
| --- | --- | --- |
| sensor | <code>object</code> | sensor instance formatted as AloesClient protocol |
| resource | <code>number</code> | OMA resource ID to update |
| value | <code>string</code> | new value to update sensor with |

<a name="module_logger"></a>

## logger

| Param | Type | Description |
| --- | --- | --- |
| priority | <code>int</code> | Logger mode. |
| collectionName | <code>string</code> | service name. |
| command | <code>string</code> | service command to log. |
| content | <code>string</code> | log content. |

