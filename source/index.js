import {
  setNamePrefix,
  setDefaultAdapter,
  addAugmentations,
  resetAugmentations,
  coreAugmentations,
  nodeAugmentations,
  listAugmentations,
  create as createRoot,
} from '@actualwave/tree-walker';

import htmlEventAugmentations from './augmentations/event';
import htmlElementAugmentations from './augmentations/element';

import HTMLROAdapter from './htmlro-adapter';

import { ATTRIBUTE_KEY, getAttribute } from './attribute';

setDefaultAdapter(HTMLROAdapter);

addAugmentations(coreAugmentations);
addAugmentations(nodeAugmentations);
addAugmentations(listAugmentations);
addAugmentations(htmlEventAugmentations);
addAugmentations(htmlElementAugmentations);

setNamePrefix(ATTRIBUTE_KEY, getAttribute);

const create = (root, adapter = HTMLROAdapter) => createRoot(root, adapter);

export {
  addAugmentations,
  resetAugmentations,
  setNamePrefix,
  create,
};

export default create;
