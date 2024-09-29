// pages/api/fees/index.js
import dbConnect from '../../../lib/dbConnect';
import Fee from '../../../models/Fee';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const fees = await Fee.find({});
        res.status(200).json({ success: true, data: fees });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const fee = new Fee(req.body);
        await fee.save();
        res.status(201).json({ success: true, data: fee });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        const fee = await Fee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!fee) {
          return res.status(404).json({ success: false, message: 'Fee not found' });
        }
        res.status(200).json({ success: true, data: fee });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const fee = await Fee.findByIdAndDelete(id);
        if (!fee) {
          return res.status(404).json({ success: false, message: 'Fee not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
