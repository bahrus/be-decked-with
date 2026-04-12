//@ts-check

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps, Actions} from './types/be-decked-with/types' */
/** @import {RAConfig} from './types/roundabout/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions> >}
 */
export const emc = {
    enhConfig: {
        enhKey: 'BeDeckedWith',
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
        compacts: {
            when_path_changes_call_upShadowSearch: 0,
            when_template_changes_call_act: 0,
            when_src_changes_call_fetchRemoteTemplate: 0,
        }
    }
};

export function render(){
    return JSON.stringify(emc, null, 4);
}

console.log(render());