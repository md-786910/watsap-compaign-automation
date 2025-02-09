// import React from 'react'

// function Schedular() {
//     return (
//         <div className="space-y-6">
//             <div className="bg-white rounded-lg shadow-md  mb-7">
//                 <div className="flex items-center justify-between border-b-2">
//                     <div className="px-6 py-4 border-b border-gray-200">
//                         <h2 className="text-xl font-semibold text-gray-800">
//                             Schedule your message
//                         </h2>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default Schedular

import React, { useState } from 'react'

function Schedular() {
    const [schedule, setSchedule] = useState({
        message: '',
        dateTime: '',
        frequency: 'once',
        phoneNumbers: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Add your WhatsApp API integration logic here
        console.log('Schedule details:', schedule)
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md mb-7">
                <div className="flex items-center justify-between border-b-2">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Schedule Campaign Messages
                        </h2>
                    </div>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Campaign Message</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="4"
                                value={schedule.message}
                                onChange={(e) => setSchedule({ ...schedule, message: e.target.value })}
                                placeholder="Enter your campaign message"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Schedule Date & Time</label>
                            <input
                                type="datetime-local"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={schedule.dateTime}
                                onChange={(e) => setSchedule({ ...schedule, dateTime: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Frequency</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={schedule.frequency}
                                onChange={(e) => setSchedule({ ...schedule, frequency: e.target.value })}
                            >
                                <option value="once">Once</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Numbers</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="3"
                                value={schedule.phoneNumbers}
                                onChange={(e) => setSchedule({ ...schedule, phoneNumbers: e.target.value })}
                                placeholder="Enter phone numbers (one per line)"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Schedule Campaign
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Schedular
