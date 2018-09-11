# DOM Walker

Library build on ES6 Proxies using TreeWalker in core for traversing HTML DOM. For more information check [TreeWalker documentation](https://github.com/burdiuz/js-tree-walker).

### Usage
From set of TreeWalker API, DOMWalker exports only
* addAugmentations() -- add more augmentations.
* resetAugmentations() -- reset augmentations.
* setNamePrefix() -- you can add more or change prefixes
* create() -- accepts one argument, adapter is set to BrowserDOM adapter.

### DEMO
Demo of DOMWalker [available here](https://jsfiddle.net/actualwave/98p2750y/), in comparison you may check [demo of DOMWalker built by parts](https://jsfiddle.net/actualwave/p1k4wjy2/)
* [@actualwave/tree-walker](https://github.com/burdiuz/js-tree-walker)
* [@actualwave/walker-browserdom-adapter]( https://github.com/burdiuz/js-walker-browserdom-adapter)
* [@actualwave/walker-browserdom-augmentations](https://github.com/burdiuz/js-walker-browserdom-augmentations)
* [@actualwave/walker-property-handlers](https://github.com/burdiuz/js-walker-property-handlers)

The only difference is DOMWalker case insensitive to node names, so these will be equivalent:
```javascript
node.descendants('DIV');
node.descendants('div');
node.descendants('Div');
```
