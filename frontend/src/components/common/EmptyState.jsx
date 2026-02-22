function EmptyState({ title, subtitle }) {
  return (
    <div className="text-center text-muted py-5">
      <h6 className="fw-semibold">{title}</h6>
      <p className="small mb-0">{subtitle}</p>
    </div>
  );
}

export default EmptyState;