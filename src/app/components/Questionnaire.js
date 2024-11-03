'use client';
import React, { useState, useEffect } from 'react';

// Fetch questions from API
const fetchQuestions = async () => {
  const response = await fetch('/api/questions');
  const data = await response.json();
  return data;
};

// Fetch questions from API
const fetchGenQuestions = async () => {
  const response = await fetch('/api/gen_questions');
  const data = await response.json();
  return data;
};

// Submit answers to API
const submitAnswers = async (userID, topic, question_id, answer) => {
  if (topic == 'AWS') {
    var topic_id = 1;
  } else if (topic == 'Snowflake') {
    var topic_id = 2;
  } else if (topic == 'Python') {
    var topic_id = 3;
  } else if (topic == 'Talend') {
    var topic_id = 4;
  } else if (topic == 'SQL') {
    var topic_id = 5;
  }
  try {
    const response = await fetch('/api/submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userID.userID,
        topic_id: topic_id,
        question_type: 'mcq',
        question_id,
        selected_option: answer,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Error submitting answer:', data.error);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
// Submit scores to API
const submitScore = async (userID, final_score) => {
  try {
    const response = await fetch('/api/scoresubmit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userID.userID,
        final_score: final_score,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Error submitting score:', data.error);
      var err = "duplicate key value violates unique constraint \"final_score_pkey\""
      if (data.error == err)
      {
        window.alert("You have already submitted the assessment!")
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);

  }
};

// Questionnaire component
const Questionnaire = ({ userID }) => {
  const [questionsByTopic, setQuestionsByTopic] = useState({});
  const [GenquestionsByTopic, setGenQuestionsByTopic] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      const data = await fetchQuestions();
      setQuestionsByTopic(data);
  }
    loadQuestions();
  }, []);

  useEffect(() => {
    const loadGenQuestions = async () => {
      const data = await fetchGenQuestions();
      setGenQuestionsByTopic(data);
  }
    loadGenQuestions();
  }, []);

  const handleChange = (topic, questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    let score = 0;

    // Calculate score based on answers
    Object.entries(questionsByTopic).forEach(([topic, questions]) => {
      questions.forEach((q) => {
        if (answers[q.question_id] === q.correct_option) {
          score += 1;
        }
      });
    });

    // Submit answers for each question
    Object.entries(questionsByTopic).forEach(([topic, questions]) => {
      questions.forEach((q) => {
        if (answers[q.question_id]) {
          submitAnswers(userID, topic, q.question_id, answers[q.question_id]);
        }
      });
    });

    setMarks(score);
    submitScore(userID, score);
    setSubmitted(true);
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md'>
      {Object.entries(questionsByTopic).map(([topic, questions]) => (
        <div key={topic} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">{topic}</h2>
          {questions.map((question) => (
            <div key={question.question_id} className="mb-4">
              <p className='text-lg font-semibold mb-2'>{question.question}</p>
              {['A', 'B', 'C', 'D'].map((option) => {
                const optionValue = question[`option_${option}`]; // Get the value of the option
                return (
                  <div key={option} className="flex items-center mb-1">
                    <input
                      type="radio"
                      name={question.question_id}
                      value={option}
                      checked={answers[question.question_id] === option}
                      onChange={() => handleChange(topic, question.question_id, option)}
                      className='mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2'
                    />
                    <label className='text-sm'>{option}: {optionValue}</label>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}

    {Object.entries(GenquestionsByTopic).map(([topic, questions]) => (
        <div key={topic} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">{topic}</h2>
          {questions.map((question) => (
            <div key={question.question_id} className="mb-4">
              <p className='text-lg font-semibold mb-2'>{question.question}</p>
              
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit} // Use function reference without parentheses
        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Submit
      </button>
      {submitted && (
        <div className="mt-6 text-center">
          <p className='text-xl font-semibold'>Your score: {marks} / {Object.values(questionsByTopic).reduce((acc, questions) => acc + questions.length, 0)}</p>
        </div>
      )}
    </div>
  );
  
};

export default Questionnaire;
