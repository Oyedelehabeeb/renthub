import { useState } from "react";
import {
  checkNotificationsTable,
  testBookingNotification,
} from "../services/testNotifications";

export default function NotificationTester() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTableCheck = async () => {
    setLoading(true);
    try {
      const result = await checkNotificationsTable();
      console.log("Table check result:", result);
      setResults({ type: "table check", data: result });
    } catch (err) {
      console.error("Error:", err);
      setResults({ type: "table check", error: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  const runNotificationTest = async () => {
    setLoading(true);
    try {
      const result = await testBookingNotification();
      console.log("Notification test result:", result);
      setResults({ type: "notification test", data: result });
    } catch (err) {
      console.error("Error:", err);
      setResults({
        type: "notification test",
        error: err.message || String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Notification System Tester</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={runTableCheck}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Check Notifications Table
        </button>

        <button
          onClick={runNotificationTest}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Notification Creation
        </button>
      </div>

      {loading && <div className="text-gray-600">Running test...</div>}

      {results && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Test Results: {results.type}</h3>

          {results.error ? (
            <div className="text-red-500">
              <p>Error: {results.error}</p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap bg-gray-200 p-2 rounded">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p>Check the browser console for detailed logs</p>
      </div>
    </div>
  );
}
