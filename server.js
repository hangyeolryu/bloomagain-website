const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: '다시, 봄 (Dasi, Bom) - Gentle connections, at your pace',
    description: '50세 이상을 위한 따뜻한 동반자 앱'
  });
});

app.get('/privacy', (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy - 다시, 봄 (Dasi, Bom)',
    description: 'Privacy Policy for BloomAgain Korea app'
  });
});

app.get('/terms', (req, res) => {
  res.render('terms', {
    title: 'Terms of Service - 다시, 봄 (Dasi, Bom)',
    description: 'Terms of Service for BloomAgain Korea app'
  });
});

app.get('/delete-account', (req, res) => {
  res.render('delete-account', {
    title: 'Account Deletion - 다시, 봄 (Dasi, Bom)',
    description: 'How to delete your BloomAgain Korea account'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`BloomAgain website running on http://localhost:${PORT}`);
});
