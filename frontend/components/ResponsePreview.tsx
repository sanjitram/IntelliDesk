import React, { useState, useEffect } from "react";
import { Ticket, replyToTicket } from "@/lib/api";
import { Wand2, Send, Edit3, CheckCircle2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface ResponsePreviewProps {
  ticket: Ticket;
  onUpdate?: () => void;
}

export function ResponsePreview({ ticket, onUpdate }: ResponsePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [responseBody, setResponseBody] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);

  // Check if there's an AI-generated response in the thread
  const aiResponse = ticket.thread.find(msg => msg.sender === 'AI_Agent');
  const hasAiResponse = !!aiResponse;
  
  // Determine match quality based on resolution status
  const isAutoResolved = ticket.resolution.status === 'Auto_Resolved';
  const hasSuggestion = ticket.resolution.status === 'Suggestion_Sent';
  const matchScore = isAutoResolved ? 95 : hasSuggestion ? 75 : 30;
  const isHighMatch = matchScore >= 90;
  const isLowMatch = matchScore <= 60;

  // Generate default response based on ticket data
  const generateDefaultResponse = () => {
    if (aiResponse) {
      return aiResponse.message;
    }
    return `Hi,\n\nThank you for reaching out regarding: "${ticket.subject}"\n\nOur team is reviewing your request and will get back to you shortly.\n\nTicket ID: ${ticket.ticketId}\nCategory: ${ticket.category}\nSeverity: ${ticket.severity}\n\nBest regards,\nIntelliDesk Support`;
  };

  // Update response when ticket changes
  useEffect(() => {
    if (isLowMatch && !aiResponse) {
      setResponseBody("");
      setIsEditing(true);
    } else {
      setResponseBody(generateDefaultResponse());
      setIsEditing(false);
    }
    setSendError(null);
  }, [ticket.ticketId]);

  const handleSendResponse = async () => {
    if (!responseBody.trim()) {
      setSendError("Please enter a response message");
      return;
    }

    try {
      setIsSending(true);
      setSendError(null);
      
      await replyToTicket({
        customerEmail: ticket.customer.email,
        question: ticket.originalBody || ticket.subject,
        answer: responseBody
      });
      console.log(ticket.customer.email, ticket.originalBody, responseBody);
      
      // Clear the response and refresh ticket data
      setResponseBody("");
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Failed to send response');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-card border-t border-border p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
           <div>
               <h3 className="text-sm font-bold text-foreground font-[family-name:var(--font-jetbrains-mono)]">AI Suggested Response</h3>
               <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className={isHighMatch ? "text-green-600 font-medium" : isLowMatch ? "text-red-500 font-medium" : ""}>
                    Match Score: {matchScore}%
                  </span>
                  <span>•</span>
                  <span>Status: {ticket.resolution.status.replace(/_/g, ' ')}</span>
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
                  disabled={isSending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditing ? "Cancel Edit" : "Edit"}
              </button>
            )}

            <button 
                onClick={handleSendResponse}
                disabled={isSending || !responseBody.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm transition-colors"
            >
                {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {isSending ? 'Sending...' : 'Send Response'}
            </button>
        </div>
        )}
      </div>

      {sendError && (
        <div className="mb-2 p-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded border border-red-200 dark:border-red-800">
          {sendError}
        </div>
      )}

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
