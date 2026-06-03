const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const DB_PATH = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

// --- Helper Functions ---
function readUsers() {
    try {
        if (!fs.existsSync(DB_PATH)) return [];
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (err) { return []; }
}

function writeUsers(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (err) { return false; }
}

// --- API Routes ---
app.post('/api/login', (req, res) => {
    const { identifier, password } = req.body;
    const users = readUsers();
    const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);
    if (!user) return res.status(401).json({ success: false, message: 'Login gagal!' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
});

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = readUsers();
    if (users.some(u => u.username === username)) return res.status(409).json({ success: false, message: 'User sudah ada!' });
    users.push({ username, email, password, phone: "", language: "Bahasa Indonesia", role: "standard" });
    writeUsers(users);
    res.status(201).json({ success: true, message: 'Daftar berhasil!' });
});

app.put('/api/profile', (req, res) => {
    const { currentUsername, username, email, phone, language } = req.body;
    let users = readUsers();
    const idx = users.findIndex(u => u.username === currentUsername);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    
    users[idx] = { ...users[idx], username: username || users[idx].username, email: email || users[idx].email, phone, language };
    writeUsers(users);
    res.json({ success: true, message: 'Profil diperbarui!' });
});

// --- API AI ---
app.post('/api/ai', async (req, res) => {
    const { messages, system } = req.body;
    const API_KEY = process.env.OPEN_AI_KEY; 

    if (!API_KEY) return res.status(500).json({ success: false, message: 'API Key belum di-set.' });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'system', content: system || 'Halo' }, ...messages.slice(-10)]
            })
        });

        const data = await response.json();
        if (data.choices) {
            res.json({ success: true, content: [{ text: data.choices[0].message.content }] });
        } else {
            res.status(500).json({ success: false, message: 'Gagal mendapatkan respon AI.' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Penting untuk Vercel
module.exports = app;