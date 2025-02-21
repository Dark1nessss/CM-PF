const mongoose = require('mongoose');

const SubPageSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        subPages: [{
             title: { 
                type: String, 
                required: false 
            } 
        }],
    }
);

const OtherPageSchema = new mongoose.Schema(
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
                ref: 'Block',
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

module.exports = mongoose.model('OtherPage', OtherPageSchema);
