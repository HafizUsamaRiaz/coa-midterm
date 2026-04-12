import { useState, useEffect, useCallback, useRef } from "react";
import { SECTION_A, SECTION_B, SECTION_C } from "./questions.js";

// ═══════════════════════════════════════════════════════════════
//  🔧 CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const SHEET_URL        = "https://script.google.com/macros/s/AKfycbzGos0nqk-BIjx9zwuVtSRfU4diIbfGwlKTiBZhcQfDiG25gNPxdaiW0d5dxgrG9Qqkhw/exec";
const COURSE           = "CE203L · Computer Organization & Architecture Lab";
const EXAM_TITLE       = "Midterm Exam";
const EXAM_SUB         = "Labs 1–6 · Verilog HDL & Digital Design";
const INSTITUTION      = "Information Technology University (ITU)";
const FACULTY          = "Faculty of Engineering";

// Section config — questions per section picked randomly
const SECTION_CONFIG = {
  A: { questions: SECTION_A, pick: 10, timePerQ: 90,  label: "Section A", desc: "Concept MCQ",      color: "#4f8ef7", bg: "#0a1428" },
  B: { questions: SECTION_B, pick: 8,  timePerQ: 120, label: "Section B", desc: "Code Reading",     color: "#22d49a", bg: "#071a10" },
  C: { questions: SECTION_C, pick: 7,  timePerQ: 120, label: "Section C", desc: "Fill in the Blank", color: "#f7a94f", bg: "#1a100a" },
};
// ═══════════════════════════════════════════════════════════════

const C = {
  bg:"#06080f", card:"#0d1220", border:"#182840",
  text:"#d0e0ff", muted:"#3d5580", dim:"#0f1828",
  green:"#22d49a", danger:"#ff5252", warn:"#f7a94f",
  mono:"'Courier New', monospace", sans:"'Segoe UI', system-ui, sans-serif",
};

function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

// ── Load jsPDF ─────────────────────────────────────────────────
function loadJsPDF() {
  return new Promise((resolve,reject)=>{
    if(window.jspdf){resolve(window.jspdf.jsPDF);return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload=()=>resolve(window.jspdf.jsPDF);s.onerror=reject;
    document.head.appendChild(s);
  });
}

// ── Build flat question list in order A→B→C ────────────────────
function buildExamQuestions() {
  const qA = shuffle(SECTION_A).slice(0, SECTION_CONFIG.A.pick);
  const qB = shuffle(SECTION_B).slice(0, SECTION_CONFIG.B.pick);
  const qC = shuffle(SECTION_C).slice(0, SECTION_CONFIG.C.pick);
  return [...qA, ...qB, ...qC];
}

// ── PDF Generator ──────────────────────────────────────────────
async function generateResultPDF({studentName,rollNumber,studentEmail,questions,answers,tabWarnings,sectionScores,total,pct,grade}) {
  const jsPDF=await loadJsPDF();
  const doc=new jsPDF({unit:"mm",format:"a4"});
  const W=210,margin=14,CW=W-margin*2;
  const ts=new Date().toLocaleString("en-PK",{dateStyle:"medium",timeStyle:"short"});
  let y=0;
  const gradeRGB=pct>=80?[34,212,154]:pct>=60?[247,169,79]:[247,95,95];
  const newPage=()=>{doc.addPage();y=16;doc.setDrawColor(30,60,100);doc.setLineWidth(0.3);doc.line(margin,10,W-margin,10);};
  const checkY=(n=20)=>{if(y+n>275)newPage();};

  // Header
  doc.setFillColor(8,14,30);doc.rect(0,0,W,52,"F");
  doc.setFillColor(0,130,80);doc.rect(0,0,4,52,"F");
  doc.setTextColor(100,150,220);doc.setFontSize(8);doc.setFont("helvetica","bold");
  doc.text(INSTITUTION.toUpperCase(),margin+4,10);
  doc.setTextColor(70,110,170);doc.setFontSize(7);doc.setFont("helvetica","normal");
  doc.text(FACULTY.toUpperCase(),margin+4,15);
  doc.setFillColor(0,60,40);doc.roundedRect(margin+4,19,90,6,1.5,1.5,"F");
  doc.setTextColor(0,212,170);doc.setFontSize(7);doc.setFont("helvetica","bold");
  doc.text(COURSE,margin+7,23.2);
  doc.setTextColor(208,224,255);doc.setFontSize(17);doc.setFont("helvetica","bold");
  doc.text(EXAM_TITLE,margin+4,34);
  doc.setTextColor(61,85,128);doc.setFontSize(8);doc.setFont("helvetica","normal");
  doc.text(EXAM_SUB,margin+4,40);
  doc.setTextColor(61,85,128);doc.setFontSize(7);
  doc.text(`Generated: ${ts}`,W-margin,10,{align:"right"});
  doc.text("OFFICIAL RESULT SLIP",W-margin,15,{align:"right"});
  doc.setFillColor(0,80,40);doc.roundedRect(W-margin-42,19,42,7,1.5,1.5,"F");
  doc.setTextColor(34,212,154);doc.setFontSize(7);doc.setFont("helvetica","bold");
  doc.text("✓ ITU VERIFIED",W-margin-21,23.5,{align:"center"});
  y=60;

  // Student card
  doc.setFillColor(13,18,32);doc.setDrawColor(24,40,64);doc.setLineWidth(0.4);
  doc.roundedRect(margin,y,CW,34,2,2,"FD");
  doc.setTextColor(61,85,128);doc.setFontSize(7);doc.setFont("helvetica","normal");
  doc.text("STUDENT NAME",margin+5,y+7);
  doc.setTextColor(208,224,255);doc.setFontSize(12);doc.setFont("helvetica","bold");
  doc.text(studentName,margin+5,y+14);
  doc.setTextColor(61,85,128);doc.setFontSize(7);doc.setFont("helvetica","normal");
  doc.text("ROLL NUMBER",margin+5,y+21);
  doc.setTextColor(160,190,230);doc.setFontSize(9);doc.setFont("helvetica","bold");
  doc.text(rollNumber,margin+5,y+26.5);
  doc.setTextColor(61,85,128);doc.setFontSize(7);doc.setFont("helvetica","normal");
  doc.text("ITU EMAIL",margin+5,y+31.5);
  doc.setTextColor(100,140,200);doc.setFontSize(7.5);doc.text(studentEmail,margin+5,y+36);
  // Score circle
  const cx=W-margin-22,cy=y+17;
  doc.setFillColor(...gradeRGB);doc.circle(cx,cy,14,"F");
  doc.setFillColor(8,14,30);doc.circle(cx,cy,11,"F");
  doc.setTextColor(...gradeRGB);doc.setFontSize(14);doc.setFont("helvetica","bold");
  doc.text(`${pct}%`,cx,cy+2,{align:"center"});
  doc.setFillColor(...gradeRGB);doc.roundedRect(cx-10,cy+16,20,6,1.5,1.5,"F");
  doc.setTextColor(8,14,30);doc.setFontSize(8);
  doc.text(`GRADE  ${grade}`,cx,cy+20.5,{align:"center"});
  doc.setTextColor(100,140,200);doc.setFontSize(7);doc.setFont("helvetica","normal");
  doc.text(`${total.correct}/${total.total}`,cx,cy+28,{align:"center"});
  y+=40;
  if(tabWarnings>0){
    doc.setFillColor(40,10,10);doc.setDrawColor(100,20,20);
    doc.roundedRect(margin,y,CW,8,1.5,1.5,"FD");
    doc.setTextColor(247,95,95);doc.setFontSize(7.5);doc.setFont("helvetica","bold");
    doc.text(`⚠  Tab switching detected: ${tabWarnings} time${tabWarnings>1?"s":""}`,margin+5,y+5.5);
    y+=12;
  }
  y+=6;

  // Section breakdown
  doc.setTextColor(61,85,128);doc.setFontSize(7);doc.setFont("helvetica","bold");
  doc.text("PERFORMANCE BY SECTION",margin,y);y+=5;
  doc.setFillColor(15,24,40);doc.rect(margin,y,CW,6,"F");
  doc.setTextColor(61,85,128);doc.setFontSize(7);doc.setFont("helvetica","bold");
  doc.text("SECTION",margin+3,y+4.2);doc.text("TYPE",margin+50,y+4.2);
  doc.text("SCORE",margin+110,y+4.2);doc.text("%",margin+130,y+4.2);doc.text("PROGRESS",margin+142,y+4.2);
  y+=6;
  const sColors={A:[79,142,247],B:[34,212,154],C:[247,169,79]};
  Object.entries(sectionScores).forEach(([sec,{correct,total:tot}],idx)=>{
    const p=Math.round((correct/tot)*100);const tc=sColors[sec]||[79,142,247];
    doc.setFillColor(idx%2===0?11:14,idx%2===0?16:20,idx%2===0?26:32);
    doc.rect(margin,y,CW,7,"F");
    doc.setFillColor(...tc);doc.circle(margin+4,y+3.5,1.8,"F");
    doc.setTextColor(200,220,255);doc.setFontSize(7.5);doc.setFont("helvetica","normal");
    doc.text(`Section ${sec}: ${SECTION_CONFIG[sec].desc}`,margin+8,y+4.8);
    doc.text(`${SECTION_CONFIG[sec].label}`,margin+50,y+4.8);
    doc.text(`${correct}/${tot}`,margin+110,y+4.8);
    doc.setTextColor(...(p>=60?[34,212,154]:[247,95,95]));doc.setFont("helvetica","bold");
    doc.text(`${p}%`,margin+130,y+4.8);
    doc.setFillColor(20,30,50);doc.roundedRect(margin+142,y+1.5,42,4,1,1,"F");
    doc.setFillColor(...(p>=60?[34,212,154]:[247,95,95]));
    doc.roundedRect(margin+142,y+1.5,42*p/100,4,1,1,"F");
    y+=7;
  });
  y+=8;

  // Q&A review
  checkY(16);
  doc.setTextColor(61,85,128);doc.setFontSize(7);doc.setFont("helvetica","bold");
  doc.text("QUESTION-BY-QUESTION REVIEW",margin,y);y+=6;
  questions.forEach((q,i)=>{
    const ua=answers[q.id],ok=ua===q.answer;
    const sc=SECTION_CONFIG[q.section];const tc=sColors[q.section]||[79,142,247];
    doc.setFontSize(8);
    const qText=q.type==="fill_blank"?`${q.question}\n[${q.blank_label}]`:q.question;
    const qLines=doc.splitTextToSize(String(qText),CW-14);
    doc.setFontSize(7);
    const expLines=doc.splitTextToSize(`Explanation: ${q.explanation}`,CW-14);
    const wrongLines=(!ok&&ua)?doc.splitTextToSize(`Your answer: ${ua}`,CW-14):[];
    const blockH=6+qLines.length*4.5+2+(wrongLines.length*3.8||0)+(!ok&&!ua?4.5:0)+4+expLines.length*3.8+6;
    checkY(blockH+3);
    doc.setFillColor(...(ok?[8,20,12]:[20,8,8]));
    doc.setDrawColor(...(ok?[26,64,42]:[64,26,26]));doc.setLineWidth(0.3);
    doc.roundedRect(margin,y,CW,blockH,1.5,1.5,"FD");
    doc.setFillColor(...tc);doc.circle(margin+4.5,y+5,2,"F");
    doc.setTextColor(...tc);doc.setFontSize(6.5);doc.setFont("helvetica","bold");
    doc.text(`${sc.label} · ${q.lab}`,margin+8,y+6.2);
    const tw=doc.getTextWidth(`${sc.label} · ${q.lab}`);
    doc.setTextColor(61,85,128);doc.setFont("helvetica","normal");
    doc.text(`  Q${i+1}`,margin+8+tw,y+6.2);
    const bt=ok?"✓ CORRECT":"✗ WRONG",bW=doc.getTextWidth(bt)+6;
    doc.setFillColor(...(ok?[34,212,154]:[247,95,95]));
    doc.roundedRect(W-margin-bW-2,y+2,bW+2,5.5,1,1,"F");
    doc.setTextColor(8,14,30);doc.setFontSize(6.5);doc.setFont("helvetica","bold");
    doc.text(bt,W-margin-bW/2-1,y+6,{align:"center"});
    let iy=y+11;
    doc.setTextColor(210,225,255);doc.setFontSize(8);doc.setFont("helvetica","normal");
    qLines.forEach(l=>{doc.text(l,margin+4,iy);iy+=4.5;});iy+=2;
    if(!ok&&ua){doc.setTextColor(247,95,95);doc.setFontSize(7);doc.setFont("helvetica","italic");wrongLines.forEach(l=>{doc.text(l,margin+4,iy);iy+=3.8;});iy+=1;}
    if(!ok&&!ua){doc.setTextColor(247,95,95);doc.setFontSize(7);doc.setFont("helvetica","italic");doc.text("Your answer: — time expired",margin+4,iy);iy+=5;}
    doc.setTextColor(34,212,154);doc.setFontSize(7);doc.setFont("helvetica","bold");
    const caL=doc.splitTextToSize(`Correct: ${q.answer}`,CW-14);
    caL.forEach(l=>{doc.text(l,margin+4,iy);iy+=3.8;});iy+=2;
    doc.setDrawColor(30,50,80);doc.setLineWidth(0.2);doc.line(margin+4,iy-1,W-margin-4,iy-1);
    doc.setTextColor(80,110,160);doc.setFontSize(7);doc.setFont("helvetica","italic");
    expLines.forEach(l=>{doc.text(l,margin+4,iy+1);iy+=3.8;});
    y+=blockH+3;
  });

  const totalPages=doc.getNumberOfPages();
  for(let p=1;p<=totalPages;p++){
    doc.setPage(p);
    doc.setFillColor(8,14,30);doc.rect(0,285,W,12,"F");
    doc.setDrawColor(0,130,80);doc.setLineWidth(0.4);doc.line(0,285,W,285);
    doc.setTextColor(61,85,128);doc.setFontSize(6.5);doc.setFont("helvetica","normal");
    doc.text(`${INSTITUTION} · ${FACULTY}`,margin,291);
    doc.text(`${EXAM_TITLE} · ${studentEmail}`,margin,294.5);
    doc.text(`Page ${p} of ${totalPages}`,W-margin,291,{align:"right"});
    doc.text(`${rollNumber} · ${ts}`,W-margin,294.5,{align:"right"});
  }
  doc.save(`ITU_${rollNumber}_COA-Midterm_Result.pdf`);
}

// ── Shared UI ──────────────────────────────────────────────────
const Card=({children,style={}})=><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"28px 32px",...style}}>{children}</div>;
const Tag=({children,color})=><span style={{display:"inline-block",background:`${color}18`,border:`1px solid ${color}44`,color,fontSize:10,padding:"3px 10px",borderRadius:20,letterSpacing:2,fontFamily:C.mono}}>{children}</span>;
const Btn=({children,onClick,disabled,color="#4f8ef7",style={}})=>(
  <button onClick={onClick} disabled={disabled} style={{padding:"13px 22px",background:disabled?C.dim:color==="ghost"?"transparent":color,color:disabled?C.muted:color==="ghost"?C.text:"#fff",border:color==="ghost"?`1px solid ${C.border}`:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:C.mono,letterSpacing:1,transition:"all 0.18s",...style}}>{children}</button>
);
const FieldInput=({label,value,onChange,placeholder,readOnly=false})=>(
  <div style={{marginBottom:16}}>
    <div style={{color:C.muted,fontSize:10,letterSpacing:4,marginBottom:8,fontFamily:C.mono}}>{label}</div>
    <input value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
      style={{width:"100%",padding:"12px 16px",background:readOnly?"#0a1020":C.dim,border:`1px solid ${readOnly?"#1a3060":C.border}`,borderRadius:10,color:readOnly?"#6090c0":C.text,fontSize:14,fontFamily:C.mono,boxSizing:"border-box",outline:"none"}}/>
    {readOnly&&<div style={{color:C.muted,fontSize:10,marginTop:4,fontFamily:C.mono}}>Auto-filled from Google account</div>}
  </div>
);

// ── Code Block renderer ────────────────────────────────────────
const CodeBlock=({code})=>(
  <pre style={{background:"#030810",border:`1px solid #1a3060`,borderRadius:8,padding:"14px 16px",fontFamily:C.mono,fontSize:12,color:"#7ec8e3",lineHeight:1.7,overflowX:"auto",margin:"12px 0",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
    {code}
  </pre>
);



// ── Register Screen ────────────────────────────────────────────
function RegisterScreen({onStart}){
  const [name,setName]=useState("");
  const [roll,setRoll]=useState("");
  const [email,setEmail]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const go=async()=>{
    if(!name.trim())return setError("Please enter your full name.");
    if(!roll.trim())return setError("Please enter your roll number.");
    if(!email.trim())return setError("Please enter your email.");
    setError("");setBusy(true);
    try{
      if(SHEET_URL!=="YOUR_APPS_SCRIPT_URL_HERE"){
        const res=await fetch(`${SHEET_URL}?action=check&roll=${encodeURIComponent(roll.trim().toUpperCase())}`);
        const data=await res.json();
        if(data.exists){setError(`Roll number ${roll.trim().toUpperCase()} has already completed this exam.`);setBusy(false);return;}
      }
    }catch{}
    setBusy(false);onStart({name:name.trim(),roll:roll.trim().toUpperCase(),email:email.trim()});
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.sans,padding:16}}>
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(${C.dim} 1px,transparent 1px),linear-gradient(90deg,${C.dim} 1px,transparent 1px)`,backgroundSize:"48px 48px",opacity:0.5,pointerEvents:"none"}}/>
      <div style={{maxWidth:480,width:"100%",position:"relative"}}>
        <Card>
          <div style={{marginBottom:16}}><Tag color="#4f8ef7">{COURSE}</Tag></div>
          <h1 style={{color:C.text,fontSize:22,fontWeight:800,margin:"0 0 4px",fontFamily:C.sans}}>{EXAM_TITLE}</h1>
          <p style={{color:C.muted,fontSize:13,marginBottom:24,lineHeight:1.6}}>{EXAM_SUB}</p>
          <FieldInput label="FULL NAME" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Muhammad Ali"/>
          <FieldInput label="EMAIL" value={email} onChange={e=>setEmail(e.target.value)} placeholder="e.g. student@itu.edu.pk"/>
          <FieldInput label="ROLL NUMBER" value={roll} onChange={e=>setRoll(e.target.value)} placeholder="e.g. BSCE24001"/>
          {error&&<div style={{background:"#1f0909",border:`1px solid #4a1a1a`,borderRadius:8,padding:"12px 16px",marginBottom:16,color:"#ff5252",fontSize:12,lineHeight:1.6}}>⚠ {error}</div>}
          <div style={{background:C.dim,borderRadius:10,padding:"14px 18px",marginBottom:20}}>
            {[["Section A: MCQs","10 questions · 90 sec each"],["Section B: Code Reading","8 questions · 120 sec each"],["Section C: Fill-in-Blank","7 questions · 120 sec each"],["Attempts","One only — per roll number"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
                <span style={{color:C.muted}}>{k}</span><span style={{color:C.text}}>{v}</span>
              </div>
            ))}
          </div>
          <Btn onClick={go} disabled={busy} color="#4f8ef7" style={{width:"100%"}}>{busy?"CHECKING…":"BEGIN EXAM →"}</Btn>
        </Card>
      </div>
    </div>
  );
}

// ── Exam Screen ────────────────────────────────────────────────
function ExamScreen({studentName,rollNumber,onFinish}){
  const [questions]=useState(()=>buildExamQuestions());
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selected,setSelected]=useState(null);
  const [confirmed,setConfirmed]=useState(false);
  const [timeLeft,setTimeLeft]=useState(0);
  const [tabWarnings,setTabWarnings]=useState(0);
  const [opts,setOpts]=useState([]);
  const timerRef=useRef(null);

  const q=questions[current];
  const sc=SECTION_CONFIG[q.section];
  const tColor=timeLeft>sc.timePerQ*0.4?sc.color:timeLeft>sc.timePerQ*0.2?"#f7a94f":"#ff5252";

  useEffect(()=>{
    setOpts(shuffle(q.options));
    setSelected(null);setConfirmed(false);
    setTimeLeft(sc.timePerQ);
  },[current]);

  const confirm=useCallback((auto=false)=>{
    clearInterval(timerRef.current);
    setAnswers(p=>({...p,[q.id]:auto?null:selected}));
    setConfirmed(true);
  },[q,selected]);

  useEffect(()=>{
    if(confirmed)return;clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);confirm(true);return 0;}return t-1;}),1000);
    return()=>clearInterval(timerRef.current);
  },[current,confirmed,confirm]);

  useEffect(()=>{const fn=()=>{if(document.hidden&&!confirmed)setTabWarnings(w=>w+1);};document.addEventListener("visibilitychange",fn);return()=>document.removeEventListener("visibilitychange",fn);},[confirmed]);
  useEffect(()=>{const b=e=>e.preventDefault();document.addEventListener("contextmenu",b);return()=>document.removeEventListener("contextmenu",b);},[]);

  const next=()=>{if(current+1>=questions.length)onFinish(questions,answers,tabWarnings);else setCurrent(c=>c+1);};
  const isOk=confirmed&&selected===q.answer;
  const totalQ=questions.length;

  // Section boundary detection
  const prevSection=current>0?questions[current-1].section:null;
  const isNewSection=prevSection!==q.section;

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.sans,padding:"20px 16px",userSelect:"none"}}>
      <div style={{maxWidth:720,margin:"0 auto"}}>

        {/* Top bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Tag color={sc.color}>{sc.label}</Tag>
            <span style={{color:C.muted,fontSize:11,fontFamily:C.mono}}>Q{current+1}/{totalQ}</span>
            <span style={{color:C.muted,fontSize:10,fontFamily:C.mono,opacity:0.6}}>·</span>
            <span style={{color:sc.color,fontSize:10,fontFamily:C.mono,opacity:0.8}}>{sc.desc}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {tabWarnings>0&&<span style={{color:"#ff5252",fontSize:11,background:"#1f0909",padding:"3px 8px",borderRadius:6,fontFamily:C.mono}}>⚠ {tabWarnings}</span>}
            <div style={{background:C.card,border:`1px solid ${tColor}55`,borderRadius:8,padding:"4px 12px",color:tColor,fontSize:20,fontWeight:900,minWidth:48,textAlign:"center",fontFamily:C.mono}}>{timeLeft}</div>
          </div>
        </div>

        {/* Timer bar */}
        <div style={{background:C.dim,borderRadius:3,height:3,marginBottom:3}}>
          <div style={{height:3,borderRadius:3,background:tColor,width:`${(timeLeft/sc.timePerQ)*100}%`,transition:"width 1s linear,background 0.5s"}}/>
        </div>
        {/* Progress bar */}
        <div style={{background:C.dim,borderRadius:3,height:3,marginBottom:20}}>
          <div style={{height:3,borderRadius:3,background:sc.color,width:`${(current/totalQ)*100}%`,transition:"width 0.3s"}}/>
        </div>

        {/* Question card — style differs by type */}
        <div style={{background:sc.bg||C.card,border:`1px solid ${sc.color}33`,borderRadius:14,padding:"22px 24px",marginBottom:14}}>
          <div style={{color:sc.color,fontSize:10,letterSpacing:3,marginBottom:10,fontFamily:C.mono,display:"flex",alignItems:"center",gap:8}}>
            <span>{q.type==="mcq"?"◆ MULTIPLE CHOICE":q.type==="code_reading"?"⬛ CODE READING":"✏ FILL IN THE BLANK"}</span>
            <span style={{color:C.muted,fontSize:9}}>· {q.lab}</span>
          </div>
          <div style={{color:C.text,fontSize:14,lineHeight:1.8}}>{q.question}</div>
          {/* Code block for code_reading and fill_blank */}
          {(q.type==="code_reading"||q.type==="fill_blank")&&q.code&&<CodeBlock code={q.code}/>}
          {/* Blank label for fill_blank */}
          {q.type==="fill_blank"&&q.blank_label&&(
            <div style={{color:sc.color,fontSize:12,fontFamily:C.mono,marginTop:4,padding:"6px 12px",background:`${sc.color}11`,borderRadius:6,display:"inline-block"}}>
              → {q.blank_label}
            </div>
          )}
        </div>

        {/* Options */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {opts.map((opt,i)=>{
            let bg=C.card,border=`1px solid ${C.border}`,color=C.muted;
            if(selected===opt&&!confirmed){bg=`${sc.color}11`;border=`1px solid ${sc.color}`;color=C.text;}
            if(confirmed){
              if(opt===q.answer){bg="#091a10";border=`1px solid ${C.green}`;color=C.green;}
              else if(opt===selected){bg="#1a0909";border=`1px solid #ff5252`;color:"#ff5252";}
            }
            // For fill_blank/code_reading, use monospace options
            const isMono=q.type==="fill_blank"||q.type==="code_reading";
            return(
              <button key={opt} onClick={()=>!confirmed&&setSelected(opt)}
                style={{background:bg,border,borderRadius:10,padding:"12px 16px",color,fontSize:isMono?12:13,cursor:confirmed?"default":"pointer",textAlign:"left",display:"flex",gap:10,alignItems:"flex-start",fontFamily:isMono?C.mono:C.sans,lineHeight:1.6,transition:"all 0.15s",width:"100%",whiteSpace:isMono?"pre-wrap":"normal"}}>
                <span style={{minWidth:20,height:20,borderRadius:5,background:C.dim,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:C.muted,flexShrink:0,marginTop:1,fontFamily:C.mono}}>
                  {String.fromCharCode(65+i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {confirmed&&(
          <div style={{background:isOk?"#081510":"#150808",border:`1px solid ${isOk?"#1a4a2a":"#4a1a1a"}`,borderRadius:10,padding:"12px 16px",marginBottom:14}}>
            <div style={{color:isOk?C.green:"#ff5252",fontSize:11,fontWeight:700,marginBottom:5,fontFamily:C.mono}}>
              {isOk?"✓ Correct!":selected===null?"⏰ Time expired":"✗ Incorrect"}
            </div>
            {!isOk&&selected&&<div style={{color:"#ff5252",fontSize:12,marginBottom:5}}>Correct: <strong>{q.answer}</strong></div>}
            <div style={{color:C.muted,fontSize:12,lineHeight:1.7}}>💡 {q.explanation}</div>
          </div>
        )}

        {!confirmed
          ?<Btn onClick={()=>confirm(false)} disabled={!selected} color={sc.color} style={{width:"100%"}}>CONFIRM ANSWER</Btn>
          :<Btn onClick={next} color="ghost" style={{width:"100%",border:`1px solid ${sc.color}44`,color:sc.color}}>{current+1>=totalQ?"SUBMIT EXAM →":"NEXT QUESTION →"}</Btn>
        }
      </div>
    </div>
  );
}

// ── Submitting ─────────────────────────────────────────────────
const SubmittingScreen=()=>(
  <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:C.mono}}>
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:14,display:"inline-block",animation:"sp 1s linear infinite"}}>⟳</div>
      <div style={{color:C.muted,fontSize:13}}>Submitting exam results…</div>
      <style>{`@keyframes sp{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  </div>
);

// ── Result Screen ──────────────────────────────────────────────
function ResultScreen({studentName,rollNumber,studentEmail,questions,answers,tabWarnings,submitStatus}){
  const [pdfBusy,setPdfBusy]=useState(false);

  // Compute scores
  const sectionScores={A:{correct:0,total:0},B:{correct:0,total:0},C:{correct:0,total:0}};
  questions.forEach(q=>{
    sectionScores[q.section].total++;
    if(answers[q.id]===q.answer)sectionScores[q.section].correct++;
  });
  const totalCorrect=Object.values(sectionScores).reduce((a,v)=>a+v.correct,0);
  const totalQ=questions.length;
  const pct=Math.round((totalCorrect/totalQ)*100);
  const grade=pct>=80?"A":pct>=70?"B":pct>=60?"C":pct>=50?"D":"F";
  const gc=pct>=80?C.green:pct>=60?C.warn:"#ff5252";

  const handlePDF=async()=>{
    setPdfBusy(true);
    try{await generateResultPDF({studentName,rollNumber,studentEmail,questions,answers,tabWarnings,sectionScores,total:{correct:totalCorrect,total:totalQ},pct,grade});}
    catch(e){alert("PDF failed. Use Ctrl+P → Save as PDF.");console.error(e);}
    setPdfBusy(false);
  };

  const PDFBtn=({ghost=false})=>(
    <button onClick={handlePDF} disabled={pdfBusy} style={{
      display:"inline-flex",alignItems:"center",gap:8,padding:"13px 26px",borderRadius:10,
      fontSize:13,fontWeight:700,cursor:pdfBusy?"default":"pointer",fontFamily:C.mono,letterSpacing:1,
      ...(ghost?{background:"transparent",color:pdfBusy?C.muted:"#4f8ef7",border:`1px solid ${C.border}`}
        :{background:pdfBusy?C.dim:"linear-gradient(135deg,#0d2a5a,#061428)",color:pdfBusy?C.muted:"#d0e0ff",
          border:`1px solid ${pdfBusy?C.border:"#2a5a9a"}`,boxShadow:pdfBusy?"none":"0 4px 20px rgba(79,142,247,0.15)"})
    }}>
      {pdfBusy?<><span style={{display:"inline-block",animation:"sp 1s linear infinite"}}>⟳</span>&nbsp;Generating…</>:"⬇  Download Result PDF"}
      <style>{`@keyframes sp{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </button>
  );

  const sColors={"A":"#4f8ef7","B":"#22d49a","C":"#f7a94f"};

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:C.sans,padding:"28px 16px"}}>
      <div style={{maxWidth:720,margin:"0 auto"}}>
        {/* Hero */}
        <Card style={{textAlign:"center",marginBottom:16,padding:"32px"}}>
          <Tag color="#4f8ef7">{COURSE}</Tag>
          <div style={{fontSize:68,fontWeight:900,color:gc,lineHeight:1,marginTop:14}}>{pct}%</div>
          <div style={{color:gc,fontSize:20,marginTop:6,fontWeight:700}}>Grade {grade}</div>
          <div style={{color:C.muted,fontSize:13,marginTop:8}}>{studentName} · {rollNumber} · {totalCorrect}/{totalQ} correct</div>
          <div style={{color:"#3a6080",fontSize:11,marginTop:4,fontFamily:C.mono}}>{studentEmail}</div>
          {tabWarnings>0&&<div style={{marginTop:8,color:"#ff5252",fontSize:12,fontFamily:C.mono}}>⚠ {tabWarnings} tab switch{tabWarnings>1?"es":""} detected</div>}
          <div style={{marginTop:14,display:"inline-block",padding:"10px 18px",borderRadius:8,fontSize:12,
            background:submitStatus==="ok"?"#08150e":submitStatus==="error"?"#150808":C.dim,
            border:`1px solid ${submitStatus==="ok"?"#1a4a2a":submitStatus==="error"?"#4a1a1a":C.border}`,
            color:submitStatus==="ok"?C.green:submitStatus==="error"?"#ff5252":C.muted,fontFamily:C.mono}}>
            {submitStatus==="ok"&&"✓ Score saved to gradebook"}
            {submitStatus==="error"&&"⚠ Submission failed — inform your instructor"}
            {submitStatus==="demo"&&"ℹ Demo mode · Add Apps Script URL to enable gradebook"}
          </div>
          <div style={{marginTop:18}}><PDFBtn/></div>
          <div style={{color:C.muted,fontSize:11,marginTop:6,fontFamily:C.mono}}>ITU_{rollNumber}_COA-Midterm_Result.pdf</div>
        </Card>

        {/* Section breakdown */}
        <div style={{color:C.muted,fontSize:10,letterSpacing:4,marginBottom:10,fontFamily:C.mono}}>PERFORMANCE BY SECTION</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {Object.entries(sectionScores).map(([sec,{correct,total:tot}])=>{
            const p=Math.round((correct/tot)*100),tc=sColors[sec];
            const cfg=SECTION_CONFIG[sec];
            return(
              <div key={sec} style={{background:C.card,border:`1px solid ${tc}33`,borderRadius:12,padding:"16px"}}>
                <Tag color={tc}>{cfg.label}</Tag>
                <div style={{color:C.muted,fontSize:11,marginTop:6,marginBottom:8}}>{cfg.desc}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.muted,fontSize:12}}>{correct}/{tot}</span>
                  <span style={{color:p>=60?C.green:"#ff5252",fontWeight:700,fontSize:16,fontFamily:C.mono}}>{p}%</span>
                </div>
                <div style={{marginTop:8,background:C.dim,borderRadius:3,height:5}}>
                  <div style={{height:5,borderRadius:3,background:p>=60?C.green:"#ff5252",width:`${p}%`,transition:"width 0.6s"}}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Q review */}
        <div style={{color:C.muted,fontSize:10,letterSpacing:4,marginBottom:10,fontFamily:C.mono}}>QUESTION REVIEW</div>
        {questions.map((q,i)=>{
          const ua=answers[q.id],ok=ua===q.answer,tc=sColors[q.section];
          return(
            <div key={q.id} style={{background:C.card,border:`1px solid ${ok?"#1a3d2b":"#3d1a1a"}`,borderRadius:12,padding:"16px 20px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <Tag color={tc}>{SECTION_CONFIG[q.section].label}</Tag>
                  <span style={{color:C.muted,fontSize:10,fontFamily:C.mono}}>{q.lab}</span>
                  <span style={{color:C.muted,fontSize:10,fontFamily:C.mono,opacity:0.5}}>Q{i+1}</span>
                </div>
                <span style={{color:ok?C.green:"#ff5252",fontSize:11,fontWeight:700,fontFamily:C.mono}}>{ok?"✓ CORRECT":"✗ WRONG"}</span>
              </div>
              <div style={{color:C.text,fontSize:13,marginBottom:8,lineHeight:1.7}}>{q.question}</div>
              {(q.type==="code_reading"||q.type==="fill_blank")&&q.code&&<CodeBlock code={q.code}/>}
              {q.type==="fill_blank"&&q.blank_label&&<div style={{color:tc,fontSize:11,fontFamily:C.mono,marginBottom:8}}>→ {q.blank_label}</div>}
              {!ok&&<div style={{color:"#ff5252",fontSize:12,marginBottom:4}}>Your answer: {ua||"— time expired"}</div>}
              <div style={{color:C.green,fontSize:12,marginBottom:8}}>Correct: {q.answer}</div>
              <div style={{color:C.muted,fontSize:11,borderTop:`1px solid ${C.border}`,paddingTop:8,lineHeight:1.6}}>💡 {q.explanation}</div>
            </div>
          );
        })}
        <div style={{textAlign:"center",padding:"20px 0 12px"}}><PDFBtn ghost={true}/></div>
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────
export default function App(){
  const [phase,setPhase]=useState("register");
  const [student,setStudent]=useState({name:"",roll:"",email:""});
  const [result,setResult]=useState(null);
  const startTime=useRef(null);

  const handleStart=({name,roll,email})=>{
    setStudent({name,roll,email});
    startTime.current=new Date().toISOString();setPhase("exam");
  };

  const handleFinish=async(questions,answers,tabWarnings)=>{
    setPhase("submitting");
    const totalCorrect=questions.reduce((a,q)=>answers[q.id]===q.answer?a+1:a,0);
    const pct=Math.round((totalCorrect/questions.length)*100);
    const payload={
      action:"submit",timestamp:new Date().toISOString(),startTime:startTime.current,
      name:student.name,rollNumber:student.roll,email:student.email,
      score:totalCorrect,total:questions.length,percentage:pct,tabWarnings,
      answers:JSON.stringify(questions.map((q,i)=>({q:i+1,section:q.section,type:q.type,lab:q.lab,studentAnswer:answers[q.id]||"NO ANSWER",correct:answers[q.id]===q.answer?"YES":"NO",correctAnswer:q.answer})))
    };
    let submitStatus="demo";
    if(SHEET_URL!=="YOUR_APPS_SCRIPT_URL_HERE"){
      try{await fetch(SHEET_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});submitStatus="ok";}
      catch{submitStatus="error";}
    }
    setResult({questions,answers,tabWarnings,submitStatus});setPhase("result");
  };

  if(phase==="register")   return <RegisterScreen onStart={handleStart}/>;
  if(phase==="exam")       return <ExamScreen studentName={student.name} rollNumber={student.roll} onFinish={handleFinish}/>;
  if(phase==="submitting") return <SubmittingScreen/>;
  if(phase==="result")     return <ResultScreen studentName={student.name} rollNumber={student.roll} studentEmail={student.email} {...result}/>;
}
