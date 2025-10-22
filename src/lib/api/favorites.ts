// 1. CREATE API SERVICE FILE: lib/api/favorites.ts

import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Get auth token from session
async function getAuthToken() {
  const session = await getSession();
  return session?.accessToken;
}

// Fetch all favorites for current user
export async function fetchFavorites() {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/quizzes/favorites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }

    const data = await response.json();
    return data; // Returns array of favorite objects with quizId
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

// Add quiz to favorites
export async function addFavorite(quizId: string) {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/favorite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add favorite');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

// Remove quiz from favorites
export async function removeFavorite(quizId: string) {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/favorite`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }

    return true;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}