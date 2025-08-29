import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StaffManagers() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    skills: "",
    manager_id: "", // matches serializer
  });
  const [managers, setManagers] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Fetch managers for dropdown
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/managers/", {
        headers: { Authorization: "Bearer " + localStorage.getItem("access_token") },
      })
      .then((res) => setManagers(res.data.data || res.data))
      .catch((err) => console.error("Error fetching managers:", err));
  }, []);

  // Fetch staff list
  const fetchStaffList = () => {
    axios
      .get("http://127.0.0.1:8000/api/staff/", {
        headers: { Authorization: "Bearer " + localStorage.getItem("access_token") },
      })
      .then((res) => setStaffList(res.data.data || res.data))
      .catch((err) => console.error("Error fetching staff:", err));
  };
  useEffect(() => {
    fetchStaffList();
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.skills.trim()) newErrors.skills = "Skills are required";
    if (!form.manager_id) newErrors.manager_id = "Please select a manager";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post("http://127.0.0.1:8000/api/staff/", form, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
      });
      setMessage("✅ Staff added successfully!");
      setForm({ full_name: "", email: "", phone: "", skills: "", manager_id: "" });
      setShowModal(false);
      fetchStaffList();
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage("❌ " + JSON.stringify(error.response.data));
      } else {
        setMessage("❌ Error adding staff.");
      }
    }
  };

  // Open/close modal
  const openModal = () => {
    setShowModal(true);
    setMessage("");
    setErrors({});
  };
  const closeModal = () => {
    setForm({ full_name: "", email: "", phone: "", skills: "", manager_id: "" });
    setErrors({});
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary mb-3" onClick={openModal}>
        + Add Staff
      </button>

      {/* Add Staff Modal */}
      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit} noValidate>
                <div className="modal-header">
                  <h5 className="modal-title">Add Staff Member</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>

                <div className="modal-body">
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.full_name ? "is-invalid" : ""}`}
                    placeholder="Full Name"
                    required
                  />
                  {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}

                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Email"
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.phone ? "is-invalid" : ""}`}
                    placeholder="Phone"
                    required
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

                  <input
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.skills ? "is-invalid" : ""}`}
                    placeholder="Skills"
                    required
                  />
                  {errors.skills && <div className="invalid-feedback">{errors.skills}</div>}

                  <select
                    name="manager_id"
                    value={form.manager_id}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.manager_id ? "is-invalid" : ""}`}
                    required
                  >
                    <option value="">Select Manager</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.full_name}
                      </option>
                    ))}
                  </select>
                  {errors.manager_id && (
                    <div className="invalid-feedback">{errors.manager_id}</div>
                  )}

                  {message && <div className="alert alert-info mt-2">{message}</div>}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Staff Table */}
      <h2>Staff Members</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Skills</th>
            <th>Manager</th>
          </tr>
        </thead>
        <tbody>
          {staffList.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No staff members found
              </td>
            </tr>
          ) : (
            staffList.map((staff) => (
              <tr key={staff.id}>
                <td>{staff.full_name}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>{staff.skills}</td>
                <td>
                  {staff.manager?.full_name || staff.manager_id || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
