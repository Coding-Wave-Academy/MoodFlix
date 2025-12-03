import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MoodFlix Backend is up and running');
})

app.get('/recommend', (req, res) => {
    
    res.send('Recommendation endpoint');

});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
