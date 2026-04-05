//@ts-check
/** @import {EnhancementConfig, SpawnContext, ElementEnhancementGateway} from './types/assign-gingerly/types' */;
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {RAConfig, RoundaboutOptions} from './types/roundabout/types' */

/** @import { AllProps, Actions, PAP } from './types/be-decked-with/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>}
 */
import emc from './emc.json' with {type: 'json'};

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
            on: 'keyup',
            ...initVals
        });
    }
}