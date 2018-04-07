const length = (node, adapter) => {
  if (adapter.isList(node)) {
    return adapter.getLength(node);
  } else if (adapter.isNode(node)) {
    return 1;
  }
  return 0;
};

const first = (node, adapter, args, utils) => {

};

const filter = (node, adapter, [ callback ], utils) => {
  // apply filter on element collection
  // allways return wrapped HTMLCollection
};

const map = (node, adapter, [ callback, wrapNodes = true ], utils) => {
  // apply map on element collection
  // if wrapNodes in FALSE, will generate normal Array with RAW results in it
  // if wrapNodes in TRUE, will generate wrapped HTMLCollection and put all result into it
};

const reduce = (node, adapter, [ callback, head ], utils) => {
  // apply reduce on element collection
};

export default {
  length,
  first,
  filter,
  map,
  reduce,
};
