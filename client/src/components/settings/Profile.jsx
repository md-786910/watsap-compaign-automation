import React from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import { formateDate } from '../../utils/formatDate'

function Profile() {
    let [user, _] = useLocalStorage("user", null)
    user = JSON.parse(user)
    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {user?.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {user?.email}
                        </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`}>
                        Role : [{user.role}]
                    </span>
                </div>

                {/* Credits Usage */}
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Joined At</h4>
                    <div className="bg-gray-100 rounded-full h-2">
                        <h5 className='mt-2'>
                            {formateDate(user?.createdAt)}
                        </h5>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Profile
