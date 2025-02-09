import React, { useEffect } from "react";
import { tabList } from "../../utils/tablist";
import { useSearchParams } from "react-router-dom";
export const Settings = () => {
  const [activeTab, setActiveTab] = React.useState(tabList[0]);
  const [searchParams] = useSearchParams();
  const tabId = searchParams.get("tab");

  useEffect(() => {
    if (tabId) {
      const foundTab = tabList.find((tab) => tab.id === tabId);
      if (foundTab) {
        setActiveTab(foundTab); // ✅ Correctly update the active tab with its component
      }
    }
  }, [tabId]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {
              tabList.map((tab, index) => (
                <button
                  onClick={() => {
                    setActiveTab(tab)
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab.id === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  key={index}
                >
                  {tab.name}
                </button>
              ))
            }
          </nav>
        </div>
      </div>

      {activeTab.component ? <activeTab.component /> : <p>Tab not found</p>}

    </div>
  );
};
