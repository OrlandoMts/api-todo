// remove-version-key-plugin.ts
import { Schema } from 'mongoose';

// Plugin to remove the __v field
export function removeVersionKeyPlugin(schema: Schema) {
  schema.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    },
  });
}
