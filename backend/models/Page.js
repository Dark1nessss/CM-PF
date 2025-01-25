// Page schema for Notion-like structure
const mongoose = require('mongoose');

// Schema for blocks (content types such as text, images, videos, etc.)
const BlockSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['text', 'image', 'video', 'audio'], 
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

// Page schema
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
  content: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Block' 
  }],
  lastEditedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Page = mongoose.model('Page', PageSchema);
const Block = mongoose.model('Block', BlockSchema);

module.exports = { Page, Block };