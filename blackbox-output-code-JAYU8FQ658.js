import connectToDatabase from '../../../lib/mongodb';
import Agent from '../../../models/Agent';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  await connectToDatabase();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const agents = await Agent.find({}).populate('creator', 'name');
      res.status(200).json(agents);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching agents' });
    }
  } else if (req.method === 'POST') {
    if (session.user.role !== 'creator') {
      return res.status(403).json({ message: 'Only creators can add agents' });
    }

    const { title, description, features, category, price, image } = req.body;
    try {
      const agent = new Agent({
        title,
        description,
        features,
        category,
        price,
        image,
        creator: session.user.id,
      });
      await agent.save();
      res.status(201).json(agent);
    } catch (error) {
      res.status(500).json({ message: 'Error creating agent' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}