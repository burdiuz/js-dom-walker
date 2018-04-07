import { setDefaultAdapter, getDefaultAdapter } from './default-adapter';
import { setNamePrefix } from './prefixes';
import { addAugmentations, resetAugmentations } from './augmentations';
import wrapWithProxy from './wrapper';

import coreAugmentations from './augmentations/core';
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

const create = (root, adapter = getDefaultAdapter()) =>
  wrapWithProxy(adapter.validateRoot(root), adapter);

export {
  setDefaultAdapter,
  getDefaultAdapter,
  addAugmentations,
  resetAugmentations,
  setNamePrefix,
  create,
};

export default create;
