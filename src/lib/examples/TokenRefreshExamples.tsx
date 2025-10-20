/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Example Component Usage for Token Refresh
 * 
 * This file shows various ways to use the token refresh system
 * in your React components.
 */

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getValidToken, isTokenExpiring } from '@/lib/utils/tokenRefresh';

// ============================================================
// Example 1: Using Redux API (Automatic Refresh)
// ============================================================
/**
 * No code changes needed! The base API automatically handles refresh.
 * Just use your Redux hooks as normal.
 */
export function QuizListExample() {
  // Token refresh happens automatically in the background
  // const { data: quizzes } = useGetQuizzesQuery();
  
  return (
    <div>
      {/* Component code */}
    </div>
  );
}

// ============================================================
// Example 2: Display Token Status
// ============================================================
export function TokenStatusIndicator() {
  const { data: session, update: updateSession } = useSession();
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    if (!session) return;

    const expiryTime = (session as any)?.apiAccessTokenExpires;
    if (!expiryTime) return;

    const calculateTime = () => {
      const now = Date.now();
      const remaining = expiryTime - now;
      setExpiresIn(Math.max(0, remaining));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [session]);

  if (!expiresIn) return null;

  const minutes = Math.floor(expiresIn / 60000);
  const seconds = Math.floor((expiresIn % 60000) / 1000);

  return (
    <div className="p-2 bg-gray-100 rounded">
      <p className="text-sm">
        Session expires in: <strong>{minutes}:{seconds.toString().padStart(2, '0')}</strong>
      </p>
    </div>
  );
}

// ============================================================
// Example 3: Manual Token Refresh Button
// ============================================================
export function ManualRefreshButton() {
  const { update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRefresh = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (response.ok) {
        // Update session on client
        await updateSession();
        setMessage('✓ Token refreshed successfully');
      } else {
        setMessage('✗ Failed to refresh token');
      }
    } catch (error) {
      console.error('Refresh error:', error);
      setMessage('✗ Refresh error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Refreshing...' : 'Refresh Token'}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}

// ============================================================
// Example 4: Token Warning Notification
// ============================================================
export function TokenExpiryWarning() {
  const { data: session } = useSession();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!session) return;

    const checkExpiry = async () => {
      const expiring = await isTokenExpiring(10 * 60 * 1000); // 10 minute warning
      setShowWarning(expiring);
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [session]);

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 right-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
      <p className="text-sm font-semibold">⚠️ Your session is about to expire</p>
      <p className="text-xs text-gray-600">You will be logged out soon for security.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
      >
        Refresh Session
      </button>
    </div>
  );
}

// ============================================================
// Example 5: Protected API Call with Manual Refresh
// ============================================================
export function ProtectedApiCallExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProtectedData = async () => {
    setLoading(true);
    setError('');

    try {
      // Get valid token (refreshes if needed)
      const token = await getValidToken();

      if (!token) {
        throw new Error('No valid token available');
      }

      const response = await fetch('/api/protected-endpoint', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Fetch error:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={fetchProtectedData}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {data && <pre className="mt-2 p-2 bg-gray-100 rounded">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

// ============================================================
// Example 6: Auto-refresh on App Load
// ============================================================
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const { data: session, update: updateSession } = useSession();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (!session) {
        setIsReady(true);
        return;
      }

      // Check if token needs refresh on app load
      const needsRefresh = await isTokenExpiring(60 * 60 * 1000); // 1 hour warning

      if (needsRefresh) {
        try {
          await fetch('/api/auth/refresh', { method: 'POST' });
          await updateSession();
          console.log('[App] Token refreshed on load');
        } catch (error) {
          console.error('[App] Failed to refresh on load:', error);
        }
      }

      setIsReady(true);
    };

    initializeApp();
  }, [session, updateSession]);

  if (!isReady) {
    return <div>Initializing...</div>;
  }

  return <>{children}</>;
}

// ============================================================
// Example 7: Session Provider with Token Monitoring
// ============================================================
import { SessionProvider } from 'next-auth/react';

export function CustomSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={4 * 60}> {/* Refetch every 4 minutes */}
      <AppInitializer>
        <TokenExpiryWarning />
        {children}
      </AppInitializer>
    </SessionProvider>
  );
}

// ============================================================
// Example 8: Hook for Token Status in Components
// ============================================================
export function useTokenStatus() {
  const { data: session } = useSession();
  const [tokenStatus, setTokenStatus] = useState({
    isValid: false,
    expiresIn: 0,
    isExpiring: false,
  });

  useEffect(() => {
    const updateStatus = async () => {
      if (!session) {
        setTokenStatus({
          isValid: false,
          expiresIn: 0,
          isExpiring: false,
        });
        return;
      }

      const expiryTime = (session as any)?.apiAccessTokenExpires;
      if (!expiryTime) return;

      const now = Date.now();
      const remaining = expiryTime - now;
      const isExpiring = remaining < 5 * 60 * 1000; // Less than 5 minutes

      setTokenStatus({
        isValid: remaining > 0,
        expiresIn: Math.max(0, remaining),
        isExpiring,
      });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [session]);

  return tokenStatus;
}

// Usage in component:
export function ComponentWithTokenStatus() {
  const { isValid, expiresIn, isExpiring } = useTokenStatus();

  return (
    <div>
      {isValid && (
        <p className={isExpiring ? 'text-yellow-600' : 'text-green-600'}>
          ✓ Session valid ({Math.floor(expiresIn / 1000)}s remaining)
        </p>
      )}
      {!isValid && (
        <p className="text-red-600">✗ Session expired</p>
      )}
    </div>
  );
}

// ============================================================
// Example 9: Form Submit with Token Validation
// ============================================================
export function FormWithTokenValidation() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: any) => {
    setSubmitting(true);
    setError('');

    try {
      // Ensure token is valid before submitting
      const token = await getValidToken();
      
      if (!token) {
        throw new Error('Session expired. Please log in again.');
      }

      // Make API call with valid token
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      console.log('Form submitted successfully');
      // Handle success
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ /* form data */ });
    }}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* Form fields */}
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

// ============================================================
// Example 10: Debug Component for Development
// ============================================================
export function TokenDebugPanel() {
  const { data: session, update: updateSession } = useSession();
  const [showPanel, setShowPanel] = useState(false);

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 px-3 py-1 text-xs bg-gray-800 text-white rounded"
      >
        Debug
      </button>
    );
  }

  const expiryTime = (session as any)?.apiAccessTokenExpires;
  const expiresIn = expiryTime ? expiryTime - Date.now() : null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-900 text-white rounded text-xs w-80 max-h-96 overflow-auto font-mono">
      <div className="flex justify-between mb-2">
        <strong>Token Debug</strong>
        <button onClick={() => setShowPanel(false)}>✕</button>
      </div>

      <div className="space-y-2 border-t border-gray-700 pt-2">
        <div>
          <strong>Session:</strong> {session ? 'Active' : 'Inactive'}
        </div>
        {session && (
          <>
            <div>
              <strong>Email:</strong> {(session as any)?.email}
            </div>
            <div>
              <strong>User ID:</strong> {(session as any)?.userId}
            </div>
            <div>
              <strong>Access Token:</strong> {(session as any)?.apiAccessToken?.slice(0, 20)}...
            </div>
            <div>
              <strong>Expires In:</strong> {expiresIn ? `${Math.floor(expiresIn / 1000)}s` : 'N/A'}
            </div>
            <button
              onClick={() => {
                updateSession();
                console.log('Session updated');
              }}
              className="mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs w-full"
            >
              Refresh Session
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default {
  TokenStatusIndicator,
  ManualRefreshButton,
  TokenExpiryWarning,
  ProtectedApiCallExample,
  AppInitializer,
  CustomSessionProvider,
  useTokenStatus,
  FormWithTokenValidation,
  TokenDebugPanel,
};
