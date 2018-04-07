const on = (node, adapter, [eventType, callback]) => {
  node = adapter.toNode(node);
  node.addEventListener(eventType, callback);
  return () => node.removeEventListener(eventType, callback);
};

const off = (node, adapter, [eventType, callback]) => {
  adapter
    .toNode(node)
    .removeEventListener(eventType, callback);
};

const emmit = (node, adapter, [event]) => {
  adapter
    .toNode(node)
    .dispatchEvent(event instanceof Event ? event : new Event(String(event)));
};

export default {
  on,
  off,
  emmit,
};
