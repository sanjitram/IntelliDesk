import React, { useState } from "react";
import { Ticket } from "@/data/mockData";
import { Wand2, Send, Edit3, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export function ResponsePreview({ ticket }: { ticket: Ticket }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const stepsList = ticket.aiResponse.steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
  const defaultBody = `${ticket.aiResponse.greeting || "Hi,"}\n\nThanks for reaching out about ticket #${ticket.ticketId}. Our AI has analyzed your request and we understand this is a ${ticket.severity} issue concerning "${ticket.subject}".\n\nSuggested Resolution Steps:\n${stepsList}\n\nWe are committed to resolving this within ${ticket.slaRemaining}.\n\nBased on similar issues, this solution has a ${ticket.aiResponse.successRate} success rate.\n\nBest regards,\nIntelliDesk Support`;

  const [responseBody, setResponseBody] = useState(defaultBody);

  return (
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
           <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-md">
             <Wand2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
           </div>
           <div>
               <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Suggested Response</h3>
               <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Confidence: 94%</span>
                  <span>•</span>
                  <span>Avg Resolution: {ticket.aiResponse.avgResolutionTime}</span>
               </div>
           </div>
           <button className="ml-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
           </button>
        </div>
        
        {!isCollapsed && (
        <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <AlertTriangle className="w-3.5 h-3.5" />
                Escalate
            </button>
            <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? "Cancel Edit" : "Edit"}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm shadow-green-200 dark:shadow-none transition-colors">
                <Send className="w-3.5 h-3.5" />
                Send Response
            </button>
        </div>
        )}
      </div>

      {!isCollapsed && (
      <div className="relative">
        <textarea
            readOnly={!isEditing}
            value={responseBody}
            onChange={(e) => setResponseBody(e.target.value)} 
            className={`w-full h-[200px] p-4 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono leading-relaxed
                ${isEditing 
                    ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-inner" 
                    : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                }`}
        />
        {!isEditing && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded border border-green-100 dark:border-green-900/50">
                <CheckCircle2 className="w-3 h-3" />
                AI Generated
            </div>
        )}
      </div>
      )}
    </div>
  );
}
