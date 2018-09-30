'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var treeWalker = require('@actualwave/tree-walker');
var BrowserDOMAdapter = _interopDefault(require('@actualwave/walker-browserdom-adapter'));
var walkerBrowserdomAugmentations = require('@actualwave/walker-browserdom-augmentations');
var walkerPropertyHandlers = require('@actualwave/walker-property-handlers');

treeWalker.addAugmentations(treeWalker.coreAugmentations);
treeWalker.addAugmentations(Object.assign({}, treeWalker.nodeAugmentations, {
  descendants: (({ descendants }) => (node, adapter, args, utils) => {
    const [childName] = args;

    if (childName) {
      return descendants(node, adapter, [childName.toLowerCase()], utils);
    }

    return descendants(node, adapter, args, utils);
  })(treeWalker.nodeAugmentations)
}));
treeWalker.addAugmentations(treeWalker.listAugmentations);
treeWalker.addAugmentations(walkerBrowserdomAugmentations.eventAugmentations);
treeWalker.addAugmentations(walkerBrowserdomAugmentations.elementAugmentations);

treeWalker.setNamePrefix('$', walkerPropertyHandlers.createHandlers());

const create = (root, adapter = BrowserDOMAdapter) => treeWalker.create(root, adapter);

exports.addAugmentations = treeWalker.addAugmentations;
exports.resetAugmentations = treeWalker.resetAugmentations;
exports.setNamePrefix = treeWalker.setNamePrefix;
exports.create = create;
exports.default = create;
//# sourceMappingURL=index.js.map
