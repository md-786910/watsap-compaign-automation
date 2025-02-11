import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import showToast from '../../helpers/Toast'
import { Smartphone, Trash2 } from 'lucide-react'
import Loader from '../Loader'
import { useWhatsApp } from '../../context/WatsappContext'
import socket from '../../config/socketConfig'
import axiosInstance from '../../config/axios'

function GetSession() {
    const [hitSeesion, setHitSession] = useState(1)
    const [loader, setLoader] = useState(false)
    const { connectToWhatsApp, isLoading } = useWhatsApp();
    const { loading, error, data } = useFetch("/session", {
        method: "GET",
    }, [isLoading, hitSeesion])
    if (error) {
        return showToast(error, "error")
    }


    // @handleDeleteSession
    const handleDeleteSession = async (session_id) => {
        try {
            setLoader(true)
            const resp = await axiosInstance.delete("/session/" + session_id)
            if (resp.status === 200) {
                showToast("session deleted successfully", "success")
                setHitSession(Math.random())
                setLoader(false)
            }
        } catch (error) {
            showToast(error, "error")
        }
        finally {
            setHitSession(false)
            setLoader(false)

        }
    }

    useEffect(() => {
        // socket.connect();
        return () => {
            // socket.off("watsapp_connected");
            // socket.off("watsapp_disconnected");
            // socket.disconnect();
        };

    }, [socket]);



    return (
        <div className="bg-white rounded-lg shadow-md">

            <div className="px-6 py-4 border-b border-gray-200">
                <div className='p-2'>
                    {
                        loading && <Loader />
                    }
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                    Active Sessions
                </h2>

            </div>
            <div className="divide-y divide-gray-200">

                {data && data?.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <Smartphone className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No active sessions found</p>
                    </div>
                ) : (
                    data?.map((session, index) => (
                        <div key={index} className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <Smartphone className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {session.phone_number} ({session.user})
                                        </h3>
                                        <div className="mt-1 flex items-center space-x-4">
                                            <span className="text-sm text-gray-500">

                                                {session.device}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Last active:{" "}
                                                {new Date(session.updatedAt).toLocaleString()}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {session.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {session.status === "inactive" && (
                                        <button
                                            onClick={() => connectToWhatsApp(session.session_id)}
                                            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            title="Activate Session"
                                        >
                                            {isLoading ? "Loading..." : "initiate connection"}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteSession(session.session_id)}
                                        className="flex items-center px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                        title="Delete Session"
                                    >
                                        {
                                            loader ? "Deleting..." : <Trash2 className="w-5 h-5" />
                                        }

                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default GetSession
