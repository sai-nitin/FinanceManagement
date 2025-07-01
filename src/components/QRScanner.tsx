import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Scan } from 'lucide-react';
import { scanQRFromFile, parseUPIQRCode, generateSampleQRCodes } from '../utils/qrScanner';
import { QRPaymentData } from '../types';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentDetected: (paymentData: QRPaymentData) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onPaymentDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);

    try {
      const qrText = await scanQRFromFile(file);
      const paymentData = parseUPIQRCode(qrText);
      
      if (paymentData) {
        onPaymentDetected(paymentData);
        onClose();
      } else {
        setError('Invalid UPI QR code. Please try another image.');
      }
    } catch (err) {
      setError('Could not scan QR code from image. Please try another image.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSampleQR = (qrText: string) => {
    const paymentData = parseUPIQRCode(qrText);
    if (paymentData) {
      onPaymentDetected(paymentData);
      onClose();
    }
  };

  if (!isOpen) return null;

  const sampleQRs = generateSampleQRCodes();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Scan className="h-6 w-6 text-blue-600" />
            <span>Scan QR Code</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload QR Code Image</h3>
            <p className="text-gray-600 mb-4">Select an image containing a UPI QR code</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? 'Scanning...' : 'Choose Image'}
            </button>
          </div>

          {/* Sample QR Codes for Testing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Try Sample QR Codes</h3>
            <div className="space-y-2">
              {sampleQRs.map((qrText, index) => {
                const data = parseUPIQRCode(qrText);
                return (
                  <button
                    key={index}
                    onClick={() => handleSampleQR(qrText)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{data?.merchant}</p>
                        <p className="text-sm text-gray-600">{data?.description}</p>
                      </div>
                      <span className="font-bold text-blue-600">₹{data?.amount}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Upload a UPI QR code image or try the sample codes above for testing
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;