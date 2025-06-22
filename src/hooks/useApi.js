// src/hooks/useApi.js
import { useState } from 'react';
import { get, post } from 'aws-amplify/api';

const apiName = 'stocktradingapi';
const path = '/portfolio';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveUserData = async (userId, dataType, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const operation = post({
        apiName: apiName,
        path: path,
        options: {
          body: {
            userId,
            dataType,
            data: JSON.stringify(data),
            updatedAt: new Date().toISOString()
          }
        }
      });
      
      const response = await operation.response;
      const result = await response.body.json();
      return { success: true, data: result };
    } catch (err) {
      console.error('Error saving data:', err);
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async (userId, dataType) => {
    setLoading(true);
    setError(null);
    
    try {
      const operation = get({
        apiName: apiName,
        path: `${path}/${userId}/${dataType}`,
        options: {}
      });
      
      const response = await operation.response;
      const result = await response.body.json();
      
      if (result.body) {
        const bodyData = JSON.parse(result.body);
        return bodyData.data ? JSON.parse(bodyData.data) : null;
      }
      return result.data ? JSON.parse(result.data) : null;
    } catch (err) {
      console.error('Error getting data:', err);
      setError(err.message);
      
      // Return default values based on data type
      if (dataType === 'USER_INFO') return null;
      if (dataType === 'PORTFOLIO') return {};
      if (dataType === 'TRANSACTIONS') return [];
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    saveUserData,
    getUserData,
    clearError: () => setError(null)
  };
};