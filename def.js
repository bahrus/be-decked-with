import 'assign-gingerly/object-extension.js';

/**
 * Registers be-decked-with's config, so it can be attached programmatically
 * via el.enh.set.beDeckedWith / el.enh.get(emc).
 * @param {Element | undefined} ref element whose customElementRegistry to register against
 */
export async function defBeDeckedWith(ref){
    const {default: emc} = await import('./emc.json', {with: {type: 'json'}});
    return await push(ref, emc);
}

async function push(ref, emc){
    const {BeDeckedWith} = await import('./be-decked-with.js');
    const {enhConfig} = emc;
    enhConfig.spawn = BeDeckedWith;
    enhConfig.customData = emc.customData; // the registry only stores enhConfig, not the full emc
    const registry = (ref?.customElementRegistry ?? customElements).enhancementRegistry;
    registry.push(enhConfig);
    return enhConfig;
}
