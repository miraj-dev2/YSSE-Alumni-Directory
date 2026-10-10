import React, { useRef, useState } from 'react';
import { Upload, Download, FileText } from 'lucide-react';

interface CsvDropzoneProps {
  onFileSelect: (file: File) => void;
  onDownloadTemplate: () => void;
  isParsing?: boolean;
}

export const CsvDropzone: React.FC<CsvDropzoneProps> = ({
  onFileSelect,
  onDownloadTemplate,
  isParsing = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        onFileSelect(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1F3027] border border-[#2E4336] p-4 rounded">
        <div>
          <h2 className="text-sm font-bold font-heading text-[#EEF3E8]">
            Bulk Alumni Import
          </h2>
          <p className="text-xs text-[#9DB0A2] mt-0.5">
            Upload CSV rosters exported from batch registers or Google Forms.
          </p>
        </div>
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="min-h-[44px] px-3.5 py-2 rounded bg-[#18251D] border border-[#2E4336] text-[#EEF3E8] hover:border-[#B7FF72] hover:text-[#B7FF72] text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#B7FF72]" />
          <span>Download CSV Template</span>
        </button>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors min-h-[160px] flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-[#B7FF72] bg-[#B7FF72]/5'
            : 'border-[#2E4336] bg-[#1F3027]/50 hover:bg-[#1F3027] hover:border-[#9DB0A2]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileSelect(e.target.files[0]);
            }
          }}
        />

        <div className="w-12 h-12 rounded-full bg-[#18251D] border border-[#2E4336] flex items-center justify-center text-[#B7FF72] mb-3">
          {isParsing ? <FileText className="w-6 h-6 animate-pulse" /> : <Upload className="w-6 h-6" />}
        </div>

        <p className="text-sm font-medium text-[#EEF3E8]">
          {isParsing ? 'Parsing and validating file...' : 'Drop CSV file here, or click to browse'}
        </p>
        <p className="text-xs text-[#9DB0A2] mt-1">
          Required headers: <span className="font-mono text-[#EEF3E8]">name, email, batch</span>
        </p>
      </div>
    </div>
  );
};
