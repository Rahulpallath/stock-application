// src/services/portfolioService.js
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE = 'https://tio4o7kn76.execute-api.us-east-2.amazonaws.com/dev';

export const saveUserData = async (userId, dataType, data) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();

    const response = await fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ dataType, data }),
    });

    const result = await response.json();
    console.log('✅ Saved to DB:', result);
  } catch (err) {
    console.error('❌ Error saving user data:', err);
  }
};

export const getUserData = async (userId, dataType) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();

    const response = await fetch(`${API_BASE}/portfolio?dataType=${dataType}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const result = await response.json();
    console.log('📦 Fetched from DB:', result);
    return result;
  } catch (err) {
    console.error('❌ Error fetching user data:', err);
    return null;
  }
};
