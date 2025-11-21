import { Preference, ArcoRequest, AdminArcoRequest } from '@/types/privacy';

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

// Admin Functions
export const getAllArcoRequests = async (): Promise<AdminArcoRequest[]> => {
  const response = await fetch('/api/admin/privacy/arco');
  if (!response.ok) {
    throw new Error('Failed to fetch all ARCO requests for admin');
  }
  return response.json();
};

export const resolveArcoRequest = async (
  id: number, 
  data: { estado: 'RESUELTO' | 'RECHAZADO', evidencia_respuesta?: string, detalle_resolucion?: string }
): Promise<AdminArcoRequest> => {
  const response = await fetch(`/api/admin/privacy/arco/${id}/resolve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to resolve ARCO request');
  }
  return response.json();
};
