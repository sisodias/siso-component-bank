"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card"
import { Button } from "./button"
import { CheckIcon, DownloadIcon } from "lucide-react"

export interface QRCodeResult {
  data: string
  size: number
  output: string 
}

type QRCodeDisplayProps = {
  data?: QRCodeResult | null
  isLoading?: boolean
  error?: string | null
}

export function QRCodeDisplay({ data, isLoading, error }: QRCodeDisplayProps) {
  const [downloading, setDownloading] = React.useState(false)
  const [downloaded, setDownloaded] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)

  const handleDownload = async () => {
    if (!data?.output) return
    setDownloading(true)
    setLocalError(null)
    try {
      const response = await fetch(data.output)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "qrcode.png"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 1200)
    } catch (e) {
      console.error("Failed to download QR code:", e)
      setLocalError("Failed to download. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
        <CardDescription>
          {data?.data
            ? data.data.length > 50
              ? `${data.data.slice(0, 50)}...`
              : data.data
            : "Generate or pass a QR code result"}
        </CardDescription>
      </CardHeader>

      {/* Loading */}
      {isLoading && (
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-full max-w-[300px] aspect-square rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-28 bg-muted rounded animate-pulse" />
          <Button disabled className="w-full">
            Download PNG
          </Button>
        </CardContent>
      )}

      {/* Error */}
      {!isLoading && (error || localError) && (
        <CardContent>
          <div className="text-sm text-red-600" role="status" aria-live="assertive">
            {error || localError}
          </div>
        </CardContent>
      )}

      {/* Empty */}
      {!isLoading && !error && !localError && !data && (
        <CardContent className="text-sm text-muted-foreground">
          No data yet. Pass a <code>QRCodeResult</code> to render the preview.
        </CardContent>
      )}

      {/* Data */}
      {!isLoading && !error && !localError && data && (
        <CardContent className="flex flex-col items-center gap-4">
          <div
            className="w-full rounded-lg bg-white p-4"
            style={{ maxWidth: `${data.size}px` }}
          >
            <img
              src={data.output}
              alt={
                data.data.length > 50
                  ? `QR code for '${data.data.slice(0, 50)}...'`
                  : `QR code for '${data.data}'`
              }
              width={data.size}
              height={data.size}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </div>
          <div className="text-sm text-muted-foreground">Size: {data.size}px</div>
          <Button
            onClick={handleDownload}
            disabled={downloading || !data.output}
            className="w-full"
            aria-busy={downloading}
            aria-live="polite"
            aria-label={
              downloaded
                ? "QR code saved"
                : downloading
                ? "Downloading QR code"
                : "Download QR code as PNG"
            }
          >
            {downloaded ? (
              <>
                <CheckIcon className="mr-1.5" />
                Saved
              </>
            ) : (
              <>
                <DownloadIcon className="mr-1.5" />
                {downloading ? "Downloading..." : "Download PNG"}
              </>
            )}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

export default QRCodeDisplay
