import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { QrCode, Lock, Settings, Info, ArrowUpRight, ChevronRight } from 'lucide-react';

function WatsappMain({ }) {
  const [options, setOptions] = useState({
    width: 200,
    height: 200,
    type: 'png',
    data: "qrCode",
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    cornersSquareOptions: { type: "square", color: "#000000" },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.5,
      margin: 20,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: 'bleu',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#25D366',
    },
    cornersSquareOptions: {
      color: '#222222',
      type: 'extra-rounded'
    },
    cornersDotOptions: {
      color: '#222222',
      type: 'dot',
    }
  });
  const ref = useRef(null);

  const [qrCode] = useState(new QRCodeStyling(options));
  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff1e9] to-white flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="bg-[#25D366]/10 p-2 rounded-lg">
            <QrCode className="w-6 h-6 text-[#25D366]" />
          </div>
          <span className="text-xl font-semibold text-[#25D366]">WhatsApp</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-white/50">
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold text-[#1f1f1f] mb-4">
              Log into WhatsApp Web
            </h1>
            <p className="text-gray-600 mb-10">
              Message privately with friends and family using WhatsApp on your
              browser.
            </p>

            <div className="flex flex-col md:flex-row items-start gap-12">
              <div className="flex-1 space-y-8">
                <ol className="space-y-6 list-none m-0 p-0">
                  {[
                    { num: "1", text: "Open WhatsApp on your phone" },
                    {
                      num: "2",
                      content: (
                        <span className="flex flex-wrap items-center">
                          <span className="mr-1">Tap Menu</span>
                          <span className="bg-gray-100 p-1 rounded-full inline-flex items-center justify-center">
                            <Info className="w-3.5 h-3.5" />
                          </span>
                          <span className="mx-1">on Android, or Settings</span>
                          <span className="bg-gray-100 p-1 rounded-full inline-flex items-center justify-center">
                            <Settings className="w-3.5 h-3.5" />
                          </span>
                          <span className="ml-1">on iPhone</span>
                        </span>
                      ),
                    },
                    {
                      num: "3",
                      text: "Tap Linked devices and then Link a device",
                    },
                    {
                      num: "4",
                      text: "Point your phone at this screen to scan the QR code",
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex gap-4 group">
                      <span className="font-medium min-w-[24px] h-24px bg-[#25D366]/10 rounded-full w-6 h-6 flex items-center justify-center text-[#25D366]">
                        {item.num}
                      </span>
                      <span className="pt-1">{item.content || item.text}</span>
                    </li>
                  ))}
                </ol>

                <div className="space-y-4 pt-6">
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 rounded-lg hover:bg-[#25D366]/5 transition-colors"
                  >
                    <span className="text-[#25D366]">
                      Need help getting started?
                    </span>
                    <ArrowUpRight className="w-4 h-4 ml-1 text-[#25D366]" />
                  </a>
                  <div>
                    <a
                      href="#"
                      className="inline-flex items-center px-4 py-2 rounded-lg hover:bg-[#25D366]/5 transition-colors"
                    >
                      <span className="text-[#25D366]">
                        Log in with phone number
                      </span>
                      <ChevronRight className="w-4 h-4 ml-1 text-[#25D366]" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#25D366]/20 to-[#25D366]/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-48 h-48 border-2 border-[#25D366] rounded-xl p-2 bg-white/80 backdrop-blur-sm shrink-0">
                  <div className="w-full h-full bg-[#f0f2f5] rounded-lg flex items-center justify-center">
                    {/* <QrCode className="w-32 h-32 text-[#25D366]" ref={ref} /> */}
                    <div ref={ref} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Your personal messages are end-to-end encrypted</span>
        </div>
      </footer>
    </div>
  );
}

export default WatsappMain;



