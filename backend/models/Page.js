const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true 
    },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    parentLayer: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'layerType',
        required: true 
    },
    layerType: { 
        type: String, 
        enum: ['Favorite', 'OtherPage'], 
        required: true 
    },
    blocks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Block' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
    lastEditedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
});

const BlockSchema = new mongoose.Schema({
    pageId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Page', required: true 
    },
    type: { 
        type: String, 
        enum: ['text', 'image', 'video'], 
        required: true 
    },
    content: { 
        type: String 
    },
    position: { 
        type: Number, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Page = mongoose.model('Page', PageSchema);
const Block = mongoose.model('Block', BlockSchema);

module.exports = { Page, Block };