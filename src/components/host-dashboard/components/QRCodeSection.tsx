// ============================================================================
// FILE: components/host-dashboard/components/QRCodeSection.tsx
// ============================================================================

import React from "react"
import { QRCodeCanvas } from "qrcode.react"

interface QRCodeSectionProps {
  joinUrl: string
}

export function QRCodeSection({ joinUrl }: QRCodeSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📱 Join Quiz</h3>
      {joinUrl && (
        <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-200">
          <QRCodeCanvas value={joinUrl} size={150} />
        </div>
      )}
      <p className="text-sm text-gray-600 mt-4">
        Scan QR code or visit: <br />
        <span className="font-mono text-purple-600">{joinUrl}</span>
      </p>
    </div>
  )
}