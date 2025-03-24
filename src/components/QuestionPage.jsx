import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Utility function to shuffle arrays
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function QuestionPage() {
  const { chapterName } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [mode, setMode] = useState("Objective");
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/data/questions.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch questions.");
        }
        return response.json();
      })
      .then((data) => {
        const selectedChapter = data.find((q) => q.chapter === chapterName);
        if (selectedChapter) {
          const shuffledQuestions = shuffleArray(
            selectedChapter.questions.map((q) => ({
              ...q,
              options: shuffleArray(q.options),
            }))
          );
          setQuestions(shuffledQuestions);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [chapterName, navigate]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setFeedback("Correct! 🎉");
    } else {
      setFeedback(`Wrong! The correct answer is: ${currentQuestion.answer}`);
    }
  };

  const handleSubjectiveSubmit = () => {
    const cleanedUserAnswer = userAnswer.trim().toLowerCase();
    const cleanedCorrectAnswer = currentQuestion.answer.trim().toLowerCase();

    if (cleanedUserAnswer.includes(cleanedCorrectAnswer)) {
      setFeedback("Correct! 🎉");
    } else {
      setFeedback(`Wrong! The correct answer is: ${currentQuestion.answer}`);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setUserAnswer("");
      setFeedback("");
    } else {
      alert("Quiz completed!");
      navigate("/");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(null);
      setUserAnswer("");
      setFeedback("");
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "Objective" ? "Subjective" : "Objective"));
    setFeedback("");
    setUserAnswer("");
    setSelectedOption(null);
  };

  if (loading) {
    return <div className="text-white">Loading Questions...</div>;
  }

  if (error) {
    return <div className="text-white">Error: {error}</div>;
  }

  if (!currentQuestion) {
    return <div className="text-white">No questions found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {/* ... (rest of the code remains the same) */}

      {/* Mode Switch and Back Button */}
      <div className="flex justify-between w-full max-w-xl mb-6">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back to Chapter Select
        </button>

        {/* Mode Switch with Rolling Animation */}
        <div className="flex items-center gap-4">
          <div
            className="w-28 h-14 flex items-center justify-between bg-gray-700 rounded-full relative cursor-pointer p-1"
            onClick={toggleMode}
          >
            {/* Motion Blue Circle with Rolling Effect */}
            <motion.div
              className="absolute w-8 h-8 bg-blue-500 rounded-full"
              initial={{ x: mode === "Objective" ? 4 : 65, rotate: 0 }}
              animate={{
                x: mode === "Objective" ? 4 : 65,
                rotate: mode === "Objective" ? 0 : 360,
              }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 200,
                damping: 18,
              }}
            />

            {/* Icons */}
            <span
              className={`z-10 w-10 h-10 flex items-center justify-center ${
                mode === "Objective" ? "text-white" : "text-gray-400"
              }`}
            >
              ✔️
            </span>
            <span
              className={`z-10 w-10 h-10 flex items-center justify-center ${
                mode === "Subjective" ? "text-white" : "text-gray-400"
              }`}
            >
              📝
            </span>
          </div>
          <span className="text-lg font-semibold">{mode} Mode</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xl mb-6">
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Question Display */}
      <h1 className="text-3xl font-bold mb-8 text-center">
        {currentQuestion.question}
      </h1>

      {/* Objective Mode */}
      {mode === "Objective" ? (
        <div className="w-full max-w-lg">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`w-full p-4 mb-4 rounded-lg text-lg transition-all duration-300 ${
                selectedOption === option
                  ? option === currentQuestion.answer
                    ? "bg-green-600"
                    : "bg-red-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        // Subjective Mode
        <div className="w-full max-w-lg">
          <textarea
            placeholder="Write your answer here..."
            className="w-full p-4 h-40 bg-gray-800 rounded-lg text-white mb-4"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          ></textarea>
          <button
            onClick={handleSubjectiveSubmit}
            className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* Feedback Display */}
      {feedback && (
        <p
          className={`mt-4 text-lg ${
            feedback.includes("Correct") ? "text-green-400" : "text-red-400"
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-8 py-4 bg-gray-600 text-white rounded-lg ${
            currentQuestionIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-700"
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
}

export default QuestionPage;
