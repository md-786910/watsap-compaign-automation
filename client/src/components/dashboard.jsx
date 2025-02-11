import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import StatCard from "./status_card";
import axiosInstance from "../config/axios";
import Loader from "./Loader";
import { formateDate } from "../utils/formatDate";
import socket from "../config/socketConfig";

export const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    skipped: 0,
    retry: 0,
    pending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [incoming, setIncoming] = useState("");

  useEffect(() => {
    // Simulated API call - replace with actual API endpoint
    const fetchData = async () => {
      try {
        // Replace with actual API endpoint
        const response = await axiosInstance.get(`/logs`);
        const data = response.data;
        setLogs(data.logs);
        calculateStats(data.logs, data?.statusCounts);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const calculateStats = (logs, countStats) => {
    setStats({
      total: logs.length,
      success: countStats?.success,
      failed: countStats?.failed,
      skipped: countStats?.skipped,
      retry: countStats?.retry,
      pending: countStats?.pending,
    });
  };

  //@ Websocket
  useEffect(() => {
    // Connect to the socket
    // socket.connect();
    socket.on("message", (data) => {
      console.log("Connected to server", data);
      setIncoming(data);
    });
    // Cleanup on component unmount
    return () => {
      // socket.disconnect(); // Disconnect the socket
      // socket.off("message"); // Stop listening to the "message" event
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Messages"
          value={stats.total || 0}
          icon={BarChart3}
          color="bg-blue-500"
        />
        <StatCard
          title="Sent Successfully"
          value={stats.success}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Failed"
          value={stats.failed}
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
          value={stats.retry}
          icon={RefreshCw}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Message Logs</h2>
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
                        className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full
                        ${log.status === "success"
                            ? "bg-green-100 text-green-800"
                            : log.status === "error"
                              ? "bg-red-100 text-red-800"
                              : log.status === "skipped"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log?.reason?.substring(0, 100) || log?.error?.substring(0, 100) || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formateDate(log.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
