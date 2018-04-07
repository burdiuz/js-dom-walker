const name = (node, adapter, args, utils) =>
  adapter.getName(utils.getSingleNode(node, adapter));

const text = (node, adapter) =>
  adapter.getText(node);

const children = (node, adapter, [childName], utils) => {
  node = utils.getSingleNode(node, adapter);
  let list;

  if (childName) {
    list = adapter.getChildrenByName(node, childName);
  } else {
    list = adapter.getChildren(node);
  }

  return utils.wrapWithProxy(list, adapter);
};

// FIXME move parts to adapter
const attributes = (node, adapter, args, utils) => {
  const target = utils.getSingleNode(node, adapter);
  if (target.hasAttributes()) {
    return target.attributes;
  }

  return null;
};

// FIXME move parts to adapter
const attribute = (node, adapter, [attrName], utils) => {
  const attrs = attributes(node, adapter, [], utils);
  if (attrs) {
    const attr = attrs.getNamedItem(attrName);
    if (attr) {
      return attr.value;
    }
  }
  return '';
};

const childAt = (node, adapter, [index = 0], utils) =>
  adapter.getChildAt(utils.getSingleNode(node, adapter), index);

const root = (node, adapter, args, utils) =>
  utils.wrapWithProxy(adapter.getNodeRoot(node), adapter);

const parent = (node, adapter, args, utils) =>
  utils.wrapWithProxy(adapter.getNodeParent(node), adapter);

const query = (node, adapter, [queryString], utils) => {

};

const queryAll = (node, adapter, [queryString], utils) => {

};

export default {
  name,
  text,
  children,
  attributes,
  attribute,
  childAt,
  root,
  parent,
  query,
  queryAll,
};
