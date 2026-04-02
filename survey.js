// 이메일 동적 주입
(function(){
  var p1='codl';
  var p2='_121';
  var p3='khu';
  var p4='.ac.kr';
  var sep=String.fromCharCode(64);
  var full=p1+p2+sep+p3+p4;
  function inject(){
    var els=document.querySelectorAll('.em-placeholder');
    els.forEach(function(e){e.textContent=full;});
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',inject);
  } else {
    inject();
  }
})();

document.addEventListener('DOMContentLoaded', function() {

var SHEET_URL='https://script.google.com/macros/s/AKfycbxewOPqzNbp9Ni_CvRnn-qjtMhFQY-khf7kFzP9NqIKO8nVi_X3zJ_NisAqwtORMRjr/exec';
var TOTAL=12;
var cur=0;
var chatDone=false;

// ── 2×2 랜덤 배정 ──────────────────────────
// 그룹1: 고책임×설명높음, 그룹2: 고책임×설명낮음
// 그룹3: 저책임×설명높음, 그룹4: 저책임×설명낮음
var grp=Math.floor(Math.random()*4)+1;
var isHighResp=(grp===1||grp===2);
var isHighExp=(grp===1||grp===3);

// ── 책임 수준 시나리오 ──────────────────────
var respHTML={
  high:'<div class="resp-card resp-high"><div class="rc-text">이번 검토 결과는 <strong>외부 인증 심사 대응 자료에 반영될 수 있습니다.</strong> 만약 판단이 부정확하면 심사 지적, 인증 일정 지연 또는 고객 대응 문제가 발생할 수 있습니다.<br><br>또한 당신은 검토 결과와 판단 근거를 <strong>회의에서 직접 설명해야 하며</strong>, 해당 이력은 <strong>공식 기록으로 남습니다.</strong></div></div>',
  low:'<div class="resp-card resp-low"><div class="rc-text">이번 검토 결과는 <strong>내부 참고용 검토 초안에 활용됩니다.</strong> 이후 별도의 확인과 수정 절차가 예정되어 있으며, 이 단계의 결과는 <strong>외부 제출 자료가 아닙니다.</strong><br><br>최종 판단은 <strong>후속 검토 단계에서 다시 이루어집니다.</strong></div></div>'
};

// ── 채팅 리마인드 ──────────────────────────
var chatRemind={
  high:'⏰ 외부 심사 대응 자료 검토 중 AI 도구를 실행했습니다. AI의 분석 결과가 아래와 같이 나타났습니다.',
  low:'ℹ️ 내부 참고용 초안 검토를 위해 AI 도구를 실행했습니다. AI의 분석 결과가 아래와 같이 나타났습니다.'
};

// ── AI 채팅 스크립트 (4개 조건) ──────────────
var chatScripts={
  // 고책임 × 설명 높음
  1:[
    {t:'ai-init'},
    {t:'u',tx:'내용 확인하기'},
    {t:'typing'},
    {t:'ai',bub:'bwarn',tx:'절차서 4.2와 기록서 A-12 사이에 불일치 가능성이 있습니다.'},
    {t:'ai',bub:'bai',tx:'기록서의 승인일과 변경 이력 항목이 내부 문서관리 기준과 일치하지 않습니다. 특히 승인일 누락과 변경 이력 미기재가 문제일 수 있으며, 관련 기준과 비교했을 때 재검토가 필요합니다.'},
    {t:'ai',bub:'bai',tx:'검토가 필요한 항목은 2개입니다. 관련 기준과 비교 결과를 확인하시겠습니까?'},
    {t:'u',tx:'수정 후 다시 검토해줘.'},
    {t:'typing'},
    {t:'ai',bub:'bok',tx:'재검토 완료 — 절차서 4.2 및 기록서 A-12 기준 검토 결과, 수정된 문서에 승인일과 변경 이력이 정상 기재되어 내부 문서관리 기준을 충족합니다. 부적합 사항 없음으로 판단됩니다.'}
  ],
  // 고책임 × 설명 낮음
  2:[
    {t:'ai-init'},
    {t:'u',tx:'내용 확인하기'},
    {t:'typing'},
    {t:'ai',bub:'bwarn',tx:'절차서 4.2와 기록서 A-12 사이에 불일치 가능성이 있습니다.'},
    {t:'ai',bub:'bai',tx:'문제 가능성이 감지되었습니다.'},
    {t:'ai',bub:'bai',tx:'재검토를 권장합니다.'},
    {t:'u',tx:'수정 후 다시 검토해줘.'},
    {t:'typing'},
    {t:'ai',bub:'bok',tx:'재검토 완료 — 이상 없음으로 판단됩니다.'}
  ],
  // 저책임 × 설명 높음
  3:[
    {t:'ai-init'},
    {t:'u',tx:'내용 확인하기'},
    {t:'typing'},
    {t:'ai',bub:'bwarn',tx:'절차서 4.2와 기록서 A-12 사이에 불일치 가능성이 있습니다.'},
    {t:'ai',bub:'bai',tx:'기록서의 승인일과 변경 이력 항목이 내부 문서관리 기준과 일치하지 않습니다. 특히 승인일 누락과 변경 이력 미기재가 문제일 수 있으며, 관련 기준과 비교했을 때 재검토가 필요합니다.'},
    {t:'ai',bub:'bai',tx:'검토가 필요한 항목은 2개입니다. 관련 기준과 비교 결과를 확인하시겠습니까?'},
    {t:'u',tx:'수정안 적용했어. 다시 검토해줘.'},
    {t:'typing'},
    {t:'ai',bub:'bok',tx:'재검토 완료 — 수정된 내용이 내부 기준을 충족합니다. 보조 자료로 활용하시기에 적합한 수준입니다.'}
  ],
  // 저책임 × 설명 낮음
  4:[
    {t:'ai-init'},
    {t:'u',tx:'내용 확인하기'},
    {t:'typing'},
    {t:'ai',bub:'bwarn',tx:'절차서 4.2와 기록서 A-12 사이에 불일치 가능성이 있습니다.'},
    {t:'ai',bub:'bai',tx:'문제 가능성이 감지되었습니다.'},
    {t:'ai',bub:'bai',tx:'재검토를 권장합니다.'},
    {t:'u',tx:'수정안 적용했어. 다시 검토해줘.'},
    {t:'typing'},
    {t:'ai',bub:'bok',tx:'재검토 완료 — 이상 없음으로 판단됩니다.'}
  ]
};

function runChat(){
  if(chatDone)return;
  chatDone=true;
  var wrap=document.getElementById('chatbox');
  if(!wrap)return;
  wrap.innerHTML='';

  // 단계별 메시지 정의
  var steps={
    1:[
      {msgs:[
        {bub:'bai',tx:'기록 검토 중 이상 항목이 감지되었습니다.'}
      ],btn:'내용 확인하기',nextStep:2},
      {msgs:[
        {bub:'bwarn',tx:'절차서 4.2와 기록서 A-12 사이에 불일치 가능성이 있습니다.'},
        {bub:'bai',tx:'기록서의 승인일과 변경 이력 항목이 내부 문서관리 기준과 일치하지 않습니다. 특히 승인일 누락과 변경 이력 미기재가 문제일 수 있으며, 관련 기준과 비교했을 때 재검토가 필요합니다.'},
        {bub:'bai',tx:'검토가 필요한 항목은 2개입니다. 관련 기준과 비교 결과를 확인하시겠습니까?'}
      ],btn:'수정 후 재검토 요청',nextStep:3},
      {msgs:[
        {bub:'bok',tx:'재검토 완료 — 절차서 4.2 및 기록서 A-12 기준 검토 결과, 수정된 문서에 승인일과 변경 이력이 정상 기재되어 내부 문서관리 기준을 충족합니다. 부적합 사항 없음으로 판단됩니다.'}
      ],btn:null}
    ],
    2:[
      {msgs:[
        {bub:'bai',tx:'기록 검토 중 이상 항목이 감지되었습니다.'}
      ],btn:'내용 확인하기',nextStep:2},
      {msgs:[
        {bub:'bwarn',tx:'절차서 4.2와 기록서 A-12 사이에 불일치 가능성이 있습니다.'},
        {bub:'bai',tx:'문제 가능성이 감지되었습니다.'},
        {bub:'bai',tx:'재검토를 권장합니다.'}
      ],btn:'수정 후 재검토 요청',nextStep:3},
      {msgs:[
        {bub:'bok',tx:'재검토 완료 — 이상 없음으로 판단됩니다.'}
      ],btn:null}
    ],
    3:[
      {msgs:[
        {bub:'bai',tx:'기록 검토 중 이상 항목이 감지되었습니다.'}
      ],btn:'내용 확인하기',nextStep:2},
      {msgs:[
        {bub:'bwarn',tx:'절차서 4.2와 기록서 A-12 사이에 불일치 가능성이 있습니다.'},
        {bub:'bai',tx:'기록서의 승인일과 변경 이력 항목이 내부 문서관리 기준과 일치하지 않습니다. 특히 승인일 누락과 변경 이력 미기재가 문제일 수 있으며, 관련 기준과 비교했을 때 재검토가 필요합니다.'},
        {bub:'bai',tx:'검토가 필요한 항목은 2개입니다. 관련 기준과 비교 결과를 확인하시겠습니까?'}
      ],btn:'수정 후 재검토 요청',nextStep:3},
      {msgs:[
        {bub:'bok',tx:'재검토 완료 — 수정된 내용이 내부 기준을 충족합니다. 보조 자료로 활용하시기에 적합한 수준입니다.'}
      ],btn:null}
    ],
    4:[
      {msgs:[
        {bub:'bai',tx:'기록 검토 중 이상 항목이 감지되었습니다.'}
      ],btn:'내용 확인하기',nextStep:2},
      {msgs:[
        {bub:'bwarn',tx:'절차서 4.2와 기록서 A-12 사이에 불일치 가능성이 있습니다.'},
        {bub:'bai',tx:'문제 가능성이 감지되었습니다.'},
        {bub:'bai',tx:'재검토를 권장합니다.'}
      ],btn:'수정 후 재검토 요청',nextStep:3},
      {msgs:[
        {bub:'bok',tx:'재검토 완료 — 이상 없음으로 판단됩니다.'}
      ],btn:null}
    ]
  };

  var currentStep=0;
  var allSteps=steps[grp];
  // 다음 섹션 버튼 비활성화 (채팅 완료 전)
  document.getElementById('bnext').disabled=true;

  function showStep(stepIdx){
    var step=allSteps[stepIdx];
    var delay=300;
    // 타이핑 표시
    setTimeout(function(){
      var r=document.createElement('div');r.className='crow';r.id='typr';
      r.innerHTML='<div class="av av-ai">AI</div><div class="bub bai"><div class="tdots"><span></span><span></span><span></span></div></div>';
      wrap.appendChild(r);setTimeout(function(){r.classList.add('show');},30);
      setTimeout(function(){var x=document.getElementById('typr');if(x)x.remove();},1400);
    },delay);
    delay+=1600;

    // 메시지들 순서대로 표시
    step.msgs.forEach(function(msg){
      setTimeout(function(){
        var r=document.createElement('div');r.className='crow';
        r.innerHTML='<div class="av av-ai">AI</div><div class="bub '+msg.bub+'">'+msg.tx+'</div>';
        wrap.appendChild(r);setTimeout(function(){r.classList.add('show');},30);wrap.scrollTop=wrap.scrollHeight;
      },delay);
      delay+=900;
    });

    // 버튼 표시
    setTimeout(function(){
      // 이전 버튼 wrap 제거
      var old=document.getElementById('chat-btn-area');
      if(old)old.remove();

      var btnWrap=document.createElement('div');
      btnWrap.className='chat-btn-wrap';
      btnWrap.id='chat-btn-area';

      if(step.btn){
        // 사용자 말풍선처럼 보이는 버튼
        var userRow=document.createElement('div');
        userRow.className='crow urow';
        userRow.id='user-btn-row';
        var btn=document.createElement('button');
        btn.className='chat-btn';
        btn.textContent=step.btn;
        btn.onclick=function(){
          // 버튼을 실제 말풍선으로 교체
          var ur=document.getElementById('user-btn-row');
          if(ur){
            ur.innerHTML='<div class="bub bu">'+step.btn+'</div><div class="av av-u">나</div>';
          }
          // 다음 단계로
          currentStep++;
          if(currentStep<allSteps.length){
            showStep(currentStep);
          }
        };
        userRow.appendChild(btn);
        wrap.appendChild(userRow);
        setTimeout(function(){userRow.classList.add('show');},30);
      } else {
        // 마지막 단계 — 다음 버튼 활성화
        document.getElementById('bnext').disabled=false;
        var doneMsg=document.createElement('div');
        doneMsg.style.cssText='font-size:12px;color:#888;text-align:center;padding:10px 0;';
        doneMsg.textContent='✅ AI 검토 완료 — 아래 다음 버튼을 눌러 계속하세요';
        wrap.appendChild(doneMsg);
        wrap.scrollTop=wrap.scrollHeight;
      }
    },delay);
  }

  showStep(0);
}

function initAll(){
  // 책임 조작
  var rb=document.getElementById('resp-box');
  if(rb)rb.innerHTML=isHighResp?respHTML.high:respHTML.low;
  // 채팅 리마인드
  var cr=document.getElementById('chat-remind');
  if(cr)cr.innerHTML=isHighResp?chatRemind.high:chatRemind.low;
  // 조작점검
  var mcr=document.getElementById('mc-resp-box');
  if(mcr){
    mcr.innerHTML=mcRespItems.map(function(item,i){
      return'<div class="qb"><div class="ql"><span class="qn">'+(i+1)+'</span>'+item.lb+'</div>'+
        '<div class="lanc"><span>전혀 아니다</span><span>매우 그렇다</span></div>'+
        '<div class="lrow">'+[1,2,3,4,5,6,7].map(function(v){
          return'<label><input type="radio" name="'+item.id+'" value="'+v+'"><div class="lbtn">'+v+'</div></label>';
        }).join('')+'</div></div>';
    }).join('');
  }
  var mce=document.getElementById('mc-exp-box');
  if(mce){
    mce.innerHTML=mcExpItems.map(function(item,i){
      return'<div class="qb"><div class="ql"><span class="qn">'+(i+1)+'</span>'+item.lb+'</div>'+
        '<div class="lanc"><span>전혀 아니다</span><span>매우 그렇다</span></div>'+
        '<div class="lrow">'+[1,2,3,4,5,6,7].map(function(v){
          return'<label><input type="radio" name="'+item.id+'" value="'+v+'"><div class="lbtn">'+v+'</div></label>';
        }).join('')+'</div></div>';
    }).join('');
  }
  makeLikert(s7Items,'s7box');
  makeLikert(s8Items,'s8box');
  makeLikert(s9Items,'s9box');
}

function updateProg(){
  var pct=Math.round((cur/(TOTAL-1))*100);
  document.getElementById('pfill').style.width=pct+'%';
  document.getElementById('ppct').textContent=pct+'%';
  var labs=['연구 동의','자격 확인','상황 도입','책임 조건','AI 분석','상황 판단','조작 점검','인식 1/2','인식 2/2','사용 의도','기본 정보','개인정보'];
  document.getElementById('ptxt').textContent=labs[cur]||'';
}

function showSec(n){
  document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('active');});
  var sec=document.getElementById('s'+n);
  if(sec)sec.classList.add('active');
  document.getElementById('bprev').style.display=n===0?'none':'';
  document.getElementById('bnext').textContent=n===TOTAL-1?'제출하기 ✓':'다음 →';
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
  if(cur===5)return!!document.querySelector('input[name="action"]:checked');
  if(cur===6){
    var allMC=[].concat(mcRespItems,mcExpItems);
    return allMC.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  }
  if(cur===7)return s7Items.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===8)return s8Items.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===9)return s9Items.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===10){
    return['qgender','qage','qfield','qindustry','qcompsize','qrank','qexp','qedu','qai'].every(function(n){
      return document.querySelector('input[name="'+n+'"]:checked');
    });
  }
  return true;
}

function gv(name){
  var el=document.querySelector('input[name="'+name+'"]:checked');
  if(!el)return'';
  if(el.value==='기타'){
    var m={qfield:'field-etc',qrank:'rank-etc',qindustry:'industry-etc'};
    if(m[name]){var t=document.getElementById(m[name]).value.trim();return t?'기타: '+t:'기타';}
  }
  return el.value;
}

function collectData(){
  var data={
    timestamp:new Date().toLocaleString('ko-KR'),
    group:grp,
    resp_cond:isHighResp?'고책임':'저책임',
    exp_cond:isHighExp?'설명높음':'설명낮음',
    action:(document.querySelector('input[name="action"]:checked')||{}).value||''
  };
  [].concat(mcRespItems,mcExpItems,s7Items,s8Items,s9Items).forEach(function(item){
    var el=document.querySelector('input[name="'+item.id+'"]:checked');
    data[item.id]=el?parseInt(el.value):'';
  });
  data.gender=(document.querySelector('input[name="qgender"]:checked')||{}).value||'';
  data.age=(document.querySelector('input[name="qage"]:checked')||{}).value||'';
  data.field=gv('qfield');
  data.industry=gv('qindustry');
  data.compsize=(document.querySelector('input[name="qcompsize"]:checked')||{}).value||'';
  data.rank=gv('qrank');
  data.experience=(document.querySelector('input[name="qexp"]:checked')||{}).value||'';
  data.education=(document.querySelector('input[name="qedu"]:checked')||{}).value||'';
  data.ai_usage=(document.querySelector('input[name="qai"]:checked')||{}).value||'';
  data.privacy_agree=(document.querySelector('input[name="pvagree"]:checked')||{}).value||'미응답';
  data.name=(document.getElementById('iname')||{}).value||'';
  data.contact=(document.getElementById('icontact')||{}).value||'';
  return data;
}

function showEnd(){
  document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('active');});
  document.getElementById('navrow').style.display='none';
  document.getElementById('pfill').style.width='100%';
  document.getElementById('ppct').textContent='';
  document.getElementById('ptxt').textContent='설문 종료';
  document.getElementById('endw').style.display='block';
  window.scrollTo({top:0,behavior:'smooth'});
}

function showThank(data){
  document.getElementById('navrow').style.display='none';
  document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('active');});
  document.getElementById('pfill').style.width='100%';
  document.getElementById('ppct').textContent='완료';
  document.getElementById('ptxt').textContent='제출 완료';
  document.getElementById('thkd').innerHTML=
    '<div class="tdr"><span class="tdk">응답 시각</span><span class="tdv">'+data.timestamp+'</span></div>';
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
  if(dir===1&&!validate()){
    if(cur!==1)alert('모든 항목에 응답해 주세요.');
    return;
  }
  if(dir===1&&cur===TOTAL-1){submitData(collectData());return;}
  cur=Math.max(0,Math.min(TOTAL-1,cur+dir));
  showSec(cur);
}

document.addEventListener('change',function(e){
  if(e.target.name==='qfield'){
    document.getElementById('field-etc').style.display=e.target.value==='기타'?'block':'none';
  }
  if(e.target.name==='qrank'){
    document.getElementById('rank-etc').style.display=e.target.value==='기타'?'block':'none';
  }
  if(e.target.name==='qindustry'){
    document.getElementById('industry-etc').style.display=e.target.value==='기타'?'block':'none';
  }
  if(e.target.name==='pvagree'){
    document.getElementById('pvfields').style.display=e.target.value==='yes'?'block':'none';
  }
});

document.getElementById('bprev').addEventListener('click',function(){navigate(-1);});
document.getElementById('bnext').addEventListener('click',function(){navigate(1);});

initAll();
showSec(0);

});
