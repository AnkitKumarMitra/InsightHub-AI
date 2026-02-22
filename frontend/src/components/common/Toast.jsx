function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="position-fixed bottom-0 end-0 p-3">
      <div className="toast show">
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
}

export default Toast;