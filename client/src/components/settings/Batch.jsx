import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import { Clock, Save } from 'lucide-react';
import showToast from '../../helpers/Toast';
import Loader from '../Loader';
import Button from '../../utils/button';
import axiosInstance from '../../config/axios';

function Batch() {
    const [isLoading, setIsLoading] = useState(false);
    // fetch batch
    const { data: batch, loading: isBatchLoading, error: batchError } = useFetch(
        "/watsapp-batch",
        {
            method: "GET",
        },
        ["name", isLoading]);

    const [settings, setSettings] = useState({
        message_delay: 0,
        batch_size: 0,
        batch_delay: 0,
    });


    if (batchError) {
        return showToast(batchError, "error")
    }

    const handleSaveSettings = async () => {
        try {
            // @add check 
            const { batch_delay, batch_size, message_delay } = settings;
            if (batch_delay < 30000) {
                return showToast("Batch delay must be greater than 30000 ms", "error");
            }
            if (batch_size < 20) {
                return showToast("Batch size must be greater than 20", "error");
            }
            if (message_delay < 3000) {
                return showToast("Message delay must be greater than 3000 ms", "error");
            }
            setIsLoading(true);
            const resp = await axiosInstance.post("/watsapp-batch", settings);
            if (resp.status === 201) {
                showToast(resp.data.message, "success");
            }
        } catch (error) {
            showToast(error, "error");
        } finally {
            setIsLoading(false);
        }
        // clear input
        setSettings({
            message_delay: 0,
            batch_size: 0,
            batch_delay: 0,
        });
    };


    useEffect(() => {
        setSettings({
            message_delay: batch?.message_delay,
            batch_size: batch?.batch_size,
            batch_delay: batch?.batch_delay,
        });
    }, [batch]);


    return (
        <div className="bg-white rounded-lg shadow-md">
            {
                isBatchLoading && <Loader />
            }
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                    Message Delay Settings
                </h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message Delay (ms)
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                min={3000}
                                value={settings.message_delay}
                                onChange={(e) =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        message_delay: parseInt(e.target.value) || 0,
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Delay between each message
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Batch Size
                        </label>
                        <input
                            type="text"
                            min={20}
                            value={settings.batch_size}
                            defaultValue={settings.batch_size}
                            onChange={(e) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    batch_size: parseInt(e.target.value) || 0,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            number of messages per batch
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Batch Delay (ms)
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                min={30000}
                                value={settings.batch_delay}
                                onChange={(e) =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        batch_delay: parseInt(e.target.value) || 0,
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Delay between each batch
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Button Icon={Save} text="Save Settings" loadingText="Saving..." onClick={() => handleSaveSettings()} isLoading={isLoading} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700" />


                </div>
            </div>
        </div>
    )
}

export default Batch
