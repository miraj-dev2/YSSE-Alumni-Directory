import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { AlumniProfile, PaginatedAlumniQuery } from '../types/admin';
import { alumniApi } from '../api/alumniApi';

export const useAlumniAdmin = () => {
  const [query, setQuery] = useState<PaginatedAlumniQuery>({
    page: 1,
    pageSize: 8,
    search: '',
    batch: 'all',
    wing: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [items, setItems] = useState<AlumniProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlumni = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await alumniApi.getAlumniList(query);
      setItems(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alumni');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  const updateQuery = (patch: Partial<PaginatedAlumniQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...patch,
      page: patch.page !== undefined ? patch.page : 1, // reset page on filter change unless page explicitly provided
    }));
  };

  const toggleSort = (field: 'name' | 'batch' | 'wing' | 'organization') => {
    setQuery((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const createAlumnus = async (data: Omit<AlumniProfile, 'id' | 'status'>) => {
    const res = await alumniApi.createAlumnus(data);
    await fetchAlumni();
    return res;
  };

  const updateAlumnus = async (id: string, data: Partial<AlumniProfile>) => {
    const res = await alumniApi.updateAlumnus(id, data);
    await fetchAlumni();
    return res;
  };

  const deleteAlumnus = async (id: string) => {
    await alumniApi.deleteAlumnus(id);
    await fetchAlumni();
  };

  const exportCsv = async () => {
    // Fetch all records matching the current filters (large page size)
    const allMatches = await alumniApi.getAlumniList({
      ...query,
      page: 1,
      pageSize: 9999,
    });
    const csvData = allMatches.data.map((a) => ({
      Name: a.name,
      Email: a.email,
      Batch: a.batch,
      Wing: a.wing,
      Role: a.currentRole,
      Organization: a.organization,
      Location: a.location,
      LinkedIn: a.linkedinUrl,
      Status: a.status,
    }));
    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ysse_alumni_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    query,
    items,
    total,
    totalPages,
    isLoading,
    error,
    updateQuery,
    toggleSort,
    createAlumnus,
    updateAlumnus,
    deleteAlumnus,
    exportCsv,
    retry: fetchAlumni,
  };
};
