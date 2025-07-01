import QrScanner from 'qr-scanner';

export const parseUPIQRCode = (qrText: string): { amount: number; merchant: string; upiId: string; description: string } | null => {
  try {
    // UPI QR codes typically start with "upi://pay?"
    if (!qrText.toLowerCase().includes('upi://pay') && !qrText.toLowerCase().includes('pa=')) {
      return null;
    }

    // Extract UPI parameters
    const params = new URLSearchParams(qrText.split('?')[1] || qrText);
    
    const upiId = params.get('pa') || 'unknown@upi';
    const merchant = params.get('pn') || params.get('merchant') || 'Unknown Merchant';
    const amountStr = params.get('am') || params.get('amount') || '0';
    const description = params.get('tn') || params.get('tr') || 'UPI Payment';
    
    const amount = parseFloat(amountStr);
    
    return {
      amount: isNaN(amount) ? 0 : amount,
      merchant,
      upiId,
      description
    };
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
};

export const scanQRFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imageData = e.target?.result as string;
        const img = new Image();
        img.onload = async () => {
          try {
            const result = await QrScanner.scanImage(img);
            resolve(result);
          } catch (error) {
            reject(new Error('Could not scan QR code from image'));
          }
        };
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = imageData;
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
};

// Generate sample UPI QR codes for testing
export const generateSampleQRCodes = () => [
  'upi://pay?pa=merchant1@paytm&pn=Coffee Shop&am=150&tn=Coffee Purchase',
  'upi://pay?pa=store@phonepe&pn=Grocery Store&am=450&tn=Grocery Shopping',
  'upi://pay?pa=restaurant@gpay&pn=Pizza Palace&am=320&tn=Food Order',
  'upi://pay?pa=fuel@upi&pn=Petrol Pump&am=2000&tn=Fuel Payment',
  'upi://pay?pa=shop@paytm&pn=Electronics Store&am=15000&tn=Mobile Purchase'
];