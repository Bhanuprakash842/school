// pages/api/notifications/index.js
import dbConnect from '../../../lib/dbConnect';
import Notification from '../../../models/Notification';

export default async function handler(req, res) {
    await dbConnect();

    // Log the request method and body for debugging
    console.log('Request Method:', req.method);
    console.log('Request Body:', req.body);

    if (req.method === 'POST') {
        try {
            const notificationData = req.body;

            // You may want to validate the notificationData here before saving
            const notification = new Notification(notificationData);
            await notification.save();
            res.status(201).json({ success: true, notification });
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    } else if (req.method === 'GET') {
        try {
            const notifications = await Notification.find();
            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    } else {
        // Allow only POST and GET methods
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
