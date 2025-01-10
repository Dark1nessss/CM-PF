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
        subPages: [SubPageSchema],
    }
);

module.exports = mongoose.model('OtherPage', OtherPageSchema);
