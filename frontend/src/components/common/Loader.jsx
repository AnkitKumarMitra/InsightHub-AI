function Loader({ fullScreen = false }) {
  const classes = fullScreen
    ? "vh-100 d-flex justify-content-center align-items-center"
    : "d-flex justify-content-center align-items-center";

  return (
    <div className={classes}>
      <div className="spinner-border text-primary" role="status" />
    </div>
  );
}

export default Loader;