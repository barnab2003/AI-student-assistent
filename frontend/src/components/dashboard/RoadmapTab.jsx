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
    <div className="max-w-4xl mx-auto font-mono text-[#bac2de]">
      {/* Conditional: Do they need a roadmap, or do they already have one? */}
      {!roadmap || roadmap?.modules?.length === 0 || showGenerator ? (
        
        /* --- THE GENERATOR FORM (Cyber-Zen Redesign) --- */
        <div className="p-8 md:p-10 bg-[#111818] rounded-2xl border border-[#313244] shadow-2xl text-center mt-4">
          <div className="w-16 h-16 bg-[#1a2322] border border-[#313244] rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-[#f38ba8]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#bac2de] mb-3 tracking-tight">
            Design Your <span className="text-[#89dceb]">AI Learning Path</span>
          </h1>
          <p className="text-[#bac2de]/70 font-medium mb-10 max-w-lg mx-auto text-sm">
            Tell us what you want to master, and our AI will build a custom day-by-day curriculum for you.
          </p>
          
          <form onSubmit={handleGenerateAI} className="space-y-6 text-left max-w-xl mx-auto">
            <div>
              <label className="block text-xs font-semibold text-[#89dceb] uppercase tracking-wider mb-2">
                What do you want to learn?
              </label>
              <input 
                type="text" required placeholder="e.g., Python for Data Science, Advanced React..."
                className="w-full p-4 bg-[#1a2322] border border-[#313244] rounded-lg outline-none focus:border-[#f38ba8] focus:ring-1 focus:ring-[#f38ba8] text-[#bac2de] transition-all placeholder:text-[#bac2de]/40"
                value={genParams.track}
                onChange={(e) => setGenParams({...genParams, track: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#89dceb] uppercase tracking-wider mb-2">
                In how many days?
              </label>
              <input 
                type="number" required min="7" max="180"
                className="w-full p-4 bg-[#1a2322] border border-[#313244] rounded-lg outline-none focus:border-[#f38ba8] focus:ring-1 focus:ring-[#f38ba8] text-[#bac2de] transition-all placeholder:text-[#bac2de]/40"
                value={genParams.daysToComplete}
                onChange={(e) => setGenParams({...genParams, daysToComplete: e.target.value})}
              />
            </div>
            
            <button 
              type="submit" disabled={isGenerating}
              className="w-full flex items-center justify-center bg-[#f38ba8] text-[#111818] font-bold text-lg py-4 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? <Loader2 className="animate-spin mr-2" size={24} /> : 'Generate My Roadmap'}
            </button>

            {/* Cancel button */}
            {roadmap?.modules?.length > 0 && (
              <button 
                type="button" 
                onClick={() => setShowGenerator(false)}
                className="w-full flex items-center justify-center bg-[#1a2322] text-[#bac2de] border border-[#313244] font-semibold py-4 rounded-lg hover:bg-[#313244]/50 hover:text-[#f38ba8] transition-all mt-4 text-sm"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

      ) : (

        /* --- THE ACTUAL ROADMAP CHECKLIST (Cyber-Zen Redesign) --- */
        <div className="space-y-8">
          
          {/* Main Roadmap Header (Responsive Redesign) */}
          <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-6 bg-[#111818] p-6 md:p-8 rounded-2xl border border-[#313244] shadow-lg">
            
            {/* Title with flex-1 and break-words so it doesn't push buttons out */}
            <h1 className="text-2xl md:text-3xl font-bold flex-1 min-w-0 break-words text-[#bac2de]">
              <span className="text-[#89dceb]">Your</span> {roadmap.track} <span className="text-[#89dceb]">Roadmap</span>
            </h1>
            
            {/* Button container with flex-wrap and shrink-0 */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={() => setShowGenerator(true)} 
                className="flex-1 md:flex-none justify-center flex items-center text-sm font-semibold bg-[#1a2322] text-[#bac2de] border border-[#313244] px-5 py-2.5 rounded-lg hover:border-[#f38ba8] hover:text-[#f38ba8] transition-all"
              >
                New Roadmap
              </button>
              <button 
                onClick={handleRecalculate} 
                disabled={isRecalculating} 
                className="flex-1 md:flex-none justify-center flex items-center text-sm font-bold bg-[#f38ba8] text-[#111818] px-5 py-2.5 rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-all"
              >
                {isRecalculating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />} Re-route
              </button>
            </div>
            
          </div>

          {/* Modules Array */}
          {roadmap.modules.map((mod, idx) => (
            <div key={idx} className="bg-[#111818] p-6 md:p-8 rounded-2xl border border-[#313244]">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#89dceb] border-b border-[#313244] pb-3 inline-block">
                {mod.moduleName}
              </h2>
              <ul className="space-y-4">
                {mod.tasks.map((task) => (
                  <li 
                    key={task.taskId} 
                    className={`flex flex-col p-5 rounded-xl cursor-pointer border transition-all ${
                      task.isCompleted 
                        ? 'bg-[#1a2322] border-[#89dceb]/50 opacity-70 scale-[0.99]' 
                        : 'bg-[#1a2322] border-[#313244] hover:border-[#f38ba8]/60 hover:shadow-md'
                    }`}
                    onClick={() => handleToggleTask(task.taskId, mod.moduleName)}
                  >
                    <div className="flex items-start md:items-center w-full">
                      {task.isCompleted ? (
                        <CheckCircle className="text-[#89dceb] mr-4 flex-shrink-0 mt-1 md:mt-0" size={24} />
                      ) : (
                        <Circle className="text-[#313244] mr-4 flex-shrink-0 mt-1 md:mt-0" size={24} />
                      )}
                      
                      <div className="flex-1">
                        <span className={`block text-base md:text-lg font-semibold ${task.isCompleted ? 'line-through text-[#bac2de]/50' : 'text-[#bac2de]'}`}>
                          {task.title}
                        </span>
                        <span className={`text-xs font-semibold mt-2 inline-block px-2 py-1 rounded-md border ${
                          task.isCompleted 
                            ? 'bg-[#111818] text-[#89dceb] border-[#89dceb]/30' 
                            : 'bg-[#111818] text-[#bac2de]/70 border-[#313244]'
                        }`}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Resource Badges */}
                    {task.resources && task.resources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 md:ml-10" onClick={(e) => e.stopPropagation()}>
                        {task.resources.map((res, rIdx) => (
                          <a
                            key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold bg-[#111818] text-[#89dceb] hover:text-[#f38ba8] hover:border-[#f38ba8] px-3 py-1.5 rounded-md border border-[#313244] transition-colors"
                          >
                            <span className="mr-1.5 opacity-70">📚</span> {res.label}
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