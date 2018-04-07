const on = (node, adapter, [ eventType, callback ], utils) => {
  // add even listener
};

const off = (node, adapter, [ eventType, callback ], utils) => {
  // remove even listener
};

const emmit = (node, adapter, [ event ], utils) => {
  // dispatch event
};

export default {
  on,
  off,
  emmit,
};
