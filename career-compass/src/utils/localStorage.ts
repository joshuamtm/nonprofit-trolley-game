import { UserData } from '../types';
import { initialUserData } from '../data/initialData';

const STORAGE_KEY = 'career-compass-data';

export const loadUserData = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Convert date strings back to Date objects
      data.lastUpdated = new Date(data.lastUpdated);
      data.dailyActions = data.dailyActions.map((action: any) => ({
        ...action,
        date: new Date(action.date)
      }));
      return data;
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return initialUserData;
};

export const saveUserData = (data: UserData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const clearUserData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};