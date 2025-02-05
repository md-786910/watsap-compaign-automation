import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Image as ImageIcon, Upload, FileText, Music2, X, } from 'lucide-react';
import axiosInstance from '../../config/axios';
import showToast from '../../helpers/Toast';
import Button from '../../utils/button';
import { useFetch } from '../../hooks/useFetch';
import Loader from '../Loader';
import { SERVER_FILE_API } from '../../utils/common';
import { useWhatsApp } from '../../context/WatsappContext';



const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_AUDIO_SIZE = 16 * 1024 * 1024; // 16MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

export const Template = () => {
    const [currentTemplate, setCurrentTemplate] = useState({
        name: '',
        content: '',
        imageFile: '',
        documentFile: '',
        audioFile: ''
    });
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {handleStartMessaging,isLoading} = useWhatsApp()
    const { data, loading: dataLoading, error: fetchError } = useFetch("/template", {
        method: "GET"
    }, [loading])


    const validateFile = (file, type) => {
        let maxSize;
        let allowedTypes;
        let typeLabel;
        switch (type) {
            case 'image':
                maxSize = MAX_IMAGE_SIZE;
                allowedTypes = ALLOWED_IMAGE_TYPES;
                typeLabel = 'Image';
                break;
            case 'document':
                maxSize = MAX_DOCUMENT_SIZE;
                allowedTypes = ALLOWED_DOCUMENT_TYPES;
                typeLabel = 'Document';
                break;
            case 'audio':
                maxSize = MAX_AUDIO_SIZE;
                allowedTypes = ALLOWED_AUDIO_TYPES;
                typeLabel = 'Audio';
                break;
        }

        if (!allowedTypes.includes(file.type)) {
            setError(`Invalid ${typeLabel.toLowerCase()} format. Allowed formats: ${allowedTypes.join(', ')}`);
            return false;
        }

        if (file.size > maxSize) {
            setError(`${typeLabel} size must be less than ${Math.floor(maxSize / (1024 * 1024))}MB`);
            return false;
        }

        return true;
    };

    const handleFileUpload = (event, type) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!validateFile(file, type)) {
            event.target.value = '';
            return;
        }
        if (type === 'image') {
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);
            setCurrentTemplate(prev => ({
                ...prev,
                imageFile: file
            }));
        } else if (type === 'document') {
            setCurrentTemplate(prev => ({
                ...prev,
                documentFile: file
            }));
        } else if (type === 'audio') {
            setCurrentTemplate(prev => ({
                ...prev,
                audioFile: file
            }));
        }

        setError(null);
    };

    const handleSave = async () => {
        if (!currentTemplate.name || !currentTemplate.content) {
            setError('Please fill in all required fields');
            showToast("Please fill in all required fields", "warning");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', currentTemplate.name);
            formData.append('content', currentTemplate.content);
            formData.append('imageUrl', currentTemplate.imageFile);
            formData.append('documentUrl', currentTemplate.documentFile);
            formData.append('audioUrl', currentTemplate.audioFile);

            const resp = await axiosInstance.post('/template', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            if (resp.status === 200) {
                showToast('Template saved successfully!', "success");
            }

            setError(null);
        } catch (err) {
            setError('Failed to save template. Please try again.');
        } finally {
            setError(null);
            setLoading(false);
            showToast(err, "error");
        }
    };

    const handleDeleteMedia = (type) => {
        setCurrentTemplate(prev => {
            const updated = { ...prev };
            if (type === 'image') {
                updated.imageFile = undefined;
                setImagePreviewUrl('');
            } else if (type === 'document') {
                updated.documentFile = undefined;
            } else if (type === 'audio') {
                updated.audioFile = undefined;
            }
            return updated;
        });
    };

    if (fetchError) {
        showToast(fetchError, "error");
        return
    }

    useEffect(() => {
        setCurrentTemplate({
            ...currentTemplate,
            name: data?.name,
            content: data?.content,
            imageFile: `http://localhost:3000/uploads/${data?.imageName}`,
            documentFile: "http://localhost:3000/uploads/doc.pdf",
            audioFile: "http://localhost:3000/uploads/audio.mp3"
        })
    }, [data])

    return (
        <div className="space-y-6">
            {
                dataLoading && <Loader />
            }

            {/* Template Editor */}
            <div className="bg-white rounded-lg shadow-md  mb-7">
                <div className="flex items-center justify-between border-b-2">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Create New Template
                        </h2>
                    </div>
                    <div className="px-6 py-4 border-b border-gray-200">
                        <Button text="start to send message" loadingText="sending..." onClick={() => handleStartMessaging()} isLoading={isLoading} className="bg-blue-600 text-white font-semibold rounded-md" />
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Editor Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Template Name(*)
                                </label>
                                <input
                                    type="text"
                                    value={currentTemplate.name}
                                    onChange={e => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter template name"
                                />
                            </div>

                            {/* Banner Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Banner Image (JPEG/PNG, max 5MB, recommended 800x418px)
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <label className="flex-1">
                                            <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                                                <Upload className="w-5 h-5 mr-2 text-gray-600" />
                                                <span className="text-gray-600">Choose image file</span>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={e => handleFileUpload(e, 'image')}
                                                accept={ALLOWED_IMAGE_TYPES.join(',')}
                                                className="hidden"
                                            />
                                        </label>
                                        <div className="flex-2 flex space-x-2">
                                            {(currentTemplate.imageFile) && (
                                                <button
                                                    onClick={() => handleDeleteMedia('image')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                                    title="Remove image"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Document Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Document (PDF, max 100MB)
                                </label>
                                <div className="flex items-center space-x-2">
                                    <label className="flex-1">
                                        <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                                            <FileText className="w-5 h-5 mr-2 text-gray-600" />
                                            <span className="text-gray-600">Choose document</span>
                                        </div>
                                        <input
                                            type="file"
                                            onChange={e => handleFileUpload(e, 'document')}
                                            accept={ALLOWED_DOCUMENT_TYPES.join(',')}
                                            className="hidden"
                                        />
                                    </label>
                                    <div className="flex-2 flex space-x-2">
                                        {(currentTemplate.documentFile) && (
                                            <button
                                                onClick={() => handleDeleteMedia('document')}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                                title="Remove document"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Audio Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Audio (MP3/WAV/OGG, max 16MB)
                                </label>
                                <div className="flex items-center space-x-2">
                                    <label className="flex-1">
                                        <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                                            <Music2 className="w-5 h-5 mr-2 text-gray-600" />
                                            <span className="text-gray-600">Choose audio file</span>
                                        </div>
                                        <input
                                            type="file"
                                            onChange={e => handleFileUpload(e, 'audio')}
                                            accept={ALLOWED_AUDIO_TYPES.join(',')}
                                            className="hidden"
                                        />
                                    </label>
                                    <div className="flex-2 flex space-x-2">
                                        {(currentTemplate.audioFile) && (
                                            <button
                                                onClick={() => handleDeleteMedia('audio')}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                                title="Remove audio"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message Content(*)
                                </label>
                                <div className="text-xs text-gray-500 mb-2">
                                    Formatting: *bold*, _italic_, ~strikethrough~, ```code```
                                </div>
                                <textarea
                                    value={currentTemplate.content}
                                    onChange={e => setCurrentTemplate(prev => ({ ...prev, content: e.target.value }))}
                                    rows={10}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your message content here..."
                                />
                            </div>

                            <div className="flex space-x-3" style={{
                                marginBottom: "30px",
                            }}>

                                <Button text="Save Template" loadingText="saving..." onClick={() => handleSave()} isLoading={loading} className="bg-blue-600 text-white font-semibold rounded-md" />

                            </div>
                            {error && (
                                <div className="flex items-center text-red-600">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Preview Section */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">WhatsApp Preview</h3>
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
                                                        (e.target).src = 'https://via.placeholder.com/800x418?text=Invalid+Image';
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleDeleteMedia('image')}
                                                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Remove image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        {(currentTemplate.documentFile) && (
                                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded group">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="w-5 h-5 text-gray-600" />
                                                    <span className="text-sm text-gray-700 truncate">
                                                        {currentTemplate.documentFile?.name || 'Document attached'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDeleteMedia('document')}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        title="Remove document"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {(currentTemplate.audioFile) && (
                                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded group">
                                                <div className="flex items-center space-x-2">
                                                    <Music2 className="w-5 h-5 text-gray-600" />
                                                    <span className="text-sm text-gray-700 truncate">
                                                        {currentTemplate.audioFile?.name || 'Audio attached'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDeleteMedia('audio')}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        title="Remove audio"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div
                                            className="prose prose-sm max-w-none"

                                        >

                                            {
                                                currentTemplate.content
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Files Summary */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            {/* Image File */}
                            {(currentTemplate.imageFile) && (
                                <div className="flex items-center space-x-2">
                                    <ImageIcon className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm text-gray-700">
                                        {currentTemplate.imageFile?.name || 'Image URL added'}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteMedia('image')}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Document File */}
                            {(currentTemplate.documentFile) && (
                                <div className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm text-gray-700">
                                        {currentTemplate.documentFile?.name || 'Document URL added'}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteMedia('document')}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Audio File */}
                            {(currentTemplate.audioFile) && (
                                <div className="flex items-center space-x-2">
                                    <Music2 className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm text-gray-700">
                                        {currentTemplate.audioFile?.name || 'Audio URL added'}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteMedia('audio')}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {(currentTemplate.imageFile ||
                            currentTemplate.documentFile ||
                            currentTemplate.audioFile) && (
                                <button
                                    onClick={() => {
                                        handleDeleteMedia('image');
                                        handleDeleteMedia('document');
                                        handleDeleteMedia('audio');
                                    }}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Clear all files
                                </button>
                            )}
                    </div>
                </div>
            </div>

        </div>
    );
};