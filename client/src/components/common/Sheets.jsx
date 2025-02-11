import { FileSpreadsheet } from "lucide-react";
import React, { useEffect } from "react";
import Loader from "../Loader";
import { useFetch } from "../../hooks/useFetch";

function Sheets(props) {
// @fetch sheets
  const {
    data: sheets,
    loading,
    error: sheetError,
  } = useFetch(
    "/process-sheet",
    {
      method: "GET",
    },
    [props]
  );

  if (sheetError) {
    return showToast(sheetError, "error");
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md"
      style={{
        overflow: "auto",
        height: "77vh",
      }}
    >
      <div className="overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50 ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sheets?.length == 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  <FileSpreadsheet className="w-6 h-6 mx-auto mb-2" />
                  No sheets uploaded yet
                </td>
              </tr>
            ) : (
              sheets?.map((sheet, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sheet.phone_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sheet.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sheets;
