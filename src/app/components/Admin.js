import React, { useState } from 'react';
import Login from './Login';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [fileName, setFileName] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  // Handle file name input change
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  // Fetch selected JSON file content
  const handleFetchFile = () => {
    fetch(`/data/${fileName}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('File not found.');
        }
        return res.json();
      })
      .then((data) => setQuizData(data))
      .catch((error) => alert(error.message));
  };

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    setIsLoggedIn(false);
  };

  // Handle adding a new question
  const handleAddQuestion = () => {
    if (!newQuestion.text || newQuestion.options.some(opt => !opt) || !newQuestion.correctAnswer) return;

    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { id: (prev.questions.length + 1).toString(), ...newQuestion }
      ]
    }));
    setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' });
  };

  // Handle removing a question
  const handleRemoveQuestion = (id) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id)
    }));
  };

  // Handle updating the question text, options, or correct answer
  const handleUpdateQuestion = (id, field, value) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className='flex justify-center'>
      <div className="p-6 bg-gray-900 min-h-screen max-w-screen-lg">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Admin Dashboard</h1>
          <form className="space-y-4 mb-6" onSubmit={handleLogout}>
            <button
              type="submit"
              className="w-auto text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Input box to enter JSON file name */}
        <div className="mb-6">
          <input
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            placeholder="Enter JSON file name"
            className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleFetchFile}
            className="mt-2 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Load File
          </button>
        </div>

        {/* Display selected JSON file questions */}
        {quizData && (
          <div className="bg-gray-900 text-gray-900  rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">{quizData.paperName}</h2>
            {quizData.questions.map((question) => (
              <div key={question.id} className="mt-4 p-4 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleUpdateQuestion(question.id, 'text', e.target.value)}
                  className="w-full mb-2 p-2 text-white bg-gray-900 border-0 roun"
                  placeholder="Question text"
                />
                {question.options.map((option, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={option}
                    onChange={(e) => handleUpdateQuestion(question.id, `options[${idx}]`, e.target.value)}
                    className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
                    placeholder={`Option ${idx + 1}`}
                  />
                ))}
                <p className='text-white'>Correct answer</p>
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) => handleUpdateQuestion(question.id, 'correctAnswer', e.target.value)}
                  className="w-full mb-2 p-2 border-0 bg-lime-400  rounded-lg"
                  placeholder="Correct Answer"
                />
                <button
                  onClick={() => handleRemoveQuestion(question.id)}
                  className="mt-2 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 font-medium rounded-lg px-4 py-2"
                >
                  Remove Question
                </button>
              </div>
            ))}

            {/* Add a new question form */}
            <div className="mt-8 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Add New Question</h3>
              <input
                type="text"
                placeholder="Question text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
              />
              {newQuestion.options.map((option, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={option}
                  onChange={(e) =>
                    setNewQuestion((prev) => {
                      const updatedOptions = [...prev.options];
                      updatedOptions[idx] = e.target.value;
                      return { ...prev, options: updatedOptions };
                    })
                  }
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
                />
              ))}
              <p className='text-white'>Correct answer</p>
              <input
                type="text"
                placeholder="Correct Answer"
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                className="w-full mb-2 p-2 border-0 bg-lime-400 rounded-lg"
              />
              <button
                onClick={handleAddQuestion}
                className="mt-2 w-full text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium rounded-lg px-4 py-2"
              >
                Add Question
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
