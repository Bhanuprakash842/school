// /pages/api/diary/[date].js
import dbConnect from '../../../lib/dbConnect';
import DiaryEntry from '../../../models/DiaryEntry';

export default async function handler(req, res) {
  const { method } = req;
  const { date } = req.query;

  await dbConnect();

  if (method === 'GET') {
    try {
      const entries = await DiaryEntry.find({ date });
      res.status(200).json({ success: true, data: entries });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
