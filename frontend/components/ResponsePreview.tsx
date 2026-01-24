import React, { useState, useEffect } from "react";
import { Ticket } from "@/data/mockData";
import { Wand2, Send, Edit3, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export function ResponsePreview({ ticket }: { ticket: Ticket }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Destructure matchScore with a default to avoid errors if missing
  const { matchScore = 0 } = ticket.aiResponse;
  const isHighMatch = matchScore >= 90;
  const isLowMatch = matchScore <= 60;

  const stepsList = ticket.aiResponse.steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
  const defaultBody = `${ticket.aiResponse.greeting || "Hi,"}\n\nThanks for reaching out about ticket #${ticket.ticketId}. Our AI has analyzed your request and we understand this is a ${ticket.severity} issue concerning "${ticket.subject}".\n\nSuggested Resolution Steps:\n${stepsList}\n\nWe are committed to resolving this within ${ticket.slaRemaining}.\n\nBased on similar issues, this solution has a ${ticket.aiResponse.successRate} success rate.\n\nBest regards,\nIntelliDesk Support`;

  const [responseBody, setResponseBody] = useState("");

  // Update effect to handle logic when ticket changes or match score changes
  useEffect(() => {
    if (isLowMatch) {
      // Low confidence: Clear body and force edit mode
      setResponseBody("");
      setIsEditing(true);
    } else {
      // Normal/High confidence: detailed body, read-only initially (unless high match where it stays read-only)
      setResponseBody(defaultBody);
      setIsEditing(false);
    }
  }, [ticket.ticketId, isLowMatch, defaultBody]);

  return (
    <div className="bg-card border-t border-border p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
           <div className="bg-primary/10 p-1.5 rounded-md">
             <Wand2 className="w-5 h-5 text-primary" />
           </div>
           <div>
               <h3 className="text-sm font-bold text-foreground font-[family-name:var(--font-jetbrains-mono)]">AI Suggested Response</h3>
               <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className={isHighMatch ? "text-green-600 font-medium" : isLowMatch ? "text-red-500 font-medium" : ""}>
                    Match Score: {matchScore}%
                  </span>
                  <span>•</span>
                  <span>Avg Resolution: {ticket.aiResponse.avgResolutionTime}</span>
               </div>
           </div>
           <button className="ml-2 text-muted-foreground hover:text-foreground">
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
           </button>
        </div>
        
        {!isCollapsed && (
        <div className="flex gap-2">
            
            {!isHighMatch && (
              <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors"
              >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditing ? "Cancel Edit" : "Edit"}
              </button>
            )}

            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm transition-colors">
                <Send className="w-3.5 h-3.5" />
                Send Email
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
            placeholder={isLowMatch ? "Confidence too low for auto-generation. Please write a response..." : ""}
            className={`w-full h-[200px] p-4 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono leading-relaxed bg-background text-foreground border-border ${!isEditing && "opacity-80"}`}
        />
        {!isEditing && !isLowMatch && (
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
