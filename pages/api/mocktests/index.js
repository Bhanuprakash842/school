import dbConnect from '../../../lib/dbConnect';
import MockTest from '../../../models/MockTest';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Fetch all mock tests
      try {
        const mockTests = await MockTest.find();
        res.status(200).json({ success: true, data: mockTests });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'POST': // Create a new mock test
      try {
        const newTest = new MockTest(req.body);
        await newTest.save();
        res.status(201).json({ success: true, data: newTest });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Method not allowed' });
      break;
  }
}
