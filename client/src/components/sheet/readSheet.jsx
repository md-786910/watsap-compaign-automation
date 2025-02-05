import React, { useState } from "react";
import {
  FileSpreadsheet,
  Eye,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Loader from "../Loader";
import axiosInstance from "../../config/axios";
import showToast from "../../helpers/Toast";
import { useFetch } from "../../hooks/useFetch";
import Button from "../../utils/button";

export const ReadSheet = () => {
  // const [sheets, setSheets] = useState([]);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [file, setFile] = useState(null);

  // @fetch sheets
  const { data: sheets, loading, error: sheetError } = useFetch("/process-sheet", {
    method: "GET",
  }, [isUploading]);


  const handleFileUpload = async () => {
    if (!file) {
      showToast("please select a file", "warning");
      return;
    };
    // Check file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "text/csv", // csv
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid Excel or CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      setIsUploading(true);
      setError("");
      const resp = await axiosInstance.post("/process-sheet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      if (resp.status === 200) {
        showToast("Sheet uploaded successfully", "success",);

        setFile(null);

      }

    } catch (error) {
      setError("Error uploading file. Please try again." + error);
      setIsUploading(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsUploading(true);
      const resp = await axiosInstance.delete("/process-sheet");
      if (resp.status === 200) {
        showToast("Sheet deleted successfully", "success");
        setSelectedSheet(null);
      }
    } catch (error) {
      showToast(error, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleView = (sheet) => {
    console.log({ sheet });
    setSelectedSheet(sheet);
  };


  if (sheetError) {
    return showToast(sheetError, "error");
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-4">Upload Sheet (Max size 5mb)</h2>
          <button onClick={() => {
            window.open("https://docs.google.com/spreadsheets/d/131N2EzYA-R_OhR2_3Bnxqui5JwGxEX8P/edit?usp=sharing&ouid=105436255648647026912&rtpof=true&sd=true")
          }} className="bg-yellow-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
            Download sample sheet
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            name="file"
            onChange={(e) => {
              setFile(e.target.files[0])
            }}
            accept=".xlsx,.xls,.csv"
            className=""
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center p-1 rounded-md border  cursor-pointer transition-colors"
          >
            Select new file(csv,xlsx)
          </label>
        </div>
        <div className="mt-3">
          <Button text="Upload" loadingText="saving..."
            onClick={() => handleFileUpload()} className="bg-blue-600 text-white rounded-lg" isLoading={isUploading} />


        </div>
        {error && (
          <div className="mt-3 flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

      </div>

      {/* Sheets List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Uploaded Sheets
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Row Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sheets?.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <FileSpreadsheet className="w-6 h-6 mx-auto mb-2" />
                    No sheets uploaded yet
                  </td>
                </tr>
              ) : (
                sheets?.slice(0, 1)?.map((sheet) => (
                  <tr key={sheet._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sheet.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sheet.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sheets?.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleView(sheets)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Sheet"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete()}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Sheet"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      </div>

      {/* Sheet Preview Modal */}
      {selectedSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedSheet.name}
              </h3>
              <button
                onClick={() => setSelectedSheet(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-8rem)]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Id
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Phone number
                    </th>

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedSheet?.map((row, index) => (
                    <tr key={index}>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {row?._id}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {row?.name}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {row?.phone_number}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
