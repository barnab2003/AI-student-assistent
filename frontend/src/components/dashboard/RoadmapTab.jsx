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
        
        /* --- THE GENERATOR FORM --- */
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center mt-4">
          <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Your AI Learning Path</h1>
          <p className="text-gray-500 mb-8">Tell us what you want to master, and our AI will build a day-by-day curriculum for you.</p>
          
          <form onSubmit={handleGenerateAI} className="space-y-6 text-left max-w-xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What do you want to learn?</label>
              <input 
                type="text" required placeholder="e.g., Python for Data Science, Advanced React..."
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={genParams.track}
                onChange={(e) => setGenParams({...genParams, track: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">In how many days?</label>
              <input 
                type="number" required min="7" max="180"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={genParams.daysToComplete}
                onChange={(e) => setGenParams({...genParams, daysToComplete: e.target.value})}
              />
            </div>
            
            <button 
              type="submit" disabled={isGenerating}
              className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {isGenerating ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Generate My Roadmap'}
            </button>

            {/* Cancel button: Only show if they already have a roadmap and are just trying to make a new one */}
            {roadmap?.modules?.length > 0 && (
              <button 
                type="button" 
                onClick={() => setShowGenerator(false)}
                className="w-full flex items-center justify-center bg-gray-100 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors mt-2"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

      ) : (

        /* --- THE ACTUAL ROADMAP CHECKLIST --- */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Your {roadmap.track} Roadmap</h1>
            <div className="flex space-x-2">
              <button onClick={() => setShowGenerator(true)} className="flex items-center text-sm font-semibold bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                New Roadmap
              </button>
              <button onClick={handleRecalculate} disabled={isRecalculating} className="flex items-center text-sm font-semibold bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                {isRecalculating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />} Re-route
              </button>
            </div>
          </div>

          {roadmap.modules.map((mod, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">{mod.moduleName}</h2>
              <ul className="space-y-3">
                {mod.tasks.map((task) => (
                  <li 
                    key={task.taskId} 
                    className={`flex flex-col p-4 rounded-lg cursor-pointer transition-colors ${task.isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleToggleTask(task.taskId, mod.moduleName)}
                  >
                    <div className="flex items-center w-full">
                      {task.isCompleted ? <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={24} /> : <Circle className="text-gray-300 mr-3 flex-shrink-0" size={24} />}
                      <span className={`flex-1 text-lg ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.title}</span>
                      <span className="text-sm text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>

                    {/* Resource Badges */}
                    {task.resources && task.resources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-9" onClick={(e) => e.stopPropagation()}>
                        {task.resources.map((res, rIdx) => (
                          <a
                            key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-2.5 py-1 rounded-md border border-gray-200 transition-colors"
                          >
                            <span className="mr-1">📚</span> {res.label}
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