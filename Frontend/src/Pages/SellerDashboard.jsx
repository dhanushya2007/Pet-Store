import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../Components/Layout";
import API_BASE from "../api";
import { useAuth } from "../context/AuthContext";

const TABS   = ["My Listings","Add Pet","Adoption Requests","Sales History","Messages","Analytics","Profile"];
const SPECIES = ["dog","cat","bird","rabbit","fish","hamster","other"];

function StatusBadge({ status }) {
  const map = {
    pending:"#f39c12", approved:"#27ae60", rejected:"#e74c3c",
    available:"#27ae60", adopted:"#8e44ad", sold:"#e8721a", true:"#27ae60", false:"#aaa",
  };
  return (
    <span style={{ background:map[String(status)]||"#aaa", color:"white", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      {String(status).toUpperCase()}
    </span>
  );
}

const BLANK_FORM = {
  name:"", species:"dog", breed:"", age:"", ageUnit:"months", gender:"male",
  price:"", imageUrl:"", imageUrls:"", description:"",
  vaccinated:false, neutered:false, location:"", adoptionType:"adoption"
};

function SellerDashboard() {
  const { user, authFetch, logout, isSeller, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]         = useState("My Listings");
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [orders, setOrders]   = useState([]);
  const [threads, setThreads] = useState([]);
  const [selThread, setSelThread] = useState(null);
  const [threadMsgs, setThreadMsgs] = useState([]);
  const [newMsg, setNewMsg]   = useState("");
  const [loading, setLoading] = useState(true);
  const [noteMap, setNoteMap] = useState({});
  const [form, setForm]       = useState(BLANK_FORM);
  const [editId, setEditId]   = useState(null);
  const [formMsg, setFormMsg] = useState("");
  const [profile, setProfile] = useState({ name:"", phone:"", shopName:"", bio:"" });
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!isSeller)         { navigate("/order-history"); return; }
    setProfile({ name:user?.name||"", phone:"", shopName:user?.shopName||"", bio:"" });
    loadAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isSeller]);

  const safeJson = async (res) => {
    try { return await res.json(); } catch (_) { return null; }
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [lRes, rRes, tRes, oRes, meRes] = await Promise.all([
        authFetch(`${API_BASE}/api/pets/my`),
        authFetch(`${API_BASE}/api/applications/seller`),
        authFetch(`${API_BASE}/api/messages/threads`),
        authFetch(`${API_BASE}/api/orders/seller`),
        authFetch(`${API_BASE}/api/auth/me`),
      ]);
      const [l, r, t, o, me] = await Promise.all([
        safeJson(lRes), safeJson(rRes), safeJson(tRes), safeJson(oRes), safeJson(meRes)
      ]);
      setListings(Array.isArray(l) ? l : []);
      setRequests(Array.isArray(r) ? r : []);
      setThreads(Array.isArray(t) ? t : []);
      setOrders(Array.isArray(o) ? o : []);
      if (me && !me.error) {
        setProfile(p => ({...p, name:me.name||"", phone:me.phone||"", shopName:me.shopName||"", bio:me.bio||""}));
      }
    } catch (err) {
      console.error("SellerDashboard loadAll failed:", err.message);
    }
    setLoading(false);
  }, [authFetch]);

  // ── Thread/Chat ──
  const loadThread = useCallback(async (thread) => {
    setSelThread(thread);
    const res  = await authFetch(`${API_BASE}/api/messages/${thread.threadId}`);
    const msgs = await res.json();
    setThreadMsgs(Array.isArray(msgs)?msgs:[]);
  }, [authFetch]);

  async function sendMsg(e) {
    e.preventDefault();
    if (!newMsg.trim()||!selThread) return;
    const other = selThread.fromUser?._id===user.id ? selThread.toUser?._id : selThread.fromUser?._id;
    await authFetch(`${API_BASE}/api/messages`, {
      method:"POST",
      body:JSON.stringify({ petId:selThread.petId?._id, toUserId:other, text:newMsg }),
    });
    setNewMsg(""); loadThread(selThread);
  }

  // ── Add / Edit Pet ──
  function startEdit(pet) {
    setForm({
      name:pet.name||"", species:pet.species||"dog", breed:pet.breed||"",
      age:pet.age||"", ageUnit:pet.ageUnit||"months", gender:pet.gender||"male",
      price:pet.price||"", imageUrl:pet.imageUrl||"",
      imageUrls:(pet.imageUrls||[]).join(", "),
      description:pet.description||"", vaccinated:!!pet.vaccinated,
      neutered:!!pet.neutered, location:pet.location||"",
      adoptionType:pet.adoptionType||"adoption",
    });
    setEditId(pet._id);
    setTab("Add Pet");
    setFormMsg("");
  }

  function cancelEdit() {
    setForm(BLANK_FORM); setEditId(null); setFormMsg("");
  }

  async function submitPet(e) {
    e.preventDefault();
    if (!form.name||!form.species||!form.age) { setFormMsg("Name, species and age are required."); return; }
    const payload = {
      ...form,
      age: Number(form.age),
      price: Number(form.price||0),
      imageUrls: form.imageUrls ? form.imageUrls.split(",").map(s=>s.trim()).filter(Boolean) : [],
    };
    const url    = editId ? `${API_BASE}/api/pets/${editId}` : `${API_BASE}/api/pets`;
    const method = editId ? "PUT" : "POST";
    setFormMsg("Saving...");
    let res;
    try {
      res = await authFetch(url, { method, body:JSON.stringify(payload) });
    } catch(_) {
      setFormMsg("Network error — make sure the backend server is running on port 5000.");
      return;
    }
    let data = {};
    try { data = await res.json(); } catch(_) {}
    if (res.ok) {
      setFormMsg(editId ? "✓ Listing updated!" : "✓ Pet listed! Now visible on the adoption page.");
      setForm(BLANK_FORM); setEditId(null); loadAll();
    } else {
      setFormMsg(data.error || `Error ${res.status}: Could not save listing.`);
    }
  }

  // ── Delete ──
  async function deleteListing(id) {
    if (!window.confirm("Delete this listing?")) return;
    await authFetch(`${API_BASE}/api/pets/${id}`, { method:"DELETE" });
    setListings(l => l.filter(p=>p._id!==id));
  }

  // ── Pet Status ──
  async function updatePetStatus(petId, status) {
    await authFetch(`${API_BASE}/api/pets/${petId}`, {
      method:"PUT", body:JSON.stringify({ status }),
    });
    setListings(l => l.map(p => p._id===petId ? {...p,status} : p));
  }

  // ── Request status ──
  async function updateRequest(appId, status) {
    const note = noteMap[appId]||"";
    const res = await authFetch(`${API_BASE}/api/applications/${appId}/status`, {
      method:"PUT", body:JSON.stringify({ status, sellerNote:note }),
    });
    if (res.ok) loadAll();
  }

  // ── Profile ──
  async function saveProfile(e) {
    e.preventDefault();
    const res = await authFetch(`${API_BASE}/api/auth/profile`, {
      method:"PUT", body:JSON.stringify(profile),
    });
    setProfileMsg(res.ok ? "Profile saved! ✓" : "Error saving.");
    setTimeout(() => setProfileMsg(""), 3000);
  }

  // ── Analytics ──
  const totalSales    = orders.reduce((s,o)=>s+o.total,0);
  const approvedPets  = listings.filter(p=>p.isApproved).length;
  const adoptedPets   = listings.filter(p=>p.status==="adopted").length;
  const soldPets      = listings.filter(p=>p.status==="sold").length;
  const pendingReqs   = requests.filter(r=>r.status==="pending").length;

  if (loading) return <Layout><div className="dash-loading">Loading your dashboard...</div></Layout>;

  return (
    <Layout>
      <main className="dashboard-page">
        <div className="dashboard-inner">
          {/* ── Sidebar ── */}
          <aside className="dashboard-sidebar">
            <div className="dashboard-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="dashboard-username">{user?.shopName||user?.name}</div>
            <div className="dashboard-role">🏪 Seller</div>
            {TABS.map(t => (
              <button key={t} className={`dashboard-tab-btn${tab===t?" active":""}`}
                onClick={() => setTab(t)}>
                {t==="My Listings"?"🐾 ":t==="Add Pet"?"➕ ":t==="Adoption Requests"?"📋 ":t==="Sales History"?"💰 ":t==="Messages"?"💬 ":t==="Analytics"?"📊 ":"👤 "}
                {t}
              </button>
            ))}
            <button className="dashboard-logout" onClick={() => { logout(); navigate("/"); }}>🚪 Logout</button>
          </aside>

          <div className="dashboard-content">

            {/* ── My Listings ── */}
            {tab==="My Listings" && (
              <section>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h2 className="dash-section-title" style={{ margin:0 }}>My Pet Listings ({listings.length})</h2>
                  <button className="btn-primary" style={{ fontSize:13, padding:"8px 14px" }}
                    onClick={() => { setTab("Add Pet"); cancelEdit(); }}>+ Add New Pet</button>
                </div>
                {listings.length===0
                  ? <div className="dash-empty">No listings yet. <button className="link-btn" onClick={()=>{setTab("Add Pet");cancelEdit();}}>Add your first pet →</button></div>
                  : listings.map(pet => (
                    <div key={pet._id} className="dash-listing-row">
                      {pet.imageUrl
                        ? <img src={pet.imageUrl} alt={pet.name} className="dash-pet-thumb" />
                        : <div className="dash-thumb-empty">🐾</div>}
                      <div className="dash-listing-info">
                        <div className="dash-listing-name">{pet.name} <span className="dash-listing-species">({pet.species})</span></div>
                        <div className="dash-listing-meta">{pet.breed||"Mixed"} · {pet.age} {pet.ageUnit} · {pet.gender}</div>
                        <div className="dash-listing-meta">${pet.price||0} · {pet.adoptionType}</div>
                        <div className="dash-listing-approve">{pet.isApproved?"✓ Approved":"⏳ Awaiting approval"}</div>
                      </div>

                      {/* Status picker */}
                      <select value={pet.status}
                        onChange={e=>updatePetStatus(pet._id, e.target.value)}
                        style={{ fontSize:12, padding:"4px 8px", border:"1.5px solid #ddd", borderRadius:6, cursor:"pointer", minWidth:100 }}>
                        <option value="available">Available</option>
                        <option value="adopted">Adopted</option>
                        <option value="sold">Sold</option>
                        <option value="pending">Pending</option>
                      </select>

                      <div className="dash-listing-btns">
                        <Link to={`/pets/${pet._id}`} className="dash-view-btn">View</Link>
                        <button className="dash-edit-btn" onClick={()=>startEdit(pet)}>Edit</button>
                        <button className="dash-del-btn"  onClick={()=>deleteListing(pet._id)}>Delete</button>
                      </div>
                    </div>
                  ))
                }
              </section>
            )}

            {/* ── Add / Edit Pet ── */}
            {tab==="Add Pet" && (
              <section>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h2 className="dash-section-title" style={{ margin:0 }}>{editId ? "Edit Pet Listing" : "Add New Pet Listing"}</h2>
                  {editId && <button className="btn-clear" onClick={cancelEdit}>✕ Cancel Edit</button>}
                </div>
                {formMsg && <p style={{ color:formMsg.startsWith("✓")?"#27ae60":"#e74c3c", fontWeight:700, marginBottom:12 }}>{formMsg}</p>}

                <form className="dash-pet-form" onSubmit={submitPet}>
                  <div className="dash-form-grid">
                    <div className="form-field">
                      <label>Pet Name *</label>
                      <input type="text" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required />
                    </div>
                    <div className="form-field">
                      <label>Breed</label>
                      <input type="text" value={form.breed} onChange={e=>setForm(p=>({...p,breed:e.target.value}))} />
                    </div>
                    <div className="form-field">
                      <label>Species *</label>
                      <select value={form.species} onChange={e=>setForm(p=>({...p,species:e.target.value}))}>
                        {SPECIES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Gender</label>
                      <select value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))}>
                        {["male","female","unknown"].map(g=><option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Age (months) *</label>
                      <input type="number" min="0" value={form.age} onChange={e=>setForm(p=>({...p,age:e.target.value}))} required />
                    </div>
                    <div className="form-field">
                      <label>Price ($) — 0 for free</label>
                      <input type="number" min="0" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} />
                    </div>
                    <div className="form-field">
                      <label>Listing Type</label>
                      <select value={form.adoptionType} onChange={e=>setForm(p=>({...p,adoptionType:e.target.value}))}>
                        <option value="adoption">Free Adoption</option>
                        <option value="sale">For Sale</option>
                        <option value="both">Adopt or Buy</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Location</label>
                      <input type="text" value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} />
                    </div>

                    {/* Main image URL */}
                    <div className="form-field" style={{ gridColumn:"1/-1" }}>
                      <label>Main Image URL</label>
                      <input type="url" value={form.imageUrl}
                        onChange={e=>setForm(p=>({...p,imageUrl:e.target.value}))}
                        placeholder="https://example.com/pet-photo.jpg" />
                      {form.imageUrl && <img src={form.imageUrl} alt="preview" style={{ marginTop:8, width:80, height:80, borderRadius:8, objectFit:"cover" }} onError={e=>e.target.style.display="none"} />}
                    </div>

                    {/* Additional image URLs */}
                    <div className="form-field" style={{ gridColumn:"1/-1" }}>
                      <label>Additional Image URLs (comma-separated)</label>
                      <textarea rows={2} value={form.imageUrls}
                        onChange={e=>setForm(p=>({...p,imageUrls:e.target.value}))}
                        placeholder="https://url1.jpg, https://url2.jpg, https://url3.jpg" />
                      <small style={{ color:"#7a857c", fontSize:11 }}>Paste multiple image URLs separated by commas</small>
                    </div>

                    <div className="form-field" style={{ gridColumn:"1/-1" }}>
                      <label>Description</label>
                      <textarea rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} />
                    </div>

                    <div className="form-field" style={{ display:"flex", gap:20, alignItems:"center", gridColumn:"1/-1" }}>
                      <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
                        <input type="checkbox" checked={form.vaccinated} onChange={e=>setForm(p=>({...p,vaccinated:e.target.checked}))} />
                        💉 Vaccinated
                      </label>
                      <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
                        <input type="checkbox" checked={form.neutered} onChange={e=>setForm(p=>({...p,neutered:e.target.checked}))} />
                        ✂️ Neutered/Spayed
                      </label>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, marginTop:16 }}>
                    <button type="submit" className="btn-primary">{editId ? "Update Listing" : "Submit Listing"}</button>
                    {editId && <button type="button" className="btn-clear" onClick={cancelEdit}>Cancel</button>}
                  </div>
                </form>
              </section>
            )}

            {/* ── Adoption Requests ── */}
            {tab==="Adoption Requests" && (
              <section>
                <h2 className="dash-section-title">Adoption Requests ({requests.length})</h2>
                {requests.length===0
                  ? <div className="dash-empty">No requests yet.</div>
                  : requests.map(r=>(
                    <div key={r._id} className="dash-req-row">
                      <div className="dash-req-info">
                        <div className="dash-req-name">{r.applicantName}</div>
                        <div className="dash-req-pet">For: <strong>{r.petName}</strong></div>
                        <div className="dash-req-contact">📞 {r.contactNumber}</div>
                        {r.location && <div className="dash-req-contact">📍 {r.location}</div>}
                        <div className="dash-req-reason">💬 {r.reason}</div>
                        {r.userId?.email && <div style={{ fontSize:11, color:"#7a857c" }}>📧 {r.userId.email}</div>}
                        <input type="text" placeholder="Add note to applicant..."
                          value={noteMap[r._id]||""}
                          onChange={e=>setNoteMap(m=>({...m,[r._id]:e.target.value}))}
                          style={{ marginTop:8, width:"100%", padding:"6px 10px", borderRadius:6, border:"1px solid #ddd", fontSize:12 }} />
                      </div>
                      <div className="dash-req-actions">
                        <StatusBadge status={r.status} />
                        {r.status==="pending" && <>
                          <button className="btn-approve" onClick={()=>updateRequest(r._id,"approved")}>✓ Approve</button>
                          <button className="btn-reject"  onClick={()=>updateRequest(r._id,"rejected")}>✕ Reject</button>
                        </>}
                      </div>
                    </div>
                  ))
                }
              </section>
            )}

            {/* ── Sales History ── */}
            {tab==="Sales History" && (
              <section>
                <h2 className="dash-section-title">Sales History</h2>
                {orders.length===0
                  ? <div className="dash-empty">No sales yet. Your sold pets will appear here.</div>
                  : orders.map(o=>(
                    <div key={o._id} className="dash-order-row">
                      <div className="dash-order-header">
                        <div>
                          <span className="dash-order-id">Order #{o._id.slice(-6).toUpperCase()}</span>
                          <span className="dash-order-date">{new Date(o.createdAt).toLocaleDateString()}</span>
                          {o.userId && <span className="dash-order-date"> · {o.userId.name} ({o.userId.email})</span>}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span className="dash-order-total">${o.total?.toFixed(2)}</span>
                          <StatusBadge status={o.status} />
                        </div>
                      </div>
                      <div className="dash-order-items">
                        {o.items?.map((it,i)=>(
                          <div key={i} className="dash-order-item">
                            <span className="dash-order-item-name">{it.name}</span>
                            <span className="dash-order-item-meta">x{it.qty} · ${it.price?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                }
              </section>
            )}

            {/* ── Messages ── */}
            {tab==="Messages" && (
              <section>
                <h2 className="dash-section-title">Messages with Adopters</h2>
                <div className="dash-msg-layout">
                  <div className="dash-threads">
                    {threads.length===0 && <div className="dash-empty" style={{ padding:20 }}>No conversations yet.</div>}
                    {threads.map(t=>{
                      const other = t.fromUser?._id===user.id ? t.toUser : t.fromUser;
                      return (
                        <div key={t.threadId}
                          className={`dash-thread-item${selThread?.threadId===t.threadId?" selected":""}`}
                          onClick={()=>loadThread(t)}>
                          <div className="dash-thread-avatar">{other?.name?.[0]?.toUpperCase()}</div>
                          <div>
                            <div className="dash-thread-name">{other?.name}</div>
                            <div className="dash-thread-pet">Re: {t.petId?.name}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="dash-chat">
                    {!selThread
                      ? <div className="dash-empty" style={{ padding:40 }}>Select a conversation</div>
                      : <>
                        <div className="dash-chat-msgs">
                          {threadMsgs.map(m=>(
                            <div key={m._id} className={`dash-bubble${m.fromUser?._id===user.id?" mine":""}`}>
                              <div style={{ fontSize:10, opacity:0.7, marginBottom:2 }}>{m.fromUser?.name}</div>
                              <span>{m.text}</span>
                            </div>
                          ))}
                        </div>
                        <form className="dash-chat-input" onSubmit={sendMsg}>
                          <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} placeholder="Type a message..." />
                          <button type="submit">Send</button>
                        </form>
                      </>
                    }
                  </div>
                </div>
              </section>
            )}

            {/* ── Analytics ── */}
            {tab==="Analytics" && (
              <section>
                <h2 className="dash-section-title">Your Analytics</h2>
                <div className="seller-analytics-grid">
                  <div className="sel-stat-card">
                    <div className="sel-stat-icon">📋</div>
                    <div className="sel-stat-val">{listings.length}</div>
                    <div className="sel-stat-label">Total Listings</div>
                  </div>
                  <div className="sel-stat-card">
                    <div className="sel-stat-icon">✅</div>
                    <div className="sel-stat-val">{approvedPets}</div>
                    <div className="sel-stat-label">Approved</div>
                  </div>
                  <div className="sel-stat-card">
                    <div className="sel-stat-icon">🐾</div>
                    <div className="sel-stat-val">{adoptedPets}</div>
                    <div className="sel-stat-label">Adopted</div>
                  </div>
                  <div className="sel-stat-card">
                    <div className="sel-stat-icon">🛒</div>
                    <div className="sel-stat-val">{soldPets}</div>
                    <div className="sel-stat-label">Sold</div>
                  </div>
                  <div className="sel-stat-card">
                    <div className="sel-stat-icon">📩</div>
                    <div className="sel-stat-val">{requests.length}</div>
                    <div className="sel-stat-label">Total Requests</div>
                  </div>
                  <div className="sel-stat-card">
                    <div className="sel-stat-icon">⏳</div>
                    <div className="sel-stat-val">{pendingReqs}</div>
                    <div className="sel-stat-label">Pending</div>
                  </div>
                  <div className="sel-stat-card" style={{ gridColumn:"1/-1" }}>
                    <div className="sel-stat-icon">💰</div>
                    <div className="sel-stat-val">${totalSales.toFixed(2)}</div>
                    <div className="sel-stat-label">Total Revenue</div>
                  </div>
                </div>

                {/* Listing breakdown */}
                <h3 style={{ marginTop:24, marginBottom:12, color:"var(--green)", fontSize:15 }}>Inventory Status</h3>
                <div className="dash-order-row" style={{ flexDirection:"column" }}>
                  {listings.length===0
                    ? <p style={{ color:"#7a857c" }}>No listings yet.</p>
                    : listings.map(p=>(
                      <div key={p._id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #f7e8d8" }}>
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width:36, height:36, objectFit:"cover", borderRadius:6 }} onError={e=>e.target.style.display="none"} />}
                        <div style={{ flex:1 }}>
                          <strong>{p.name}</strong>
                          <span style={{ color:"#7a857c", fontSize:12, marginLeft:8 }}>{p.species} · {p.adoptionType}</span>
                        </div>
                        <StatusBadge status={p.status} />
                        <span style={{ fontSize:11, color: p.isApproved?"#27ae60":"#f39c12", fontWeight:700 }}>
                          {p.isApproved?"✓ Live":"⏳ Pending approval"}
                        </span>
                      </div>
                    ))
                  }
                </div>
              </section>
            )}

            {/* ── Profile ── */}
            {tab==="Profile" && (
              <section>
                <h2 className="dash-section-title">Seller Profile</h2>
                <form className="dash-profile-form" onSubmit={saveProfile}>
                  {profileMsg && <p style={{ color:"#27ae60", fontWeight:700 }}>{profileMsg}</p>}
                  {[["name","Your Name"],["phone","Phone Number"],["shopName","Shop / Business Name"]].map(([f,l])=>(
                    <div className="form-field" key={f}>
                      <label>{l}</label>
                      <input type="text" value={profile[f]} onChange={e=>setProfile(p=>({...p,[f]:e.target.value}))} />
                    </div>
                  ))}
                  <div className="form-field">
                    <label>About Your Shop</label>
                    <textarea rows={3} value={profile.bio} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))} />
                  </div>
                  <div className="form-field">
                    <label>Email (read-only)</label>
                    <input type="email" value={user?.email} disabled style={{ opacity:0.5 }} />
                  </div>
                  <button type="submit" className="btn-primary">Save Profile</button>
                </form>
              </section>
            )}

          </div>
        </div>
      </main>
    </Layout>
  );
}

export default SellerDashboard;
