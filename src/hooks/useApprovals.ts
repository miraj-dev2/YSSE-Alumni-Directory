import { useState, useEffect, useCallback, useRef } from 'react';
import { AlumniProfile, AlumniStatus } from '../types/admin';
import { alumniApi } from '../api/alumniApi';

export const useApprovals = (initialStatus: AlumniStatus = 'PENDING') => {
  const [activeTab, setActiveTab] = useState<AlumniStatus>(initialStatus);
  const [items, setItems] = useState<AlumniProfile[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Backup for optimistic rollback
  const backupRef = useRef<AlumniProfile[]>([]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alumniApi.getApprovalsList(activeTab);
      setItems(data);
      backupRef.current = data;
      setSelectedIds(new Set());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load approvals');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const approveSingle = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    const prev = [...items];
    // Optimistic remove from pending or update
    setItems((curr) => curr.filter((i) => i.id !== id));
    try {
      await alumniApi.approveAlumnus(id);
      return true;
    } catch {
      setItems(prev); // Rollback on error
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectSingle = async (id: string, reason: string): Promise<boolean> => {
    setIsSubmitting(true);
    const prev = [...items];
    setItems((curr) => curr.filter((i) => i.id !== id));
    try {
      await alumniApi.rejectAlumnus(id, reason);
      return true;
    } catch {
      setItems(prev); // Rollback
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveBulk = async (): Promise<boolean> => {
    if (selectedIds.size === 0) return false;
    setIsSubmitting(true);
    const ids = Array.from(selectedIds);
    const prev = [...items];
    setItems((curr) => curr.filter((i) => !selectedIds.has(i.id)));
    try {
      await alumniApi.bulkApprove(ids);
      setSelectedIds(new Set());
      return true;
    } catch {
      setItems(prev); // Rollback
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectBulk = async (reason: string): Promise<boolean> => {
    if (selectedIds.size === 0) return false;
    setIsSubmitting(true);
    const ids = Array.from(selectedIds);
    const prev = [...items];
    setItems((curr) => curr.filter((i) => !selectedIds.has(i.id)));
    try {
      await alumniApi.bulkReject(ids, reason);
      setSelectedIds(new Set());
      return true;
    } catch {
      setItems(prev); // Rollback
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    items,
    selectedIds,
    isLoading,
    isSubmitting,
    error,
    toggleSelect,
    toggleSelectAll,
    approveSingle,
    rejectSingle,
    approveBulk,
    rejectBulk,
    retry: fetchItems,
  };
};
