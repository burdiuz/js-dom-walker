(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.DOMWalker = {})));
}(this, (function (exports) { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var treeWalker = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	let defaultAdapter = null;

	const setDefaultAdapter = adapter => {
	  defaultAdapter = adapter;
	};
	const getDefaultAdapter = () => defaultAdapter;

	const namePrefixes = {};

	const isValidPrefix = prefix => typeof prefix === 'string' && prefix.length === 1 && namePrefixes.hasOwnProperty(prefix);

	const isPrefixedKey = key => key && typeof key === 'string' && key.length > 1 && namePrefixes.hasOwnProperty(key.charAt());

	const getPrefixHandler = key => namePrefixes[key.charAt()];

	const setNamePrefix = (prefix, handler) => {
	  if (typeof prefix !== 'string' || prefix.length !== 1) {
	    throw new Error('Name Prefix must be one character string.');
	  }

	  namePrefixes[prefix] = handler;
	};

	const isIntKey = key => `${parseInt(key, 10)}` === key;

	const getValue = (node, adapter, childName = undefined) => {
	  if (childName !== undefined) {
	    return adapter.getChildrenByName(node, childName);
	  }

	  return node;
	};

	const getSingleNode = (node, adapter, childName = undefined) => {
	  const value = getValue(node, adapter, childName);

	  if (adapter.isList(value)) {
	    return adapter.getNodeAt(node);
	  }

	  return value;
	};

	const getNodeList = (node, adapter, childName = undefined) => {
	  return adapter.toList(getValue(node, adapter, childName));
	};

	let augmentations = {};

	const resetAugmentations = (augs = {}) => {
	  augmentations = augs;
	};

	const addAugmentations = (augs = {}) => {
	  augmentations = Object.assign({}, augmentations, augs);
	};

	const hasAugmentation = key => key && typeof key === 'string' && augmentations.hasOwnProperty(key);

	const applyAugmentation = (key, ...args) => augmentations[key](...args);

	let handlers;
	let utils;

	const createWalkerNode = (node, adapter, childName = undefined) => {
	  function TreeWalker() {
	    throw new Error('Should have been never called');
	  }

	  // can be single Node and NodeList with length >= 0
	  // should it be always NodeList?
	  TreeWalker.node = node;
	  // childName always String/Symbol, Number's are being handled in proxy get wrapper
	  // INFO "name" is RO property of Function object
	  TreeWalker.childName = childName;
	  TreeWalker.adapter = adapter;
	  return TreeWalker;
	};

	const wrap = (node, adapter, childName = undefined) => {
	  if (!adapter.isNode(node) && !adapter.isList(node)) {
	    return node;
	  }

	  return new Proxy(createWalkerNode(node, adapter, childName), handlers);
	};

	// eslint-disable-next-line
	utils = {
	  isIntKey,
	  getValue,
	  getSingleNode,
	  getNodeList,
	  wrap
	};

	const get = ({ node, adapter, childName }, key) => {
	  /*
	   if string childName used
	   if starts with $, return attribute value
	   else return wrapper with current single node and property childName
	   if numeric index used, use node as parent and childName is undefined
	   */
	  if (isIntKey(key)) {
	    return wrap(adapter.getNodeAt(getNodeList(node, adapter, childName), key), adapter);
	  }

	  if (isPrefixedKey(key)) {
	    const handler = getPrefixHandler(key);
	    return handler(getValue(node, adapter, childName), adapter, [key.substr(1)], utils);
	  }

	  // return wrap with node and childName
	  return wrap(getValue(node, adapter, childName), adapter, key);
	};

	const has = ({ node, adapter, childName }, key) => {
	  if (isIntKey(key)) {
	    return !!adapter.getNodeAt(getNodeList(node, adapter, childName), key);
	  }

	  if (isPrefixedKey(key)) {
	    // return adapter.hasAttribute(getSingleNode(node, adapter, childName), key.substr(1));
	    // don't know how to implement this, calling same handler as in GET seems overkill
	    return true;
	  }

	  return adapter.hasChild(getSingleNode(), key);
	};

	const apply = ({ node, adapter, childName }, thisArg, argumentsList) => {
	  if (childName === undefined) {
	    throw new Error('Cannot call on TreeWalker Node');
	  }

	  // this works only of childName === prefix, one char string
	  // otherwise it should be passed into arguments
	  if (isValidPrefix(childName)) {
	    const handler = getPrefixHandler(childName);
	    return handler(node, adapter, argumentsList, utils);
	  }

	  if (hasAugmentation(childName)) {
	    // INFO cannot use target because it contains method's childName, not Node childName
	    // call the function with saving context, so other augmentations are accessible via "this"
	    return applyAugmentation(childName, node, adapter, argumentsList, utils);
	  }

	  // FIXME might throw only in dev mode(needs implementation)
	  throw new Error(`"${childName}" is not a callable object.`);
	};

	handlers = {
	  get,
	  has,
	  apply
	};

	const toString = node => node.toString();
	const valueOf = node => node;

	var coreAugmentations = {
	  toString,
	  valueOf,
	  [Symbol.toPrimitive]: node => node
	};

	const children = (node, adapter, [childName], utils) => {
	  let list;

	  if (childName) {
	    list = adapter.getChildrenByName(node, childName);
	  } else {
	    list = adapter.getChildren(node);
	  }

	  return utils.wrap(list, adapter);
	};

	const childAt = (node, adapter, [index = 0], utils) => utils.wrap(adapter.getChildAt(node, index), adapter);

	const root = (node, adapter, args, utils) => utils.wrap(adapter.getNodeRoot(node), adapter);

	const parent = (node, adapter, args, utils) => utils.wrap(adapter.getNodeParent(node), adapter);

	var node = {
	  children,
	  childAt,
	  root,
	  parent
	};

	const length = (node, adapter) => {
	  if (adapter.isList(node)) {
	    return adapter.getLength(node);
	  } else if (adapter.isNode(node)) {
	    return 1;
	  }
	  return 0;
	};

	const first = (node, adapter, args, utils) => {
	  let result = node;

	  if (adapter.isList(node)) {
	    if (node.length) {
	      [result] = node;
	    } else {
	      result = [];
	    }
	  }

	  return utils.wrap(result, adapter);
	};

	const filter = (node, adapter, [callback], utils) => {
	  // apply filter on element collection
	  // always return wrapped list
	  node = adapter.toList(node);
	  const list = [];

	  const wrappedNode = utils.wrap(node, adapter);
	  for (let index = 0; index < node.length; index += 1) {
	    const child = node[index];
	    if (callback(utils.wrap(child, adapter), index, wrappedNode)) {
	      list.push(child);
	    }
	  }

	  return utils.wrap(list, adapter);
	};

	const map = (node, adapter, [callback, wrapNodes = true], utils) => {
	  // apply map on element collection
	  // if wrapNodes in FALSE, will generate normal Array with RAW results in it
	  // if wrapNodes in TRUE and all elements of resulting list are nodes, will
	  //   generate wrapped list and put all result into it
	  node = adapter.toList(node);
	  const list = [];

	  let areNodes = true;
	  const wrappedNode = utils.wrap(node, adapter);
	  for (let index = 0; index < node.length; index += 1) {
	    const child = node[index];
	    const result = callback(utils.wrap(child, adapter), index, wrappedNode);
	    areNodes = areNodes && adapter.isNode(result);
	    list.push(result);
	  }

	  return wrapNodes && areNodes ? utils.wrap(list, adapter) : list;
	};

	const reduce = (node, adapter, [callback, result], utils) => {
	  // apply reduce on element collection
	  node = adapter.toList(node);

	  const wrappedNode = utils.wrap(node, adapter);
	  for (let index = 0; index < node.length; index += 1) {
	    const child = node[index];
	    result = callback(result, utils.wrap(child, adapter), index, wrappedNode);
	  }

	  return result;
	};

	var list = {
	  length,
	  first,
	  filter,
	  map,
	  reduce
	};

	addAugmentations(coreAugmentations);

	const create = (root, adapter = getDefaultAdapter()) => wrap(adapter.validateRoot(root), adapter);

	exports.setDefaultAdapter = setDefaultAdapter;
	exports.getDefaultAdapter = getDefaultAdapter;
	exports.addAugmentations = addAugmentations;
	exports.hasAugmentation = hasAugmentation;
	exports.resetAugmentations = resetAugmentations;
	exports.coreAugmentations = coreAugmentations;
	exports.nodeAugmentations = node;
	exports.listAugmentations = list;
	exports.setNamePrefix = setNamePrefix;
	exports.isValidPrefix = isValidPrefix;
	exports.create = create;
	exports.default = create;

	});

	unwrapExports(treeWalker);
	var treeWalker_1 = treeWalker.setDefaultAdapter;
	var treeWalker_2 = treeWalker.getDefaultAdapter;
	var treeWalker_3 = treeWalker.addAugmentations;
	var treeWalker_4 = treeWalker.hasAugmentation;
	var treeWalker_5 = treeWalker.resetAugmentations;
	var treeWalker_6 = treeWalker.coreAugmentations;
	var treeWalker_7 = treeWalker.nodeAugmentations;
	var treeWalker_8 = treeWalker.listAugmentations;
	var treeWalker_9 = treeWalker.setNamePrefix;
	var treeWalker_10 = treeWalker.isValidPrefix;
	var treeWalker_11 = treeWalker.create;

	const on = (node, adapter, [eventType, callback]) => {
	  node = adapter.toNode(node);
	  node.addEventListener(eventType, callback);
	  return () => node.removeEventListener(eventType, callback);
	};

	const off = (node, adapter, [eventType, callback]) => {
	  adapter.toNode(node).removeEventListener(eventType, callback);
	};

	const emmit = (node, adapter, [event]) => {
	  adapter.toNode(node).dispatchEvent(event instanceof Event ? event : new Event(String(event)));
	};

	var htmlEventAugmentations = {
	  on,
	  off,
	  emmit
	};

	const name = (node, adapter) => adapter.getName(node);

	const text = (node, adapter) => adapter.getText(node);

	const attributes = (node, adapter) => adapter.getAttributes(node);

	const query = (node, adapter, [queryString], utils) => {
	  const result = adapter.toNode(node).querySelector(queryString);
	  return utils.wrap(adapter.isNode(result) ? result : [], adapter);
	};

	const queryAll = (node, adapter, [queryString], utils) => {
	  const result = adapter.toNode(node).querySelectorAll(queryString);
	  return utils.wrap(result, adapter);
	};

	var htmlElementAugmentations = {
	  name,
	  text,
	  attributes,
	  query,
	  queryAll
	};

	const isList = node => node instanceof Array || node instanceof HTMLCollection || node instanceof NodeList;

	const toList = (...args) => {
	  const { length } = args;
	  const [node] = args;

	  if (length === 1 && isList(node)) {
	    return node;
	  }

	  const list = [];

	  for (let index = 0; index < length; index++) {
	    const part = args[index];
	    if (isList(part)) {
	      list.push.call(part);
	    } else {
	      list.push(part);
	    }
	  }

	  return list;
	};

	const isNode = node => node instanceof HTMLElement;

	const toNode = node => {
	  // if list we use only first node
	  if (isList(node)) {
	    return node.length ? node[0] : null;
	  }

	  return isNode(node) ? node : null;
	};

	const getNodeAt = (list, index = 0) => {
	  if (isList(list)) {
	    return list[index];
	  }

	  return list;
	};

	const getLength = list => list.length;

	// Node
	const getChildren = node => {
	  node = toNode(node);

	  // if not a node, return empty list
	  return isNode(node) ? node.children : toList();
	};

	const getChildrenByName = (node, name) => {
	  name = name.toLowerCase();
	  const children = getChildren(node);
	  const { length } = children;

	  if (!length) {
	    return children;
	  }

	  const list = [];

	  for (let index = 0; index < children.length; index++) {
	    const child = children[index];
	    if (child.nodeName.toLowerCase() === name) {
	      list.push(child);
	    }
	  }

	  return list;
	};

	const hasChildren = node => !!toNode(node).childElementCount;

	const hasChild = (node, name) => {
	  const children = getChildren(node);
	  const { length } = children;

	  for (let index = 0; index < length; index++) {
	    if (children[index].nodeName === name) {
	      return true;
	    }
	  }

	  return false;
	};

	const getChildAt = (node, index) => getChildren(node)[index];

	const getAttributes = node => {
	  node = toNode(node);
	  if (node.hasAttributes()) {
	    return node.attributes;
	  }

	  return null;
	};

	const hasAttribute = (node, name) => toNode(node).hasAttribute(name);

	const getAttributeValue = (node, name) => toNode(node).getAttribute(name);

	const getName = node => toNode(node).nodeName;

	const getText = node => toNode(node).innerText;

	const getNodeParent = node => toNode(node).parentNode;

	const getNodeRoot = node => toNode(node).getRootNode();

	const validateRoot = root => {
	  if (root === undefined || root === document) {
	    return document.firstElementChild;
	  } else if (typeof root === 'string') {
	    return document.querySelector(root);
	  }

	  return root;
	};

	var HTMLROAdapter = {
	  isList,
	  toList,
	  isNode,
	  toNode,
	  getNodeAt,
	  getLength,
	  getChildren,
	  getChildrenByName,
	  hasChildren,
	  hasChild,
	  getChildAt,
	  getAttributes,
	  hasAttribute,
	  getAttributeValue,
	  getName,
	  getText,
	  getNodeParent,
	  getNodeRoot,
	  validateRoot
	};

	const ATTRIBUTE_KEY = '$';
	const getAttribute = (node, adapter, [name]) => adapter.getAttributeValue(node, name);

	treeWalker_1(HTMLROAdapter);

	treeWalker_3(treeWalker_6);
	treeWalker_3(treeWalker_7);
	treeWalker_3(treeWalker_8);
	treeWalker_3(htmlEventAugmentations);
	treeWalker_3(htmlElementAugmentations);

	treeWalker_9(ATTRIBUTE_KEY, getAttribute);

	const create$$1 = (root, adapter = HTMLROAdapter) => treeWalker_11(root, adapter);

	exports.addAugmentations = treeWalker_3;
	exports.resetAugmentations = treeWalker_5;
	exports.setNamePrefix = treeWalker_9;
	exports.create = create$$1;
	exports.default = create$$1;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=dom-walker.js.map
