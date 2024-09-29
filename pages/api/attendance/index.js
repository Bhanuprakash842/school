// /pages/api/attendance/index.js
import dbConnect from '../../../lib/dbConnect';
import Attendance from '../../../models/Attendance';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { studentId, date } = req.query;

    // Fetch attendance for specific student and date
    if (studentId && date) {
      try {
        const attendance = await Attendance.find({ studentId, date });
        return res.status(200).json(attendance);
      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    // Fetch all attendance records if no filters are applied
    try {
      const attendance = await Attendance.find({});
      return res.status(200).json(attendance);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { teacherId, studentId, date, status } = req.body;

    try {
      const existingRecord = await Attendance.findOne({ studentId, date });
      if (existingRecord) {
        // Update existing attendance record
        existingRecord.status = status;
        await existingRecord.save();
        return res.status(200).json({ success: true, data: existingRecord });
      } else {
        // Create new attendance record
        const newAttendance = new Attendance({ teacherId, studentId, date, status });
        await newAttendance.save();
        return res.status(201).json({ success: true, data: newAttendance });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { studentId, date } = req.query;
    if (!studentId || !date) {
      return res.status(400).json({ error: 'Student ID and date are required' });
    }

    try {
      await Attendance.deleteOne({ studentId, date });
      res.status(204).end(); // No Content
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
