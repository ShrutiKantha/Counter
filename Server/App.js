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

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    counters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Counter' }]
});
const User = mongoose.model('User', userSchema);

const counterSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    myCount: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'counters' });
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

app.post('/auth/storeUser', async (req, res) => {
    try {
        const { user } = req.body;
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
            const newUser = await new User({ email: user.email }).save();
            const counter = await new Counter({ user: newUser._id }).save();
            newUser.counters.push(counter);
            await newUser.save();
            res.json({ message: 'User information stored successfully', user: newUser });
        } else {
            res.json({ message: 'User already exists', user: existingUser });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/counter/increment', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).populate('counters');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const counter = user.counters[0];
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
        const user = await User.findOne({ email }).populate('counters');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const counter = user.counters[0];
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
        const user = await User.findOne({ email }).populate('counters');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const counter = user.counters[0];
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
        const user = await User.findOne({ email }).populate('counters');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const counter = user.counters[0];
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
