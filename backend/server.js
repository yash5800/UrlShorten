require('dotenv').config();

const { mageSchema } = require('./scheme');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { generateHashedShortcode } = require('./lib');
const { exists } = require('fs');

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Model
const Mage = mongoose.model("Mage", mageSchema);

//Insert 
function insertUrl(originalUrl, shortcode) {
    const newUrl = new Mage({
        original_url: originalUrl,
        shortcode: shortcode
    });
    return newUrl.save();
}

app.post('/login',async (req, res) => {
    const { username, password } = req.body;

    // Validate user credentials (this is just a placeholder, implement your own logic)
    if (username === 'admin' && password === 'admin') {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
})

// Get all URLs
app.get('/api/urls', async (req, res) => {
    try {
        const urls = await Mage.find();
        res.json(urls);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// shorten a URL
app.post('/api/shorten', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    
    // Check if URL already exists in database
    try {
        const existingUrl = await Mage.findOne({ original_url: url });
        if (existingUrl) {
            console.log('URL already exists, returning existing shortcode:', existingUrl.shortcode);
            return res.json({ exists: true, shortcode: existingUrl.shortcode });
        }
    } catch (error) {
        console.error('Error checking existing URL:', error);
    }
    
    // Generate hash-based shortcode
    let shortcode = generateHashedShortcode(url);
    let isUnique = false;
    let attempts = 0;
    let salt = '';
    
    while (!isUnique && attempts < 10) {
        const hashInput = url + salt;
        shortcode = generateHashedShortcode(hashInput);
        
        try {
            const existing = await Mage.findOne({ shortcode: shortcode });
            if (!existing) {
                isUnique = true;
            } else {
                salt = attempts.toString(); 
            }
        } catch (error) {
            console.error('Error checking shortcode uniqueness:', error);
        }
        attempts++;
    }
    
    if (!isUnique) {
        return res.status(500).json({ error: 'Failed to generate unique shortcode' });
    }
    
    try {
        await insertUrl(url, shortcode);
        console.log('Hash-based shortcode generated:', shortcode);
        res.json({ exists: false, shortcode });
    } catch (error) {
        console.error('Error saving URL:', error);
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Shortcode already exists, please try again' });
        }
        return res.status(500).json({ error: 'Failed to save URL' });
    }
})

// redirect to the original URL based on shortcode
app.get('/:shortcode', async (req, res) => {
    const { shortcode } = req.params;
    if (!shortcode) {
        return res.status(400).json({ error: 'Shortcode is required' });
    }

    try {
        // Find the URL by shortcode and increment views
        const urlData = await Mage.findOneAndUpdate(
            { shortcode: shortcode },
            { $inc: { views: 1 } },
            { new: true }
        );
        
        if (!urlData) {
            return res.status(404).json({ error: 'Shortcode not found' });
        }
        
        console.log('Redirecting to:', urlData.original_url);
        res.redirect(urlData.original_url);
    } catch (error) {
        console.error('Error finding URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.delete('/delete/:shortcode', async (req, res) => {
    const { shortcode } = req.params;
    if (!shortcode) {
        return res.status(400).json({ error: 'Shortcode is required' });
    }

    try {
        const result = await Mage.deleteOne({ shortcode: shortcode });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Shortcode not found' });
        }
        console.log('Shortcode deleted successfully:', shortcode);
        res.json({ message: 'Shortcode deleted successfully' });
    } catch (error) {
        console.error('Error deleting shortcode:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Clean up any invalid data (run this once to fix duplicate key issues)
app.get('/api/cleanup', async (req, res) => {
    try {
        // Remove documents with null or empty shortcode
        const result = await Mage.deleteMany({ 
            $or: [
                { shortcode: null },
                { shortcode: "" },
                { shortcode: { $exists: false } }
            ]
        });
        res.json({ message: `Cleaned up ${result.deletedCount} invalid documents` });
    } catch (error) {
        console.error('Error during cleanup:', error);
        res.status(500).json({ error: 'Cleanup failed' });
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});