// 📄 components/QRCodeDisplay.tsx

import QRCode from 'qrcode.react';

export default function QRCodeDisplay({ formId }: { formId: string }) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/checkin?form_id=${formId}`;

  return (
    <div className="flex flex-col items-center space-y-2">
      <QRCode value={url} size={200} />
      <p className="text-sm break-all text-center">{url}</p>
    </div>
  );
}
