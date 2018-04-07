const isList = (node) => (
  node instanceof Array
  || node instanceof HTMLCollection
  || node instanceof NodeList
);

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

const isNode = (node) => node instanceof HTMLElement;

const toNode = (node) => {
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

const getLength = (list) => list.length;

// Node
const getChildren = (node) => {
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

const hasChildren = (node) => !!toNode(node).childElementCount;

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

const getAttributes = (node) => {
  node = toNode(node);
  if (node.hasAttributes()) {
    return node.attributes;
  }

  return null;
};

const hasAttribute = (node, name) => toNode(node).hasAttribute(name);

const getAttributeValue = (node, name) => toNode(node).getAttribute(name);

const getName = (node) => toNode(node).nodeName;

const getText = (node) => toNode(node).innerText;

const getNodeParent = (node) => toNode(node).parentNode;

const getNodeRoot = (node) => toNode(node).getRootNode();

const validateRoot = (root) => {
  if (root === undefined || root === document) {
    return document.firstElementChild;
  } else if (typeof root === 'string') {
    return document.querySelector(root);
  }

  return root;
};

export default {
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
  validateRoot,
};
