"use client"

import { useState, useEffect, useCallback } from "react"

interface FileUpload {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "paused" | "completed" | "error"
  speed: number
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatTime = (seconds: number) => {
  if (seconds < 60) return `${Math.ceil(seconds)}s`
  return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`
}

const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase()
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return { icon: "image", color: "#8b5cf6" }
  if (["mp4", "mov", "avi", "webm"].includes(ext || "")) return { icon: "video", color: "#ef4444" }
  if (["pdf"].includes(ext || "")) return { icon: "pdf", color: "#ef4444" }
  if (["doc", "docx"].includes(ext || "")) return { icon: "doc", color: "#3b82f6" }
  if (["zip", "rar", "7z"].includes(ext || "")) return { icon: "archive", color: "#f59e0b" }
  return { icon: "file", color: "#6b7280" }
}

const initialFiles: FileUpload[] = [
  { id: "1", name: "project-assets.zip", size: 45000000, progress: 67, status: "uploading", speed: 2500000 },
  { id: "2", name: "presentation.pdf", size: 12000000, progress: 100, status: "completed", speed: 0 },
  { id: "3", name: "video-demo.mp4", size: 120000000, progress: 23, status: "paused", speed: 0 },
  { id: "4", name: "screenshot.png", size: 2500000, progress: 45, status: "uploading", speed: 1800000 },
]

export function Component() {
  const [files, setFiles] = useState<FileUpload[]>(initialFiles)

  const simulateProgress = useCallback(() => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.status === "uploading" && file.progress < 100) {
          const newProgress = Math.min(100, file.progress + Math.random() * 3)
          return {
            ...file,
            progress: newProgress,
            status: newProgress >= 100 ? "completed" : "uploading",
            speed: newProgress >= 100 ? 0 : file.speed + (Math.random() - 0.5) * 500000,
          }
        }
        return file
      }),
    )
  }, [])

  useEffect(() => {
    const interval = setInterval(simulateProgress, 500)
    return () => clearInterval(interval)
  }, [simulateProgress])

  const togglePause = (id: string) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === id) {
          if (file.status === "uploading") return { ...file, status: "paused", speed: 0 }
          if (file.status === "paused") return { ...file, status: "uploading", speed: 2000000 }
        }
        return file
      }),
    )
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const retryFile = (id: string) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, status: "uploading", progress: 0, speed: 2000000 } : file)),
    )
  }

  const totalProgress = files.length > 0 ? files.reduce((acc, f) => acc + f.progress, 0) / files.length : 0
  const uploadingCount = files.filter((f) => f.status === "uploading").length
  const completedCount = files.filter((f) => f.status === "completed").length

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "48px 24px" }}>
      <style jsx>{`
        @keyframes progress-shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .progress-bar {
          position: relative;
          overflow: hidden;
        }
        .progress-bar.uploading::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: progress-shine 1.5s infinite;
        }
        .file-row {
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .file-row:hover {
          background-color: #f1f5f9;
          transform: translateX(4px);
        }
        .action-btn {
          transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .action-btn:hover {
          transform: scale(1.1);
        }
        .action-btn:active {
          transform: scale(0.95);
        }
      `}</style>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>File Uploads</h1>
          <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "14px" }}>
            <span>{files.length} files</span>
            <span>{uploadingCount} uploading</span>
            <span>{completedCount} completed</span>
          </div>
        </div>

        {/* Overall Progress */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontWeight: "600", color: "#0f172a" }}>Overall Progress</span>
            <span style={{ fontWeight: "600", color: "#3b82f6" }}>{Math.round(totalProgress)}%</span>
          </div>
          <div style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
            <div
              style={{
                width: `${totalProgress}%`,
                height: "100%",
                backgroundColor: "#3b82f6",
                borderRadius: "9999px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* File List */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {files.map((file, index) => {
            const { icon, color } = getFileIcon(file.name)
            const remainingBytes = file.size * (1 - file.progress / 100)
            const eta = file.speed > 0 ? remainingBytes / file.speed : 0

            return (
              <div
                key={file.id}
                className="file-row"
                style={{
                  padding: "16px 20px",
                  borderBottom: index < files.length - 1 ? "1px solid #e2e8f0" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {/* File Icon */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      backgroundColor: `${color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {icon === "image" && (
                        <>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </>
                      )}
                      {icon === "video" && (
                        <>
                          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                          <line x1="7" y1="2" x2="7" y2="22" />
                          <line x1="17" y1="2" x2="17" y2="22" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <line x1="2" y1="7" x2="7" y2="7" />
                          <line x1="2" y1="17" x2="7" y2="17" />
                          <line x1="17" y1="17" x2="22" y2="17" />
                          <line x1="17" y1="7" x2="22" y2="7" />
                        </>
                      )}
                      {icon === "pdf" && (
                        <>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </>
                      )}
                      {icon === "archive" && (
                        <>
                          <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" />
                        </>
                      )}
                      {(icon === "file" || icon === "doc") && (
                        <>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </>
                      )}
                    </svg>
                  </div>

                  {/* File Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "500",
                          color: "#0f172a",
                          fontSize: "14px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        {file.name}
                      </p>
                      <span style={{ fontSize: "13px", fontWeight: "500", color: "#3b82f6", marginLeft: "12px" }}>
                        {Math.round(file.progress)}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                      className={`progress-bar ${file.status === "uploading" ? "uploading" : ""}`}
                      style={{
                        height: "6px",
                        backgroundColor: "#e2e8f0",
                        borderRadius: "9999px",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: `${file.progress}%`,
                          height: "100%",
                          backgroundColor:
                            file.status === "completed"
                              ? "#10b981"
                              : file.status === "error"
                                ? "#ef4444"
                                : file.status === "paused"
                                  ? "#f59e0b"
                                  : "#3b82f6",
                          borderRadius: "9999px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>

                    {/* Status Info */}
                    <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#64748b" }}>
                      <span>{formatSize(file.size)}</span>
                      {file.status === "uploading" && file.speed > 0 && (
                        <>
                          <span>{formatSize(file.speed)}/s</span>
                          <span>ETA: {formatTime(eta)}</span>
                        </>
                      )}
                      {file.status === "paused" && <span style={{ color: "#f59e0b" }}>Paused</span>}
                      {file.status === "completed" && <span style={{ color: "#10b981" }}>Completed</span>}
                      {file.status === "error" && <span style={{ color: "#ef4444" }}>Error</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(file.status === "uploading" || file.status === "paused") && (
                      <button
                        className="action-btn"
                        onClick={() => togglePause(file.id)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: file.status === "paused" ? "#dbeafe" : "#fef3c7",
                          color: file.status === "paused" ? "#3b82f6" : "#f59e0b",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {file.status === "paused" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        )}
                      </button>
                    )}
                    {file.status === "error" && (
                      <button
                        className="action-btn"
                        onClick={() => retryFile(file.id)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: "none",
                          backgroundColor: "#fef2f2",
                          color: "#ef4444",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="23 4 23 10 17 10" />
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                      </button>
                    )}
                    <button
                      className="action-btn"
                      onClick={() => removeFile(file.id)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
