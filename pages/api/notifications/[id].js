// pages/api/notifications/[id].js
import dbConnect from '../../../lib/dbConnect';
import Notification from '../../../models/Notification';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'PUT') {
    if (!id) {
      return res.status(400).json({ success: false, message: 'Notification ID is required' });
    }

    try {
      const notification = await Notification.findById(id);

      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }

      // Update the read status to true
      notification.read = true;
      await notification.save();

      res.status(200).json({ success: true, message: 'Notification marked as read', notification });
    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
