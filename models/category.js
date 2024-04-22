const { Schema, model } = require('mongoose');

const categorySchema = Schema({
    name: { type: String, required: true },
    color: { type: String, default: '#000000' },
    image: { type: String, required: true }, //might use admin panel for future so setting the type to String wont have a problem if we create an admin dashboard in another platform
    markedForDeletion: { type: Boolean, default: false } //we dont want the category deletion to delete current events so we need to mark them using time deletion

});
categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });
exports.Category = model('Category', categorySchema);