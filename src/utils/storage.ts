import { User, Startup } from '../types';

export const getUsers = (): User[] => {
  const users = localStorage.getItem('solace_users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem('solace_users', JSON.stringify(users));
};

export const deleteUser = (userId: string): void => {
  const users = getUsers().filter(u => u.id !== userId);
  localStorage.setItem('solace_users', JSON.stringify(users));
};

export const getStartups = (): Startup[] => {
  const startups = localStorage.getItem('solace_startups');
  return startups ? JSON.parse(startups) : [];
};

export const saveStartup = (startup: Startup): void => {
  const startups = getStartups();
  const existingIndex = startups.findIndex(s => s.id === startup.id);
  
  if (existingIndex >= 0) {
    startups[existingIndex] = startup;
  } else {
    startups.push(startup);
  }
  
  localStorage.setItem('solace_startups', JSON.stringify(startups));
};

export const deleteStartup = (startupId: string): void => {
  const startups = getStartups().filter(s => s.id !== startupId);
  localStorage.setItem('solace_startups', JSON.stringify(startups));
};

export const getUserStartups = (userId: string): Startup[] => {
  return getStartups().filter(startup => startup.userId === userId);
};