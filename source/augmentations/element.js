const name = (node, adapter) =>
  adapter.getName(node);

const text = (node, adapter) =>
  adapter.getText(node);

const attributes = (node, adapter) =>
  adapter.getAttributes(node);

const query = (node, adapter, [queryString], utils) => {
  const result = adapter.toNode(node).querySelector(queryString);
  return utils.wrap(adapter.isNode(result) ? result : [], adapter);
};

const queryAll = (node, adapter, [queryString], utils) => {
  const result = adapter.toNode(node).querySelectorAll(queryString);
  return utils.wrap(result, adapter);
};

export default {
  name,
  text,
  attributes,
  query,
  queryAll,
};
