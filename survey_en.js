// Email injection
(function(){
  var p1='codl';var p2='_121';var p3='khu';var p4='.ac.kr';
  var sep=String.fromCharCode(64);
  var full=p1+p2+sep+p3+p4;
  function inject(){document.querySelectorAll('.em-placeholder').forEach(function(e){e.textContent=full;});}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',inject);}else{inject();}
})();

document.addEventListener('DOMContentLoaded',function(){

var SHEET_URL='https://script.google.com/macros/s/AKfycbztXfNRHdYtPq9qGu7a2imzzbup5Kjb9Q4BMtLUwiiNNGUJoMZxOQLNtDVLrt0gkhZOdw/exec';

var TOTAL=11;
var cur=0;
var chatDone=false;

// Balanced random 2x2 group assignment (cycling through 4 groups)
function assignGroup(){
  var key='survey_grp_queue_en';
  var queue=[];
  try{
    var stored=localStorage.getItem(key);
    if(stored)queue=JSON.parse(stored);
  }catch(e){}
  if(!queue||queue.length===0){
    queue=[1,2,3,4];
    for(var i=queue.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var tmp=queue[i];queue[i]=queue[j];queue[j]=tmp;
    }
  }
  var g=queue.shift();
  try{localStorage.setItem(key,JSON.stringify(queue));}catch(e){}
  return g;
}
var grp=assignGroup();
var isHighResp=(grp===1||grp===2);
var isHighExp=(grp===1||grp===3);

// Scenario text
var respHTML={
  high:'<div class="resp-card"><div class="rc-text">You are a quality and certification practitioner at a company.<br><br>Your company has recently introduced an <strong>AI document support tool</strong> to improve document review efficiency, and today you are using it in your work for the first time.<br><br><strong>Tomorrow morning</strong>, an external certification body will conduct an <strong>ISO 9001 periodic surveillance audit</strong>. This is a <strong>biennial recertification audit</strong> — if a major nonconformity is found, the certification may be revoked, which could directly affect contractual obligations with key clients.<br><br>You must complete the final review of the <strong>Quality Management Plan Rev.2 (2025.12.01)</strong> by the end of today. This document will be <strong>submitted directly to the auditor under your name</strong>, and you will be required to <strong>personally explain your review findings and judgments to the auditor on-site</strong>. The review history will be <strong>preserved as an official record</strong>, and in the event of any nonconformity, the outcome will be attributed to <strong>your responsibility</strong>.<br><br>To conduct a fast and accurate review, you have decided to upload the Quality Management Plan file to the AI document support tool.</div></div>',
  low:'<div class="resp-card"><div class="rc-text">You are a quality and certification practitioner at a company.<br><br>Your company has recently introduced an <strong>AI document support tool</strong> to improve document review efficiency, and today you are using it in your work for the first time.<br><br>Today, you have been asked by your team to briefly look over a <strong>draft Quality Management Plan for internal review purposes</strong>. This document is still in draft form, <strong>will not be submitted externally</strong>, and a separate formal review and approval process is planned.<br><br>The final review and sign-off will be handled by the person in charge — your role is simply to <strong>provide informal reference feedback</strong>. The outcome of this review stage is <strong>not directly linked to any external evaluation or certification result</strong>, and you bear <strong>no official responsibility</strong> at this stage.<br><br>To review the document quickly, you have decided to upload the Quality Management Plan file to the AI document support tool.</div></div>'
};

// Remind box text
var remindResp={
  high:'<strong>📋 Situation Summary</strong><br>An ISO 9001 periodic surveillance audit (biennial recertification) is scheduled for tomorrow morning. You must complete the final review of the Quality Management Plan Rev.2 (2025.12.01), which will be submitted under your name. Any nonconformity will be attributed to your responsibility.',
  low:'<strong>📋 Situation Summary</strong><br>At your team\'s request, you are reviewing a draft Quality Management Plan for internal purposes. This review will not be submitted externally, and the final judgment will be handled by the person in charge. You bear no official responsibility at this stage.'
};
var remindExp={
  high:'<strong>💬 AI Analysis Summary</strong><br>The AI detected a potential nonconformity in <strong>Clause 6.2.2 — Planning to achieve quality objectives</strong>. The cause was identified as a missing quarterly achievement plan and unassigned responsible personnel, failing to meet ISO 9001:2015 requirements 6.2.2(b)(c)(d). After applying the revised draft, the document was judged to meet the requirements.',
  low:'<strong>💬 AI Analysis Summary</strong><br>The AI indicated that a potential nonconformity was detected. After applying the revised draft, no issues were found.'
};

// Manipulation check items
var mcRespItems=[
  {id:'MCR1',lb:'This situation felt like one where a mistake could lead to serious consequences.'},
  {id:'MCR2',lb:'I felt a strong sense of responsibility for my judgment in this situation.'},
  {id:'MCR3',lb:'I felt that my judgment in this situation would need to be formally explained to external parties.'},
  {id:'MCR4',lb:'This situation felt like one that required careful and deliberate judgment.'}
];
var mcExpItems=[
  {id:'MCE1',lb:'The AI sufficiently explained why it made its judgment.'},
  {id:'MCE2',lb:'The AI\'s response was specific and detailed.'},
  {id:'MCE3',lb:'The reasoning behind the AI\'s judgment was easy to understand.'},
  {id:'MCE4',lb:'The AI\'s explanation was sufficient to refer to when making a work decision.'}
];

var s7Items=[
  {id:'EXP1',lb:'The AI explained its judgment in a way that helped me understand why it reached that conclusion.'},
  {id:'EXP2',lb:'I could tell what basis the AI used to identify the item as problematic.'},
  {id:'EXP3',lb:'The AI\'s explanation was specific enough for me to grasp the situation.'},
  {id:'EXP4',lb:'I could follow the logical process by which the AI arrived at its conclusion.'},
  {id:'TRU1',lb:'I believe I can trust the AI\'s judgment.'},
  {id:'TRU2',lb:'I feel that this AI provides trustworthy information.'},
  {id:'TRU3',lb:'I think I can rely on this AI\'s output to some extent.'},
  {id:'TRU4',lb:'I believe this AI will provide consistent judgments.'}
];
var s8Items=[
  {id:'PU1',lb:'This AI seems like it would help improve my work efficiency.'},
  {id:'PU2',lb:'This AI seems like it would make document review tasks easier.'},
  {id:'PU3',lb:'I think this AI is a useful tool for practical work.'},
  {id:'EPR1',lb:'This AI may contain errors.'},
  {id:'EPR2',lb:'It could be risky to use this AI\'s output as-is.'},
  {id:'EPR3',lb:'I feel that the AI\'s judgment requires additional verification.'},
  {id:'AA1',lb:'I feel burdened by the thought that if I use this AI\'s output and something goes wrong, I will be held responsible.'},
  {id:'AA2',lb:'I feel anxious about accountability when using AI output.'},
  {id:'AA3',lb:'I am worried that if the AI produces an incorrect result, the responsibility for that outcome will fall on me.'}
];
var s9Items=[
  {id:'ITU1',lb:'I intend to use this AI tool in my future work.'},
  {id:'ITU2',lb:'If possible, I would like to continue using this AI in my work.'},
  {id:'ITU3',lb:'I think this AI is worth using in actual work.'},
  {id:'ITU4',lb:'I would use this AI again in a similar situation.'}
];

// ── AI Chat ──────────────────────────────────
function runChat(){
  if(chatDone)return;
  chatDone=true;
  var wrap=document.getElementById('chatbox');
  if(!wrap)return;
  wrap.innerHTML='';
  document.getElementById('bnext').disabled=true;

  var script=isHighExp?buildHighExp():buildLowExp();
  var stepIdx=0;

  function addMsg(cls,inner){
    var r=document.createElement('div');
    r.className='crow '+cls;
    r.innerHTML=inner;
    wrap.appendChild(r);
    setTimeout(function(){r.classList.add('show');},30);
    wrap.scrollTop=wrap.scrollHeight;
    return r;
  }

  function removeTyping(){
    var t=wrap.querySelector('.typing-row');
    if(t)t.remove();
  }

  function showTyping(){
    removeTyping();
    var r=addMsg('typing-row','<div class="av av-ai">AI</div><div class="bub bai"><div class="tdots"><span></span><span></span><span></span></div></div>');
    return r;
  }

  function runStep(){
    if(stepIdx>=script.length)return;
    var step=script[stepIdx];

    if(step.type==='ai'){
      showTyping();
      setTimeout(function(){
        removeTyping();
        addMsg('',makeAIBub(step.bub,step.tx));
        stepIdx++;
        setTimeout(runStep,600);
      },1200);

    } else if(step.type==='upload'){
      var uid='u'+Date.now();
      addMsg('urow','<div class="av av-u">Me</div>'+makeUpload(uid));
      var pct=0;
      var iv=setInterval(function(){
        pct+=Math.random()*18+6;
        if(pct>=100){
          pct=100;clearInterval(iv);
          setProgress(uid,100,true);
          stepIdx++;setTimeout(runStep,700);
        } else {
          setProgress(uid,Math.round(pct),false);
        }
      },110);

    } else if(step.type==='btn'){
      var urow=document.createElement('div');
      urow.className='crow urow btn-row';
      var btn=document.createElement('button');
      btn.className='chat-btn';
      btn.textContent=step.label;
      btn.onclick=function(){
        urow.innerHTML='<div class="bub bu">'+step.label+'</div><div class="av av-u">Me</div>';
        urow.classList.add('show');
        stepIdx++;
        setTimeout(runStep,400);
      };
      urow.appendChild(btn);
      wrap.appendChild(urow);
      setTimeout(function(){urow.classList.add('show');},30);
      wrap.scrollTop=wrap.scrollHeight;

    } else if(step.type==='done'){
      document.getElementById('bnext').disabled=false;
      var d=document.createElement('div');
      d.className='chat-done-msg';
      d.textContent='AI review complete. Please click the Next button below.';
      wrap.appendChild(d);
      wrap.scrollTop=wrap.scrollHeight;
    }
  }

  runStep();
}

function makeAIBub(bubClass,tx){
  return '<div class="av av-ai">AI</div><div class="bub '+bubClass+'">'+tx+'</div>';
}

function makeUpload(uid){
  return '<div class="bub bu upload-bub"><div class="upl-row"><div class="upl-icon">PDF</div><div class="upl-info"><div class="upl-name">QualityManagementPlan_Rev2_2025.12.01.pdf</div><div class="upl-size">2.4 MB</div><div class="upl-track"><div id="'+uid+'bar" class="upl-fill"></div></div><div class="upl-foot"><span id="'+uid+'st">Uploading...</span><span id="'+uid+'pc">0%</span></div></div></div></div>';
}

function setProgress(uid,pct,done){
  var bar=document.getElementById(uid+'bar');
  var st=document.getElementById(uid+'st');
  var pc=document.getElementById(uid+'pc');
  if(!bar)return;
  bar.style.width=pct+'%';
  if(pc)pc.textContent=pct+'%';
  if(done&&bar){bar.style.background='#a7f3d0';}
  if(done&&st){st.textContent='Upload complete';}
}

// High explanation script (Groups 1, 3)
function buildHighExp(){
  return [
    {type:'upload'},
    {type:'ai',bub:'bai',tx:'Document received. Beginning analysis against ISO 9001:2015 requirements.'},
    {type:'ai',bub:'bai',tx:'<div style="font-size:12px;line-height:1.9;"><div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>4.1 Context of the Organization — Conforming</div><div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>5.1 Leadership and Commitment — Conforming</div><div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;"><span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block;flex-shrink:0;"></span>6.2.2 Planning to Achieve Quality Objectives — Review Required</div><div style="display:flex;align-items:center;gap:7px;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>8.1 Operational Planning and Control — Conforming</div></div>'},
    {type:'ai',bub:'bwarn',tx:'An item requiring review has been identified. Would you like to see the details?'},
    {type:'btn',label:'View Details'},
    {type:'ai',bub:'bwarn',tx:'<strong>Clause 6.2.2 — Planning to Achieve Quality Objectives: Potential Nonconformity Detected</strong><br><br>Per ISO 9001:2015 Clause 6.2.2(b)(c)(d), planning for quality objectives must specify: a quarterly detailed achievement plan, designated responsible personnel, and a method for monitoring progress.<br><br>The current document is <strong>missing the quarterly achievement plan</strong> and <strong>responsible personnel have not been assigned</strong> for each objective, meaning the requirements are not met. This may be flagged as a major nonconformity during the audit.'},
    {type:'ai',bub:'bai',tx:'A revised draft can be auto-generated based on data from similar departments. Would you like to generate a revised version adding quarterly plans and department head responsibilities?'},
    {type:'btn',label:'Request Revised Draft'},
    {type:'ai',bub:'bai',tx:'Revised draft generated. The following content has been added to Clause 6.2.2:<br><br>• Q1 (March): Defect rate target 2.0% — Quality Manager responsible<br>• Q2 (June): Customer satisfaction target 85pts — Customer Support Manager responsible<br>• Q3 (September): On-time delivery target 95% — Production Manager responsible<br>• Q4 (December): Internal audit findings target 0 — Quality Manager responsible'},
    {type:'ai',bub:'bok',tx:'<strong>Re-review Complete — Clause 6.2.2 Requirements Met</strong><br><br>The revised document now includes quarterly achievement plans and designated responsible personnel, satisfying ISO 9001:2015 Clause 6.2.2(b)(c)(d). No nonconformities identified.'},
    {type:'done'}
  ];
}

// Low explanation script (Groups 2, 4)
function buildLowExp(){
  return [
    {type:'upload'},
    {type:'ai',bub:'bai',tx:'Document received. Beginning analysis.'},
    {type:'ai',bub:'bwarn',tx:'Some items require attention.'},
    {type:'btn',label:'Confirm'},
    {type:'ai',bub:'bai',tx:'Would you like to request a revised draft?'},
    {type:'btn',label:'Request Revised Draft'},
    {type:'ai',bub:'bai',tx:'Revised draft generated.'},
    {type:'ai',bub:'bok',tx:'Re-review complete.'},
    {type:'done'}
  ];
}

// ── Remind box ──────────────────────────────────
function makeRemindBox(type){
  var html='';
  if(type==='resp'||type==='both'){
    html+='<div class="remind-box remind-resp">'+(isHighResp?remindResp.high:remindResp.low)+'</div>';
  }
  if(type==='exp'||type==='both'){
    html+='<div class="remind-box remind-exp">'+(isHighExp?remindExp.high:remindExp.low)+'</div>';
  }
  return html;
}

function makeLikert(items,tid){
  var el=document.getElementById(tid);if(!el)return;
  el.innerHTML=items.map(function(item,i){
    return'<div class="qb"><div class="ql"><span class="qn">'+(i+1)+'</span>'+item.lb+'</div>'+
      '<div class="lanc"><span>Strongly Disagree</span><span>Strongly Agree</span></div>'+
      '<div class="lrow">'+[1,2,3,4,5,6,7].map(function(v){
        return'<label><input type="radio" name="'+item.id+'" value="'+v+'"><div class="lbtn">'+v+'</div></label>';
      }).join('')+'</div></div>';
  }).join('');
}

function initAll(){
  // Scenario
  var rb=document.getElementById('resp-box');
  if(rb)rb.innerHTML=isHighResp?respHTML.high:respHTML.low;

  // S5 manipulation check reminds
  var r6a=document.getElementById('remind-mcr');
  if(r6a)r6a.innerHTML=makeRemindBox('resp');
  var r6b=document.getElementById('remind-mce');
  if(r6b)r6b.innerHTML=makeRemindBox('exp');

  // S6 EXP+TRU remind
  var r7=document.getElementById('remind-s6');
  if(r7)r7.innerHTML=makeRemindBox('exp');

  // S7 PU+EPR+AA remind
  var r8=document.getElementById('remind-s7');
  if(r8)r8.innerHTML=makeRemindBox('resp');

  // S8 ITU remind
  var r9=document.getElementById('remind-s8');
  if(r9)r9.innerHTML=makeRemindBox('both');

  // Manipulation check items
  var mcr=document.getElementById('mc-resp-box');
  if(mcr){mcr.innerHTML=mcRespItems.map(function(item,i){
    return'<div class="qb"><div class="ql"><span class="qn">'+(i+1)+'</span>'+item.lb+'</div>'+
      '<div class="lanc"><span>Strongly Disagree</span><span>Strongly Agree</span></div>'+
      '<div class="lrow">'+[1,2,3,4,5,6,7].map(function(v){
        return'<label><input type="radio" name="'+item.id+'" value="'+v+'"><div class="lbtn">'+v+'</div></label>';
      }).join('')+'</div></div>';
  }).join('');}
  var mce=document.getElementById('mc-exp-box');
  if(mce){mce.innerHTML=mcExpItems.map(function(item,i){
    return'<div class="qb"><div class="ql"><span class="qn">'+(i+1)+'</span>'+item.lb+'</div>'+
      '<div class="lanc"><span>Strongly Disagree</span><span>Strongly Agree</span></div>'+
      '<div class="lrow">'+[1,2,3,4,5,6,7].map(function(v){
        return'<label><input type="radio" name="'+item.id+'" value="'+v+'"><div class="lbtn">'+v+'</div></label>';
      }).join('')+'</div></div>';
  }).join('');}
  makeLikert(s7Items,'s6box');
  makeLikert(s8Items,'s7box');
  makeLikert(s9Items,'s8box');
}

function updateProg(){
  var pct=Math.round((cur/(TOTAL-1))*100);
  document.getElementById('pfill').style.width=pct+'%';
  document.getElementById('ppct').textContent=pct+'%';
  var labs=['Consent','Eligibility','Introduction','Work Situation','AI Analysis','Awareness Check','Perceptions 1/2','Perceptions 2/2','Intention to Use','Basic Info','Additional Info'];
  document.getElementById('ptxt').textContent=labs[cur]||'';
}

function showSec(n){
  document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('active');});
  var sec=document.getElementById('s'+n);if(sec)sec.classList.add('active');
  document.getElementById('bprev').style.display=n===0?'none':'';
  document.getElementById('bnext').textContent=n===TOTAL-1?'Submit ✓':'Next →';
  document.getElementById('errmsg').classList.remove('show');
  updateProg();
  window.scrollTo({top:0,behavior:'smooth'});
  if(n===4)setTimeout(runChat,400);
}

function validate(){
  if(cur===0)return document.getElementById('consent').checked;
  if(cur===1){
    var v=(document.querySelector('input[name="elig"]:checked')||{}).value;
    if(v==='no'){showEnd();return false;}
    return v==='yes';
  }
  if(cur===5){
    var mcOk=[].concat(mcRespItems,mcExpItems).every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
    var imcOk=!!document.querySelector('input[name="imc"]:checked');
    return mcOk&&imcOk;
  }
  if(cur===6)return s7Items.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===7)return s8Items.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===8)return s9Items.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===9)return['qgender','qage','qfield','qindustry','qcompsize','qrank','qexp','qedu','qai'].every(function(n){return document.querySelector('input[name="'+n+'"]:checked');});
  if(cur===10){
    var rc=document.getElementById('chk-research');
    if(rc&&rc.checked){
      var em=(document.getElementById('i-research')||{}).value||'';
      if(!em.trim()){alert('Please enter your email address to receive research results.');return false;}
    }
    return true;
  }
  return true;
}

function gv(name){
  var el=document.querySelector('input[name="'+name+'"]:checked');if(!el)return'';
  if(el.value==='Other'){var m={qfield:'field-etc',qrank:'rank-etc',qindustry:'industry-etc'};if(m[name]){var t=document.getElementById(m[name]).value.trim();return t?'Other: '+t:'Other';}}
  return el.value;
}

function collectData(){
  var data={
    timestamp:new Date().toLocaleString('en-US'),
    group:grp,
    resp_cond:isHighResp?'High-Responsibility':'Low-Responsibility',
    exp_cond:isHighExp?'High-Explanation':'Low-Explanation',
    IMC:(document.querySelector('input[name="imc"]:checked')||{}).value||''
  };
  [].concat(mcRespItems,mcExpItems,s7Items,s8Items,s9Items).forEach(function(item){
    var el=document.querySelector('input[name="'+item.id+'"]:checked');
    data[item.id]=el?parseInt(el.value):'';
  });
  data.gender=(document.querySelector('input[name="qgender"]:checked')||{}).value||'';
  data.age=(document.querySelector('input[name="qage"]:checked')||{}).value||'';
  data.field=gv('qfield');data.industry=gv('qindustry');
  data.compsize=(document.querySelector('input[name="qcompsize"]:checked')||{}).value||'';
  data.rank=gv('qrank');
  data.experience=(document.querySelector('input[name="qexp"]:checked')||{}).value||'';
  data.education=(document.querySelector('input[name="qedu"]:checked')||{}).value||'';
  data.ai_usage=(document.querySelector('input[name="qai"]:checked')||{}).value||'';
  // Optional info
  var research=document.getElementById('chk-research');
  data.research_agree=(research&&research.checked)?'Yes':'No';
  data.research_email=(document.getElementById('i-research')||{}).value||'';
  return data;
}

function showEnd(){
  document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('active');});
  document.getElementById('navrow').style.display='none';
  document.getElementById('pfill').style.width='100%';
  document.getElementById('ppct').textContent='';
  document.getElementById('ptxt').textContent='Survey Ended';
  document.getElementById('endw').style.display='block';
  window.scrollTo({top:0,behavior:'smooth'});
}

function showThank(data){
  document.getElementById('navrow').style.display='none';
  document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('active');});
  document.getElementById('pfill').style.width='100%';
  document.getElementById('ppct').textContent='Done';
  document.getElementById('ptxt').textContent='Submitted';
  document.getElementById('thkd').innerHTML='<div class="tdr"><span class="tdk">Submitted at</span><span class="tdv">'+data.timestamp+'</span></div>';
  document.getElementById('thkw').style.display='block';
  window.scrollTo({top:0,behavior:'smooth'});
}

async function submitData(data){
  document.getElementById('lov').classList.add('show');
  document.getElementById('bnext').disabled=true;
  try{
    await fetch(SHEET_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    showThank(data);
  }catch(e){
    document.getElementById('errmsg').classList.add('show');
    document.getElementById('bnext').disabled=false;
  }finally{
    document.getElementById('lov').classList.remove('show');
  }
}

function navigate(dir){
  if(dir===1&&!validate()){if(cur!==1)alert('Please answer all items before proceeding.');return;}
  if(dir===1&&cur===TOTAL-1){submitData(collectData());return;}
  cur=Math.max(0,Math.min(TOTAL-1,cur+dir));
  showSec(cur);
}

document.addEventListener('change',function(e){
  if(e.target.name==='qfield'){document.getElementById('field-etc').style.display=e.target.value==='Other'?'block':'none';}
  if(e.target.name==='qrank'){document.getElementById('rank-etc').style.display=e.target.value==='Other'?'block':'none';}
  if(e.target.name==='qindustry'){document.getElementById('industry-etc').style.display=e.target.value==='Other'?'block':'none';}
  var rc=document.getElementById('chk-research');
  if(e.target.id==='chk-research'&&rc){
    var rf=document.getElementById('research-fields');
    if(rf)rf.style.display=rc.checked?'block':'none';
  }
});

document.getElementById('bprev').addEventListener('click',function(){navigate(-1);});
document.getElementById('bnext').addEventListener('click',function(){navigate(1);});

initAll();
showSec(0);

});
