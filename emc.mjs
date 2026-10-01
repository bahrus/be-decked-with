//@ts-check

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps, Actions} from './types/be-decked-with/types' */
/** @import {RAConfig} from './types/roundabout/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions> >}
 */
export const emc = {
    enhConfig: {
        enhKey: 'beDeckedWith',
        spawn: 'be-decked-with/be-decked-with.js',
        withAttrs: {
            base: 'be-decked-with',
            _base: {
                instanceOf: 'String',
                mapsTo: 'path',
            },
            src: '${base}-src',
            _src: {
                instanceOf: 'String',
                mapsTo: 'src',
            }
        },
    },
    customData: {
        weakRef: {
            properties: ['enhancedElement']
        },
        // actions rather than compacts:  actions are also evaluated once on
        // initialization, which picks up values assigned programmatically
        // (enh.get / enh.set) before roundabout has finished wiring up.
        actions: {
            upShadowSearch: {
                ifAllOf: ['enhancedElement', 'path'],
                ifNoneOf: ['resolved'],
            },
            fetchRemoteTemplate: {
                ifAllOf: ['enhancedElement', 'src'],
                ifNoneOf: ['resolved'],
            },
            act: {
                ifAllOf: ['enhancedElement', 'template'],
                ifNoneOf: ['resolved'],
            },
        }
    }
};

export function render(){
    return JSON.stringify(emc, null, 4);
}

console.log(render());