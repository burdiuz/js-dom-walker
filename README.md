# DOM Walker

Library build on ES6 Proxies using [TreeWalker](https://github.com/burdiuz/js-tree-walker) in its core for traversing HTML DOM. Uses [BrowserDOM adapter](https://github.com/burdiuz/js-walker-browserdom-adapter) and [adds augmentations](https://github.com/burdiuz/js-walker-browserdom-augmentations) to work with HTML elements. For more information check [TreeWalker documentation](https://github.com/burdiuz/js-tree-walker).

### Usage
From set of TreeWalker API, DOMWalker exports only
* **addAugmentations()** -- add more augmentations.
* **resetAugmentations()** -- reset augmentations.
* **setNamePrefix()** -- add more or change prefixes
* **create()** -- accepts two optional arguments for root node of the tree and adapter which is set by default to [BrowserDOM adapter](https://github.com/burdiuz/js-walker-browserdom-adapter).

### DEMO
Demo of DOMWalker [available here](https://jsfiddle.net/actualwave/98p2750y/), in comparison you may check [demo of DOMWalker built by parts](https://jsfiddle.net/actualwave/p1k4wjy2/)
* [@actualwave/tree-walker](https://github.com/burdiuz/js-tree-walker)
* [@actualwave/walker-browserdom-adapter]( https://github.com/burdiuz/js-walker-browserdom-adapter)
* [@actualwave/walker-browserdom-augmentations](https://github.com/burdiuz/js-walker-browserdom-augmentations)
* [@actualwave/walker-property-handlers](https://github.com/burdiuz/js-walker-property-handlers)
