# Nice Select

A lightweight Vanilla JavaScript plugin that replaces native select elements with customizable dropdowns.

## Install

```
npm i nice-select2
```

## Usage

Include nice-select2 script.

```html
<script src="path/to/nice-select2.js"></script>
```

Include the styles, either the compiled CSS...

```html
<link rel="stylesheet" href="path/to/nice-select2.css" />
```

Or import nice-select2 using ES6 syntax

```js
import NiceSelect from "nice-select2";
```

```scss
@import "~nice-select2/dist/css/nice-select2.css";
// or
@import "~nice-select2/src/scss/nice-select2.scss";
```

Finally, initialize the plugin.

Using the minimified file directly:
```javascript
NiceSelect.bind(document.getElementById("a-select"), {searchable: true, placeholder: 'select', searchtext: 'zoek', selectedtext: 'geselecteerd'});
```

Using as import in webpack:
```javascript
new NiceSelect(document.getElementById("a-select"), {searchable: true});
```

## Instance method

- `update()` : update nice-select items to match with source select
- `focus()`: open dropdown list and focus on the search box if search is enabled
- `disable()`: disable select
- `enable()`: enable select
- `destroy()`: destroy NiceSelect2 instance
- `clear()`: clear all selected options

## Documentation

Full documentation and examples at [https://bluzky.github.io/nice-select2/](https://bluzky.github.io/nice-select2/).

Server Side (New):

NiceSelect2 will issue a request to the specified URL when the page loads, and again every time the user types in the search box. By default, it will send the following as query string parameters

- `term` : The current search term in the search box
- `q` : Contains the same contents as `term`

In HTML
```html
<div class="formatHtml" data-lang="language-html">
    <select id="selectServerSide"></select>
</div>
```

In JS
```javascript
//server side
let fetchOpt = {};
let uri = "...";
NiceSelect.bind(document.getElementById("selectServerSide"), {
    serverSide: true,
    fetchUri: uri,
    fetchOpt: fetchOpt,
    fetchRes: function(err, data) {
        if(!err) {
            return data.map(function (e) {
                e.text = e.text;
                e.value = e.value;
                e.selected = null;
                e.disabled = null;
                return e;
            });
        }
    }
});
```