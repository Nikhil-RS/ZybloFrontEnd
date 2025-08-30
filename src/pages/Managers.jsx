import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Managers() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    department_id: "",
    team: "",
  });
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [managers, setManagers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");

  // Fetch departments
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/departments/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  // Fetch managers
  const fetchManagers = () => {
    axios
      .get("http://127.0.0.1:8000/api/managers/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
      .then((res) => setManagers(res.data.data || res.data))
      .catch((err) => console.error("Error fetching managers:", err));
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.department_id) newErrors.department_id = "Please select a department";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("http://127.0.0.1:8000/api/managers/", form, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
      });

      setMessage("✅ Manager added successfully!");
      setForm({ full_name: "", email: "", phone: "", department_id: "", team: "" });
      setShowModal(false);
      setErrors({});
      fetchManagers();
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage("❌ Error adding manager: " + (error.response?.data?.detail || "Unknown error"));
    }
  };

  // Filtering logic
  const filteredManagers = managers.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.toLowerCase().includes(search.toLowerCase());

    const matchesDept = filterDept ? m.department?.id === parseInt(filterDept) : true;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="container mt-4">
      {/* Top controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Add Manager
        </button>

        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name/email/phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-control"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit} noValidate>
                <div className="modal-header">
                  <h5 className="modal-title">Add Manager</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
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

                  <select
                    name="department_id"
                    value={form.department_id}
                    onChange={handleChange}
                    className={`form-control mb-2 ${errors.department_id ? "is-invalid" : ""}`}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.department_id && <div className="invalid-feedback">{errors.department_id}</div>}

                  <input
                    name="team"
                    value={form.team}
                    onChange={handleChange}
                    className="form-control mb-2"
                    placeholder="Team Name"
                  />

                  {message && <div className="alert alert-info mt-2">{message}</div>}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Manager
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manager List */}
      <h2>Managers List</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Team</th>
            <th>Email</th>
            <th>Joined On</th>
          </tr>
        </thead>
        <tbody>
          {filteredManagers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No managers found
              </td>
            </tr>
          ) : (
            filteredManagers.map((manager, idx) => (
              <tr key={idx}>
                <td>{manager.full_name}</td>
                <td>{manager.phone}</td>
                <td>{manager.department?.name || "-"}</td>
                <td>{manager.team || "-"}</td>
                <td>{manager.email}</td>
                <td>{manager.joined_on}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Managers;
