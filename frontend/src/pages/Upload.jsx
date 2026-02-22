import { useState } from "react";
import UploadBox from "../components/upload/UploadBox";
import UploadProgress from "../components/upload/UploadProgress";
import { uploadDocuments } from "../api/documents.api";

function Upload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleFilesSelect = async (files) => {
    setError("");
    setResults([]);
    setProgress(0);

    try {
      setUploading(true);

      const uploadedResults = await uploadDocuments(
        files,
        (current, total, percent) => {
          const overall =
            Math.round(
              ((current - 1) / total) * 100 +
                percent / total
            );
          setProgress(overall);
        }
      );

      setResults(uploadedResults);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to upload documents. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        {/* Page Header */}
        <div className="mb-4">
          <h4 className="fw-bold mb-1">Upload Documents</h4>
          <p className="text-muted mb-0">
            Add documents to your knowledge base
          </p>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <UploadBox
              onFilesSelect={handleFilesSelect}
              disabled={uploading}
            />

            {uploading && (
              <UploadProgress progress={progress} />
            )}

            {results.length > 0 && (
              <div className="alert alert-success mt-3">
                <strong>Upload complete</strong>
                <ul className="small mt-2 mb-0">
                  {results.map((r, i) => (
                    <li key={i}>
                      {r.filename} —{" "}
                      {r.chunks_indexed} chunks indexed
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <div className="alert alert-danger mt-3">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;