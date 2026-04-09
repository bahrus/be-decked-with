import {emc as baseEmc} from './emc.mjs';
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps} from './types/be-decked-with/types' */

console.log({emc});
/**
 * @type {EMC<any, AllProps> }
 */
const emc = {
    enhConfig: {
        ...baseEmc.enhConfig,
        enhKey: '😶‍🌫️',
        withAttrs: {
            ...baseEmc.withAttrs,
            base: '😶‍🌫️'
        }
    }
}

export function render(){
    return JSON.stringify(emc, null, 4);
}