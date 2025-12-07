// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-decked-with/types' */;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-decked-with',
    branches: ['', 'src'],
    map: {
        '0.0': {
            instanceOf: 'String',
            mapsTo: 'path',
        },
        '1.0': {
            instanceOf: 'String',
            mapsTo: 'src',
        }
    },
    enhPropKey: 'beDeckedWith',
    importEnh: async () => {
        const { BeDeckedWith } = await import('./be-decked-with.js');
        return BeDeckedWith;
    },
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
