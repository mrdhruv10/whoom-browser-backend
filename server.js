require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
    console.error('Error: YOUTUBE_API_KEY is not set in environment variables');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Whoom Browser API Server',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            search: '/api/search?q=query'
        }
    });
});

// Search endpoint
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 20,
                key: YOUTUBE_API_KEY,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('YouTube API Error:', error.message);
        res.status(500).json({ error: 'Failed to search videos' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
