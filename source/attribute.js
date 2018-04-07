export const ATTRIBUTE_KEY = '$';
export const getAttribute = (node, adapter, [name]) => adapter.getAttributeValue(node, name);
