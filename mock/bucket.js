const bucketData = require('../bucket.json');

export default {
  async getObjects() {
    return { objects: bucketData.objects };
  },
  async getObject({ slug }) {
    return { object: bucketData.objects.find(o => o.slug === slug) };
  },
  async addObject(obj) {
    bucketData.objects.push(obj);
    return { object: obj };
  }
};
