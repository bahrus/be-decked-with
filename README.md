# be-decked-with (😶‍🌫️)

[![Playwright Tests](https://github.com/bahrus/be-decked-with/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-decked-with/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-decked-with.png)](http://badge.fury.io/js/be-decked-with)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-decked-with?style=for-the-badge)](https://bundlephobia.com/result?p=be-decked-with)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-decked-with?compression=gzip">

Surround the adorned element with content from a common, reusable template.

Sometimes, styling with css alone isn't sufficient.  Sometimes, to properly "style" an element like the now customizable select element, we need to wrap the element inside some HTML tags that primarily provide look and feel improvements.

Doing so on every such element adds a lot of noise to the markup, just as minute styling instructions would.  *be-decked-with* aims to solve this problem.

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

It is easy to define alternative names for the attribute.  This package contains one such alternative name:  😶‍🌫️ (face in clouds emoji):

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

## Programmatic attachment (no attribute)

The attribute syntax shown above shines for server-rendered HTML and progressive enhancement:  the markup alone says which wrapper decks which element.  But most web development today renders on the client, with a framework (Lit, React, Vue, Svelte, etc.) that already has a JavaScript reference to each element it creates.  In that setting, attaching be-decked-with programmatically is the better fit:

1.  **A less clunky API.**  Frameworks tend to be awkward about setting arbitrary (let alone emoji) attributes like `😶‍🌫️-src="be-decked-with/demo/template.html"`.  And the attribute can only name a template by id, which then has to be searched for, up through the shadow DOM realms.  Programmatically, you can hand be-decked-with the `template` element itself (or a `WeakRef` to it), whether or not it has an id, or is even in the DOM.
2.  **Less stringifying and parsing.**  With an attribute, the framework serializes the template reference to a string, and be-decked-with then parses the attribute and looks the id up again.  Setting `template` directly skips all of that.
3.  **Less overhead monitoring attributes.**  The attribute approach relies on [be-hive](https://github.com/bahrus/be-hive) / [mount-observer](https://github.com/bahrus/mount-observer) watching the DOM for elements that carry (or gain) the attribute, and for changes to its value.  The programmatic approach needs none of that -- `def.js` just registers the enhancement's config, and the enhancement is attached exactly when, and to exactly the elements, your code says.

Both approaches produce the same enhancement, with the same `{{...}}` substitution and placeholder-attribute rules, so you can mix them in one app -- attributes for server-rendered islands, programmatic attachment inside client-rendered components.

First register the enhancement's config once:

```JS
import { defBeDeckedWith } from 'be-decked-with/def.js';
const emc = await defBeDeckedWith(document.body); // or a shadow root's host, for a scoped registry
```

Then set one of these properties:

| Attribute                        | Property   | Notes                                                                                      |
|----------------------------------|------------|--------------------------------------------------------------------------------------------|
| `be-decked-with` / `😶‍🌫️`         | `path`     | The id of a template, searched for up through the shadow DOM realms.                       |
| `be-decked-with-src` / `😶‍🌫️-src` | `src`      | An import-map-resolvable url of an html file containing the wrapper.                       |
| *(none)*                         | `template` | An `HTMLTemplateElement`, or a `WeakRef` to one.  Only available programmatically.         |

### Declarative -- via `enh.set`

```JS
// equivalent to <select data-label=Country be-decked-with=myWrappingContent>
select.enh.set.beDeckedWith.path = 'myWrappingContent';
```

Only the first property needs `.set` -- it's what triggers the attachment.  This can be done before or after `defBeDeckedWith` has been called.

### Imperative -- via `enh.get()`

```JS
select.enh.get(emc).template = myWrappingTemplate;
```

or, for a remote wrapper:

```JS
// equivalent to <select data-label=Country be-decked-with-src="be-decked-with/demo/template.html">
select.enh.get(emc).src = 'be-decked-with/demo/template.html';
```

### Differences from the attribute path

*  The wrapping is a one-time transformation of the DOM.  Once an element has been decked, setting `path`, `src` or `template` again does nothing.
*  be-decked-with doesn't keep the template alive. After the element is decked, the enhancement holds the template only through a `WeakRef`. If you pass a `WeakRef` to a template that's not in the DOM, keep your own reference to the template until the element has been decked. (Remote templates fetched via `src` are cached by url, and stay alive.)

See [demo/Programmatic](demo/Programmatic/) for runnable examples.

## Viewing Demos Locally

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to folder where you cloned this repo
5. > git submodule add https://github.com/bahrus/types.git types
6. > git submodule update --init --recursive
7. > npm install
8. > npm run build
9. > npm run serve
10. Open http://localhost:8000/demo/ in a modern browser

## Running Tests

```
> npm run test
```
