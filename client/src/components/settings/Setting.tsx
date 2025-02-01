import React, { useState, useEffect } from "react";
import {
  Save,
  Trash2,
  Play,
  AlertCircle,
  Clock,
  Smartphone,
} from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import showToast from "../../helpers/Toast";

interface Session {
  id: string;
  phoneNumber: string;
  status: "active" | "inactive";
  lastActive: string;
  deviceName: string;
}

interface DelaySettings {
  messageDelay: number;
  batchSize: number;
  batchDelay: number;
}

export const Settings: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [settings, setSettings] = useState<DelaySettings>({
    messageDelay: 1000,
    batchSize: 10,
    batchDelay: 5000,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    loading,
    error: fetchError,
    obj: { data },
  } = useFetch(
    "/session",
    {
      method: "GET",
    },
    ["session"]
  );

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("whatsappSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // In a real app, this would be an API call
    // For demo, we'll use mock data
    const mockSessions: Session[] = [
      {
        id: "1",
        phoneNumber: "+1234567890",
        status: "active",
        lastActive: new Date().toISOString(),
        deviceName: "iPhone 12",
      },
      {
        id: "2",
        phoneNumber: "+9876543210",
        status: "inactive",
        lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        deviceName: "Samsung Galaxy S21",
      },
    ];
    setSessions(mockSessions);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("whatsappSettings", JSON.stringify(settings));
  }, [settings]);

  const handleSaveSettings = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        successMessage.classList.remove("opacity-0");
        setTimeout(() => {
          successMessage.classList.add("opacity-0");
        }, 3000);
      }
    }, 500);
  };

  const handleDeleteSession = (id: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      setSessions((prev) => prev.filter((session) => session.id !== id));
    }
  };

  const handleActivateSession = (id: string) => {
    setSessions((prev) =>
      prev.map((session) => ({
        ...session,
        status: session.id === id ? "active" : "inactive",
      }))
    );
  };

  if (fetchError) {
    return showToast(fetchError, "error");
  }
  console.log(data);
  return (
    <div className="space-y-6">
      {/* Message Delay Settings */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Message Delay Settings
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Delay (ms)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  value={settings.messageDelay}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      messageDelay: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Delay between each message
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Size
              </label>
              <input
                type="number"
                min="1"
                value={settings.batchSize}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    batchSize: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Number of messages per batch
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Delay (ms)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  value={settings.batchDelay}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      batchDelay: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Delay between each batch
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {isLoading ? "Saving..." : "Save Settings"}
            </button>
            <div
              id="success-message"
              className="text-green-600 opacity-0 transition-opacity duration-300"
            >
              Settings saved successfully!
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Active Sessions
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sessions && sessions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Smartphone className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No active sessions found</p>
            </div>
          ) : (
            sessions &&
            sessions?.map((session) => (
              <div key={session.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Smartphone className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {session.phoneNumber}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {session.deviceName}
                        </span>
                        <span className="text-sm text-gray-500">
                          Last active:{" "}
                          {new Date(session.lastActive).toLocaleString()}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {session.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {session.status === "inactive" && (
                      <button
                        onClick={() => handleActivateSession(session.id)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        title="Activate Session"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="flex items-center px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      title="Delete Session"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 flex items-center bg-red-100 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};
