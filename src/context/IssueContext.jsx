import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as issueService from '../services/issueService.js';

const IssueContext = createContext(null);

export function IssueProvider({ children }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    issueService
      .getIssues()
      .then((data) => {
        if (active) setIssues(data);
      })
      .catch(() => {
        if (active) setError('Failed to load issues.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addIssue = useCallback(async (data) => {
    const created = await issueService.createIssue(data);
    setIssues((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateIssue = useCallback(async (id, changes) => {
    const updated = await issueService.updateIssue(id, changes);
    setIssues((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }, []);

  const removeIssue = useCallback(async (id) => {
    await issueService.deleteIssue(id);
    setIssues((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const value = useMemo(
    () => ({ issues, loading, error, addIssue, updateIssue, removeIssue }),
    [issues, loading, error, addIssue, updateIssue, removeIssue]
  );

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
}

export function useIssues() {
  const ctx = useContext(IssueContext);
  if (!ctx) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return ctx;
}
