import {
  setNamePrefix,
  setDefaultAdapter,
  addAugmentations,
  resetAugmentations,
  coreAugmentations,
  create as createRoot,
} from 'tree-walker';

import htmlEventAugmentations from './augmentations/event';
import htmlListAugmentations from './augmentations/list';
import htmlNodeAugmentations from './augmentations/node';

import HTMLROAdapter from './htmlro-adapter';

const ATTRIBUTE_KEY = '$';

setDefaultAdapter(HTMLROAdapter);

addAugmentations(coreAugmentations);
addAugmentations(htmlNodeAugmentations);
addAugmentations(htmlListAugmentations);
addAugmentations(htmlEventAugmentations);

setNamePrefix(ATTRIBUTE_KEY, (node, adapter, [name]) => adapter.getAttributeValue(node, name));

const create = (root, adapter = HTMLROAdapter) => createRoot(root, adapter);

export {
  addAugmentations,
  resetAugmentations,
  setNamePrefix,
  create,
};

export default create;
