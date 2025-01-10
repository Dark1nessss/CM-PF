const mongoose = require('mongoose');

const SubPageSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
    }
);

const FavoriteSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
    subPages: [SubPageSchema],
    }
);

module.exports = mongoose.model('Favorite', FavoriteSchema);
