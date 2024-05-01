const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://kanthashruti:shruti@cluster0.un8ghpb.mongodb.net/')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

    const counterSchema = new mongoose.Schema({
        email: { type: String, required: true }, // Add email field to associate the counter with the user's email
        count: { type: Number, default: 0 },
        myCount: { type: Number, default: 0 },
    });
    
const Counter = mongoose.model('Counter', counterSchema);

app.get('/api/counter', async (req, res) => {
    console.log("Reached GET method");
    try {
        const counter = await Counter.findOne();
        console.log(counter);
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Modify the '/auth/storeUser' endpoint to create a counter directly
app.post('/auth/storeUser', async (req, res) => {
    try {
        const { user } = req.body;
        const existingCounter = await Counter.findOne({ email: user.email });
        if (!existingCounter) {
            const newCounter = await new Counter({ email: user.email }).save(); // Create counter directly
            res.json({ message: 'User information stored successfully', counter: newCounter });
        } else {
            res.json({ message: 'Counter already exists', counter: existingCounter });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Modify the '/api/counter/increment' endpoint to find counter by email
app.post('/api/counter/increment', async (req, res) => {
    try {
        const { email } = req.body;
        const counter = await Counter.findOne({ email });
        if (!counter) return res.status(404).json({ message: 'Counter not found' });
        counter.count++;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/decrement', async (req, res) => {
    try {
        const { email } = req.body;
        const counter = await Counter.findOne({ email });
        if (!counter) return res.status(404).json({ message: 'Counter not found' });
        counter.count--;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


app.post('/api/counter/Myincrement', async (req, res) => {
    try {
        const { email } = req.body;
        const counter = await Counter.findOne({ email });
        if (!counter) return res.status(404).json({ message: 'Counter not found' });
        counter.myCount++;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/Mydecrement', async (req, res) => {
    try {
        const { email } = req.body;
        const counter = await Counter.findOne({ email });
        if (!counter) return res.status(404).json({ message: 'Counter not found' });
        counter.myCount--;
        await counter.save();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
