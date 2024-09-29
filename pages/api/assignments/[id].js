import dbConnect from '../../../lib/dbConnect';
import Assignment from '../../../models/Assignment';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const assignment = await Assignment.findById(id);

      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      res.status(200).json(assignment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error while fetching assignment' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { subject, title, description, marks, dueDate, class: className, section } = req.body;

      // Validate all required fields
      if (!subject || !title || !description || !marks || !dueDate || !className || !section) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Update the assignment
      const updatedAssignment = await Assignment.findByIdAndUpdate(
        id,
        {
          subject,
          title,
          description,
          marks,
          dueDate,
          class: className,
          section,
        },
        { new: true, runValidators: true }
      );

      if (!updatedAssignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      res.status(200).json({ success: true, assignment: updatedAssignment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating the assignment' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedAssignment = await Assignment.findByIdAndDelete(id);

      if (!deletedAssignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      res.status(200).json({ success: true, message: 'Assignment deleted successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting the assignment' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
