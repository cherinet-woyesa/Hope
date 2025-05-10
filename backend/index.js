import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 💰 Donation endpoint
app.post('/api/donate', async (req, res) => {
  try {
    const { name, email, amount, message } = req.body;

    const donation = await prisma.donation.create({
      data: {
        name,
        email,
        amount: parseFloat(amount),
        message,
      },
    });

    res.status(201).json(donation);
  } catch (error) {
    console.error('Donation Error:', error);
    res.status(500).json({ error: 'Failed to process donation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// 👇 Add this GET route to list all donations
app.get('/api/donate', async (req, res) => {
    try {
      const donations = await prisma.donation.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ error: 'Failed to fetch donations' });
    }
  });
  