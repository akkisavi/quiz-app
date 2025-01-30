import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Card, CardContent } from "@mui/material";

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuizData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/quiz");
        const data = await res.json();
        console.log("Fetched Quiz Data:", data); // Debugging
        if (!data.questions || data.questions.length === 0) {
          throw new Error("No quiz data available");
        }
        setQuestions(data.questions); // Access the questions directly
      } catch (error) {
        console.error("Error fetching quiz data:", error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getQuizData();
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion]?.correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (questions.length === 0) {
    return <div>No quiz data available.</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg bg-white">
        {showResult ? (
          <CardContent>
            <h2 className="text-xl font-bold text-center">Quiz Completed!</h2>
            <p className="text-center text-lg">
              Your score: {score} / {questions.length}
            </p>
          </CardContent>
        ) : (
          <CardContent>
            <h2 className="text-lg font-bold mb-4">
              Question {currentQuestion + 1}:
            </h2>
            <p className="mb-4">
              {questions[currentQuestion]?.description || "No description available"}
            </p>
            <div className="flex flex-col space-y-2">
              {questions[currentQuestion]?.options?.map((option, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded-md text-left ${
                    selectedOption === option ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <Button
              className="mt-4 w-full"
              onClick={handleNext}
              disabled={!selectedOption}
            >
              {currentQuestion + 1 === questions.length ? "Finish" : "Next"}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default QuizApp;
