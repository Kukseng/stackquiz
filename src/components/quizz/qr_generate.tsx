"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Copy, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRCodeGeneratorProps {
  sessionCode: string
  sessionName: string
}

export function QRCodeGenerator({ sessionCode, sessionName }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [joinLink, setJoinLink] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const baseUrl = window.location.origin
    const link = `${baseUrl}/quiz/join?code=${sessionCode}`
    setJoinLink(link)

    // Generate QR code using a service (you can replace with your preferred QR code library)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`
    setQrCodeUrl(qrUrl)
  }, [sessionCode])

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${sessionName}`,
          text: `Join the quiz "${sessionName}" using code: ${sessionCode}`,
          url: joinLink,
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard(joinLink, "Join link")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Share Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code */}
        <div className="text-center">
          <div className="inline-block p-4 bg-white rounded-lg">
            <img
              src={qrCodeUrl || "/placeholder.svg"}
              alt={`QR Code for ${sessionName}`}
              className="w-48 h-48 mx-auto"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Scan to join the quiz</p>
        </div>

        {/* Session Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Session Code</label>
          <div className="flex gap-2">
            <Input value={sessionCode} readOnly className="font-mono text-center text-lg font-bold" />
            <Button variant="outline" size="icon" onClick={() => copyToClipboard(sessionCode, "Session code")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Join Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Join Link</label>
          <div className="flex gap-2">
            <Input value={joinLink} readOnly className="text-sm" />
            <Button variant="outline" size="icon" onClick={() => copyToClipboard(joinLink, "Join link")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Share Button */}
        <Button onClick={shareLink} className="w-full">
          <Share2 className="h-4 w-4 mr-2" />
          Share Quiz
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>Participants can join by:</p>
          <ul className="mt-1 space-y-1">
            <li>• Scanning the QR code</li>
            <li>• Entering the session code</li>
            <li>• Clicking the join link</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
