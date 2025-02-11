import React, { useEffect, useState } from "react";
import WatsapPreview from "../common/WatsapPreview";
import Sheets from "../common/Sheets";
import Button from "../../utils/button";
import { useWhatsApp } from "../../context/WatsappContext";
import showToast from "../../helpers/Toast";
import { useFetch } from "../../hooks/useFetch";
import Loader from "../Loader";
import { SERVER_FILE_API } from "../../utils/common";



function Schedular() {
  const[data,setData] = useState({
    isTemplate:false,
    isSheet:true
  })
  const [currentTemplate,setCurrentTemplate] = useState({})
  const { handleStartMessaging, isLoading } = useWhatsApp();
  const {data:template,error,loading} = useFetch(
    "/template",
    {
      method: "GET",
    },
    []
  );
  if(error){
    return showToast(error,"error")
  }
  useEffect(()=>{
    if(template){
        setCurrentTemplate({
            name: template?.name,
            content:template?.content,
            imageFile:template.imageName ?`${SERVER_FILE_API}/${template.imageName}`:"",
            audioFile: template.audioName?`${SERVER_FILE_API}/${template.audioName}`:"",
            documentFile:template.documentName? `${SERVER_FILE_API}/${template.documentName}`:"", 
            imageName: template.imageName ?? "",
            audioName: template?.audioName ?? "",
            documentName: template?.documentName ?? "",
        })
        setData({
            ...data,
            isTemplate:true
        })
    }
  },[loading])

  return (
    <div className="space-y-6">
         {
            loading && <Loader/>
        }
      <div className="bg-white rounded-lg shadow-md mb-7">
        <div className="flex items-center justify-between border-b-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Schedule Campaign Messages
            </h2>
        
          </div>
          <Button
            text="start to send message(foreground)"
            loadingText="sending..."
            onClick={() => {
                if(!data.isTemplate){
                    return showToast("Please select as default template : Template.","warning")
                }
                if(!data.isSheet){
                    return showToast("Please upload sheet to send message.","warning")
                }
                handleStartMessaging()
            }}
            isLoading={isLoading}
            className="bg-blue-600 text-white font-semibold rounded-md"
            style={{
                padding:"9px"
            }}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WatsapPreview
            currentTemplate={currentTemplate}
            imagePreviewUrl={""}
          />
          <Sheets />
        </div>
      </div>
    </div>
  );
}

export default Schedular;
