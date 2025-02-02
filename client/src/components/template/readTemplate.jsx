import React, { useState, useEffect } from "react";
import {
  Save,
  // Edit2,
  // Trash2,
  // Plus,
  Image as ImageIcon,
  Upload,
} from "lucide-react";


export const ReadTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({
    id: "",
    name: "",
    content: "",
    imageUrl: "",
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // Load saved templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem("whatsappTemplates");
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("whatsappTemplates", JSON.stringify(templates));
  }, [templates]);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      setCurrentTemplate((prev) => ({
        ...prev,
        imageUrl: "", // Clear URL when file is selected
        imageFile: file,
      }));

      // Clean up the object URL when component unmounts or when a new file is selected
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleUrlChange = (url) => {
    setCurrentTemplate((prev) => ({
      ...prev,
      imageUrl: url,
      imageFile: undefined, // Clear file when URL is entered
    }));
    setImagePreviewUrl(""); // Clear preview URL
  };

  const handleSave = () => {
    if (!currentTemplate.name || !currentTemplate.content) {
      alert("Please fill in all required fields");
      return;
    }

    // If we have a file, convert it to base64 before saving
    if (currentTemplate.imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        saveTemplate(base64String);
      };
      reader.readAsDataURL(currentTemplate.imageFile);
    } else {
      saveTemplate(currentTemplate.imageUrl);
    }
  };

  const saveTemplate = (imageSource) => {
    const newTemplate = {
      id: isEditing ? currentTemplate.id : Date.now().toString(),
      name: currentTemplate.name,
      content: currentTemplate.content,
      imageUrl: imageSource,
      createdAt: isEditing
        ? templates.find((t) => t.id === currentTemplate.id)?.createdAt ||
        new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditing) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === newTemplate.id ? newTemplate : t))
      );
    } else {
      setTemplates((prev) => [...prev, newTemplate]);
    }

    handleReset();
  };

  // const handleEdit = (template: Template) => {
  //   setIsEditing(true);
  //   setCurrentTemplate({
  //     id: template.id,
  //     name: template.name,
  //     content: template.content,
  //     imageUrl: template.imageUrl,
  //   });
  //   setImagePreviewUrl(template.imageUrl);
  // };

  // const handleDelete = (id) => {
  //   if (window.confirm("Are you sure you want to delete this template?")) {
  //     setTemplates((prev) => prev.filter((t) => t.id !== id));
  //   }
  // };

  const handleReset = () => {
    setIsEditing(false);
    setCurrentTemplate({
      id: "",
      name: "",
      content: "",
      imageUrl: "",
    });
    setImagePreviewUrl("");
  };

  const formatWhatsAppText = (text) => {
    return text
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~(.*?)~/g, "<strike>$1</strike>")
      .replace(/```(.*?)```/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="space-y-6">
      {/* Template Editor */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Template" : "Create New Template"}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={currentTemplate.name}
                  onChange={(e) =>
                    setCurrentTemplate((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image
                </label>
                <div className="space-y-3">
                  {/* Local file upload */}
                  <div className="flex items-center space-x-2">
                    <label className="flex-1">
                      <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                        <Upload className="w-5 h-5 mr-2 text-gray-600" />
                        <span className="text-gray-600">Choose local file</span>
                      </div>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    <span className="text-gray-500">or</span>
                  </div>

                  {/* URL input */}
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={currentTemplate.imageUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter image URL"
                    />
                    {(currentTemplate.imageUrl || imagePreviewUrl) && (
                      <button
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                        title="Preview image"
                        onClick={() =>
                          window.open(
                            imagePreviewUrl || currentTemplate.imageUrl
                          )
                        }
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Content
                </label>
                <div className="text-xs text-gray-500 mb-2">
                  Formatting: *bold*, _italic_, ~strikethrough~, ```code```
                </div>
                <textarea
                  value={currentTemplate.content}
                  onChange={(e) =>
                    setCurrentTemplate((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your message content here..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? "Update Template" : "Save Template"}
                </button>
                {isEditing && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Preview
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-gray-700">
                      WhatsApp Preview
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {(imagePreviewUrl || currentTemplate.imageUrl) && (
                    <img
                      src={imagePreviewUrl || currentTemplate.imageUrl}
                      alt="Banner"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target).src =
                          "https://via.placeholder.com/400x200?text=Invalid+Image";
                      }}
                    />
                  )}
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: formatWhatsAppText(currentTemplate.content),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Templates */}
      {/* <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Saved Templates
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {templates.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Plus className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No templates saved yet. Create your first template above.</p>
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Last updated:{" "}
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(template)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Template"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Template"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {template.imageUrl && (
                  <img
                    src={template.imageUrl}
                    alt="Template Banner"
                    className="mt-4 w-full h-32 object-cover rounded-lg"
                  />
                )}
                <div
                  className="mt-4 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formatWhatsAppText(template.content),
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div> */}
    </div>
  );
};
