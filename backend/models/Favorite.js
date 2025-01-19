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
        ownerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        pages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Page',
            },
        ],
        subPages: [{
            title: { 
                type: String, 
                required: true 
            },
        }],
    }
);

module.exports = mongoose.model('Favorite', FavoriteSchema);
