import React, { useState, useEffect } from 'react';
import mongoose from 'mongoose';

const TClassDiary = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classSelected, setClassSelected] = useState('');
  const [sectionSelected, setSectionSelected] = useState('');
  const [subjectSelected, setSubjectSelected] = useState('');
  const [diaryEntry, setDiaryEntry] = useState('');
  const [diaries, setDiaries] = useState([]);

  // Fetch previous diary entries for the teacher
  useEffect(() => {
    const fetchDiaries = async () => {
      const response = await fetch(`/api/diary/${date}`);
      const result = await response.json();
      if (result.success) setDiaries(result.data);
    };
    fetchDiaries();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newDiary = {
      date,
      subject: subjectSelected,
      content: diaryEntry, // Ensure this matches your schema
      teacherId: new mongoose.Types.ObjectId(), // Replace with actual teacher ID
      classSelected,
      sectionSelected,
    };
  
    // Check if all fields are filled out before submitting
    if (!date || !subjectSelected || !diaryEntry || !classSelected || !sectionSelected) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('/api/diary/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDiary),
      });
  
      if (response.ok) {
        const result = await response.json();
        setDiaries([result.data, ...diaries]);
        alert('Class diary submitted successfully!');
        // Reset form
        setSubjectSelected('');
        setDiaryEntry('');
        setClassSelected('');
        setSectionSelected('');
      } else {
        console.error('Failed to submit diary:', await response.json());
      }
    } catch (error) {
      console.error('Error submitting diary:', error);
    }
  };
  

  return (
    <div className="container mx-auto p-6 bg-gray-100 shadow-md rounded-lg max-w-3xl">
      <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">Upload Class Diary</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Date:</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="class" className="block text-gray-700 font-bold mb-2">Class:</label>
          <select id="class" value={classSelected} onChange={(e) => setClassSelected(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
            <option value="">Select Class</option>
            <option value="I">I</option>
            {/* Add other classes */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="section" className="block text-gray-700 font-bold mb-2">Section:</label>
          <select id="section" value={sectionSelected} onChange={(e) => setSectionSelected(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
            <option value="">Select Section</option>
            <option value="A">A</option>
            {/* Add other sections */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 font-bold mb-2">Subject:</label>
          <select id="subject" value={subjectSelected} onChange={(e) => setSubjectSelected(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
            <option value="">Select Subject</option>
            <option value="english">English</option>
            {/* Add other subjects */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="diary" className="block text-gray-700 font-bold mb-2">Class Diary Entry:</label>
          <textarea id="diary" rows="6" value={diaryEntry} onChange={(e) => setDiaryEntry(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500" placeholder="Enter today's class diary..."></textarea>
        </div>
        <div className="text-center">
          <button type="submit" className="bg-blue-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800">Submit</button>
        </div>
      </form>
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Previously Added Diaries</h3>
        {diaries.length === 0 ? (
          <p className="text-gray-600">No class diaries have been added yet.</p>
        ) : (
          <ul className="space-y-4">
            {diaries.map((diary, index) => (
              <li key={index} className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                <p><strong>Date:</strong> {new Date(diary.date).toLocaleDateString()}</p>
                <p><strong>Class:</strong> {diary.classSelected}</p>
                <p><strong>Section:</strong> {diary.sectionSelected}</p>
                <p><strong>Subject:</strong> {diary.subject}</p>
                <p><strong>Diary Entry:</strong> {diary.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TClassDiary;
