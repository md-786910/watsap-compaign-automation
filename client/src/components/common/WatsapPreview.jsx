import { FileText, Music2, X } from "lucide-react";
import React from "react";
function WatsapPreview(props) {
  const { currentTemplate, imagePreviewUrl } = props;
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-[#E5DDD5]">
       
      <div className="bg-[#075E54] px-4 py-2 text-white">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-white" />
          <span className="text-sm font-medium">WhatsApp Business</span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {/* Message bubble */}
        <div className="bg-white rounded-lg shadow-sm p-3 max-w-[80%] space-y-3">
          {(imagePreviewUrl || currentTemplate.imageFile) && (
            <div className="relative group">
              <img
                src={imagePreviewUrl || currentTemplate.imageFile}
                alt="Banner"
                className="w-full h-[209px] object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x418?text=Invalid+Image";
                }}
              />
              <button
                onClick={() => handleDeleteMedia("image")}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentTemplate.documentFile && (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded group">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700 truncate">
                  {currentTemplate.documentFile?.name || "Document attached"}
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteMedia("document")}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Remove document"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentTemplate.audioFile && (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded group">
              <div className="flex items-center space-x-2">
                <Music2 className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700 truncate">
                  {currentTemplate.audioFile?.name || "Audio attached"}
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteMedia("audio")}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Remove audio"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            {currentTemplate.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatsapPreview;
