// API Base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ========== DANCES ==========

export async function getDances() {
  try {
    const response = await fetch(`${BASE_URL}/dances`);
    if (!response.ok) {
      throw new Error(`Failed to fetch dances: ${response.status}`);
    }
    const data = await response.json();
    console.log("API Response from /dances:", data);
    return data;
  } catch (error) {
    console.error('Error fetching dances:', error);
    throw error;
  }
}

export async function getDanceDetail(id: string) {
  try {
    const response = await fetch(`${BASE_URL}/dances/${id}`);
    if (!response.ok) {
      throw new Error(`Dance not found: ${response.status}`);
    }
    const data = await response.json();
    console.log(`API Response from /dances/${id}:`, data);
    return data;
  } catch (error) {
    console.error('Error fetching dance detail:', error);
    throw error;
  }
}

// ========== MUDRAS ==========

export async function getMudraInfo(mudraName: string) {
  try {
    const response = await fetch(`${BASE_URL}/mudras/${mudraName}`);
    if (!response.ok) {
      throw new Error(`Mudra not found: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching mudra info:', error);
    return null;
  }
}

export async function detectMudra(imageBlob: Blob) {
  try {
    const formData = new FormData();
    formData.append('frame', imageBlob);

    const response = await fetch(`${BASE_URL}/detect-mudra`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Detection failed: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error detecting mudra:', error);
    return null;
  }
}

// ========== HEALTH CHECK ==========

export async function healthCheck() {
  try {
    const response = await fetch(`${BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
