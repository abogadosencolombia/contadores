import { Preference, ArcoRequest } from '@/types/privacy';

export const getPreferences = async (): Promise<Preference[]> => {
  const response = await fetch('/api/privacy/preferences');
  if (!response.ok) {
    throw new Error('Failed to fetch preferences');
  }
  return response.json();
};

export const updatePreference = async (preference: Partial<Preference>): Promise<Preference> => {
  const response = await fetch('/api/privacy/preferences', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preference),
  });
  if (!response.ok) {
    throw new Error('Failed to update preference');
  }
  return response.json();
};

export const createArcoRequest = async (data: { tipo: string; detalle: string }): Promise<ArcoRequest> => {
  const response = await fetch('/api/privacy/arco', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create ARCO request');
  }
  return response.json();
};

export const getArcoHistory = async (): Promise<ArcoRequest[]> => {
  const response = await fetch('/api/privacy/arco');
  if (!response.ok) {
    throw new Error('Failed to fetch ARCO history');
  }
  return response.json();
};
