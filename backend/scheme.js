import mongoose from "mongoose";

// Schema
export const mageSchema = new mongoose.Schema({
        original_url: { 
          type: String,
          required: true 
        },
        shortcode: { 
          type: String,
          required: true,
          unique: true
        },
        views: { 
            type: Number, 
            default: 0 
        }
});