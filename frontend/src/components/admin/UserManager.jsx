import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaUser,
  FaUserShield,
  FaPen,
} from "react-icons/fa";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAuthor, setShowCreateAuthor] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuthor = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post("/users/author", formData);
      toast.success(`✅ Author "${formData.username}" created!`);

      // Show the temporary password
      toast.custom(
        (t) => (
          <div className="magazine-card p-4 max-w-sm">
            <h4 className="font-serif font-bold text-burgundy">
              📝 Author Created!
            </h4>
            <p className="text-sm mt-2">
              <strong>Username:</strong> {formData.username}
              <br />
              <strong>Temporary Password:</strong>{" "}
              <span className="font-mono bg-ink/5 px-2 py-1 rounded">
                {formData.password}
              </span>
            </p>
            <p className="text-xs text-ink/50 mt-2">
              Share these credentials with your author. They can change their
              password after login.
            </p>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="mt-3 bg-burgundy text-white px-4 py-1 rounded text-sm hover:bg-burgundy/90"
            >
              Got it
            </button>
          </div>
        ),
        { duration: 10000 },
      );

      setFormData({ username: "", email: "", password: "", bio: "" });
      setShowCreateAuthor(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create author");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (!confirm(`Delete "${username}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success(`User "${username}" deleted`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete user");
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-burgundy" />;
      case "author":
        return <FaPen className="text-gold" />;
      default:
        return <FaUser className="text-ink/40" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-burgundy/10 text-burgundy";
      case "author":
        return "bg-gold/10 text-gold";
      default:
        return "bg-ink/5 text-ink/50";
    }
  };

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif">👥 User Management</h2>
        <button
          onClick={() => setShowCreateAuthor(!showCreateAuthor)}
          className="bg-burgundy text-white px-4 py-2 rounded-lg text-sm hover:bg-burgundy/90 transition-colors flex items-center gap-2"
        >
          <FaUserPlus /> Add Author
        </button>
      </div>

      {/* Create Author Form */}
      {showCreateAuthor && (
        <div className="magazine-card p-6 mb-6">
          <h3 className="font-serif font-semibold mb-4">
            📝 Create New Author
          </h3>
          <form onSubmit={handleCreateAuthor} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-serif mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                  placeholder="author_username"
                />
              </div>
              <div>
                <label className="block text-sm font-serif mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                  placeholder="author@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-serif mb-1">
                Temporary Password *
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
                className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                placeholder="temp123"
              />
              <p className="text-xs text-ink/40 mt-1">
                Share this password with the author. They can change it after
                login.
              </p>
            </div>
            <div>
              <label className="block text-sm font-serif mb-1">Bio</label>
              <input
                type="text"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                placeholder="Guest Author, Legal Expert"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Author"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateAuthor(false)}
                className="border border-ink/20 px-6 py-2 rounded-lg hover:bg-ink/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/20 text-left text-sm text-ink/50">
              <th className="pb-2 font-serif">User</th>
              <th className="pb-2 font-serif hidden md:table-cell">Email</th>
              <th className="pb-2 font-serif">Role</th>
              <th className="pb-2 font-serif hidden lg:table-cell">Joined</th>
              <th className="pb-2 font-serif text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gold/10 hover:bg-cream/50 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <div className="font-serif font-medium">
                        {user.username}
                      </div>
                      {user.bio && (
                        <div className="text-xs text-ink/40">{user.bio}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 hidden md:table-cell text-sm text-ink/60">
                  {user.email}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-serif ${getRoleColor(user.role)}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 hidden lg:table-cell text-sm text-ink/40">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Role changer (admin only) */}
                    {user.role !== "admin" && (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleChangeRole(user._id, e.target.value)
                        }
                        className="text-xs border border-gold/20 rounded px-2 py-1 bg-white/50 focus:outline-none"
                      >
                        <option value="author">Author</option>
                        <option value="guest">Guest</option>
                      </select>
                    )}

                    {/* Delete button (can't delete self) */}
                    {user.role !== "admin" && (
                      <button
                        onClick={() =>
                          handleDeleteUser(user._id, user.username)
                        }
                        className="p-2 text-ink/30 hover:text-red-500 transition-colors"
                        title="Delete user"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-10 text-ink/40">
          No users yet. Create your first author!
        </div>
      )}
    </div>
  );
}
