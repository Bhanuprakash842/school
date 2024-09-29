import dbConnect from '../../../lib/dbConnect';
import MockTest from '../../../models/MockTest';

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const test = await MockTest.findById(id);
        res.status(200).json({ success: true, data: test });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'PUT': // Edit a mock test
      try {
        const updatedTest = await MockTest.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedTest });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'DELETE': // Delete a mock test
      try {
        await MockTest.findByIdAndDelete(id);
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
