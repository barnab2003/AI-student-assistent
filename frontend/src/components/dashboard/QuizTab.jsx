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
    <div className="max-w-2xl mx-auto space-y-8 pb-10 font-mono text-[#bac2de]">
      
      {/* Header Banner */}
      <div className="bg-[#111818] p-8 rounded-2xl border border-[#313244] shadow-lg text-center">
        <BrainCircuit className="mx-auto text-[#f38ba8] mb-4" size={48} strokeWidth={1.5} />
        <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight text-white">
          AI <span className="text-[#89dceb]">Knowledge Check</span>
        </h1>
        <p className="text-[#bac2de]/70 text-sm max-w-md mx-auto">
          Generate a quick 3-question quiz on any topic. Score 100% to earn +50 XP!
        </p>
      </div>

      {/* STATE 1: GENERATE QUIZ FORM */}
      {!quizData && !isGenerating && (
        <form onSubmit={handleGenerateQuiz} className="bg-[#111818] p-8 rounded-2xl border border-[#313244] shadow-lg space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#89dceb] uppercase tracking-wider mb-2">
              What do you want to test?
            </label>
            <input
              type="text"
              placeholder="e.g., React Hooks, Big O Notation, DNS..."
              className="w-full p-4 bg-[#1a2322] border border-[#313244] rounded-lg outline-none focus:border-[#f38ba8] focus:ring-1 focus:ring-[#f38ba8] text-[#bac2de] transition-all placeholder:text-[#bac2de]/40 text-base"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#f38ba8] text-[#111818] font-bold text-lg py-3.5 rounded-lg hover:bg-opacity-90 transition-all">
            Generate Quiz
          </button>
        </form>
      )}

      {/* STATE 2: LOADING SCREEN */}
      {isGenerating && (
        <div className="bg-[#111818] p-12 rounded-2xl border border-[#313244] shadow-lg flex flex-col items-center justify-center space-y-5">
          <Loader2 className="animate-spin text-[#f38ba8]" size={56} />
          <h2 className="text-lg font-semibold text-[#89dceb] animate-pulse">Consulting the AI Gods...</h2>
        </div>
      )}

      {/* STATE 3: ACTIVE QUIZ */}
      {quizData && !isFinished && (
        <div className="bg-[#111818] p-6 md:p-8 rounded-2xl border border-[#313244] shadow-lg space-y-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#1a2322] text-[#89dceb] px-3 py-1.5 rounded-md border border-[#313244]">
              Question {currentQIndex + 1} of {quizData.length}
            </span>
            <span className="font-semibold text-[#bac2de]/70 text-sm">Score: {score}</span>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed mb-6">
            {quizData[currentQIndex].question}
          </h2>

          <div className="space-y-3">
            {quizData[currentQIndex].options.map((option, idx) => {
              // Default Cyber-Zen Button styling
              let btnClass = "bg-[#1a2322] text-[#bac2de] border-[#313244] hover:border-[#89dceb] hover:text-[#89dceb]";
              
              if (isAnswerRevealed) {
                if (option === quizData[currentQIndex].correctAnswer) {
                  // Correct selection (Soft cyan highlight)
                  btnClass = "bg-[#89dceb]/10 border-[#89dceb] text-[#89dceb] shadow-[0_0_10px_rgba(137,220,235,0.2)]"; 
                } else if (option === selectedAnswer) {
                  // Wrong selection (Coral pink highlight)
                  btnClass = "bg-[#f38ba8]/10 border-[#f38ba8] text-[#f38ba8]"; 
                } else {
                  // Other wrong options fade out
                  btnClass = "bg-[#111818] border-[#313244] text-[#bac2de]/30 opacity-50 cursor-not-allowed"; 
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={isAnswerRevealed}
                  className={`w-full text-left p-4 rounded-xl border font-semibold text-sm md:text-base transition-all ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {isAnswerRevealed && (
            <button 
              onClick={handleNext} 
              className="w-full flex justify-center items-center gap-2 bg-[#89dceb] text-[#111818] font-bold p-3.5 rounded-lg hover:bg-opacity-90 transition-all mt-6"
            >
              {currentQIndex < quizData.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}

      {/* STATE 4: QUIZ FINISHED */}
      {isFinished && (
        <div className="bg-[#111818] p-10 rounded-2xl border border-[#313244] shadow-lg text-center space-y-6">
          <Trophy className={`mx-auto ${score === quizData.length ? 'text-[#f38ba8]' : 'text-[#bac2de]/30'}`} size={56} strokeWidth={1.5} />
          
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">You scored {score}/{quizData.length}</h2>
            {score === quizData.length ? (
              <p className="text-[#89dceb] font-semibold text-sm md:text-base">Flawless victory! +50 XP has been added to your profile.</p>
            ) : (
              <p className="text-[#bac2de]/70 text-sm md:text-base">Good effort. Try again to hit 100% and earn XP.</p>
            )}
          </div>

          <div className="pt-4">
            <button 
              onClick={() => { setQuizData(null); setTopic(''); }} 
              className="bg-[#f38ba8] text-[#111818] font-bold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all w-full md:w-auto"
            >
              Initialize New Quiz
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuizTab;