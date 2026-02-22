function UploadResult({ result }) {
  return (
    <div className="alert alert-success mt-3">
      <strong>Upload successful!</strong>
      <div className="small mt-1">
        {result.filename} — {result.chunks_indexed} chunks indexed
      </div>
    </div>
  );
}

export default UploadResult;