"use client";
import {useEffect,useMemo,useState} from "react";

const questions=[
 {tag:"FIRST IMPRESSION",q:"Be honest, One. What's your impression of me so far?",o:[["Funny 😂","I'll take that. Pressure is officially on for Thursday."],["Interesting 👀","Interesting is good. Let's keep the mystery alive."],["Trouble 🚩","Damn 😭 Thursday is officially my redemption arc."],["Still investigating 🕵🏽‍♀️","Fair. Investigation continues in person."]]},
 {tag:"PREDICTION 01",q:"Who do you think will talk more when we finally meet?",o:[["Kartel","Bold prediction. Evidence will be collected Thursday."],["One","Noted 👀 I'm absolutely bringing this up later."],["Both","Best case scenario, honestly."]]},
 {tag:"PREDICTION 02",q:"Who makes the other laugh first?",o:[["Kartel 😌","Confidence in me? I like this answer."],["One 😏","Okay then. Challenge accepted."]]}
];
const noSpots=[{x:76,y:-36},{x:-70,y:38},{x:68,y:44}];

export default function Home(){
 const [screen,setScreen]=useState("boot"),[qi,setQi]=useState(0),[reaction,setReaction]=useState("");
 const [song,setSong]=useState(""),[artist,setArtist]=useState(""),[secret,setSecret]=useState("");
 const [answers,setAnswers]=useState([]),[noCount,setNoCount]=useState(0),[iceChoice,setIceChoice]=useState("");
 const [boot,setBoot]=useState(0),[saved,setSaved]=useState(false);
 const steps=["boot","intro","game","music","ice","secret","locked","final"];
 const step=Math.max(0,steps.indexOf(screen));
 const progress=Math.round((step/(steps.length-1))*100);
 const bootLines=useMemo(()=>["initializing private build...","instagram connection: successful.","user detected: One."],[]);

 useEffect(()=>{const t=setInterval(()=>setBoot(v=>{if(v>=2){clearInterval(t);setTimeout(()=>setScreen("intro"),650);return v}return v+1}),620);return()=>clearInterval(t)},[]);
 useEffect(()=>{if(typeof window!=="undefined"){const data={song,artist,secret,answers,iceChoice};localStorage.setItem("beforeThursdayOne",JSON.stringify(data))}},[song,artist,secret,answers,iceChoice]);

 const answer=(label,msg)=>{setAnswers(a=>[...a,label]);setReaction(msg);setTimeout(()=>{if(qi<questions.length-1){setQi(qi+1);setReaction("")}else setScreen("music")},900)};
 const dodge=(e)=>{if(noCount>=3)return;if(e)e.preventDefault();setNoCount(n=>n+1)};
 const chooseIce=(choice)=>{setIceChoice(choice);setScreen("secret")};
 const lock=async()=>{
   if(saved)return;
   setSaved(true);
   try{
     const res=await fetch("/api/responses",{
       method:"POST",
       headers:{"Content-Type":"application/json"},
       body:JSON.stringify({answers,song,artist,iceChoice,secret})
     });
     if(!res.ok)throw new Error("delivery failed");
     setTimeout(()=>setScreen("locked"),700);
   }catch{
     setSaved(false);
     alert("Something went wrong sealing your question. Please try again.");
   }
 };
 const q=questions[qi];

 return <main className="shell">
   <div className="aurora a1"/><div className="aurora a2"/><div className="grain"/>
   {screen!=="boot"&&<header><span className="brand">BEFORE<span>.</span>THURSDAY</span><span className="status"><i/>FOR ONE ONLY</span></header>}
   {screen!=="boot"&&screen!=="final"&&<div className="rail"><span style={{height:`${progress}%`}}/></div>}

   {screen==="boot"&&<section className="boot fade">{bootLines.slice(0,boot+1).map((x,i)=><p key={x} className={i===boot?"active":""}><span>›</span> {x}</p>)}<i className="cursor"/></section>}

   {screen==="intro"&&<section className="hero fade">
     <p className="kicker">ONE, THIS ONE'S FOR YOU.</p>
     <h1>Before<br/><em>Thursday.</em></h1>
     <p className="lead">We haven't even met yet, and somehow you already have your own website.<br/><strong>Don't get used to this. 😂</strong></p>
     <button className="primary magnetic" onClick={()=>setScreen("game")}><span>Enter the experiment</span><b>↗</b></button>
     <div className="meta"><span>01 — PRIVATE EXPERIENCE</span><span>BUILT BY KARTEL</span></div>
   </section>}

   {screen==="game"&&<section key={qi} className="panel fade">
     <div className="topline"><span>{q.tag}</span><span>0{qi+1} / 0{questions.length}</span></div>
     <h2>{q.q}</h2>
     <div className="options">{q.o.map(([a,m],i)=><button key={a} disabled={!!reaction} onClick={()=>answer(a,m)}><small>0{i+1}</small><span>{a}</span><b>↗</b></button>)}</div>
     <p className={"reaction "+(reaction?"show":"")}>{reaction}</p>
   </section>}

   {screen==="music"&&<section className="panel fade">
     <p className="kicker">YOUR THURSDAY SOUNDTRACK · 🎧</p>
     <h2>Every good story needs a soundtrack.</h2>
     <p className="sub">Give me one song you're obsessed with right now. I'll listen before Thursday.</p>
     <div className="record"><div className="vinyl"><span>ONE</span></div><div><small>NOW ADDING</small><strong>{song||"Your favourite song"}</strong><span>{artist||"Artist"}</span></div></div>
     <div className="form"><label>SONG<input value={song} maxLength={60} onChange={e=>setSong(e.target.value)} placeholder="Song title"/></label><label>ARTIST <span className="optional">OPTIONAL</span><input value={artist} maxLength={60} onChange={e=>setArtist(e.target.value)} placeholder="Artist"/></label></div>
     <button className="primary" disabled={!song.trim()} onClick={()=>setScreen("ice")}><span>Lock it in</span><b>♪</b></button>
   </section>}

   {screen==="ice"&&<section className="panel center fade">
     <div className="iceStage"><div className="halo"/><div className="ice">🍦</div></div>
     <p className="kicker">CRITICAL SYSTEM QUESTION</p>
     <h2>We're getting ice cream on Thursday, right?</h2>
     <p className="sub iceMsg">{["Choose carefully. The system is watching. 👀","Hmm. Button malfunction detected.","That's weird... try again? 🤔","Okay okay 😭 you can actually say no."][Math.min(noCount,3)]}</p>
     <div className="choice">
       <button className="primary yes" onClick={()=>chooseIce("yes")}>Obviously 🍦</button>
       <button className="no" style={{transform:`translate(${noSpots[Math.max(0,noCount-1)]?.x||0}px,${noSpots[Math.max(0,noCount-1)]?.y||0}px)`}} onPointerEnter={dodge} onPointerDown={noCount<3?dodge:undefined} onClick={()=>noCount>=3&&chooseIce("no")}>{noCount>=3?"Fine, no 😂":"No"}</button>
     </div>
     <small className="fineprint">* yes, the button is being dramatic on purpose.</small>
   </section>}

   {screen==="secret"&&<section className="panel fade">
     <p className="kicker">ONE LAST THING · 🔒</p>
     <h2>Leave me one question for Thursday.</h2>
     <p className="sub">Something you're genuinely curious about. I won't answer it here — that's the point.</p>
     <div className="textareaWrap"><textarea value={secret} onChange={e=>setSecret(e.target.value)} maxLength={180} placeholder="Your question for Kartel..."/><span>{secret.length}/180</span></div>
     <button className="primary" disabled={!secret.trim()||saved} onClick={lock}><span>{saved?"Encrypting...":"Lock until Thursday"}</span><b>{saved?"•••":"🔒"}</b></button>
     {saved&&<div className="encrypt"><span/></div>}
   </section>}

   {screen==="locked"&&<section className="panel center fade">
     <div className="lock"><span>✓</span></div><p className="kicker">QUESTION SEALED</p><h2>Saved for the real conversation.</h2>
     <p className="sub">No spoilers. Thursday gets the answer.</p>
     <div className="ticket"><div><small>THURSDAY SOUNDTRACK</small><strong>{song}</strong><span>{artist||"One's pick"}</span></div><div className="barcode">|||| ||| || |||| |</div></div>
     <button className="primary" onClick={()=>setScreen("final")}><span>One last screen</span><b>→</b></button>
   </section>}

   {screen==="final"&&<section className="final fade">
     <div className="finalMark">K × O</div><p className="kicker">ONLINE VERSION ENDS HERE.</p>
     <h1>See you<br/><em>Thursday, One.</em></h1>
     <p className="lead">No more Instagram. No more website.<br/>Just two people finally meeting.</p>
     <div className="finalRule"><span/></div>
     <div className="finalBottom"><p>ONE <i>×</i> KARTEL</p><button className="easter" onClick={()=>alert("PROJECT: Before Thursday\nDEVELOPER: Kartel\nBUILT FOR: One\nSTATUS: Ready\nBUGS: Probably\nNERVOUS: Definitely 😂")}>made with questionable amounts of JavaScript.</button></div>
   </section>}
 </main>
}