import React, { useState, useRef } from 'react'
import { Document, DocumentType } from '../types/userProfile'

interface DocumentUploadProps {
  documentType: DocumentType
  existingDocument?: Document
  onUpload: (file: File, documentType: DocumentType) => Promise<void>
  onDelete?: (documentId: number) => Promise<void>
  onDownload?: (documentId: number, fileName: string) => Promise<void>
  isLoading?: boolean
  label: string
  description: string
  onShowWarning?: (message: string) => void
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  existingDocument,
  onUpload,
  onDelete,
  onDownload,
  isLoading = false,
  label,
  description,
  onShowWarning
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      onShowWarning?.('Solo se permiten archivos PDF')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      onShowWarning?.('El archivo no debe superar los 10MB')
      return
    }

    setUploadProgress(0)
    // Simular progreso de upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 100)

    onUpload(file, documentType)
      .then(() => {
        setUploadProgress(100)
        setTimeout(() => setUploadProgress(null), 1000)
      })
      .catch(() => {
        setUploadProgress(null)
        clearInterval(interval)
      })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{label}</h4>
        {existingDocument && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ Subido
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {existingDocument ? (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">{existingDocument.fileName}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(existingDocument.fileSize)} • Subido el {formatDate(existingDocument.uploadedAt)}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {onDownload && (
                <button
                  onClick={() => onDownload(existingDocument.id, existingDocument.fileName)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  disabled={isLoading}
                >
                  Descargar
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => onDelete(existingDocument.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                  disabled={isLoading}
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadProgress !== null ? (
            <div className="space-y-3">
              <div className="text-primary-600">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Subiendo archivo...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-gray-400">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Arrastra tu archivo aquí o <span className="text-primary-600">selecciona un archivo</span>
                </p>
                <p className="text-xs text-gray-500">PDF hasta 10MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}

export default DocumentUpload