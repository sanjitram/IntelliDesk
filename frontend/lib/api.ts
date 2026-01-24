// API configuration and service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types matching your backend Ticket model
export interface BackendTicket {
  _id: string;
  ticketId: string;
  customer: {
    email: string;
    domain?: string;
  };
  content: {
    subject: string;
    original_body: string;
  };
  classification: {
    category: string;
    confidence_score: number;
    severity: 'P1' | 'P2' | 'P3' | 'P4';
    sla?: string;
    sentiment?: string;
    flags?: {
      is_yelling?: boolean;
      is_followup?: boolean;
      has_urgent_punctuation?: boolean;
    };
  };
  resolution: {
    status: 'No_Match' | 'Suggestion_Sent' | 'Auto_Resolved' | 'Manual_Intervention';
    linked_faq_id?: string;
  };
  thread: Array<{
    sender: 'Customer' | 'AI_Agent' | 'Human_Agent';
    message: string;
    timestamp: string;
  }>;
  status: 'New' | 'In_Progress' | 'Auto-Replied' | 'Resolved' | 'Closed';
  is_escalated: boolean;
  createdAt: string;
  updatedAt: string;
}

// Frontend-friendly ticket type (transformed from backend)
export interface Ticket {
  ticketId: string;
  subject: string;
  category: string;
  categoryConfidence: number;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  slaRemaining: string;
  status: string;
  customer: {
    email: string;
    domain: string;
  };
  classification: {
    sentiment?: string;
    flags?: {
      is_yelling?: boolean;
      is_followup?: boolean;
      has_urgent_punctuation?: boolean;
    };
  };
  resolution: {
    status: string;
    linked_faq_id?: string;
  };
  thread: Array<{
    id: string;
    sender: string;
    role: 'customer' | 'support' | 'system';
    timestamp: string;
    message: string;
  }>;
  is_escalated: boolean;
  createdAt: string;
}

// Transform backend ticket to frontend format
export function transformTicket(backendTicket: BackendTicket): Ticket {
  return {
    ticketId: backendTicket.ticketId,
    subject: backendTicket.content.subject,
    category: backendTicket.classification.category,
    categoryConfidence: backendTicket.classification.confidence_score,
    severity: backendTicket.classification.severity,
    slaRemaining: backendTicket.classification.sla || 'N/A',
    status: backendTicket.status,
    customer: {
      email: backendTicket.customer.email,
      domain: backendTicket.customer.domain || '',
    },
    classification: {
      sentiment: backendTicket.classification.sentiment,
      flags: backendTicket.classification.flags,
    },
    resolution: {
      status: backendTicket.resolution.status,
      linked_faq_id: backendTicket.resolution.linked_faq_id,
    },
    thread: backendTicket.thread.map((msg, index) => ({
      id: `msg-${index}`,
      sender: msg.sender,
      role: msg.sender === 'Customer' ? 'customer' : 'support',
      timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: msg.message,
    })),
    is_escalated: backendTicket.is_escalated,
    createdAt: backendTicket.createdAt,
  };
}

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(response.status, error.message || 'Request failed');
  }

  return response.json();
}

// API functions

// Get all tickets
export async function getTickets(): Promise<Ticket[]> {
  const response = await fetchApi<{ data: { tickets: BackendTicket[] } }>('/tickets');
  return response.data.tickets.map(transformTicket);
}

// Get single ticket by ID
export async function getTicketById(ticketId: string): Promise<Ticket> {
  const response = await fetchApi<{ data: { ticket: BackendTicket } }>(`/tickets/${ticketId}`);
  return transformTicket(response.data.ticket);
}

// Create a new ticket
export async function createTicket(data: {
  subject: string;
  body: string;
  customerEmail: string;
  customerDomain?: string;
}): Promise<Ticket> {
  const response = await fetchApi<{ data: { ticket: BackendTicket } }>('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return transformTicket(response.data.ticket);
}

// Reply to a ticket
export async function replyToTicket(data: {
  ticketId: string;
  message: string;
  sender?: string;
}): Promise<Ticket> {
  const response = await fetchApi<{ data: { ticket: BackendTicket } }>('/tickets/reply', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return transformTicket(response.data.ticket);
}

// Health check
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  return fetchApi('/health');
}
