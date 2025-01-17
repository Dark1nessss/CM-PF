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
        subPages: [{
            title: { 
                type: String, 
                required: true 
            },
        pages: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Page' 
        }],
        }],
    }
);

module.exports = mongoose.model('Favorite', FavoriteSchema);
