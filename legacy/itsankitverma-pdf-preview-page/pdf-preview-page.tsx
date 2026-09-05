import { cn } from "../_utils/cn";
import { useState, useRef } from "react";
import { Button } from "./button"
import { Card } from "./card"
import { Alert } from "./alert"

interface Screenshot {
  id: string
  dataUrl: string
  pageNumber: number
}

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  isProcessing: boolean
  pdfLibLoaded: boolean
  error: string | null
  file: File | null
  screenshots: Screenshot[]
}

export const FileUpload = ({
  onFileUpload,
  onClear,
  isProcessing,
  pdfLibLoaded,
  error,
  file,
  screenshots,
}: FileUploadProps) => {
   const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const hasScreenshots = screenshots.length > 0

  return (
    <Card className="p-8 bg-gray-100 shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-110"></div>
      
      <div
        className={`relative flex flex-col ${hasScreenshots ? 'md:flex-row gap-8 items-start' : 'items-center'}`}
      >
        <div
          className={`flex flex-col items-center jc py-5 ${hasScreenshots ? 'md:w-1/2 w-full' : 'w-full max-w-xl'} space-y-8`}
        >
          <div 
            onClick={handleUploadClick}
            className="w-full max-w-xl p-8 mb-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group/upload relative"
          >
            <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-xl group-hover/upload:border-yellow-400 transition-colors"></div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={onFileUpload}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center rotate-12 transform group-hover/upload:rotate-0 transition-all duration-300 shadow-lg">
                  <svg 
                    className="w-10 h-10 text-black" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover/upload:scale-110 transition-transform shadow-lg">
                  <svg 
                    className="w-5 h-5 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {!pdfLibLoaded ? 'Initializing...' : 'Drop your PDF here'}
                </h3>
                <p className="text-gray-600">
                  {!pdfLibLoaded ? 
                    'Setting up PDF processor...' : 
                    'or click to browse from your computer'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleUploadClick}
              disabled={!pdfLibLoaded || isProcessing}
              className="bg-black hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 min-w-[160px] disabled:bg-gray-400"
              size="lg"
            >
              {!pdfLibLoaded ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-400 border-t-transparent"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                'Select File'
              )}
            </Button>
            
            {screenshots.length > 0 && (
              <Button
                onClick={onClear}
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200 min-w-[160px] shadow-md hover:shadow-lg"
              >
                Clear All
              </Button>
            )}
          </div>

          {file && (
            <div className="hidden md:flex items-center justify-center w-full">
              <div className="flex items-center gap-5 px-6 py-5 bg-white border border-gray-200 rounded-xl shadow-lg max-w-md w-full">
                <div className="flex items-center justify-center w-14 h-14 bg-yellow-400/20 text-yellow-600 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 3.75h6.379a2.25 2.25 0 011.591.659l4.121 4.121a2.25 2.25 0 01.659 1.591V18a2.25 2.25 0 01-2.25 2.25h-10.5A2.25 2.25 0 015 18V6a2.25 2.25 0 012.25-2.25z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>{screenshots.length} {screenshots.length === 1 ? 'Page' : 'Pages'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {isProcessing && (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
              <p className="mt-4 text-white font-medium">
                Processing PDF pages...
              </p>
            </div>
          </div>
        )}

        {hasScreenshots && (
          <div className="w-full md:w-1/2 max-h-[500px] overflow-auto pr-1">
            <div className="grid grid-cols-1 gap-4">
              {screenshots.map((shot) => (
                <div
                  key={shot.id}
                  className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <span className="absolute top-2 left-2 z-10 text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 border border-gray-200 backdrop-blur-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    Page {shot.pageNumber}
                  </span>
                  <img src={shot.dataUrl} alt={`Page ${shot.pageNumber}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-6 border-2 border-red-300 bg-red-50/80 backdrop-blur-sm">
          {error}
        </Alert>
      )}
    </Card>
  );
};
