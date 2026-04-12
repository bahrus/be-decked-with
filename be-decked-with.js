//@ts-check
/** @import {EnhancementConfig, SpawnContext, ElementEnhancementGateway} from './types/assign-gingerly/types' */;
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {RAConfig, RoundaboutOptions} from './types/roundabout/types' */

/** @import { AllProps, Actions, PAP } from './types/be-decked-with/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>}
 */
import emc from './emc.json' with {type: 'json'};

/** @type {WeakSet<HTMLTemplateElement>} */
const cleansed = new WeakSet();

/** @type {WeakMap<HTMLTemplateElement, string>} */
const styleLookup = new WeakMap();

const rnGuid = Symbol.for('NFweAigLiEKNat98Vdnf5w');

/** @type {Map<string, HTMLTemplateElement>} */
const remoteTemplateLookup = new Map();

/**
 * @implements {Actions}
 * 
 */
export class BeDeckedWith {

    /**
     * @this {AllProps & Actions}
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {*} ctx 
     * @param {PAP} initVals 
     */
    constructor(enhancedElement, ctx, initVals) {
        this.init(this, enhancedElement, initVals);
    }

    /**
     * @param {AllProps} self 
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {PAP} initVals 
     */
    async init(self, enhancedElement, initVals) {
        const { customData } = emc;
        const { defaultPropVals } = customData;
        /**
         * @type {RoundaboutOptions}
         */
        const raOptions = {
            ...customData,
            vm: self,
            initialPropVals: {
                enhancedElement,
                ...defaultPropVals,
                ...initVals
            }
        };
        await (await import('roundabout-lib/roundabout.js')).roundabout(raOptions);
    }

    /**
     * 
     * @param {AllProps} self 
     * @returns 
     */
    async upShadowSearch(self) {
        const { path, enhancedElement } = self;
        // Get the template selector from be-decked-with attribute

        const template = (await import('mount-observer/upShadowSearch.js')).upShadowSearch(enhancedElement, path);
        if (!(template instanceof HTMLTemplateElement)) throw 404;
        return /** @type {PAP} */ ({
            template
        });
    }

    /**
     * 
     * @param {AllProps} self 
     * @returns 
     */
    async fetchRemoteTemplate(self) {
        const { src, enhancedElement } = self;
        const cachedTemplate = remoteTemplateLookup.get(src);
        if (cachedTemplate) return /** @type {PAP} */ ({
            template: cachedTemplate
        });
        // Resolve the path using import map
        const resolvedPath = resolveWithImportMap(src);

        // Fetch the HTML file
        const response = await fetch(resolvedPath);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${resolvedPath}: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const template = document.createElement('template');
        template.innerHTML = html;
        remoteTemplateLookup.set(src, template);
        return /** @type {PAP} */ ({
            template
        });
    }

    /**
     * 
     * @param {AllProps} self 
     */
    act(self) {
        const { template, enhancedElement } = self;


        if (!cleansed.has(template)) {
            cleansed.add(template);
            const style = template.content.querySelector('style');
            if (style) {
                styleLookup.set(template, style.innerHTML);
                style.remove();
            }

        }
        const styleS = styleLookup.get(template);
        if (styleS !== undefined) {
            const rn = /** @type {any} */ (enhancedElement.getRootNode());
            /**
             * @type {WeakSet<HTMLTemplateElement> | undefined}
             */
            let rnStyleLookup = rn[rnGuid];
            if (!rnStyleLookup) {
                rnStyleLookup = new WeakSet();
                rn[rnGuid] = rnStyleLookup;
            };
            if (!rnStyleLookup.has(template)) {
                rnStyleLookup.add(template);
                const style = document.createElement('style');
                style.innerHTML = styleS;
                (rn.head || rn).appendChild(style);
            }
        }


        // Clone the template content
        const clone = /** @type {DocumentFragment} */ (template.content.cloneNode(true));

        // Substitute {{dataset.xxx}} expressions with values from element's dataset
        const walker = document.createTreeWalker(
            clone,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            null
        );


        const nodesToProcess = [];
        let node;
        while ((node = walker.nextNode())) {
            // why not just do all the logic below, right here, Claude?
            nodesToProcess.push(node);
        }
        if (enhancedElement instanceof HTMLElement) {
            nodesToProcess.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    // Process text nodes for {{}} expressions
                    const text = node.textContent;
                    if (text !== null) {
                        // const substituted = text.replace(/\{\{dataset\.(\w+)\}\}/g, (match, key) => {
                        //     return enhancedElement.dataset[key] || '';
                        // });
                        const substituted = replacePlaceholders(text, enhancedElement);
                        if (text !== substituted) {
                            node.textContent = substituted;
                        }
                    }

                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Process attributes for {{}} expressions
                    Array.from(node.attributes).forEach(attr => {
                        /**
                         * @type {string}
                         */
                        const value = attr.value;
                        // 
                        const substituted = replacePlaceholders(value, enhancedElement);
                        if (value !== substituted) {
                            attr.value = substituted;
                        }
                    });
                }
            });
        }

        // Find the slot element
        const slot = clone.querySelector('slot');
        if (!slot) throw 404;

        // Check for placeholder element inside slot that matches adorned element's tag name
        if (enhancedElement instanceof HTMLElement) {
            const tagName = enhancedElement.tagName.toLowerCase();
            const placeholder = slot.querySelector(tagName);

            if (placeholder instanceof HTMLElement) {
                // Extract attributes from placeholder and apply to adorned element
                Array.from(placeholder.attributes).forEach(attr => {
                    // Skip data attributes
                    if (!attr.name.startsWith('data-')) {
                        // Apply dynamic placeholder substitution to attribute values
                        const substituted = replacePlaceholders(attr.value, enhancedElement);
                        enhancedElement.setAttribute(attr.name, substituted);
                    }
                });
            }
        }

        enhancedElement.after(clone);
        const parentOfSlot = slot.parentElement;
        if (parentOfSlot && 'moveBefore' in parentOfSlot) {
            parentOfSlot.moveBefore(enhancedElement, slot);
        } else {
            slot.after(enhancedElement);
        }

        slot.remove();



        return /** @type {PAP} */ ({
            resolved: true,
        });
    }
}

/**
 * 
 * @param {string} txtExpression 
 * @param {any} obj 
 * @returns 
 */
function replacePlaceholders(txtExpression, obj) {
    return txtExpression.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
        // Split the path by dots and traverse the object
        const value = path.trim().split('.').reduce((current, prop) => {
            return current?.[prop];
        }, obj);

        // Return the value if found, otherwise return the original placeholder
        return value !== undefined ? value : match;
    });
}

//TODO:  take from imp-h -- maybe should put in trans-render

/**
 * Resolves a path using the import map if available
 * @param {string} specifier - The import specifier (e.g., "my-package/root.html")
 * @returns {string} The resolved URL
 */
function resolveWithImportMap(specifier) {
    // Get the import map from the document
    const importMapScripts = Array.from(document.querySelectorAll('script[type="importmap"]'));

    if (importMapScripts.length === 0) {
        // No import map, return specifier as-is
        return specifier;
    }

    for (const importMapScript of importMapScripts) {
        const importMap = JSON.parse(importMapScript.textContent);
        const imports = importMap.imports || {};

        // Check for exact match first
        if (imports[specifier]) {
            return imports[specifier];
        }

        // Check for prefix matches (e.g., "my-package/" mapping)
        for (const [key, value] of Object.entries(imports)) {
            if (key.endsWith('/') && specifier.startsWith(key)) {
                // Replace the prefix with the mapped value
                return specifier.replace(key, value);
            }
        }
    }


    // No match found, return original specifier
    return specifier;

}