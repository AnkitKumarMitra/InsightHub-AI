import { useState } from "react";
import { registerUser } from "../../api/users.api";

function AddUserModal({ show, onClose }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.name || !form.email || !form.password) {
            setError("All fields are required.");
            return;
        }

        try {
            setLoading(true);
            await registerUser(form);
            setSuccess(true);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Failed to create user."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            style={{ zIndex: 1055 }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-sm">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New User</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        />
                    </div>

                    <div className="modal-body">
                        {success ? (
                            <div className="alert alert-success mb-0">
                                User created successfully.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="alert alert-danger py-2">
                                        {error}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        name="name"
                                        className="form-control"
                                        value={form.name}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Temporary Password
                                    </label>
                                    <input
                                        name="password"
                                        type="text"
                                        className="form-control"
                                        value={form.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create User"}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AddUserModal;