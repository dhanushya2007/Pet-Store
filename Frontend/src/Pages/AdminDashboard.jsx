import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/Css/Admin.css";
import logo from "../Assets/Images/logo.png";
import API_BASE from "../api";
import { useAuth } from "../context/AuthContext";

const TABS = ["Overview","Users","Sellers","Pet Listings","Adoption Requests"];

function Stat({ title, value, icon, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-value" style={{ color: color||"inherit" }}>{value ?? "–"}</div>
        <div className="stat-title">{title}</div>
        {sub && <div style={{ fontSize:11, color:"#f39c12", fontWeight:700, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Badge({ value }) {
  const map = {
    pending:"#f39c12", approved:"#27ae60", rejected:"#e74c3c",
    admin:"#8e44ad", seller:"#e8721a", user:"#3498db",
    true:"#27ae60", false:"#e74c3c",
    suspended:"#e74c3c", active:"#27ae60"
  };
  const s = String(value);
  return <span style={{ background:map[s]||"#ccc", color:"#fff", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{s.toUpperCase()}</span>;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, authFetch, logout, isAdmin, isAuthenticated } = useAuth();
  const [tab, setTab]     = useState("Overview");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [pets, setPets]   = useState([]);
  const [apps, setApps]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!isAdmin)          { navigate("/"); return; }
    loadAll();
  }, [isAuthenticated, isAdmin]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes,uRes,slRes,pRes,aRes] = await Promise.all([
        authFetch(`${API_BASE}/api/admin/stats`),
        authFetch(`${API_BASE}/api/admin/users`),
        authFetch(`${API_BASE}/api/admin/sellers`),
        authFetch(`${API_BASE}/api/admin/pets`),
        authFetch(`${API_BASE}/api/admin/applications`),
      ]);
      const [s,u,sl,p,a] = await Promise.all([sRes.json(),uRes.json(),slRes.json(),pRes.json(),aRes.json()]);
      setStats(s||{});
      setUsers(Array.isArray(u)?u:[]);
      setSellers(Array.isArray(sl)?sl:[]);
      setPets(Array.isArray(p)?p:[]);
      setApps(Array.isArray(a)?a:[]);
    } catch(_) {}
    setLoading(false);
  }, [authFetch]);

  // Toggle user/seller suspend (isApproved toggle)
  async function toggleSuspend(id) {
    await authFetch(`${API_BASE}/api/admin/users/${id}/approve`, { method:"PUT" });
    loadAll();
  }
  async function deleteUser(id) {
    if (!window.confirm("Permanently delete this user? This cannot be undone.")) return;
    await authFetch(`${API_BASE}/api/admin/users/${id}`, { method:"DELETE" });
    loadAll();
  }
  async function togglePetApproval(id) {
    await authFetch(`${API_BASE}/api/admin/pets/${id}/approve`, { method:"PUT" });
    loadAll();
  }
  async function deletePet(id) {
    if (!window.confirm("Remove this listing? It will be permanently deleted.")) return;
    await authFetch(`${API_BASE}/api/admin/pets/${id}`, { method:"DELETE" });
    loadAll();
  }

  // Filtering helpers
  const filteredUsers   = users.filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  const filteredSellers = sellers.filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));
  const filteredPets    = pets.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.species?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <img src={logo} alt="logo" />
          <h3>PetStore Admin</h3>
        </div>
        <nav className="admin-nav">
          {TABS.map(t => (
            <a key={t} href="#!" className={tab===t?"active":""} onClick={e=>{e.preventDefault();setTab(t);}}>
              {t==="Overview"?"📊 ":t==="Users"?"👥 ":t==="Sellers"?"🏪 ":t==="Pet Listings"?"🐾 ":"📋 "}{t}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="button ghost" onClick={() => { logout(); navigate("/"); }}>🚪 Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="search">
            <input
              placeholder="Search users, sellers, pets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="top-actions">
            <div className="user-chip">👤 {user?.name}</div>
          </div>
        </header>

        <section className="admin-content container">
          {loading ? <p style={{ padding:40, textAlign:"center" }}>Loading...</p> : <>

            {/* ── Overview ── */}
            {tab==="Overview" && (
              <>
                <div className="page-title glass">
                  <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
                  <p className="muted">Live stats from your MongoDB database.</p>
                </div>
                <div className="stats-grid">
                  <Stat title="Total Users"    value={stats.users}       icon="👥" />
                  <Stat title="Sellers"        value={stats.sellers}     icon="🏪" />
                  <Stat title="Pet Listings"   value={stats.pets}        icon="🐾" sub={`${stats.pendingPets||0} awaiting approval`} />
                  <Stat title="Applications"   value={stats.applications} icon="📋" sub={`${stats.pendingApps||0} pending`} />
                </div>
                <div className="glass content-grid">
                  <div className="card big">
                    <h3>Pending Actions</h3>
                    <ul className="compact-list">
                      <li>🐾 <strong>{stats.pendingPets||0}</strong> pet listings awaiting approval</li>
                      <li>📋 <strong>{stats.pendingApps||0}</strong> adoption applications pending</li>
                      <li>🏪 <strong>{stats.sellers||0}</strong> registered sellers</li>
                      <li>👥 <strong>{stats.users||0}</strong> registered users</li>
                    </ul>
                    <div style={{ marginTop:16, display:"flex", gap:10, flexWrap:"wrap" }}>
                      <button className="admin-action-btn" onClick={() => setTab("Pet Listings")}>Review Pet Listings</button>
                      <button className="admin-action-btn" onClick={() => setTab("Adoption Requests")}>View Requests</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Users ── */}
            {tab==="Users" && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h2 style={{ color:"var(--green)" }}>All Users ({filteredUsers.length})</h2>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Account Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u=>(
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td style={{ fontSize:12, color:"#7a857c" }}>{u.email}</td>
                          <td><Badge value={u.role} /></td>
                          <td style={{ fontSize:12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td><Badge value={u.isApproved?"active":"suspended"} /></td>
                          <td>
                            <button className="admin-action-btn"
                              onClick={()=>toggleSuspend(u._id)}
                              title={u.isApproved?"Suspend this user":"Restore this user"}>
                              {u.isApproved?"🔒 Suspend":"🔓 Restore"}
                            </button>
                            <button className="admin-action-btn danger" onClick={()=>deleteUser(u._id)}
                              title="Permanently delete user">
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── Sellers ── */}
            {tab==="Sellers" && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h2 style={{ color:"var(--green)" }}>All Sellers ({filteredSellers.length})</h2>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Shop</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredSellers.map(s=>(
                        <tr key={s._id}>
                          <td>{s.name}</td>
                          <td style={{ fontSize:12, color:"#7a857c" }}>{s.email}</td>
                          <td>{s.shopName||"—"}</td>
                          <td style={{ fontSize:12 }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                          <td><Badge value={s.isApproved?"active":"suspended"} /></td>
                          <td>
                            <button className="admin-action-btn" onClick={()=>toggleSuspend(s._id)}>
                              {s.isApproved?"🔒 Suspend":"🔓 Restore"}
                            </button>
                            <button className="admin-action-btn danger" onClick={()=>deleteUser(s._id)}>
                              🗑 Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── Pet Listings ── */}
            {tab==="Pet Listings" && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h2 style={{ color:"var(--green)" }}>All Pet Listings ({filteredPets.length})</h2>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Pet</th><th>Species</th><th>Seller</th><th>Price</th><th>Type</th><th>Approved</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredPets.map(p=>(
                        <tr key={p._id}>
                          <td style={{ display:"flex", alignItems:"center", gap:8 }}>
                            {p.imageUrl && <img src={p.imageUrl} alt={p.name}
                              style={{ width:36, height:36, objectFit:"cover", borderRadius:6 }}
                              onError={e=>e.target.style.display="none"} />}
                            <span>{p.name}</span>
                          </td>
                          <td>{p.species}</td>
                          <td style={{ fontSize:12 }}>{p.seller?.name||"—"}</td>
                          <td>${p.price||0}</td>
                          <td>{p.adoptionType}</td>
                          <td><Badge value={String(p.isApproved)} /></td>
                          <td><Badge value={p.status} /></td>
                          <td>
                            <button className="admin-action-btn" onClick={()=>togglePetApproval(p._id)}>
                              {p.isApproved?"✕ Reject":"✓ Approve"}
                            </button>
                            <button className="admin-action-btn danger" onClick={()=>deletePet(p._id)}>
                              🗑 Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── Adoption Requests ── */}
            {tab==="Adoption Requests" && (
              <>
                <h2 style={{ margin:"0 0 16px", color:"var(--green)" }}>All Adoption Applications ({apps.length})</h2>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>Applicant</th><th>Pet</th><th>Contact</th><th>Location</th><th>Reason</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {apps.map(a=>(
                        <tr key={a._id}>
                          <td>{a.applicantName}</td>
                          <td>{a.petName}</td>
                          <td style={{ fontSize:12 }}>{a.contactNumber}</td>
                          <td style={{ fontSize:12 }}>{a.location || "—"}</td>
                          <td style={{ fontSize:12, maxWidth:200 }}>{a.reason?.slice(0,60)}{a.reason?.length>60?"…":""}</td>
                          <td><Badge value={a.status} /></td>
                          <td style={{ fontSize:12 }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </>}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
