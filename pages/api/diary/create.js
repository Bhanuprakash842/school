import dbConnect from '../../../lib/dbConnect'; // Adjust this import based on your db connection file
import DiaryEntry from '../../../models/DiaryEntry';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { subject, date, content, teacherId, classSelected, sectionSelected } = req.body;

    try {
      // Validate inputs
      if (!subject || !date || !content || !teacherId || !classSelected || !sectionSelected) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      const newDiary = new DiaryEntry({
        subject,
        date,
        content,
        teacherId,
        classSelected,
        sectionSelected,
      });

      await newDiary.save();
      return res.status(201).json({ success: true, data: newDiary });
    } catch (error) {
      console.error('Error saving diary entry:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
