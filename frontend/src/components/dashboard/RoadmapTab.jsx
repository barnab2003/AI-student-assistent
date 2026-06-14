import React from 'react';
import { Sparkles, CheckCircle, Circle, Loader2 } from 'lucide-react';

const RoadmapTab = ({
  roadmap,
  showGenerator,
  setShowGenerator,
  isGenerating,
  genParams,
  setGenParams,
  handleGenerateAI,
  isRecalculating,
  handleRecalculate,
  handleToggleTask
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Conditional: Do they need a roadmap, or do they already have one? */}
      {!roadmap || roadmap?.modules?.length === 0 || showGenerator ? (
        
        /* --- THE GENERATOR FORM (Brutalist Redesign) --- */
        <div className="p-10 bg-white rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] text-center mt-4">
          <div className="w-20 h-20 bg-[#B9FF66] border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-black text-black mb-3 tracking-tight">Design Your AI Learning Path</h1>
          <p className="text-gray-600 font-medium mb-10 max-w-lg mx-auto">Tell us what you want to master, and our AI will build a custom day-by-day curriculum for you.</p>
          
          <form onSubmit={handleGenerateAI} className="space-y-6 text-left max-w-xl mx-auto">
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-wider mb-2">What do you want to learn?</label>
              <input 
                type="text" required placeholder="e.g., Python for Data Science, Advanced React..."
                className="w-full p-4 border-2 border-black rounded-xl outline-none focus:ring-4 focus:ring-[#B9FF66] text-black font-medium transition-all"
                value={genParams.track}
                onChange={(e) => setGenParams({...genParams, track: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-wider mb-2">In how many days?</label>
              <input 
                type="number" required min="7" max="180"
                className="w-full p-4 border-2 border-black rounded-xl outline-none focus:ring-4 focus:ring-[#B9FF66] text-black font-medium transition-all"
                value={genParams.daysToComplete}
                onChange={(e) => setGenParams({...genParams, daysToComplete: e.target.value})}
              />
            </div>
            
            <button 
              type="submit" disabled={isGenerating}
              className="w-full flex items-center justify-center bg-[#B9FF66] text-black border-2 border-black font-black text-lg py-4 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] disabled:bg-gray-200 disabled:shadow-none transition-all"
            >
              {isGenerating ? <Loader2 className="animate-spin mr-2" size={24} /> : 'Generate My Roadmap'}
            </button>

            {/* Cancel button */}
            {roadmap?.modules?.length > 0 && (
              <button 
                type="button" 
                onClick={() => setShowGenerator(false)}
                className="w-full flex items-center justify-center bg-white text-black border-2 border-black font-black py-4 rounded-xl hover:bg-gray-50 transition-all mt-4"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

      ) : (

        /* --- THE ACTUAL ROADMAP CHECKLIST (Brutalist Redesign) --- */
        <div className="space-y-8">
          
          {/* Main Roadmap Header */}
          {/* Main Roadmap Header (Responsive Redesign) */}
          <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-6 bg-[#191A23] p-6 md:p-8 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] text-white">
            
            {/* Title with flex-1 and break-words so it doesn't push buttons out */}
            <h1 className="text-2xl md:text-3xl font-black flex-1 min-w-0 break-words">
              <span className="text-[#B9FF66]">Your</span> {roadmap.track} <span className="text-[#B9FF66]">Roadmap</span>
            </h1>
            
            {/* Button container with flex-wrap and shrink-0 */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0">
              <button onClick={() => setShowGenerator(true)} className="flex-1 md:flex-none justify-center flex items-center text-sm font-bold bg-white text-black border-2 border-black px-5 py-2.5 rounded-xl shadow-[2px_2px_0px_rgba(185,255,102,1)] hover:translate-y-[2px] hover:shadow-none transition-all">
                New Roadmap
              </button>
              <button onClick={handleRecalculate} disabled={isRecalculating} className="flex-1 md:flex-none justify-center flex items-center text-sm font-bold bg-[#B9FF66] text-black border-2 border-black px-5 py-2.5 rounded-xl shadow-[2px_2px_0px_rgba(255,255,255,1)] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 transition-all">
                {isRecalculating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />} Re-route
              </button>
            </div>
            
          </div>

          {/* Modules Array */}
          {roadmap.modules.map((mod, idx) => (
            <div key={idx} className="bg-[#191A23] p-6 md:p-8 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black mb-6 text-[#B9FF66] border-b-4 border-black pb-3 inline-block">{mod.moduleName}</h2>
              <ul className="space-y-4">
                {mod.tasks.map((task) => (
                  <li 
                    key={task.taskId} 
                    className={`flex flex-col p-5 rounded-2xl cursor-pointer border-2 transition-all ${
                      task.isCompleted 
                        ? 'bg-[#B9FF66] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] scale-[1.01]' 
                        : 'bg-white border-black hover:bg-gray-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]'
                    }`}
                    onClick={() => handleToggleTask(task.taskId, mod.moduleName)}
                  >
                    <div className="flex items-start md:items-center w-full">
                      {task.isCompleted ? <CheckCircle className="text-black mr-4 flex-shrink-0 mt-1 md:mt-0" size={28} /> : <Circle className="text-gray-400 mr-4 flex-shrink-0 mt-1 md:mt-0" size={28} />}
                      
                      <div className="flex-1">
                        <span className={`block text-lg font-bold ${task.isCompleted ? 'line-through text-black/60' : 'text-black'}`}>
                          {task.title}
                        </span>
                        <span className={`text-sm font-bold mt-1 inline-block px-2 py-0.5 rounded-md border ${task.isCompleted ? 'bg-black text-[#B9FF66] border-black' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Resource Badges */}
                    {task.resources && task.resources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 md:ml-11" onClick={(e) => e.stopPropagation()}>
                        {task.resources.map((res, rIdx) => (
                          <a
                            key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-bold bg-[#191A23] text-white hover:text-[#B9FF66] px-3 py-1.5 rounded-lg border-2 border-black transition-colors"
                          >
                            <span className="mr-1.5">📚</span> {res.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapTab;