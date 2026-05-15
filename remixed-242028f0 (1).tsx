import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#f97316","#06b6d4","#8b5cf6","#ec4899","#10b981","#f59e0b","#3b82f6"];
const TRANSPORT = ["Bus","Train","Flight","Bike","Car"];
const STAY = ["Hostel","Budget Hotel","Dorm","Guesthouse","Airbnb"];

const STATES_DATA = [
  { state:"Rajasthan", emoji:"🏰", color:"#f97316", famousPlace:"Amber Fort, Jaipur", famousImg:"🏯", places:[
    {name:"Jaipur",img:"🏯",desc:"The Pink City — palaces, forts & bazaars",rating:4.8,cost:"₹3,000–6,000",best:"Oct–Mar",tag:"Heritage",famous:"Amber Fort"},
    {name:"Udaipur",img:"🏛️",desc:"City of Lakes — Venice of the East",rating:4.9,cost:"₹4,000–8,000",best:"Sep–Mar",tag:"Romantic",famous:"City Palace"},
    {name:"Jaisalmer",img:"🌵",desc:"Golden Fort rising from the Thar Desert",rating:4.7,cost:"₹2,500–5,000",best:"Nov–Feb",tag:"Desert",famous:"Jaisalmer Fort"},
  ]},
  { state:"Kerala", emoji:"🌴", color:"#10b981", famousPlace:"Alleppey Backwaters", famousImg:"🚢", places:[
    {name:"Munnar",img:"🍵",desc:"Rolling tea gardens & misty hill stations",rating:4.8,cost:"₹3,500–7,000",best:"Sep–May",tag:"Nature",famous:"Top Station"},
    {name:"Alleppey",img:"🚢",desc:"Serene backwaters & houseboat cruises",rating:4.9,cost:"₹4,000–9,000",best:"Oct–Feb",tag:"Backwaters",famous:"Vembanad Lake"},
    {name:"Wayanad",img:"🌿",desc:"Dense forests, waterfalls & wildlife",rating:4.7,cost:"₹2,500–5,000",best:"Oct–May",tag:"Wildlife",famous:"Chembra Peak"},
  ]},
  { state:"Himachal Pradesh", emoji:"🏔️", color:"#3b82f6", famousPlace:"Rohtang Pass, Manali", famousImg:"⛰️", places:[
    {name:"Manali",img:"⛰️",desc:"Snow peaks, adventure sports & river valleys",rating:4.9,cost:"₹5,000–10,000",best:"Dec–Jun",tag:"Adventure",famous:"Rohtang Pass"},
    {name:"Shimla",img:"🚞",desc:"Colonial hill station with toy train rides",rating:4.7,cost:"₹3,000–7,000",best:"Mar–Jun",tag:"Hill Station",famous:"The Ridge"},
    {name:"Kasol",img:"🏕️",desc:"Parvati Valley — trekking & camping paradise",rating:4.8,cost:"₹2,000–4,500",best:"Mar–Jun",tag:"Trekking",famous:"Kheerganga Trek"},
  ]},
  { state:"Goa", emoji:"🏖️", color:"#ec4899", famousPlace:"Baga Beach, North Goa", famousImg:"🌊", places:[
    {name:"North Goa",img:"🌊",desc:"Vibrant beaches, nightlife & water sports",rating:4.7,cost:"₹4,000–9,000",best:"Nov–Feb",tag:"Beach",famous:"Baga Beach"},
    {name:"South Goa",img:"🐚",desc:"Serene beaches & Portuguese heritage",rating:4.8,cost:"₹3,500–8,000",best:"Oct–Mar",tag:"Culture",famous:"Basilica of Bom Jesus"},
    {name:"Dudhsagar Falls",img:"💦",desc:"Majestic four-tiered waterfall in jungle",rating:4.9,cost:"₹1,500–3,000",best:"Jun–Feb",tag:"Nature",famous:"Dudhsagar Falls"},
  ]},
  { state:"Tamil Nadu", emoji:"🛕", color:"#f59e0b", famousPlace:"Meenakshi Temple, Madurai", famousImg:"🛕", places:[
    {name:"Ooty",img:"🌸",desc:"Queen of Hill Stations — botanical gardens",rating:4.6,cost:"₹2,500–5,000",best:"Apr–Jun",tag:"Hill Station",famous:"Nilgiri Mountain Railway"},
    {name:"Madurai",img:"🛕",desc:"Ancient Meenakshi temple & street food",rating:4.8,cost:"₹2,000–4,000",best:"Oct–Mar",tag:"Temples",famous:"Meenakshi Amman Temple"},
    {name:"Kodaikanal",img:"🌫️",desc:"Misty lake town with stunning viewpoints",rating:4.7,cost:"₹2,500–5,500",best:"Apr–Jun",tag:"Nature",famous:"Kodai Lake"},
  ]},
  { state:"Uttarakhand", emoji:"🙏", color:"#8b5cf6", famousPlace:"Triveni Ghat, Rishikesh", famousImg:"🧘", places:[
    {name:"Rishikesh",img:"🧘",desc:"Yoga capital — rafting & spirituality",rating:4.9,cost:"₹2,000–5,000",best:"Sep–Jun",tag:"Spiritual",famous:"Triveni Ghat"},
    {name:"Mussoorie",img:"🌄",desc:"Queen of Hills & Kempty Falls",rating:4.7,cost:"₹3,000–6,000",best:"Mar–Jun",tag:"Hill Station",famous:"Kempty Falls"},
    {name:"Haridwar",img:"🕯️",desc:"Sacred Ganges ghats & Ganga Aarti",rating:4.8,cost:"₹1,500–3,500",best:"Oct–Apr",tag:"Pilgrimage",famous:"Har Ki Pauri"},
  ]},
];

const POPULAR = [
  {name:"Manali",state:"Himachal Pradesh",img:"⛰️",tag:"Adventure",color:"#3b82f6",cost:"₹5,000",famous:"Rohtang Pass"},
  {name:"Goa",state:"Goa",img:"🏖️",tag:"Beach",color:"#ec4899",cost:"₹4,500",famous:"Baga Beach"},
  {name:"Jaipur",state:"Rajasthan",img:"🏯",tag:"Heritage",color:"#f97316",cost:"₹3,500",famous:"Amber Fort"},
  {name:"Rishikesh",state:"Uttarakhand",img:"🧘",tag:"Spiritual",color:"#8b5cf6",cost:"₹2,500",famous:"Triveni Ghat"},
  {name:"Munnar",state:"Kerala",img:"🍵",tag:"Nature",color:"#10b981",cost:"₹4,000",famous:"Top Station"},
  {name:"Madurai",state:"Tamil Nadu",img:"🛕",tag:"Temples",color:"#f59e0b",cost:"₹2,500",famous:"Meenakshi Temple"},
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}

/* Sunrise/sunset gradient bg */
@keyframes bgShift{
  0%{background-position:0% 0%}
  33%{background-position:100% 50%}
  66%{background-position:50% 100%}
  100%{background-position:0% 0%}
}
@keyframes cloudDrift{from{transform:translateX(-120px)}to{transform:translateX(calc(100vw + 120px))}}
@keyframes sunPulse{0%,100%{transform:scale(1);box-shadow:0 0 60px rgba(251,191,36,0.4)}50%{transform:scale(1.06);box-shadow:0 0 100px rgba(251,191,36,0.7)}}
@keyframes starTwinkle{0%,100%{opacity:0.1;transform:scale(1)}50%{opacity:0.9;transform:scale(1.6)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes floatSlow{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-20px) rotate(3deg)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spinR{to{transform:rotate(-360deg)}}
@keyframes pulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideRight{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes glow{0%,100%{box-shadow:0 0 10px rgba(251,191,36,0.3)}50%{box-shadow:0 0 30px rgba(251,191,36,0.7),0 0 60px rgba(251,191,36,0.3)}}
@keyframes shimmerText{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes countUp{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
@keyframes waveIn{0%{transform:scaleX(0);transform-origin:left}100%{transform:scaleX(1);transform-origin:left}}
@keyframes typeChar{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0% 0 0)}}
@keyframes welcomePop{0%{opacity:0;transform:scale(0.6) rotate(-5deg)}60%{transform:scale(1.08) rotate(1deg)}100%{opacity:1;transform:scale(1) rotate(0deg)}}
@keyframes letterDrop{0%{opacity:0;transform:translateY(-40px) rotate(-10deg)}100%{opacity:1;transform:translateY(0) rotate(0deg)}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes rippleOut{0%{transform:scale(0.8);opacity:0.8}100%{transform:scale(2.5);opacity:0}}
@keyframes mountainRise{from{transform:translateY(100px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes birdFly{0%{transform:translateX(0) translateY(0)}25%{transform:translateX(80px) translateY(-20px)}50%{transform:translateX(160px) translateY(5px)}75%{transform:translateX(240px) translateY(-15px)}100%{transform:translateX(320px) translateY(0)}}

.fade-up{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) forwards}
.hover-lift{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease}
.hover-lift:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 20px 50px rgba(0,0,0,0.5)!important}
.btn-primary{transition:all .25s ease;background:linear-gradient(135deg,#f97316,#fbbf24,#f97316);background-size:200%;border:none;border-radius:14px;color:#fff;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif}
.btn-primary:hover{background-position:right;box-shadow:0 8px 30px rgba(249,115,22,0.5);transform:translateY(-2px)}
.tag-pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.5px}

input,select,textarea{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:10px;padding:10px 14px;color:#fff;font-size:14px;font-family:'Poppins',sans-serif;outline:none;transition:border .2s,box-shadow .2s}
input:focus,select:focus,textarea:focus{border-color:rgba(251,191,36,0.7);box-shadow:0 0 0 3px rgba(251,191,36,0.15)}
input::placeholder{color:rgba(255,255,255,0.35)}
select option{background:#1a0a00;color:#fff}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:rgba(0,0,0,0.2)}
::-webkit-scrollbar-thumb{background:rgba(251,191,36,0.5);border-radius:4px}
`;

/* ── BACKGROUND ────────────────────────────────────────────── */
const BG = ({night=false}) => (
  <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
    {/* Sky gradient */}
    <div style={{position:"absolute",inset:0,background:night
      ?"linear-gradient(180deg,#020817 0%,#0f172a 40%,#1e1b4b 70%,#312e81 100%)"
      :"linear-gradient(180deg,#0c1a4a 0%,#1e3a6e 20%,#7c3b1e 55%,#c2410c 75%,#f97316 90%,#fbbf24 100%)",
      animation:"bgShift 20s ease infinite",backgroundSize:"200% 200%"}}/>

    {/* Stars (night) */}
    {night && Array.from({length:40}).map((_,i)=>(
      <div key={i} style={{position:"absolute",width:i%5===0?3:i%3===0?2:1.5,height:i%5===0?3:i%3===0?2:1.5,borderRadius:"50%",background:"#fff",top:`${Math.random()*70}%`,left:`${Math.random()*100}%`,animation:`starTwinkle ${1.5+Math.random()*3}s ease-in-out infinite ${Math.random()*3}s`}}/>
    ))}

    {/* Sun (day) */}
    {!night && <div style={{position:"absolute",width:100,height:100,borderRadius:"50%",background:"radial-gradient(circle,#fef08a,#fbbf24,#f97316)",top:"18%",left:"72%",animation:"sunPulse 4s ease-in-out infinite",boxShadow:"0 0 80px rgba(251,191,36,0.5)"}}/>}
    {/* Sun rays */}
    {!night && <div style={{position:"absolute",width:180,height:180,borderRadius:"50%",background:"transparent",border:"2px solid rgba(251,191,36,0.12)",top:"10%",left:"68%",animation:"rippleOut 3s ease-in-out infinite"}}/>}
    {!night && <div style={{position:"absolute",width:240,height:240,borderRadius:"50%",background:"transparent",border:"2px solid rgba(251,191,36,0.07)",top:"7%",left:"65%",animation:"rippleOut 3s ease-in-out infinite 1s"}}/>}

    {/* Moon (night) */}
    {night && <div style={{position:"absolute",width:80,height:80,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,#fef9c3,#fde68a,#fbbf24)",top:"8%",right:"15%",boxShadow:"0 0 40px rgba(253,230,138,0.4)"}}/>}

    {/* Mountain silhouettes */}
    <svg style={{position:"absolute",bottom:0,left:0,width:"100%",height:"35%",animation:"mountainRise .8s ease"}} viewBox="0 0 1440 300" preserveAspectRatio="none">
      <path d="M0,300 L0,200 L120,100 L240,180 L360,80 L480,160 L600,60 L720,140 L840,40 L960,130 L1080,70 L1200,150 L1320,90 L1440,160 L1440,300 Z" fill={night?"rgba(15,23,42,0.95)":"rgba(12,20,50,0.9)"}/>
      <path d="M0,300 L0,240 L180,150 L300,220 L440,120 L560,200 L700,110 L820,190 L960,100 L1080,180 L1220,130 L1340,200 L1440,170 L1440,300 Z" fill={night?"rgba(10,15,30,0.98)":"rgba(8,14,35,0.95)"}/>
    </svg>

    {/* Clouds */}
    {!night && [
      {w:180,h:50,top:"22%",dur:"28s",delay:"0s",op:0.18},
      {w:120,h:35,top:"32%",dur:"22s",delay:"5s",op:0.12},
      {w:220,h:60,top:"15%",dur:"35s",delay:"12s",op:0.14},
    ].map((c,i)=>(
      <div key={i} style={{position:"absolute",width:c.w,height:c.h,borderRadius:c.h,background:"rgba(255,255,255,0.9)",top:c.top,left:-c.w,opacity:c.op,animation:`cloudDrift ${c.dur} linear ${c.delay} infinite`,filter:"blur(2px)"}}/>
    ))}

    {/* Birds */}
    {!night && ["12%","22%"].map((top,i)=>(
      <div key={i} style={{position:"absolute",top,left:i*120,animation:`birdFly ${14+i*5}s linear ${i*3}s infinite`,opacity:0.6,fontSize:16}}>🕊️</div>
    ))}

    {/* Floating travel icons */}
    {["✈️","🏔️","🌴","🗺️","🎒","⛵","🏛️","🧭"].map((e,i)=>(
      <div key={i} style={{position:"absolute",fontSize:i%2===0?20:14,opacity:0.07,top:`${8+i*10}%`,left:`${3+i*12}%`,animation:`floatSlow ${8+i}s ease-in-out infinite ${i*.6}s`,pointerEvents:"none"}}>{e}</div>
    ))}
  </div>
);

/* ── MARQUEE ──────────────────────────────────────────────── */
const Marquee = () => {
  const items = ["🏰 Rajasthan","🌴 Kerala","🏔️ Himachal","🏖️ Goa","🛕 Tamil Nadu","🙏 Uttarakhand","🎒 Budget Travel","✈️ Explore India","🗺️ Student Trips","⭐ Amazing Places"];
  return (
    <div style={{overflow:"hidden",whiteSpace:"nowrap",padding:"8px 0",borderTop:"1px solid rgba(255,255,255,0.08)",borderBottom:"1px solid rgba(255,255,255,0.08)",marginBottom:24}}>
      <div style={{display:"inline-block",animation:"marquee 25s linear infinite"}}>
        {[...items,...items].map((t,i)=>(
          <span key={i} style={{display:"inline-block",marginRight:48,fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:500}}>{t}</span>
        ))}
      </div>
    </div>
  );
};

const glass = {background:"rgba(255,255,255,0.06)",backdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16};
const glassWarm = {background:"rgba(249,115,22,0.08)",backdropFilter:"blur(18px)",border:"1px solid rgba(249,115,22,0.2)",borderRadius:16};
const glassHard = {background:"rgba(255,255,255,0.09)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:16};

/* ── WELCOME ANIMATION PAGE ──────────────────────────────── */
const WelcomePage = ({name, onDone}) => {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{
    const t1 = setTimeout(()=>setPhase(1),400);
    const t2 = setTimeout(()=>setPhase(2),1200);
    const t3 = setTimeout(()=>setPhase(3),2200);
    const t4 = setTimeout(()=>setPhase(4),3200);
    const t5 = setTimeout(()=>onDone(),4600);
    return ()=>{[t1,t2,t3,t4,t5].forEach(clearTimeout)};
  },[]);
  const letters = "WanderStudent".split("");
  return (
    <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Poppins',sans-serif",overflow:"hidden"}}>
      <BG/>
      {/* Ripple rings */}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{position:"absolute",width:200+i*120,height:200+i*120,borderRadius:"50%",border:`2px solid rgba(251,191,36,${0.15-i*0.04})`,animation:`rippleOut ${2+i*.5}s ease-out ${i*.4}s infinite`}}/>
        ))}
      </div>
      <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"0 2rem"}}>
        {/* Globe icon */}
        <div style={{fontSize:72,animation:"welcomePop .7s cubic-bezier(.22,1,.36,1) forwards",opacity:phase>=1?1:0,display:"inline-block",filter:"drop-shadow(0 0 30px rgba(251,191,36,0.6))"}}>🌍</div>
        {/* Brand name letter by letter */}
        <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:2,margin:"16px 0 8px"}}>
          {letters.map((l,i)=>(
            <span key={i} style={{fontSize:36,fontWeight:900,color:"#fbbf24",opacity:phase>=2?1:0,animation:phase>=2?`letterDrop .4s cubic-bezier(.22,1,.36,1) ${i*0.06}s both`:"none",display:"inline-block",textShadow:"0 0 20px rgba(251,191,36,0.6)"}}>{l}</span>
          ))}
        </div>
        {/* Welcome text */}
        <p style={{fontSize:20,color:"rgba(255,255,255,0.7)",opacity:phase>=3?1:0,animation:phase>=3?"fadeUp .6s ease forwards":"none",margin:"0 0 8px"}}>
          Welcome back, <span style={{color:"#fbbf24",fontWeight:700}}>{name}</span>! 👋
        </p>
        {/* Tagline */}
        <p style={{fontSize:14,color:"rgba(255,255,255,0.4)",opacity:phase>=3?1:0,animation:phase>=3?"fadeUp .6s ease .2s both":"none",margin:"0 0 28px"}}>
          Your adventure begins now ✈️
        </p>
        {/* Stats row */}
        <div style={{display:"flex",justifyContent:"center",gap:24,opacity:phase>=4?1:0,animation:phase>=4?"fadeUp .5s ease forwards":"none"}}>
          {[{n:"18",l:"Destinations"},{n:"6",l:"States"},{n:"₹1.5K+",l:"Starting Budget"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <p style={{fontSize:24,fontWeight:800,color:"#fbbf24",margin:0,animation:phase>=4?`countUp .4s ease ${i*.15}s both`:"none"}}>{s.n}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",margin:0,textTransform:"uppercase",letterSpacing:.5}}>{s.l}</p>
            </div>
          ))}
        </div>
        {/* Loading bar */}
        <div style={{marginTop:28,width:200,margin:"28px auto 0",height:3,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",opacity:phase>=3?1:0}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#f97316,#fbbf24)",borderRadius:99,width:"100%",animation:"waveIn 1.4s ease forwards",transformOrigin:"left"}}/>
        </div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:8,opacity:phase>=3?1:0,animation:phase>=3?"pulse 1s ease-in-out infinite":"none"}}>Loading your journey...</p>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState("login");
  const [showWelcome, setShowWelcome] = useState(false);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({name:"",email:"",password:""});
  const [isSignup, setIsSignup] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [planStep, setPlanStep] = useState(1);
  const [form, setForm] = useState({destination:"",from:"",date:"",days:"3",budget:"5000",transport:"Train",stay:"Hostel",foodBudget:"",travelBudget:"",places:"",emergency:"",persons:"1"});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [planErr, setPlanErr] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expInp, setExpInp] = useState({label:"",amt:""});
  const [checked, setChecked] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [navActive, setNavActive] = useState("home");
  const resultRef = useRef(null);

  const setF = (k,v) => setForm(f=>({...f,[k]:v}));
  const totalSpent = expenses.reduce((a,e)=>a+Number(e.amt),0);
  const allPlaces = STATES_DATA.flatMap(s=>s.places.map(p=>({...p,state:s.state,stateEmoji:s.emoji})));
  const filtered = search ? allPlaces.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.state.toLowerCase().includes(search.toLowerCase())||p.tag.toLowerCase().includes(search.toLowerCase())) : [];

  function doLogin() {
    if(!loginForm.name||!loginForm.email||!loginForm.password){setLoginErr("Please fill all fields.");return;}
    if(loginForm.password.length<6){setLoginErr("Password must be at least 6 characters.");return;}
    setUser({name:loginForm.name,email:loginForm.email});
    setShowWelcome(true);
    setLoginErr("");
  }

  async function planTrip() {
    if(!form.destination||!form.from||!form.date||!form.budget){setPlanErr("Please fill destination, starting place, date & budget.");return;}
    setPlanErr("");setLoading(true);setResult(null);
    const prompt=`You are a student travel budget planner for India. You MUST return ONLY a single valid JSON object. No markdown, no code fences, no explanation, no extra text before or after. Start your response with { and end with }.

Trip details: From:${form.from} To:${form.destination} Date:${form.date} Days:${form.days} Persons:${form.persons} Budget:${form.budget} INR Transport:${form.transport} Stay:${form.stay} Food budget:${form.foodBudget||"auto"} Places to visit:${form.places||"popular tourist spots"}

Return this exact JSON shape (all number fields must be plain integers, no strings):
{"totalCost":0,"remainingBudget":0,"budgetStatus":"Under Budget","transport":{"option":"","cost":0,"details":""},"stay":{"name":"","costPerNight":0,"totalCost":0,"type":""},"food":{"dailyCost":0,"totalCost":0,"tips":""},"weather":{"condition":"","temp":"","advice":"","emoji":""},"packingChecklist":["item1","item2","item3","item4","item5","item6","item7","item8","item9","item10","item11","item12"],"suggestedPlaces":[{"name":"","desc":"","entryFee":0,"emoji":""}],"travelRoute":["place1","place2"],"dayWisePlan":[{"day":1,"title":"","activities":"","expense":0,"emoji":""}],"expenseBreakdown":[{"category":"Transport","amount":0},{"category":"Stay","amount":0},{"category":"Food","amount":0},{"category":"Sightseeing","amount":0},{"category":"Misc","amount":0}],"splitCost":0,"costPerDay":0,"tips":["tip1","tip2","tip3","tip4","tip5"],"funFact":""}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:2000,
          messages:[{role:"user",content:prompt}]
        })
      });
      if(!res.ok){
        const errData = await res.json().catch(()=>({}));
        setPlanErr(`API error ${res.status}: ${errData?.error?.message||"Please try again."}`);
        setLoading(false); return;
      }
      const data = await res.json();
      const rawText = (data.content||[]).map(c=>c.type==="text"?c.text:"").join("").trim();
      // Extract JSON — find first { to last }
      const start = rawText.indexOf("{");
      const end = rawText.lastIndexOf("}");
      if(start===-1||end===-1) throw new Error("No JSON found in response");
      const jsonStr = rawText.slice(start, end+1);
      const parsed = JSON.parse(jsonStr);
      // Ensure required fields have defaults so UI never crashes
      parsed.expenseBreakdown = parsed.expenseBreakdown||[];
      parsed.dayWisePlan = parsed.dayWisePlan||[];
      parsed.packingChecklist = parsed.packingChecklist||[];
      parsed.suggestedPlaces = parsed.suggestedPlaces||[];
      parsed.travelRoute = parsed.travelRoute||[];
      parsed.tips = parsed.tips||[];
      setResult(parsed);
      setTimeout(()=>resultRef.current?.scrollIntoView({behavior:"smooth"}),200);
    } catch(e){
      setPlanErr(`Could not parse the trip plan. Please try again. (${e.message})`);
    }
    setLoading(false);
  }

  const inp = {display:"block",width:"100%",marginTop:4};
  const r=result;
  const budgetColor=r?.budgetStatus==="Over Budget"?"#f87171":r?.budgetStatus==="Under Budget"?"#34d399":"#fbbf24";

  /* ── WELCOME SCREEN ── */
  if(showWelcome) return <WelcomePage name={user?.name?.split(" ")[0]} onDone={()=>{setShowWelcome(false);setPage("home");}}/>;

  /* ── LOGIN PAGE ── */
  if(page==="login") return (
    <div style={{position:"relative",minHeight:"100vh",fontFamily:"'Poppins',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <style>{css}</style><BG/>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:420,padding:"0 1rem"}}>
        <div style={{textAlign:"center",marginBottom:28,animation:"fadeUp .6s ease"}}>
          <div style={{fontSize:60,animation:"float 3s ease-in-out infinite",display:"inline-block",filter:"drop-shadow(0 0 20px rgba(251,191,36,0.5))"}}>🌍</div>
          <h1 style={{fontSize:30,fontWeight:900,margin:"10px 0 6px",background:"linear-gradient(135deg,#fbbf24,#f97316,#fbbf24)",backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmerText 3s ease infinite"}}>WanderStudent</h1>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Explore India on a student budget 🎒</p>
        </div>
        <div style={{...glassWarm,padding:"2rem",animation:"fadeUp .7s ease",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
          <div style={{display:"flex",marginBottom:22,background:"rgba(0,0,0,0.25)",borderRadius:12,padding:4}}>
            {["Login","Sign Up"].map((t,i)=>(
              <button key={t} onClick={()=>{setIsSignup(i===1);setLoginErr("");}} style={{flex:1,padding:"9px",background:isSignup===(i===1)?"linear-gradient(135deg,rgba(249,115,22,0.5),rgba(251,191,36,0.3))":"transparent",border:isSignup===(i===1)?"1px solid rgba(251,191,36,0.4)":"1px solid transparent",borderRadius:9,color:isSignup===(i===1)?"#fbbf24":"rgba(255,255,255,0.4)",fontWeight:isSignup===(i===1)?700:400,cursor:"pointer",fontSize:13,transition:"all .2s",fontFamily:"'Poppins',sans-serif"}}>{t}</button>
            ))}
          </div>
          <div style={{display:"grid",gap:14}}>
            {[{l:"👤 Full Name",k:"name",p:"Your name",t:"text"},{l:"📧 Email",k:"email",p:"you@college.edu",t:"email"},{l:"🔒 Password",k:"password",p:"Min. 6 characters",t:"password"}].map(f=>(
              <label key={f.k}><span style={{fontSize:12,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:.5}}>{f.l}</span>
                <input type={f.t} value={loginForm[f.k]} onChange={e=>setLoginForm(x=>({...x,[f.k]:e.target.value}))} placeholder={f.p} style={inp}/>
              </label>
            ))}
          </div>
          {loginErr && <p style={{color:"#f87171",fontSize:13,marginTop:10}}>{loginErr}</p>}
          <button onClick={doLogin} className="btn-primary" style={{width:"100%",marginTop:20,padding:"13px",fontSize:15,borderRadius:14}}>
            {isSignup?"🚀 Begin My Journey":"✨ Login & Explore"}
          </button>
          <p style={{textAlign:"center",marginTop:14,fontSize:11,color:"rgba(255,255,255,0.28)"}}>Demo: any name + any email + 123456</p>
        </div>
      </div>
    </div>
  );

  /* ── PLACE DETAIL MODAL ── */
  if(selectedPlace) {
    const stateData = STATES_DATA.find(s=>s.state===selectedPlace.state);
    return (
      <div style={{position:"relative",minHeight:"100vh",fontFamily:"'Poppins',sans-serif",color:"#fff",overflow:"hidden"}}>
        <style>{css}</style><BG/>
        <div style={{position:"relative",zIndex:1,maxWidth:720,margin:"0 auto",padding:"1.5rem 1rem"}}>
          <button onClick={()=>setSelectedPlace(null)} style={{...glass,border:"none",padding:"8px 18px",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:13,marginBottom:20,borderRadius:10}}>← Back</button>
          <div style={{...glassWarm,padding:0,overflow:"hidden",marginBottom:20,animation:"fadeUp .4s ease",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
            <div style={{padding:"2.5rem 2rem",textAlign:"center",borderBottom:"1px solid rgba(249,115,22,0.2)"}}>
              <div style={{fontSize:68,animation:"float 3s ease-in-out infinite",display:"inline-block",filter:"drop-shadow(0 0 20px rgba(251,191,36,0.4))"}}>{selectedPlace.img}</div>
              <h1 style={{fontSize:28,fontWeight:900,margin:"12px 0 6px",background:"linear-gradient(135deg,#fbbf24,#f97316)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{selectedPlace.name}</h1>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:14}}>{selectedPlace.stateEmoji} {selectedPlace.state}</p>
              <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:12,flexWrap:"wrap"}}>
                <span className="tag-pill" style={{background:"rgba(249,115,22,0.2)",color:"#fdba74",border:"1px solid rgba(249,115,22,0.4)"}}>{selectedPlace.tag}</span>
                <span className="tag-pill" style={{background:"rgba(251,191,36,0.15)",color:"#fde68a",border:"1px solid rgba(251,191,36,0.3)"}}>⭐ {selectedPlace.rating}</span>
                <span className="tag-pill" style={{background:"rgba(16,185,129,0.15)",color:"#6ee7b7",border:"1px solid rgba(16,185,129,0.3)"}}>Best: {selectedPlace.best}</span>
              </div>
            </div>
            {/* Famous Place Highlight */}
            {selectedPlace.famous && (
              <div style={{background:"linear-gradient(135deg,rgba(251,191,36,0.12),rgba(249,115,22,0.08))",borderBottom:"1px solid rgba(251,191,36,0.15)",padding:"14px 2rem",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:28,animation:"bounce 2s ease-in-out infinite"}}>⭐</span>
                <div>
                  <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5}}>Most Famous Place</p>
                  <p style={{margin:"3px 0 0",fontSize:16,fontWeight:700,color:"#fbbf24"}}>{selectedPlace.famous}</p>
                </div>
              </div>
            )}
            <div style={{padding:"1.5rem 2rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[{icon:"📖",label:"About",val:selectedPlace.desc},{icon:"💰",label:"Budget Range",val:selectedPlace.cost},{icon:"📅",label:"Best Time",val:selectedPlace.best},{icon:"⭐",label:"Rating",val:`${selectedPlace.rating} / 5.0`}].map((item,i)=>(
                <div key={i} style={{...glass,padding:"14px",borderRadius:12}}>
                  <p style={{fontSize:20,marginBottom:4}}>{item.icon}</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>{item.label}</p>
                  <p style={{fontSize:14,fontWeight:600,color:"#fdba74"}}>{item.val}</p>
                </div>
              ))}
            </div>
            <div style={{padding:"0 2rem 1.5rem"}}>
              <button onClick={()=>{setF("destination",selectedPlace.name);setPage("planner");setSelectedPlace(null);}} className="btn-primary" style={{width:"100%",padding:"13px",fontSize:15}}>
                🚀 Plan Trip to {selectedPlace.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── PLANNER PAGE ── */
  if(page==="planner") return (
    <div style={{position:"relative",minHeight:"100vh",fontFamily:"'Poppins',sans-serif",color:"#fff",overflowY:"auto"}}>
      <style>{css}</style><BG night/>
      <div style={{position:"relative",zIndex:1,maxWidth:720,margin:"0 auto",padding:"1.5rem 1rem 4rem"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <button onClick={()=>setPage("home")} style={{...glass,border:"none",padding:"8px 16px",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:13,borderRadius:10}}>← Home</button>
          <h2 style={{fontSize:18,fontWeight:700,background:"linear-gradient(135deg,#fbbf24,#f97316)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🎒 AI Trip Planner</h2>
          <div style={{width:80}}/>
        </div>

        {!result && (
          <div style={{...glassWarm,padding:"1.5rem",marginBottom:24,animation:"fadeUp .5s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:24}}>
              {["Basics","Budget","Extras"].map((label,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center"}}>
                  <div onClick={()=>setPlanStep(i+1)} style={{cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,background:planStep>i+1?"linear-gradient(135deg,#10b981,#059669)":planStep===i+1?"linear-gradient(135deg,#f97316,#fbbf24)":"rgba(255,255,255,0.08)",color:planStep>=i+1?"#fff":"rgba(255,255,255,0.35)",boxShadow:planStep===i+1?"0 0 20px rgba(251,191,36,0.5)":"none",transition:"all .3s"}}>{planStep>i+1?"✓":i+1}</div>
                    <span style={{fontSize:11,color:planStep===i+1?"#fbbf24":"rgba(255,255,255,0.3)",fontWeight:planStep===i+1?600:400}}>{label}</span>
                  </div>
                  {i<2&&<div style={{width:56,height:1,background:planStep>i+1?"linear-gradient(90deg,#f97316,#fbbf24)":"rgba(255,255,255,0.1)",margin:"0 8px",marginBottom:20,transition:"all .4s"}}/>}
                </div>
              ))}
            </div>
            {planStep===1&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{l:"🏠 Starting Place",k:"from",p:"e.g. Bengaluru",full:true},{l:"📍 Destination",k:"destination",p:"e.g. Manali",full:true},{l:"📅 Date",k:"date",t:"date"},{l:"🌙 Days",k:"days",t:"number"},{l:"👥 Persons",k:"persons",t:"number"},{l:"🆘 Emergency",k:"emergency",p:"Phone"}].map(f=>(
                  <label key={f.k} style={{gridColumn:f.full?"1/-1":"auto"}}>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>{f.l}</span>
                    <input type={f.t||"text"} value={form[f.k]} onChange={e=>setF(f.k,e.target.value)} placeholder={f.p||""} style={inp}/>
                  </label>
                ))}
              </div>
            )}
            {planStep===2&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <label style={{gridColumn:"1/-1"}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>💰 Total Budget (₹)</span>
                  <input type="number" value={form.budget} onChange={e=>setF("budget",e.target.value)} style={inp}/>
                </label>
                {[{l:"🍛 Food Budget (₹)",k:"foodBudget"},{l:"🎫 Travel Budget (₹)",k:"travelBudget"}].map(f=>(
                  <label key={f.k}><span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>{f.l}</span><input type="number" value={form[f.k]} onChange={e=>setF(f.k,e.target.value)} placeholder="Optional" style={inp}/></label>
                ))}
                <label><span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>🚌 Transport</span><select value={form.transport} onChange={e=>setF("transport",e.target.value)} style={inp}>{TRANSPORT.map(t=><option key={t}>{t}</option>)}</select></label>
                <label><span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>🏨 Stay Type</span><select value={form.stay} onChange={e=>setF("stay",e.target.value)} style={inp}>{STAY.map(s=><option key={s}>{s}</option>)}</select></label>
              </div>
            )}
            {planStep===3&&(
              <label><span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>📌 Places to Visit</span>
                <textarea value={form.places} onChange={e=>setF("places",e.target.value)} placeholder="Leave blank for AI suggestions..." rows={4} style={{...inp,resize:"vertical",lineHeight:1.6}}/>
              </label>
            )}
            {planErr&&<p style={{color:"#f87171",fontSize:13,marginTop:8}}>{planErr}</p>}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:20,gap:10}}>
              {planStep>1&&<button onClick={()=>setPlanStep(s=>s-1)} style={{...glass,border:"none",padding:"10px 20px",color:"rgba(255,255,255,0.7)",cursor:"pointer",borderRadius:10,fontFamily:"'Poppins',sans-serif"}}>← Back</button>}
              {planStep<3&&<button onClick={()=>setPlanStep(s=>s+1)} className="btn-primary" style={{marginLeft:"auto",padding:"10px 24px",fontSize:14,borderRadius:10}}>Next →</button>}
              {planStep===3&&<button onClick={planTrip} disabled={loading} className="btn-primary" style={{marginLeft:"auto",padding:"10px 28px",fontSize:14,borderRadius:10}}>🚀 Plan My Trip</button>}
            </div>
          </div>
        )}

        {loading&&<div style={{...glassWarm,padding:"2rem",textAlign:"center"}}>
          <div style={{position:"relative",width:60,height:60,margin:"0 auto 16px"}}>
            <div style={{position:"absolute",inset:0,border:"3px solid rgba(249,115,22,0.2)",borderTop:"3px solid #f97316",borderRadius:"50%",animation:"spin .9s linear infinite"}}/>
            <div style={{position:"absolute",inset:10,border:"2px solid rgba(251,191,36,0.2)",borderBottom:"2px solid #fbbf24",borderRadius:"50%",animation:"spinR 1.2s linear infinite"}}/>
          </div>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,animation:"pulse 1.5s ease-in-out infinite"}}>✨ AI crafting your perfect trip...</p>
        </div>}

        {r&&(
          <div ref={resultRef} style={{animation:"fadeUp .5s ease"}}>
            <div style={{background:r.budgetStatus==="Over Budget"?"rgba(248,113,113,0.1)":r.budgetStatus==="Under Budget"?"rgba(16,185,129,0.1)":"rgba(251,191,36,0.1)",border:`1px solid ${budgetColor}40`,borderRadius:14,padding:"12px 20px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <p style={{margin:0,fontWeight:700,fontSize:15,color:budgetColor}}>{r.budgetStatus==="Over Budget"?"⚠️ Over Budget!":r.budgetStatus==="Under Budget"?"🎉 Under Budget!":"🎯 On Budget!"}</p>
              <span style={{background:budgetColor+"22",color:budgetColor,border:`1px solid ${budgetColor}55`,borderRadius:20,padding:"4px 14px",fontSize:12,fontWeight:600}}>{r.budgetStatus}</span>
            </div>
            {r.funFact&&<div style={{...glass,padding:"10px 16px",marginBottom:16,display:"flex",gap:10}}><span style={{fontSize:18}}>💡</span><p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.55)",fontStyle:"italic"}}>{r.funFact}</p></div>}
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
              {[{l:"Total Cost",v:`₹${r.totalCost?.toLocaleString()}`,i:"💸",c:"#f97316"},{l:"Remaining",v:`₹${r.remainingBudget?.toLocaleString()}`,i:"✅",c:"#10b981"},{l:"Per Day",v:`₹${r.costPerDay?.toLocaleString()}`,i:"📆",c:"#3b82f6"},{l:"Per Person",v:`₹${r.splitCost?.toLocaleString()}`,i:"👤",c:"#fbbf24"}].map((m,i)=>(
                <div key={i} style={{...glassWarm,padding:"12px 16px",flex:1,minWidth:130}}>
                  <p style={{fontSize:18,margin:"0 0 4px"}}>{m.i}</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,margin:0}}>{m.l}</p>
                  <p style={{fontSize:20,fontWeight:700,color:m.c,margin:"4px 0 0"}}>{m.v}</p>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
              {[{e:"🚌",t:"Transport",m:r.transport?.option,s:`₹${r.transport?.cost?.toLocaleString()}`,d:r.transport?.details},{e:"🏨",t:"Stay",m:r.stay?.name,s:`₹${r.stay?.costPerNight?.toLocaleString()}/night`,d:r.stay?.type},{e:r.weather?.emoji||"🌤️",t:"Weather",m:r.weather?.condition,s:r.weather?.temp,d:r.weather?.advice}].map((c,i)=>(
                <div key={i} className="hover-lift" style={{...glass,padding:"12px 14px",cursor:"default"}}>
                  <div style={{fontSize:26,marginBottom:6}}>{c.e}</div>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:.5,margin:"0 0 2px"}}>{c.t}</p>
                  <p style={{fontSize:13,fontWeight:600,color:"#fff",margin:"0 0 2px"}}>{c.m}</p>
                  <p style={{fontSize:13,color:"#fbbf24",margin:"0 0 4px"}}>{c.s}</p>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.38)",margin:0}}>{c.d}</p>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6,marginBottom:20,background:"rgba(0,0,0,0.3)",borderRadius:12,padding:4}}>
              {[{id:"overview",l:"Overview",i:"📊"},{id:"itinerary",l:"Itinerary",i:"📅"},{id:"places",l:"Places",i:"📍"},{id:"tools",l:"Tools",i:"🧮"}].map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{flex:1,padding:"8px 4px",background:activeTab===t.id?"linear-gradient(135deg,rgba(249,115,22,0.3),rgba(251,191,36,0.15))":"transparent",border:activeTab===t.id?"1px solid rgba(251,191,36,0.4)":"1px solid transparent",borderRadius:9,color:activeTab===t.id?"#fbbf24":"rgba(255,255,255,0.4)",fontSize:12,fontWeight:activeTab===t.id?600:400,cursor:"pointer",transition:"all .2s",fontFamily:"'Poppins',sans-serif"}}>{t.i} {t.l}</button>
              ))}
            </div>
            {activeTab==="overview"&&<div style={{animation:"fadeUp .3s ease"}}>
              <div style={{marginBottom:16}}><p style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:10}}>🗺️ Travel Route</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center"}}>
                  {r.travelRoute?.map((s,i)=>(
                    <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.3)",color:"#fdba74",fontSize:13,padding:"5px 14px",borderRadius:20}}>{s}</span>
                      {i<r.travelRoute.length-1&&<span style={{color:"rgba(251,191,36,0.5)"}}>→</span>}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={r.expenseBreakdown} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={70} stroke="rgba(0,0,0,0.3)" strokeWidth={2}>{r.expenseBreakdown?.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>`₹${v?.toLocaleString()}`} contentStyle={{background:"rgba(15,5,0,0.95)",border:"1px solid rgba(249,115,22,0.3)",borderRadius:8,color:"#fff",fontSize:12}}/></PieChart></ResponsiveContainer>
                <ResponsiveContainer width="100%" height={180}><BarChart data={r.expenseBreakdown} layout="vertical" margin={{left:0}}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/><XAxis type="number" tickFormatter={v=>`₹${v}`} tick={{fontSize:9,fill:"rgba(255,255,255,0.35)"}} axisLine={false}/><YAxis type="category" dataKey="category" tick={{fontSize:9,fill:"rgba(255,255,255,0.45)"}} width={60} axisLine={false}/><Tooltip formatter={v=>`₹${v?.toLocaleString()}`} contentStyle={{background:"rgba(15,5,0,0.95)",border:"1px solid rgba(249,115,22,0.3)",borderRadius:8,color:"#fff",fontSize:12}}/><Bar dataKey="amount" radius={[0,5,5,0]}>{r.expenseBreakdown?.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Bar></BarChart></ResponsiveContainer>
              </div>
              <div style={{display:"grid",gap:6}}>{r.tips?.map((t,i)=>(
                <div key={i} style={{...glass,padding:"10px 14px",display:"flex",gap:10,alignItems:"flex-start",borderRadius:10}}>
                  <span style={{background:"linear-gradient(135deg,#f97316,#fbbf24)",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
                  <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.5}}>{t}</p>
                </div>
              ))}</div>
            </div>}
            {activeTab==="itinerary"&&<div style={{animation:"fadeUp .3s ease"}}>
              {r.dayWisePlan?.map((d,i)=>(
                <div key={i} style={{...glass,padding:"14px",marginBottom:10,display:"flex",gap:12,borderLeft:"3px solid rgba(249,115,22,0.5)"}}>
                  <div style={{minWidth:40,height:40,borderRadius:10,background:"rgba(249,115,22,0.2)",border:"1px solid rgba(249,115,22,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{d.emoji||"📍"}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <p style={{margin:0,fontWeight:600,fontSize:14,color:"#fdba74"}}>Day {d.day} — {d.title}</p>
                      <span style={{background:"rgba(16,185,129,0.15)",color:"#34d399",border:"1px solid rgba(16,185,129,0.3)",borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:500}}>₹{d.expense?.toLocaleString()}</span>
                    </div>
                    <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{d.activities}</p>
                  </div>
                </div>
              ))}
              <div style={{marginTop:16}}><p style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:10}}>🧳 Packing Checklist</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {r.packingChecklist?.map((item,i)=>(
                    <label key={i} onClick={()=>setChecked(c=>({...c,[i]:!c[i]}))} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer",...glass,padding:"8px 10px",borderRadius:10,opacity:checked[i]?.5:1,transition:"all .2s"}}>
                      <div style={{width:16,height:16,borderRadius:4,border:"1px solid rgba(249,115,22,0.5)",background:checked[i]?"linear-gradient(135deg,#f97316,#fbbf24)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0}}>{checked[i]&&"✓"}</div>
                      <span style={{color:checked[i]?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.65)",textDecoration:checked[i]?"line-through":"none"}}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>}
            {activeTab==="places"&&<div style={{animation:"fadeUp .3s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {r.suggestedPlaces?.map((p,i)=>(
                  <div key={i} className="hover-lift" style={{...glass,padding:"14px",borderRadius:12}}>
                    <div style={{fontSize:28,marginBottom:8}}>{p.emoji||"🏞️"}</div>
                    <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14,color:"#fdba74"}}>{p.name}</p>
                    <p style={{margin:"0 0 8px",fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{p.desc}</p>
                    <span style={{background:p.entryFee===0?"rgba(16,185,129,0.15)":"rgba(59,130,246,0.15)",color:p.entryFee===0?"#34d399":"#60a5fa",border:`1px solid ${p.entryFee===0?"rgba(16,185,129,0.3)":"rgba(59,130,246,0.3)"}`,borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:500}}>
                      {p.entryFee===0?"🆓 Free":"🎫 ₹"+p.entryFee}
                    </span>
                  </div>
                ))}
              </div>
            </div>}
            {activeTab==="tools"&&<div style={{animation:"fadeUp .3s ease"}}>
              <div style={{...glass,padding:"16px",borderRadius:12,marginBottom:16}}>
                <p style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.6)",marginBottom:12}}>🧮 Expense Tracker</p>
                <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                  <input value={expInp.label} onChange={e=>setExpInp(x=>({...x,label:e.target.value}))} placeholder="Expense label" style={{flex:2,minWidth:100}}/>
                  <input type="number" value={expInp.amt} onChange={e=>setExpInp(x=>({...x,amt:e.target.value}))} placeholder="₹" style={{flex:1,minWidth:70}}/>
                  <button onClick={()=>{if(!expInp.label||!expInp.amt)return;setExpenses(e=>[...e,{...expInp,id:Date.now()}]);setExpInp({label:"",amt:""}); }} className="btn-primary" style={{padding:"10px 16px",fontSize:13,borderRadius:10}}>Add</button>
                </div>
                {expenses.map(e=>(
                  <div key={e.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                    <span style={{color:"rgba(255,255,255,0.6)"}}>{e.label}</span>
                    <span style={{color:"#f97316",fontWeight:600}}>₹{Number(e.amt).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:110,...glass,padding:"10px",borderRadius:10}}><p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.4)"}}>SPENT</p><p style={{margin:"4px 0 0",fontSize:18,fontWeight:700,color:"#f97316"}}>₹{totalSpent.toLocaleString()}</p></div>
                  <div style={{flex:1,minWidth:110,...glass,padding:"10px",borderRadius:10}}><p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.4)"}}>LEFT</p><p style={{margin:"4px 0 0",fontSize:18,fontWeight:700,color:r.remainingBudget-totalSpent<0?"#f87171":"#34d399"}}>₹{Math.abs(r.remainingBudget-totalSpent).toLocaleString()}</p></div>
                </div>
              </div>
              <button onClick={()=>{setResult(null);setPlanStep(1);setExpenses([]);setChecked({});}} style={{width:"100%",padding:"11px",...glass,border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.55)",cursor:"pointer",fontSize:13,borderRadius:10,fontFamily:"'Poppins',sans-serif"}}>🔄 Plan Another Trip</button>
            </div>}
          </div>
        )}
      </div>
    </div>
  );

  /* ── HOME PAGE ── */
  return (
    <div style={{position:"relative",minHeight:"100vh",fontFamily:"'Poppins',sans-serif",color:"#fff",overflowY:"auto"}}>
      <style>{css}</style><BG/>
      <div style={{position:"relative",zIndex:1,maxWidth:720,margin:"0 auto",padding:"0 1rem 5rem"}}>

        {/* Navbar */}
        <div style={{...glassHard,padding:"10px 16px",marginBottom:0,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,borderRadius:"0 0 16px 16px",borderTop:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:22,animation:"float 3s ease-in-out infinite",display:"inline-block"}}>🌍</span>
            <span style={{fontWeight:900,fontSize:15,background:"linear-gradient(135deg,#fbbf24,#f97316)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>WanderStudent</span>
          </div>
          <div style={{display:"flex",gap:5}}>
            {[{id:"home",i:"🏠"},{id:"explore",i:"🔭"},{id:"states",i:"🗺️"}].map(n=>(
              <button key={n.id} onClick={()=>setNavActive(n.id)} style={{padding:"6px 11px",background:navActive===n.id?"rgba(249,115,22,0.2)":"transparent",border:navActive===n.id?"1px solid rgba(251,191,36,0.35)":"1px solid transparent",borderRadius:8,color:navActive===n.id?"#fbbf24":"rgba(255,255,255,0.4)",fontSize:12,fontWeight:navActive===n.id?600:400,cursor:"pointer",transition:"all .2s",textTransform:"capitalize",fontFamily:"'Poppins',sans-serif"}}>{n.i} {n.id}</button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Hi, {user?.name?.split(" ")[0]} 👋</span>
            <button onClick={()=>setPage("login")} style={{padding:"5px 12px",background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:8,color:"#f87171",fontSize:11,cursor:"pointer",fontFamily:"'Poppins',sans-serif"}}>Logout</button>
          </div>
        </div>

        <Marquee/>

        {/* Search */}
        <div style={{position:"relative",marginBottom:28,animation:"fadeUp .5s ease"}}>
          <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:18,pointerEvents:"none"}}>🔍</div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search places, states or tags... (e.g. Beach, Goa, Adventure)" style={{width:"100%",padding:"13px 14px 13px 44px",fontSize:14,borderRadius:14,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",color:"#fff",boxSizing:"border-box"}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:20}}>×</button>}
        </div>

        {/* Search Results */}
        {search&&(
          <div style={{marginBottom:24,animation:"fadeUp .3s ease"}}>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:12}}>{filtered.length} result{filtered.length!==1?"s":""} for "{search}"</p>
            {filtered.length===0?<div style={{...glass,padding:"2rem",textAlign:"center"}}><p style={{fontSize:32,marginBottom:8}}>🔭</p><p style={{color:"rgba(255,255,255,0.4)"}}>No places found. Try "Goa", "Adventure", or "Beach"</p></div>:(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {filtered.map((p,i)=>(
                  <div key={i} className="hover-lift" onClick={()=>setSelectedPlace(p)} style={{...glassWarm,padding:"14px",cursor:"pointer",borderRadius:14}}>
                    <div style={{fontSize:30,marginBottom:8}}>{p.img}</div>
                    <p style={{margin:"0 0 2px",fontWeight:700,fontSize:15,color:"#fdba74"}}>{p.name}</p>
                    <p style={{margin:"0 0 4px",fontSize:11,color:"rgba(255,255,255,0.4)"}}>{p.stateEmoji} {p.state}</p>
                    {p.famous&&<p style={{margin:"0 0 6px",fontSize:12,color:"#fbbf24",fontWeight:500}}>⭐ {p.famous}</p>}
                    <p style={{margin:"0 0 8px",fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.4}}>{p.desc}</p>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <span className="tag-pill" style={{background:"rgba(249,115,22,0.18)",color:"#fdba74",border:"1px solid rgba(249,115,22,0.3)"}}>{p.tag}</span>
                      <span className="tag-pill" style={{background:"rgba(16,185,129,0.12)",color:"#6ee7b7",border:"1px solid rgba(16,185,129,0.25)"}}>{p.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HOME */}
        {!search && navActive==="home" && (
          <div style={{animation:"fadeUp .5s ease"}}>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{display:"flex",justifyContent:"center",gap:14,marginBottom:16}}>
                {["✈️","🏔️","🌊","🏝️","🌿"].map((e,i)=>(
                  <span key={i} style={{fontSize:26,animation:`float ${4+i*.6}s ease-in-out infinite ${i*.3}s`,display:"inline-block"}}>{e}</span>
                ))}
              </div>
              <h1 style={{fontSize:30,fontWeight:900,margin:"0 0 10px",background:"linear-gradient(135deg,#fbbf24 10%,#f97316 50%,#fbbf24 90%)",backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmerText 3s ease infinite",lineHeight:1.2}}>Explore India on a Student Budget</h1>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:22}}>Discover amazing places. Plan smart trips. Travel more. 🎒</p>
              <button onClick={()=>setPage("planner")} className="btn-primary" style={{padding:"14px 36px",fontSize:16,animation:"glow 2s ease-in-out infinite"}}>
                🚀 Plan My Trip with AI
              </button>
            </div>

            {/* Trending */}
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                <div style={{width:4,height:20,background:"linear-gradient(180deg,#fbbf24,#f97316)",borderRadius:2}}/>
                <h2 style={{fontSize:18,fontWeight:700,margin:0}}>🔥 Trending Destinations</h2>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {POPULAR.map((p,i)=>(
                  <div key={i} className="hover-lift" onClick={()=>{const found=allPlaces.find(x=>x.name===p.name);if(found)setSelectedPlace({...found,stateEmoji:STATES_DATA.find(s=>s.state===p.state)?.emoji||"📍"});}} style={{...glassWarm,padding:"16px",cursor:"pointer",borderRadius:14,textAlign:"center"}}>
                    <div style={{fontSize:36,marginBottom:8,animation:`float ${4+i*.4}s ease-in-out infinite`,display:"inline-block"}}>{p.img}</div>
                    <p style={{margin:"0 0 2px",fontWeight:700,fontSize:14,color:"#fdba74"}}>{p.name}</p>
                    <p style={{margin:"0 0 4px",fontSize:11,color:"rgba(255,255,255,0.4)"}}>{p.state}</p>
                    {/* Famous place badge */}
                    <div style={{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:8,padding:"4px 6px",marginBottom:6}}>
                      <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:.3}}>Must See</p>
                      <p style={{margin:0,fontSize:11,color:"#fbbf24",fontWeight:600,lineHeight:1.3}}>{p.famous}</p>
                    </div>
                    <span className="tag-pill" style={{background:`${p.color}22`,color:p.color,border:`1px solid ${p.color}44`}}>{p.tag}</span>
                    <p style={{margin:"6px 0 0",fontSize:12,color:"rgba(255,255,255,0.4)"}}>{p.cost}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{...glassWarm,padding:"16px 20px",borderRadius:14,display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:12}}>
              {[{n:"6",l:"States",i:"🗺️"},{n:"18",l:"Destinations",i:"📍"},{n:"₹1,500+",l:"Starting From",i:"💰"},{n:"100%",l:"AI Powered",i:"🤖"}].map((s,i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <p style={{fontSize:22,margin:"0 0 2px"}}>{s.i}</p>
                  <p style={{fontSize:22,fontWeight:800,margin:"0 0 2px",color:"#fbbf24"}}>{s.n}</p>
                  <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",margin:0}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPLORE */}
        {!search && navActive==="explore" && (
          <div style={{animation:"fadeUp .5s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
              <div style={{width:4,height:20,background:"linear-gradient(180deg,#fbbf24,#f97316)",borderRadius:2}}/>
              <h2 style={{fontSize:18,fontWeight:700,margin:0}}>🌟 All Destinations</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {allPlaces.map((p,i)=>(
                <div key={i} className="hover-lift" onClick={()=>setSelectedPlace(p)} style={{...glassWarm,padding:"14px",cursor:"pointer",borderRadius:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{fontSize:30,animation:`float ${4+i*.3}s ease-in-out infinite`,display:"inline-block"}}>{p.img}</div>
                    <span style={{fontSize:12,color:"#fbbf24"}}>⭐ {p.rating}</span>
                  </div>
                  <p style={{margin:"0 0 2px",fontWeight:700,fontSize:15,color:"#fdba74"}}>{p.name}</p>
                  <p style={{margin:"0 0 4px",fontSize:11,color:"rgba(255,255,255,0.4)"}}>{p.stateEmoji||"📍"} {p.state}</p>
                  {/* Famous place */}
                  {p.famous && <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.18)",borderRadius:7,padding:"4px 8px",marginBottom:6,display:"inline-flex",alignItems:"center",gap:5}}>
                    <span style={{fontSize:12}}>⭐</span><span style={{fontSize:11,color:"#fbbf24",fontWeight:600}}>{p.famous}</span>
                  </div>}
                  <p style={{margin:"4px 0 8px",fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.4}}>{p.desc}</p>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    <span className="tag-pill" style={{background:"rgba(249,115,22,0.15)",color:"#fdba74",border:"1px solid rgba(249,115,22,0.25)"}}>{p.tag}</span>
                    <span className="tag-pill" style={{background:"rgba(16,185,129,0.1)",color:"#6ee7b7",border:"1px solid rgba(16,185,129,0.2)"}}>{p.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATES */}
        {!search && navActive==="states" && (
          <div style={{animation:"fadeUp .5s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
              <div style={{width:4,height:20,background:"linear-gradient(180deg,#fbbf24,#f97316)",borderRadius:2}}/>
              <h2 style={{fontSize:18,fontWeight:700,margin:0}}>🗺️ Explore by State</h2>
            </div>
            {STATES_DATA.map((s,si)=>(
              <div key={si} style={{marginBottom:24}}>
                {/* State header with famous place */}
                <div style={{...glassWarm,padding:"14px 16px",marginBottom:12,borderRadius:14,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${s.color}22`,border:`1px solid ${s.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{s.emoji}</div>
                  <div style={{flex:1}}>
                    <h3 style={{margin:"0 0 2px",fontSize:17,fontWeight:800,color:"#fdba74"}}>{s.state}</h3>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontSize:16}}>{s.famousImg}</span>
                      <span style={{fontSize:12,color:"#fbbf24",fontWeight:500}}>Most Famous: {s.famousPlace}</span>
                    </div>
                  </div>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>{s.places.length} spots</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                  {s.places.map((p,pi)=>(
                    <div key={pi} className="hover-lift" onClick={()=>setSelectedPlace({...p,state:s.state,stateEmoji:s.emoji})} style={{...glass,padding:"14px",cursor:"pointer",borderRadius:12,border:`1px solid ${s.color}22`}}>
                      <div style={{fontSize:28,marginBottom:8,animation:`float ${4+pi*.5}s ease-in-out infinite`,display:"inline-block"}}>{p.img}</div>
                      <p style={{margin:"0 0 2px",fontWeight:700,fontSize:13,color:"#fdba74"}}>{p.name}</p>
                      {/* Famous badge per city */}
                      <div style={{background:`${s.color}15`,border:`1px solid ${s.color}30`,borderRadius:6,padding:"3px 7px",marginBottom:5,display:"inline-block"}}>
                        <p style={{margin:0,fontSize:10,color:s.color,fontWeight:600}}>⭐ {p.famous}</p>
                      </div>
                      <p style={{margin:"4px 0 6px",fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.3}}>{p.desc}</p>
                      <span className="tag-pill" style={{background:`${s.color}20`,color:s.color,border:`1px solid ${s.color}35`,fontSize:10}}>{p.tag}</span>
                      <p style={{margin:"5px 0 0",fontSize:11,color:"rgba(255,255,255,0.35)"}}>{p.cost}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Nav */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:20}}>
          <div style={{maxWidth:720,margin:"0 auto",padding:"0 1rem 0.5rem"}}>
            <div style={{...glassHard,padding:"8px",display:"flex",borderRadius:16}}>
              {[{id:"home",i:"🏠",l:"Home"},{id:"explore",i:"🔭",l:"Explore"},{id:"states",i:"🗺️",l:"States"},{id:"plan",i:"✈️",l:"Plan Trip"}].map(n=>(
                <button key={n.id} onClick={()=>n.id==="plan"?setPage("planner"):setNavActive(n.id)} style={{flex:1,padding:"8px 4px",background:navActive===n.id&&n.id!=="plan"?"linear-gradient(135deg,rgba(249,115,22,0.25),rgba(251,191,36,0.12))":"transparent",border:navActive===n.id&&n.id!=="plan"?"1px solid rgba(251,191,36,0.3)":"1px solid transparent",borderRadius:10,color:navActive===n.id&&n.id!=="plan"?"#fbbf24":"rgba(255,255,255,0.4)",fontSize:11,fontWeight:navActive===n.id?600:400,cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontFamily:"'Poppins',sans-serif"}}>
                  <span style={{fontSize:18}}>{n.i}</span><span>{n.l}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
