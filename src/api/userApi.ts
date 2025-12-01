/**
 * User API - Shared utilities for fetching user data
 */

export interface User {
  id: number;
  name: string;
  email: string;
  fetchedAt: string; // Server timestamp to prove when data was fetched
}

export const fetchUser = async (userId: number): Promise<User> => {
  console.log(`🌐 Making API call for user ${userId}...`);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const response = await fetch(`${apiUrl}/api/user/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  const data = await response.json();

  // Convert ISO timestamp to local time string
  if (data.fetchedAt) {
    const date = new Date(data.fetchedAt);
    // Check if date is valid
    if (!isNaN(date.getTime())) {
      data.fetchedAt = date.toLocaleTimeString();
    } else {
      console.warn("Invalid date received:", data.fetchedAt);
      // Fallback: if it's already a time string, keep it
      data.fetchedAt = data.fetchedAt;
    }
  }

  console.log(`✅ Received data for user ${userId}:`, data);
  return data;
};
