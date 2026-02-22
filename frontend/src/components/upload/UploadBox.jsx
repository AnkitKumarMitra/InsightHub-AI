import { useRef } from "react";

const ALLOWED_EXTENSIONS = ["pdf", "txt", "docx"];

function UploadBox({ onFilesSelect, disabled }) {
  const fileInputRef = useRef(null);

  const validateFiles = (files) => {
    return Array.from(files).filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      return ALLOWED_EXTENSIONS.includes(ext);
    });
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const validFiles = validateFiles(e.target.files);
    if (validFiles.length) onFilesSelect(validFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;

    const validFiles = validateFiles(e.dataTransfer.files);
    if (validFiles.length) onFilesSelect(validFiles);
  };

  return (
    <div
      className={`border rounded p-4 text-center upload-hover ${
        disabled ? "bg-light" : "bg-white"
      }`}
      style={{
        borderStyle: "dashed",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={handleClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="d-none"
        multiple
        accept=".pdf,.txt,.docx"
        onChange={handleChange}
        disabled={disabled}
      />

      <p className="mb-1 fw-semibold">
        Drag & drop files here
      </p>
      <p className="text-muted small mb-0">
        PDF, TXT, DOCX — multiple files supported
      </p>
    </div>
  );
}

export default UploadBox;