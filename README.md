# be-decked-with (😶‍🌫️)

[![Playwright Tests](https://github.com/bahrus/be-decked-with/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-decked-with/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-decked-with.png)](http://badge.fury.io/js/be-decked-with)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-decked-with?style=for-the-badge)](https://bundlephobia.com/result?p=be-decked-with)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-decked-with?compression=gzip">

Surround the adorned element with content from a common, reusable template.

Specifically, what *be-decked-with* does is it takes the following HTML:



```html
<template id=myWrappingContent>
    <fieldset>
        <legend>{{dataset.label}}</legend>
        <label>
            <span>{{dataset.label}}</span>
            <slot></slot>
        </label>
    </fieldset>
</template>

...

<select 
    data-label=Country
    be-decked-with=myWrappingContent>
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
    <option value="au">Australia</option>
    <option value="de">Germany</option>
    <option value="fr">France</option>
    <option value="jp">Japan</option>
</select>
```

and does the following:

1.  Clones the "myWrappingContent" template.
2.  Substitutes in values from the select element properties into the double brace expressions.
3.  Inserts the clone right after the select element.
4.  Moves the select element right after the slot element.
5.  Deletes the slot element.

So the markup above results in:

```html
<fieldset>
    <legend>Country></legend>
    <label>
        <span>Country</span>
        <select 
            data-label=Country
            be-decked-with=myWrappingContent>
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="jp">Japan</option>
        </select>
    </label>
</fieldset>
```

## Wouldn't it be better for the server or build process to do this?

Maybe, it depends.  If multiple elements need to be wrapped with the same wrapper, it could actually be close to a wash or even a small advantage to do it in the client, which this enhancement supports.

But I think it is quite reasonable to use server and build processes that can also apply this wrapping, based on the same syntax, where it proves more efficacious to do so.

## Related enhancements

If what is needed is more complex interspersing / weaving together of templates, consider [be-inclusive](https://github.com/bahrus/be-inclusive) or [be-imbued](https://github.com/bahrus/be-imbued).

## Compact alternative name

It is easy to define alternative names for the attribute.  This package contains one such alternative name:  😶‍🌫️:

```html
<select 
    😶‍🌫️=myWrappingContent>
    ...
</select>
```

> [!NOTE]
> A vscode extension to make navigation from the element adorned by the be-decked-with attribute to the target element [is available](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.idref).  

## Remote templates

To pull in wrapper from an external html link, this must be mapped via import maps:

```html
<html>
    <head>
        <script type=importmap >
        {
            "imports": {
                "be-decked-with/": "/"
            }
        }
        </script>
    </head>
    <body>
        <select 
            data-label=Country
            😶‍🌫️-src="be-decked-with/demo/template.html">
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="jp">Japan</option>
    </select>
    </body>
</html>
```

> [!NOTE]
> Another [vs code extension](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.custom-link-attributes) is available that specializes in supporting the be-decked-with-src/😶‍🌫️-src navigation to the source document.

## Support for applying dynamic attributes to the adorned element.

If we place a placeholder inside the slot element whose tag name matches the name of the adorned element, with dynamic attributes, those attributes get applied to to the adorned element.

So for example:

```html
<template id=myWrappingContent>
    <fieldset>
        <legend>{{dataset.label}}</legend>
        <label>
            <span>{{dataset.label}}</span>
            <slot>
                <select aria-label={{dataset.label}}></select>
            </slot>
        </label>
    </fieldset>
</template>

...

<select 
    data-label=Country
    be-decked-with=myWrappingContent>
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
    <option value="au">Australia</option>
    <option value="de">Germany</option>
    <option value="fr">France</option>
    <option value="jp">Japan</option>
</select>
```

... generates:

```html
<fieldset>
    <legend>Country></legend>
    <label>
        <span>Country</span>
        <select aria-label=Country
            data-label=Country
            be-decked-with=myWrappingContent>
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="jp">Japan</option>
        </select>
    </label>
</fieldset>
```



## Viewing Locally

Any web server that serves static files (html, css, js) will do but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:8000/demo in a modern browser.

## Importing in ES Modules:

```JavaScript
import 'be-decked-with/be-decked-with.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-decked-with';
</script>
```
