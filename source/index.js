import {
  setNamePrefix,
  addAugmentations,
  resetAugmentations,
  coreAugmentations,
  nodeAugmentations,
  listAugmentations,
  create as createRoot,
} from '@actualwave/tree-walker';

import BrowserDOMAdapter from '@actualwave/walker-browserdom-adapter';

import {
  eventAugmentations,
  elementAugmentations,
} from '@actualwave/walker-browserdom-augmentations';

import { createHandlers } from '@actualwave/walker-property-handlers';

addAugmentations(coreAugmentations);
addAugmentations({
  ...nodeAugmentations,
  descendants: (({ descendants }) => (node, adapter, args, utils) => {
    const [childName] = args;

    if (childName) {
      return descendants(node, adapter, [childName.toLowerCase()], utils);
    }

    return descendants(node, adapter, args, utils);
  })(nodeAugmentations),
});
addAugmentations(listAugmentations);
addAugmentations(eventAugmentations);
addAugmentations(elementAugmentations);

setNamePrefix('$', createHandlers());

const create = (root, adapter = BrowserDOMAdapter) => createRoot(root, adapter);

export { addAugmentations, resetAugmentations, setNamePrefix, create };

export default create;
