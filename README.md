# Instant - JQuery Plugin
JQuery Plugin for interactive instant search
* Author: Maro Ortega
* License: GPLv3

## Usage
As easy as to write some characters and see the filter working in real time, it's possible to navigate the list using the `Up` and `Down` arrows and select the option pressing the `Enter` key.

### Initialize
Add the JS and CSS files to your HTML header.
```html
<link rel="stylesheet" href="instant.css" />
<script src="./instant.js"></script>
```
And then Initialize the plugin
```javascript
$(selector).instant(parameters);
```
Where `selector` is the `<input type="text" />` in which the plugin will be initialized.

### Parameters
The default parameters for the plugin are:
```javascript
var parameters = {
    "accentsInsensitive": true,
    "attributes": false,
    "callback": false,
    "caseInsensitive": true,
    "formName": "hidden-" + input name,
    "listOptions": {}
};
```
* **accentsInsensitive**: To allow match accentuated characters with non-accentuated characters p.ex. `á => a`.
* **attributes**: A JSON list of attributes to add to the `input` in the form of `{ attributeName: attributeValue }`.
* **callback**: A callback function that executes when an option is selected, it passes the value as a parameter to the function.
* **caseInsensitive**: To allow match upper case characters with lower case characters.
* **formName**: The name given to the hidden input that passes the value of the selected option in a form. By default it takes the name of the base `input`.
* **listOptions**: A JSON object with the list of options the plugin will search in, in the form of `{ optionValue: optionName }`.

Also it is possible to pass the listOptions parameter as the `data-options` attribute in the base `input` with the `hidden-` prefix.
Any option clash between `data-options` attribute and `parameters.listOptions` will end up using the former's.
```html
<!--
data-options = {
  "1": "Option 1",
  "2": "Option 2"
}
-->
<input
    type="text"
    class="instant"
    data-options="{&quot;1&quot;:&quot;Option 1&quot;,&quot;2&quot;:&quot;Option 2&quot;}"
/>
```
Be careful with the formating or it might break your HTML, if using PHP to print that data please use `htmlentities()`.

## CSS
A very basic style is provided for a simple use. It only affects three elements.
* **.instant_wrapper**: An invisible wrapper with `position: relative`.
* **.instant_list**: The options list.
* **.instant_list li**: Each element of the list, it can also  have the class `.focus`.
