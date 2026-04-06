//@ts-check
/** @import {EnhancementConfig, SpawnContext, ElementEnhancementGateway} from './types/assign-gingerly/types' */;
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {RAConfig, RoundaboutOptions} from './types/roundabout/types' */

/** @import { AllProps, Actions, PAP } from './types/be-decked-with/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>}
 */
import emc from './emc.json' with {type: 'json'};

/** @type {Map<string, HTMLTemplateElement>} */
const remoteTemplateLookup = new Map();

/**
 * @implements {Actions}
 * 
 */
export class BeDeckedWith {

    /**
     * @type {WeakRef<Element & ElementEnhancementGateway>}
     */
    #enhancedElementRef;
    get enhancedElement(){
        const ref = this.#enhancedElementRef.deref();
        if(ref === undefined) throw 404;
        return ref;
    }

    /**
     * 
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {*} ctx 
     * @param {PAP} initVals 
     */
    constructor(enhancedElement, ctx, initVals){
        this.#enhancedElementRef = new WeakRef(enhancedElement);
        const self = /** @type {AllProps & Actions} */(/** @type {unknown} */(this));
        self.init(self, initVals);
    }

    /**
     * @this {AllProps & Actions}
     * @param {AllProps} self 
     * @param {PAP} initVals 
     */
    async init(self, initVals){
        const {customData} = emc;
        /**
         * @type {RoundaboutOptions}
         */
        const raOptions = {
            ...customData,
            vm: this,
        };
        (await import('roundabout-lib/roundabout.js')).roundabout(raOptions);
        (await import('assign-gingerly/assignGingerly.js')).assignGingerly(self, {
            
            ...initVals
        });
    }

    /**
     * 
     * @param {AllProps} self 
     * @returns 
     */
    async upShadowSearch(self){
        const { path, enhancedElement } = self;
        // Get the template selector from be-decked-with attribute

        const template =(await import('mount-observer/upShadowSearch.js')).upShadowSearch(enhancedElement, path);
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
    async fetchRemoteTemplate(self){
        const {src, enhancedElement} = self;
        const cachedTemplate = remoteTemplateLookup.get(src);
        if(cachedTemplate) return /** @type {PAP} */ ({
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
  
  for(const importMapScript of importMapScripts){
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