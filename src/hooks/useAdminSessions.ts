import { useState, useEffect, useCallback } from 'react';
import { SessionRequest, SessionStatus } from '../types/admin';
import { sessionApi } from '../api/sessionApi';

export const useAdminSessions = () => {
  const [sessions, setSessions] = useState<SessionRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | SessionStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await sessionApi.getSessionRequests();
      setSessions(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const acceptSession = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const updated = await sessionApi.acceptSessionRequest(id);
      setSessions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return true;
    } catch {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const markDone = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const updated = await sessionApi.markSessionDone(id);
      setSessions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return true;
    } catch {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    statusFilter === 'all' ? true : s.status === statusFilter
  );

  return {
    sessions: filteredSessions,
    totalCount: sessions.length,
    statusFilter,
    setStatusFilter,
    isLoading,
    isSubmitting,
    error,
    acceptSession,
    markDone,
    retry: fetchSessions,
  };
};
