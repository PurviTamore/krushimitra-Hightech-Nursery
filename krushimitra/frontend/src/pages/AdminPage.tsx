import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, ComposedChart, Bar, Area,
} from 'recharts';

/* ---------- Interfaces ---------- */
interface Plant { 
  _id?: string; 
  name: string; 
  category: string; 
  price: number | ""; 
  stockCount: number | ""; 
  image: string; 
}

interface MLReport { 
  _id: string; 
  timestamp: string; 
  disease: string; 
  confidence: string; 
}

interface Enquiry { 
  _id: string; 
  name: string; 
  phone: string; 
  message: string; 
  date: string; 
}

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#065f46', '#064e3b'];

const AdminPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [otpInput, setOtpInput] = useState("");
  const [stats, setStats] = useState({ plants: [] as Plant[], enquiries: [] as Enquiry[] });
  const [mlData, setMlData] = useState<MLReport[]>([]);
  const [plantForm, setPlantForm] = useState<Plant>({ name: "", category: "Fruit", price: "", stockCount: "", image: "" });

  const loadData = async () => {
    try {
      const sRes = await axios.get("http://localhost:3002/admin/stats");
      setStats(sRes.data);
      const mRes = await axios.get("http://localhost:3003/admin/history");
      setMlData(Array.isArray(mRes.data) ? mRes.data : []);
    } catch (e) { 
      console.error("Sync Error", e); 
    }
  };

  useEffect(() => { 
    if (step === 3) loadData(); 
  }, [step]);

  /* --- Calculations --- */
  const totalAssetValue = stats.plants.reduce((acc, p) => acc + (Number(p.price) * (Number(p.stockCount) || 0)), 0);
  const categories = ['Fruit', 'Flower', 'Vegetable', 'Medicinal', 'Indoor', 'Outdoor'];
  
  const analyticsData = categories.map((cat, index) => {
    const cp = stats.plants.filter(p => p.category === cat);
    const value = cp.reduce((a, b) => a + (Number(b.price) * (Number(b.stockCount) || 0)), 0);
    const stock = cp.reduce((a, b) => a + (Number(b.stockCount) || 0), 0);
    return { 
      name: cat, 
      value, 
      stock, 
      avgPrice: stock > 0 ? (value/stock).toFixed(0) : 0, 
      fill: COLORS[index % COLORS.length] 
    };
  });

  const topCategory = [...analyticsData].sort((a, b) => b.value - a.value)[0];

  /* --- Handlers --- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.username === "admin" && creds.password === "admin123") {
      try {
        const response = await axios.post("http://localhost:3002/send-otp");
        if (response.data.success) { 
          alert("OTP Sent to Email"); 
          setStep(2); 
        }
      } catch (err) { 
        alert("Server Error."); 
      }
    } else { 
      alert("Invalid Credentials"); 
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3002/verify-otp", { otp: otpInput });
      if (res.data.success) setStep(3);
    } catch { 
      alert("Invalid OTP Code."); 
    }
  };

  const deletePlant = async (id: string) => { 
    if(window.confirm("Remove this plant from inventory?")) { 
      await axios.delete(`http://localhost:3002/plants/${id}`); 
      loadData(); 
    }
  };

  const resolveLead = async (id: string) => { 
    if(window.confirm("Archive this customer enquiry?")) { 
      await axios.delete(`http://localhost:3002/enquiries/${id}`); 
      loadData(); 
    }
  };

  /* --- Login Screen --- */
  if (step < 3) return (
    <div style={authWrapper}>
      <div style={glassCard}>
        <h2 style={{ color: '#059669', textAlign:'center', fontWeight:900 }}>ADMIN LOGIN</h2>
        <form onSubmit={step === 1 ? handleLogin : handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop:'30px' }}>
          {step === 1 ? (
            <>
              <input style={formInput} placeholder="Username" onChange={e => setCreds({...creds, username: e.target.value})} />
              <input style={formInput} type="password" placeholder="Password" onChange={e => setCreds({...creds, password: e.target.value})} />
            </>
          ) : (
            <input style={{...formInput, textAlign:'center', fontSize:'1.5rem', color:'#059669'}} placeholder="Enter 6-Digit OTP" onChange={e => setOtpInput(e.target.value)} maxLength={6} />
          )}
          <button style={primaryBtn} type="submit">{step === 1 ? 'LOGIN' : 'VERIFY OTP'}</button>
        </form>
      </div>
    </div>
  );

  /* --- Main Dashboard --- */
  return (
    <div style={layout}>
      <aside style={sidebar}>
        <div style={brand}>KRUSHIMITRA</div>
        <div style={navGroup}>
          <NavBtn icon="📊" label="DASHBOARD" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavBtn icon="📦" label="PLANT STOCK" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavBtn icon="🔬" label="HEALTH REPORTS" active={activeTab === 'disease'} onClick={() => setActiveTab('disease')} />
          <NavBtn icon="📧" label="ENQUIRIES" active={activeTab === 'enquiries'} onClick={() => setActiveTab('enquiries')} />
          <NavBtn icon="➕" label="ADD NEW PLANT" active={activeTab === 'add'} onClick={() => setActiveTab('add')} />
        </div>
      </aside>

      <main style={main}>
        <header style={headerStyle}>
          <div><h1 style={pageTitle}>{activeTab.toUpperCase()}</h1><p style={subText}>Nursery Management System</p></div>
          <div style={statusTag}>SYSTEM ONLINE</div>
        </header>

        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={kpiGrid}>
              <StatCard label="TOTAL STOCK VALUE" val={`₹${totalAssetValue.toLocaleString()}`} color="#059669" sub="Total Inventory Worth" />
              <StatCard label="ACTIVE ENQUIRIES" val={stats.enquiries.length} color="#10b981" sub="New Customer Leads" />
              <StatCard label="HEALTH SCANS" val={mlData.length} color="#059669" sub="Total AI Scans Conducted" />
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitle}>FINANCIAL OVERVIEW & STOCK DISTRIBUTION</h3>
              <div style={{ height: 350, marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analyticsData}>
                    <CartesianGrid stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend verticalAlign="top" height={40}/>
                    <Bar dataKey="stock" fill="#10b981" radius={[8, 8, 0, 0]} name="Stock Units" barSize={45} />
                    <Area type="monotone" dataKey="value" fill="#d1fae5" stroke="#059669" strokeWidth={3} name="Total Value (₹)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={chartGrid}>
              <div style={cardStyle}>
                <h3 style={cardTitle}>CATEGORY-WISE REVENUE</h3>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analyticsData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={5}>
                        {analyticsData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ ...cardStyle, background: '#f0fdf4' }}>
                <h3 style={{ ...cardTitle, color: '#065f46' }}>SYSTEM INSIGHTS</h3>
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <InsightRow icon="📈" title="Top Performer" text={`${topCategory?.name} plants hold the highest value.`} />
                  <InsightRow icon="🔬" title="AI Monitoring" text={`${mlData.length} plant health checks are recorded.`} />
                  <InsightRow icon="💹" title="New Leads" text={`${stats.enquiries.length} customers are waiting for a reply.`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'inventory' || activeTab === 'enquiries' || activeTab === 'disease') && (
          <div style={cardStyle}>
            <table style={tableStyle}>
              <thead style={tableHeader}>
                {activeTab === 'inventory' && <tr><th>PLANT NAME</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>ACTION</th></tr>}
                {activeTab === 'enquiries' && <tr><th>CUSTOMER NAME</th><th>MESSAGE</th><th>DATE</th><th>ACTION</th></tr>}
                {activeTab === 'disease' && <tr><th>DATE/TIME</th><th>AI DIAGNOSIS</th><th>ACCURACY</th><th>LOG STATUS</th></tr>}
              </thead>
              <tbody>
                {activeTab === 'inventory' && stats.plants.map(p => (
                  <tr key={p._id} style={trStyle}>
                    <td><div style={{display:'flex', alignItems:'center'}}><img src={p.image} style={thumb} alt={p.name}/><b>{p.name}</b></div></td>
                    <td>{p.category}</td><td>₹{p.price}</td><td><span style={pill}>{p.stockCount} UNITS</span></td>
                    <td><button onClick={()=>deletePlant(p._id!)} style={actionBtn}>DELETE</button></td>
                  </tr>
                ))}
                {activeTab === 'enquiries' && stats.enquiries.map(enq => (
                  <tr key={enq._id} style={trStyle}>
                    <td><b>{enq.name}</b><br/>{enq.phone}</td><td>"{enq.message}"</td><td>{enq.date}</td>
                    <td><button onClick={()=>resolveLead(enq._id)} style={{...actionBtn, color: '#059669', borderColor: '#059669'}}>ARCHIVE</button></td>
                  </tr>
                ))}
                {activeTab === 'disease' && mlData.map((scan, i) => (
                  <tr key={i} style={trStyle}>
                    <td>{scan.timestamp}</td>
                    <td><b style={{color: scan.disease.includes('Healthy') ? '#059669' : '#ef4444'}}>{scan.disease}</b></td>
                    <td>{scan.confidence}</td>
                    <td><span style={{...pill, background: scan.disease.includes('Healthy') ? '#ecfdf5' : '#fef2f2', color: scan.disease.includes('Healthy') ? '#059669' : '#ef4444'}}>SAVED</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'add' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={provisionCard}>
              <h2 style={{ textAlign: 'center', color: '#059669', marginBottom: '30px', fontWeight:900 }}>ADD NEW PLANT STOCK</h2>
              <form onSubmit={async (e) => {
                  e.preventDefault(); 
                  await axios.post("http://localhost:3002/plants", plantForm);
                  alert("New Plant Added Successfully"); 
                  loadData(); 
                  setPlantForm({name:"", category:"Fruit", price:"", stockCount:"", image:""});
              }} style={{ display: 'grid', gap: '20px' }}>
                <input style={formInput} placeholder="Plant Name" value={plantForm.name} onChange={e=>setPlantForm({...plantForm, name:e.target.value})} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <select style={formInput} value={plantForm.category} onChange={e=>setPlantForm({...plantForm, category:e.target.value})}>
                    <option>Fruit</option>
                    <option>Flower</option>
                    <option>Vegetable</option>
                    <option>Medicinal</option>
                    <option>Indoor</option>
                    <option>Outdoor</option>
                  </select>
                  <input style={formInput} placeholder="Price per Unit" type="number" value={plantForm.price} onChange={e=>setPlantForm({...plantForm, price:e.target.value===""?"":Number(e.target.value)})} required />
                </div>
                <input style={formInput} placeholder="Total Stock Quantity" type="number" value={plantForm.stockCount} onChange={e=>setPlantForm({...plantForm, stockCount:e.target.value===""?"":Number(e.target.value)})} required />
                <input type="file" style={{...formInput, padding:'10px'}} onChange={(e)=>{
                    const file=e.target.files?.[0]; 
                    if(file){
                      const r=new FileReader(); 
                      r.onloadend=()=>setPlantForm({...plantForm, image:r.result as string}); 
                      r.readAsDataURL(file);
                    }
                }} />
                <button style={primaryBtn} type="submit">UPDATE INVENTORY</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

/* --- Sub-Components --- */
const InsightRow = ({ icon, title, text }: any) => (
  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
    <div style={{ fontSize: '1.2rem', background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>{icon}</div>
    <div><b style={{ fontSize: '0.85rem', color: '#064e3b' }}>{title}</b><p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{text}</p></div>
  </div>
);

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} style={active ? activeNav : navBtn}><span style={{ marginRight: '15px' }}>{icon}</span> {label}</button>
);

const StatCard = ({ label, val, color, sub }: any) => (
  <div style={cardStyle}>
    <p style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 800 }}>{label}</p>
    <h2 style={{ fontSize: '2.5rem', color: color, fontWeight: 900, margin: '8px 0' }}>{val}</h2>
    <p style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{sub}</p>
  </div>
);

/* --- STYLES --- */
const layout: any = { display: 'flex', background: '#f8fafc', minHeight: '100vh', color: '#1e293b', fontFamily: '"Inter", sans-serif' };
const sidebar: any = { width: '280px', background: '#ffffff', padding: '30px', position: 'fixed', height: '100vh', borderRight: '1px solid #e2e8f0' };
const brand: any = { fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginBottom: '40px', letterSpacing:'-1px' };
const navGroup: any = { display: 'flex', flexDirection: 'column', gap: '8px' };
const navBtn: any = { padding: '16px 20px', background: 'none', border: 'none', color: '#64748b', textAlign: 'left', cursor: 'pointer', borderRadius: '12px', fontWeight: 'bold' };
const activeNav: any = { ...navBtn, color: '#059669', background: '#f0fdf4' };
const main: any = { flex: 1, marginLeft: '280px', padding: '60px' };
const headerStyle: any = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' };
const pageTitle: any = { fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: 0 };
const subText: any = { color: '#64748b', fontSize: '0.9rem' };
const statusTag: any = { background: '#f0fdf4', color: '#059669', padding: '8px 16px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid #bbf7d0' };
const kpiGrid: any = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' };
const cardStyle: any = { background: '#ffffff', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const cardTitle: any = { color: '#64748b', fontSize: '0.75rem', fontWeight: 800, marginBottom: '20px' };
const chartGrid: any = { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px' };
const tooltipStyle: any = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' };
const tableStyle: any = { width: '100%', borderCollapse: 'collapse' };
const tableHeader: any = { textAlign: 'left', fontSize: '0.7rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' };
const trStyle: any = { borderBottom: '1px solid #f1f5f9' };
const thumb: any = { width: '45px', height: '45px', borderRadius: '12px', marginRight: '15px', objectFit: 'cover' };
const pill: any = { background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' };
const actionBtn: any = { background: 'none', border: '1px solid #ef444460', color: '#ef4444', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem' };
const authWrapper: any = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0fdf4' };
const glassCard: any = { background: '#ffffff', padding: '50px', borderRadius: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '400px' };
const formInput: any = { width: '100%', padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', outline:'none' };
const primaryBtn: any = { width: '100%', padding: '16px', background: '#059669', color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' };
const provisionCard: any = { ...cardStyle, width: '100%', maxWidth: '550px' };

export default AdminPage;