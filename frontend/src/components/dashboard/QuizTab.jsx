import React, { useState } from 'react';
import { BrainCircuit, Loader2, Trophy, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const QuizTab = ({ currentUser }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // 1. Ask the backend/AI to generate the quiz
  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      // NOTE: Ensure this matches your backend route!
      // Change this line:
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/roadmap/generate-quiz`, { topic });
      setQuizData(res.data.quiz); // Expecting an array of 3 questions
      setCurrentQIndex(0);
      setScore(0);
      setIsFinished(false);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Is your backend running?");
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Handle Answer Selection
  const handleSelectAnswer = (option) => {
    if (isAnswerRevealed) return; // Prevent changing answer
    setSelectedAnswer(option);
    setIsAnswerRevealed(true);

    if (option === quizData[currentQIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  // 3. Move to next question or finish
  const handleNext = () => {
    if (currentQIndex < quizData.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
    } else {
      setIsFinished(true);
      // If perfect score, we could trigger a backend call here to add XP!
      if (score + (selectedAnswer === quizData[currentQIndex].correctAnswer ? 1 : 0) === quizData.length) {
        awardXP();
      }
    }
  };

  const awardXP = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/add-xp`, { username: currentUser.username, xpToAdd: 50 });
      // In a real app, you'd trigger a context/state update here to refresh the user's XP in the Navbar
    } catch (error) {
      console.error("Error adding XP", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      
      {/* Header Banner */}
      <div className="bg-[#191A23] p-8 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] text-white text-center">
        <BrainCircuit className="mx-auto text-[#FF90E8] mb-4" size={48} strokeWidth={2} />
        <h1 className="text-3xl font-black mb-2 tracking-tight">AI <span className="text-[#FF90E8]">Knowledge Check</span></h1>
        <p className="text-gray-400 font-bold">Generate a quick 3-question quiz on any topic. Score 100% to earn +50 XP!</p>
      </div>

      {/* STATE 1: GENERATE QUIZ FORM */}
      {!quizData && !isGenerating && (
        <form onSubmit={handleGenerateQuiz} className="bg-white p-8 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-4">
          <label className="block text-sm font-black text-black uppercase tracking-wider">What do you want to test?</label>
          <input
            type="text"
            placeholder="e.g., React Hooks, Big O Notation, DNS..."
            className="w-full p-4 border-2 border-black rounded-xl outline-none focus:ring-4 focus:ring-[#FF90E8] text-black font-medium transition-all text-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-black text-[#FF90E8] border-2 border-black font-black text-lg py-4 rounded-xl shadow-[6px_6px_0px_rgba(255,144,232,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(255,144,232,1)] transition-all">
            Generate Quiz
          </button>
        </form>
      )}

      {/* STATE 2: LOADING SCREEN */}
      {isGenerating && (
        <div className="bg-white p-12 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-[#FF90E8]" size={64} />
          <h2 className="text-xl font-black animate-pulse">Consulting the AI Gods...</h2>
        </div>
      )}

      {/* STATE 3: ACTIVE QUIZ */}
      {quizData && !isFinished && (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-black uppercase tracking-widest bg-[#FF90E8] px-3 py-1 rounded-md border-2 border-black">Question {currentQIndex + 1} of {quizData.length}</span>
            <span className="font-bold text-gray-500">Score: {score}</span>
          </div>

          <h2 className="text-2xl font-black text-black leading-tight">{quizData[currentQIndex].question}</h2>

          <div className="space-y-3">
            {quizData[currentQIndex].options.map((option, idx) => {
              let btnClass = "bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50";
              
              if (isAnswerRevealed) {
                if (option === quizData[currentQIndex].correctAnswer) {
                  btnClass = "bg-[#B9FF66] border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"; // Correct
                } else if (option === selectedAnswer) {
                  btnClass = "bg-red-400 border-black text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"; // Wrong selection
                } else {
                  btnClass = "bg-gray-100 border-gray-300 text-gray-400 opacity-50"; // Other wrong options
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={isAnswerRevealed}
                  className={`w-full text-left p-4 rounded-xl border-2 font-bold text-lg transition-all ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {isAnswerRevealed && (
            <button onClick={handleNext} className="w-full flex justify-center items-center gap-2 bg-black text-white font-black p-4 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all mt-4">
              {currentQIndex < quizData.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight size={20} />
            </button>
          )}
        </div>
      )}

      {/* STATE 4: QUIZ FINISHED */}
      {isFinished && (
        <div className="bg-white p-10 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] text-center space-y-6">
          <Trophy className={`mx-auto ${score === quizData.length ? 'text-[#FFD700]' : 'text-gray-400'}`} size={64} />
          
          <div>
            <h2 className="text-4xl font-black text-black mb-2">You scored {score}/{quizData.length}</h2>
            {score === quizData.length ? (
              <p className="text-[#40c463] font-bold text-lg">Flawless victory! +50 XP has been added to your profile.</p>
            ) : (
              <p className="text-gray-600 font-bold text-lg">Good effort! Try again to hit 100% and earn XP.</p>
            )}
          </div>

          <button onClick={() => { setQuizData(null); setTopic(''); }} className="bg-[#FF90E8] text-black border-2 border-black px-8 py-4 rounded-xl font-black text-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all w-full md:w-auto">
            Take Another Quiz
          </button>
        </div>
      )}

    </div>
  );
};

export default QuizTab;