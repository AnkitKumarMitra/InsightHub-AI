function PageContainer({ title, subtitle, children }) {
  return (
    <>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">{title}</h4>
        {subtitle && (
          <p className="text-muted mb-0">{subtitle}</p>
        )}
      </div>
      {children}
    </>
  );
}

export default PageContainer;