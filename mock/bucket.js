const data = require('../bucket.json').bucket;

function parseFields(fields = []) {
  const metadata = {};
  fields.forEach(field => {
    metadata[field.key] = field.value;
  });
  return metadata;
}

module.exports = {
  async getObjects() {
    const objects = (data.objects || []).map(obj =>
      Object.assign({}, obj, { metadata: parseFields(obj.metafields) })
    );
    return { objects };
  },

  async getObject(params = {}) {
    const slug = params.slug;
    const object = (data.objects || []).find(o => o.slug === slug);
    return {
      object: object
        ? Object.assign({}, object, { metadata: parseFields(object.metafields) })
        : null
    };
  },

  async addObject(newObj = {}) {
    const object = Object.assign({}, newObj, {
      metadata: parseFields(newObj.metafields || [])
    });
    return { object };
  }
};
