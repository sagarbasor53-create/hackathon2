import { supabase } from '../lib/supabase.js';
import { seedIssues } from '../data/seedIssues.js';

/*
 * Data access layer.
 * Currently backed by localStorage so the MVP works without a server.
 * To connect a real backend, replace the body of each exported function
 * with a fetch() call (e.g. using import.meta.env.VITE_API_URL).
 * The rest of the app only depends on these function signatures.
 */

const STORAGE_KEY = 'campusfix_issues_v1';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedIssues));
      return [...seedIssues];
    }
    return JSON.parse(raw);
  } catch {
    return [...seedIssues];
  }
}

function save(issues) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  } catch {
    // Ignore storage errors (e.g. private mode / quota)
  }
}

function nextId(issues) {
  const numbers = issues
    .map((i) => parseInt(String(i.id).replace('CF-', ''), 10))
    .filter((n) => !Number.isNaN(n));
  const max = numbers.length ? Math.max(...numbers) : 1000;
  return `CF-${max + 1}`;
}

export async function getIssues() {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    category: issue.category,
    priority: issue.priority,
    status: issue.status,
    location: issue.location,
    reportedBy: issue.reported_by,
    adminNote: issue.admin_note || '',
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
  }));
}


export async function createIssue(data) {
  const now = new Date().toISOString();

  const issue = {
    id: `CF-${Date.now()}`,
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    priority: data.priority,
    status: 'Pending',
    location: data.location.trim(),
    reported_by: data.reportedBy.trim(),
    admin_note: '',
    created_at: now,
    updated_at: now,
  };

  const { data: created, error } = await supabase
    .from('issues')
    .insert(issue)
    .select()
    .single();

  if (error) {
  console.error('SUPABASE ERROR:', error);
  throw error;
}
  return {
    id: created.id,
    title: created.title,
    description: created.description,
    category: created.category,
    priority: created.priority,
    status: created.status,
    location: created.location,
    reportedBy: created.reported_by,
    adminNote: created.admin_note || '',
    createdAt: created.created_at,
    updatedAt: created.updated_at,
  };
}

export async function updateIssue(id, changes) {
  await delay(100);
  const issues = load();
  const index = issues.findIndex((i) => i.id === id);
  if (index === -1) {
    throw new Error('Issue not found');
  }
  const updated = { ...issues[index], ...changes, updatedAt: new Date().toISOString() };
  issues[index] = updated;
  save(issues);
  return updated;
}

export async function deleteIssue(id) {
  await delay(100);
  const issues = load().filter((i) => i.id !== id);
  save(issues);
  return true;
}
