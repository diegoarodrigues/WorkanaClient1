const data = require('../bucket.json').bucket;

// Map media by name for quick lookups when resolving file fields
const mediaMap = new Map((data.media || []).map(m => [m.name, m]));

// Build full url and imgix_url similar to Cosmic's response
const buildFileObject = name => {
  const media = mediaMap.get(name);
  if (!media) return { url: name, imgix_url: name };
  const baseUrl = `${media.location}/${data.slug}/${media.name}`;
  const imgixUrl = `https://imgix.cosmicjs.com/${data.slug}/${media.name}`;
  return { url: baseUrl, imgix_url: imgixUrl };
};

// Recursively convert the Cosmic "metafields" array into the
// "metadata" object structure returned by the API. Supports repeater
// fields and nested objects.
const parseFields = (fields = []) => {
  const metadata = {};
  fields.forEach(field => {
    if (field.type === 'repeater') {
      metadata[field.key] = (field.children || []).map(child =>
        parseFields(child.children || [])
      );
    } else if (field.type === 'file') {
      metadata[field.key] = buildFileObject(field.value);
    } else if (field.children && field.children.length) {
      metadata[field.key] = parseFields(field.children);
    } else {
      metadata[field.key] = field.value;
    }
  });
  return metadata;
};

const objects = (data.objects || []).map(obj => ({
  ...obj,
  metadata: parseFields(obj.metafields)
}));

export default {
  async getObjects() {
    return { objects };
  },
  async getObject({ slug }) {
    return { object: objects.find(o => o.slug === slug) };
  },
  async addObject(obj) {
    objects.push(obj);
    return { object: obj };
  }
};
