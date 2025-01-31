import { useEffect, useState } from "react";
import React from "react";
import toast from "react-hot-toast";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { LuLoaderCircle } from "react-icons/lu";

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuizData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/quiz");
        const data = await res.json();

        if (!data.questions || data.questions.length === 0) {
          throw new Error("No quiz data available");
        }

        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching quiz data:", error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getQuizData();
  }, []);

  const handleOptionSelect = (questionIndex, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: optionId,
    }));
  };

  const handleSubmit = () => {
    //----------checking if all the questions are answered or not-----------------
    if (Object.keys(selectedOptions).length !== questions.length) {
      toast.error("Please select an option for all questions.");
      return;
    }

    let calculatedScore = 0;
    questions.forEach((question, index) => {
      const selectedOptionId = selectedOptions[index];
      const correctOption = question.options.find((opt) => opt.is_correct);

      if (
        selectedOptionId &&
        String(selectedOptionId) === String(correctOption.id)
      ) {
        calculatedScore++;
      }
    });

    if(calculatedScore === 10){
      toast.success("🎉 Congratulations! You have completed the quiz.");
    }else{
      toast.error("😔 Better luck next time!");
    }
    setScore(calculatedScore);
    setShowResult(true);
  };

  const handleRetry = () => {
    setSelectedOptions({});
    setScore(0);
    setShowResult(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl">
        <LuLoaderCircle className="animate-spin text-white text-6xl mb-4" />
        Loading...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center text-xl text-gray-800">
        No quiz data available.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-br from-blue-500 to-purple-600">
      {showResult ? (
        <div className="mb-10 text-center p-8 bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-lg w-full max-w-lg border border-white">
          <h2 className="text-3xl font-bold text-white">🎉 Quiz Completed!</h2>
          <p className="text-lg mt-4 text-white font-semibold">
            Your score:{" "}
            <span className="text-yellow-300">
              {score} / {questions.length}
            </span>
          </p>
          <Button
            className="mt-6 w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-lg p-8 border border-white">
          <h2 className="text-3xl font-bold text-white text-center border-b-2 border-white pb-2 mb-2">
            📝 Quiz Time!
          </h2>
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="mb-6 p-4 bg-white bg-opacity-25 backdrop-blur-lg rounded-lg shadow-md border border-white"
            >
              <p className="font-semibold text-lg text-white">
                {index + 1}. {question.description}
              </p>
              <RadioGroup
                value={selectedOptions[index] || ""}
                onChange={(e) => handleOptionSelect(index, e.target.value)}
              >
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio className="text-white" />}
                    label={
                      <span className="text-white text-lg">
                        {option.description}
                      </span>
                    }
                    className="mt-2"
                  />
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button
            className="mt-6 w-full bg-green-300 !text-white font-semibold p-3 rounded-lg hover:bg-green-600 transition-all duration-300 "
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
