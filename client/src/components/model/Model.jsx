import React from 'react'
function Model(props) {
    const { setShowModal, text = "Create Account", showSubmitBtn = false, onClick = null, Component, width = "md", style = {} } = props;
    return (
        <div className="fixed   inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white rounded-lg shadow-xl ${width == 'md' ? ' w-2/6' : ''} max-w-${width} p-6`}
                style={style}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {text}
                        {/* {true ? 'Create Account' : 'Welcome Back'} */}
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <Component />
                <div className='border-1 mt-5 flex justify-center items-center gap-4'>
                    <button className="p-2 bg-red-600 text-white rounded-md  focus:outline-none focus:ring-2 w-40"
                        onClick={() => setShowModal(false)}
                    >Close</button>
                    {
                        showSubmitBtn && <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-0 w-40" onClick={() => onClick()}>Submit</button>
                    }

                </div>
            </div>
        </div>
    )
}

export default Model