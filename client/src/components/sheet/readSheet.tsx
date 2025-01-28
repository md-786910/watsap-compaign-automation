import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  Eye,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { read, utils } from "xlsx";
import { SheetData } from "../../types";

export const ReadSheet: React.FC = () => {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<SheetData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    try {
      setIsUploading(true);
      setError("");

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet);
          const newSheet: SheetData = {
            id: Date.now().toString(),
            name: file.name,
            dateUploaded: new Date().toISOString(),
            rowCount: jsonData.length,
            data: jsonData,
          };

          setSheets((prev) => [newSheet, ...prev]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (error) {
          setError("Error processing file. Please try again." + error);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      setError("Error uploading file. Please try again." + error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    setSheets((prev) => prev.filter((sheet) => sheet.id !== id));
    if (selectedSheet?.id === id) {
      setSelectedSheet(null);
    }
  };

  const handleView = (sheet: SheetData) => {
    setSelectedSheet(sheet);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Sheet</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Choose File
          </label>
          {isUploading && <span className="text-gray-600">Uploading...</span>}
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
              {sheets.length === 0 ? (
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
                sheets.map((sheet) => (
                  <tr key={sheet.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sheet.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sheet.dateUploaded).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sheet.rowCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleView(sheet)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Sheet"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sheet.id)}
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
                    {Object.keys(selectedSheet.data[0] || {}).map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedSheet.data.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {cell as string}
                        </td>
                      ))}
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
