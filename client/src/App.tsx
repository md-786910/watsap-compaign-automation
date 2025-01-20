import { useState, useEffect } from "react";
import {
  BarChart3,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { io } from "socket.io-client";

interface MessageLog {
  phoneNumber: string;
  status: string;
  reason?: string;
  error?: string;
  timestamp?: string;
}

interface Stats {
  total: number;
  sent: number;
  error: number;
  skipped: number;
  retrying: number;
}

const socket = io("http://localhost:3000");
console.log({ socket });
function App() {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    sent: 0,
    error: 0,
    skipped: 0,
    retrying: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated API call - replace with actual API endpoint
    const fetchData = async () => {
      try {
        // Replace with actual API endpoint
        const response = await fetch("/api/logs");
        const data = await response.json();
        setLogs(data.logs);
        calculateStats(data.logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("connection", () => {});
  }, []);

  const calculateStats = (logs: MessageLog[]) => {
    const newStats = logs.reduce(
      (acc, log) => ({
        ...acc,
        sent: acc.sent + (log.status === "success" ? 1 : 0),
        error: acc.error + (log.status === "error" ? 1 : 0),
        skipped: acc.skipped + (log.status === "skipped" ? 1 : 0),
        retrying: acc.retrying + (log.status === "retry" ? 1 : 0),
      }),
      {
        total: logs.length,
        sent: 0,
        error: 0,
        skipped: 0,
        retrying: 0,
      }
    );
    setStats(newStats);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            WhatsApp Messaging Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Real-time monitoring of message delivery status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Messages"
            value={stats.total}
            icon={BarChart3}
            color="bg-blue-500"
          />
          <StatCard
            title="Sent Successfully"
            value={stats.sent}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Failed"
            value={stats.error}
            icon={XCircle}
            color="bg-red-500"
          />
          <StatCard
            title="Skipped"
            value={stats.skipped}
            icon={AlertCircle}
            color="bg-yellow-500"
          />
          <StatCard
            title="Retrying"
            value={stats.retrying}
            icon={RefreshCw}
            color="bg-purple-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Message Logs
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No messages sent yet
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            log.status === "Success"
                              ? "bg-green-100 text-green-800"
                              : log.status === "Error"
                              ? "bg-red-100 text-red-800"
                              : log.status === "Skipped"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.reason || log.error || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.timestamp || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
