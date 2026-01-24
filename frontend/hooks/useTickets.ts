"use client";

import { useState, useEffect, useCallback } from 'react';
import { getTickets, getTicketById, createTicket, replyToTicket, Ticket, ApiError } from '@/lib/api';

interface UseTicketsReturn {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTickets(): UseTicketsReturn {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch tickets';
      setError(message);
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refetch: fetchTickets };
}

interface UseTicketReturn {
  ticket: Ticket | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTicket(ticketId: string | null): UseTicketReturn {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(async () => {
    if (!ticketId) {
      setTicket(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTicketById(ticketId);
      setTicket(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to fetch ticket';
      setError(message);
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  return { ticket, loading, error, refetch: fetchTicket };
}

interface UseCreateTicketReturn {
  createNewTicket: (data: { subject: string; body: string; customerEmail: string; customerDomain?: string }) => Promise<Ticket | null>;
  loading: boolean;
  error: string | null;
}

export function useCreateTicket(): UseCreateTicketReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewTicket = useCallback(async (data: { subject: string; body: string; customerEmail: string; customerDomain?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const ticket = await createTicket(data);
      return ticket;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create ticket';
      setError(message);
      console.error('Error creating ticket:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createNewTicket, loading, error };
}

interface UseReplyTicketReturn {
  sendReply: (data: { customerEmail: string; question: string; answer: string }) => Promise<{ sent: boolean } | null>;
  loading: boolean;
  error: string | null;
}

export function useReplyTicket(): UseReplyTicketReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendReply = useCallback(async (data: { customerEmail: string; question: string; answer: string }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await replyToTicket(data);
      return result;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to send reply';
      setError(message);
      console.error('Error replying to ticket:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendReply, loading, error };
}
