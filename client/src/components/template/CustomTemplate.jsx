import React, { useState } from 'react'
import { WHATSAPP_TEMPLATES } from '../../utils/templateData';
import { Filter } from 'lucide-react';

const categories = ['all', ...new Set(WHATSAPP_TEMPLATES.map(t => t.category))];

function CustomTemplate(props) {
    const { setCurrentTemplate, setImagePreviewUrl, setShowModal } = props;
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleUseTemplate = (template = WHATSAPP_TEMPLATES[0]) => {
        setCurrentTemplate(prev => ({
            ...prev,
            name: `Copy of ${template.name}`,
            content: template.content,
            imageUrl: template.imageUrl,
            documentUrl: '',
            audioUrl: ''
        }));
        setImagePreviewUrl(template.imageUrl);
        const timeout = setTimeout(() => {
            setShowModal(false);
        }, 500)
        return () => clearTimeout(timeout);
    };

    const filteredTemplates = WHATSAPP_TEMPLATES.filter(
        template => selectedCategory === 'all' || template.category === selectedCategory
    );
    return (
        <div className="p-6">
            {/* Category Filter */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                    <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <img
                            src={template.imageUrl}
                            alt={template.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {template.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                {template.content.substring(0, 150)}...
                            </p>
                            <button
                                onClick={() => handleUseTemplate(template)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Use Template
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomTemplate
