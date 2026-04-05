// 이메일 동적 주입
(function(){
  var p1='codl';var p2='_121';var p3='khu';var p4='.ac.kr';
  var sep=String.fromCharCode(64);
  var full=p1+p2+sep+p3+p4;
  function inject(){document.querySelectorAll('.em-placeholder').forEach(function(e){e.textContent=full;});}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',inject);}else{inject();}
})();

document.addEventListener('DOMContentLoaded',function(){

var SHEET_URL='https://script.google.com/macros/s/AKfycbxewOPqzNbp9Ni_CvRnn-qjtMhFQY-khf7kFzP9NqIKO8nVi_X3zJ_NisAqwtORMRjr/exec';
var TOTAL=12;
var cur=0;
var chatDone=false;

var grp=Math.floor(Math.random()*4)+1;
var isHighResp=(grp===1||grp===2);
var isHighExp=(grp===1||grp===3);

var respHTML={
  high:'<div class="resp-card"><div class="rc-text">귀하는 기업의 품질·인증 실무자입니다.<br><br>귀하의 회사는 최근 문서 검토 효율화를 위해 <strong>AI 문서 지원 도구</strong>를 도입하였으며, 귀하는 오늘 이 도구를 실무에 활용하게 되었습니다.<br><br><strong>내일 오전</strong>, 외부 인증기관에서 <strong>ISO 9001 정기 사후심사</strong>가 예정되어 있습니다. 이번 심사는 <strong>2년 주기 인증 갱신 심사</strong>로, 만약 중대한 부적합이 발견될 경우 인증이 취소될 수 있으며, 이는 주요 거래처와의 계약 조건에도 직접적인 영향을 미칠 수 있습니다.<br><br>귀하는 오늘 중으로 심사 제출용 <strong>품질경영계획서(Rev.2, 2025.12.01)</strong>의 최종 검토를 완료해야 합니다. 이 문서는 <strong>귀하의 이름으로 심사원에게 직접 제출</strong>되며, 검토 결과와 판단 근거는 <strong>심사 현장에서 귀하가 직접 심사원에게 설명</strong>해야 합니다. 검토 이력은 <strong>공식 기록으로 보존</strong>되며, 부적합 발생 시 그 결과는 <strong>귀하의 책임</strong>으로 귀속됩니다.<br><br>귀하는 빠르고 정확한 검토를 위해 AI 문서 지원 도구에 품질경영계획서 파일을 업로드하기로 했습니다.</div></div>',
  low:'<div class="resp-card"><div class="rc-text">귀하는 기업의 품질·인증 실무자입니다.<br><br>귀하의 회사는 최근 문서 검토 효율화를 위해 <strong>AI 문서 지원 도구</strong>를 도입하였으며, 귀하는 오늘 이 도구를 실무에 활용하게 되었습니다.<br><br>오늘 귀하는 팀에서 <strong>내부 검토용 품질경영계획서 초안</strong>을 간단히 살펴봐 달라는 요청을 받았습니다. 이 문서는 아직 초안 단계로 <strong>외부에 제출되지 않으며</strong>, 이후 별도의 공식 검토 및 승인 절차가 예정되어 있습니다.<br><br>최종 검토와 서명은 담당자가 따로 진행하며, 귀하는 <strong>단순히 참고 의견을 제공하는 역할</strong>입니다. 이 단계의 검토 결과는 외부 평가나 인증 결과에 <strong>직접 연결되지 않으며</strong>, 귀하에게 <strong>공식적인 책임은 없습니다</strong>.<br><br>귀하는 빠르게 검토하기 위해 AI 문서 지원 도구에 품질경영계획서 파일을 업로드하기로 했습니다.</div></div>'
};

var mcRespItems=[
  {id:'MCR1',lb:'이 상황은 실수 시 결과가 크게 잘못될 수 있는 업무라고 느껴졌다.'},
  {id:'MCR2',lb:'이 상황에서는 판단에 대한 책임이 크다고 느껴졌다.'},
  {id:'MCR3',lb:'이 상황에서는 판단 근거를 설명해야 한다고 느껴졌다.'},
  {id:'MCR4',lb:'이 상황은 신중한 판단이 요구되는 업무라고 느껴졌다.'}
];
var mcExpItems=[
  {id:'MCE1',lb:'AI는 왜 이런 판단을 했는지 충분히 설명했다.'},
  {id:'MCE2',lb:'AI의 답변은 구체적이었다.'},
  {id:'MCE3',lb:'AI의 판단 근거를 이해하기 쉬웠다.'},
  {id:'MCE4',lb:'AI의 설명은 업무 판단에 참고하기에 충분했다.'}
];

var aiRemindHigh='AI는 품질경영계획서에서 <strong>6.2.2항 품질목표 달성 기획</strong>의 부적합 가능성을 발견하고, ISO 9001:2015 요구사항에 따른 상세 근거와 수정 방향을 제시했습니다.';
var aiRemindLow='AI는 문서에서 <strong>부적합 가능성</strong>을 감지했다고 알려주었습니다.';

var s7Items=[
  {id:'EXP1',lb:'AI는 왜 이런 판단을 했는지 이해할 수 있게 설명해 주었다.'},
  {id:'EXP2',lb:'AI가 어떤 근거로 해당 항목을 문제로 판단했는지 알 수 있었다.'},
  {id:'EXP3',lb:'AI의 설명은 내가 상황을 파악하기에 충분히 구체적이었다.'},
  {id:'EXP4',lb:'AI가 결론에 도달한 논리적 과정을 파악할 수 있었다.'},
  {id:'TRU1',lb:'나는 이 AI의 판단을 신뢰할 수 있다고 생각한다.'},
  {id:'TRU2',lb:'이 AI는 신뢰할 만한 정보를 제공한다고 느낀다.'},
  {id:'TRU3',lb:'이 AI 결과에 어느 정도 의존할 수 있다고 생각한다.'},
  {id:'TRU4',lb:'이 AI는 일관된 판단을 제공할 것이라고 생각한다.'}
];
var s8Items=[
  {id:'PU1',lb:'이 AI는 업무 효율을 높이는 데 도움이 될 것 같다.'},
  {id:'PU2',lb:'이 AI는 검토 업무를 더 쉽게 만들어 줄 것 같다.'},
  {id:'PU3',lb:'이 AI는 실무에 유용한 도구라고 생각한다.'},
  {id:'EPR1',lb:'이 AI는 오류를 포함할 가능성이 있다.'},
  {id:'EPR2',lb:'이 AI 결과를 그대로 사용하는 것은 위험할 수 있다.'},
  {id:'EPR3',lb:'이 AI 판단은 추가 확인이 필요하다고 느껴진다.'},
  {id:'AA1',lb:'이 상황에서 AI를 사용하는 것은 부담스럽다.'},
  {id:'AA2',lb:'AI 결과를 활용할 때 책임에 대한 불안이 느껴진다.'},
  {id:'AA3',lb:'잘못된 판단이 발생하면 부담이 클 것 같다.'}
];
var s9Items=[
  {id:'ITU1',lb:'나는 이 AI 도구를 향후 업무에 활용할 의향이 있다.'},
  {id:'ITU2',lb:'가능하다면 이 AI를 실무에 계속 사용하고 싶다.'},
  {id:'ITU3',lb:'이 AI는 실제 업무에서 사용할 가치가 있다고 생각한다.'},
  {id:'ITU4',lb:'비슷한 상황에서 다시 이 AI를 활용할 것이다.'}
];

function runChat(){
  if(chatDone)return;
  chatDone=true;
  var wrap=document.getElementById('chatbox');
  if(!wrap)return;
  wrap.innerHTML='';
  document.getElementById('bnext').disabled=true;

  var highDetail=[
    {type:'upload'},
    {type:'scan'},
    {msgs:[{bub:'bwarn',tx:'검토가 필요한 항목이 발견되었습니다. 상세 내용을 확인하시겠습니까?'}],btn:'상세 내용 확인하기'},
    {msgs:[
      {bub:'bwarn',tx:'<strong>6.2.2항 품질목표 달성 기획 — 부적합 가능성 감지</strong><br><br>ISO 9001:2015 6.2.2(b)(c)(d) 요구사항에 따르면, 품질목표 달성을 위한 기획 시 분기별 세부 달성 계획, 담당자(책임자) 지정, 진척도 모니터링 방법이 명시되어야 합니다.<br><br>현재 문서에는 <strong>분기별 달성 계획이 누락</strong>되어 있으며, <strong>각 목표에 대한 담당자가 지정되지 않아</strong> 요구사항을 충족하지 못하고 있습니다. 심사 시 중대한 부적합으로 지적될 가능성이 있습니다.'},
      {bub:'bai',tx:'과거 유사 부서 데이터를 기반으로 수정 초안을 자동 생성할 수 있습니다. 1~4분기별 달성 계획과 담당 부서장 책임을 추가한 수정안을 생성하시겠습니까?'}
    ],btn:'수정 초안 요청'},
    {msgs:[
      {bub:'bai',tx:'수정 초안을 생성했습니다. 6.2.2항에 다음 내용이 추가되었습니다.<br><br>1분기(3월): 공정불량률 목표 2.0% — 품질팀장 책임<br>2분기(6월): 고객만족도 목표 85점 — 고객지원팀장 책임<br>3분기(9월): 납기준수율 목표 95% — 생산팀장 책임<br>4분기(12월): 내부심사 지적건수 0건 — 품질팀장 책임'},
      {bub:'bok',tx:'<strong>재검토 완료 — 6.2.2항 기준 충족</strong><br><br>수정된 문서에 분기별 달성 계획과 담당자가 명시되어 ISO 9001:2015 6.2.2(b)(c)(d) 요구사항을 충족합니다. 부적합 사항 없음으로 판단됩니다.'}
    ],btn:null}
  ];

  var lowDetail=[
    {type:'upload'},
    {type:'scan-low'},
    {msgs:[{bub:'bwarn',tx:'문제 가능성이 감지되었습니다. 확인하시겠습니까?'}],btn:'내용 확인하기'},
    {msgs:[
      {bub:'bwarn',tx:'문서에서 부적합 가능성이 감지되었습니다.'},
      {bub:'bai',tx:'수정이 필요할 수 있습니다. 수정 초안을 요청하시겠습니까?'}
    ],btn:'수정 초안 요청'},
    {msgs:[
      {bub:'bai',tx:'수정 초안을 생성했습니다.'},
      {bub:'bok',tx:'재검토 완료 — 이상 없음으로 판단됩니다.'}
    ],btn:null}
  ];

  var allSteps=isHighExp?highDetail:lowDetail;
  var currentStep=0;

  function addMsg(cls,inner){
    var r=document.createElement('div');r.className='crow '+cls;
    r.innerHTML=inner;wrap.appendChild(r);
    setTimeout(function(){r.classList.add('show');},30);
    wrap.scrollTop=wrap.scrollHeight;
    return r;
  }

  function showStep(idx){
    var step=allSteps[idx];
    var delay=200;

    if(step.type==='upload'){
      setTimeout(function(){
        var uid='pf'+Date.now();
        addMsg('urow','<div class="av av-u">나</div><div class="bub bu" style="padding:0;overflow:hidden;min-width:200px;max-width:260px;"><div style="padding:12px;"><div style="display:flex;align-items:center;gap:10px;"><div style="width:34px;height:42px;background:rgba(255,255,255,.2);border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="font-size:9px;font-weight:700;color:#fff;">PDF</span></div><div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">품질경영계획서_Rev2_2025.12.01.pdf</div><div style="font-size:10px;color:rgba(255,255,255,.7);margin-top:1px;">2.4 MB</div><div style="margin-top:6px;height:3px;background:rgba(255,255,255,.25);border-radius:2px;overflow:hidden;"><div id="'+uid+'" style="height:100%;background:#fff;border-radius:2px;width:0%;"></div></div><div style="font-size:10px;color:rgba(255,255,255,.8);margin-top:3px;display:flex;justify-content:space-between;"><span id="'+uid+'s">업로드 중...</span><span id="'+uid+'p">0%</span></div></div></div></div></div>');
        var pct=0;
        var iv=setInterval(function(){
          pct+=Math.random()*15+5;
          if(pct>=100){
            pct=100;clearInterval(iv);
            var pf=document.getElementById(uid);
            if(pf){pf.style.width='100%';pf.style.background='#a7f3d0';}
            var pp=document.getElementById(uid+'p');if(pp)pp.textContent='100%';
            var ps=document.getElementById(uid+'s');if(ps)ps.textContent='업로드 완료';
            setTimeout(function(){showStep(idx+1);},600);
          } else {
            var pf2=document.getElementById(uid);if(pf2)pf2.style.width=Math.round(pct)+'%';
            var pp2=document.getElementById(uid+'p');if(pp2)pp2.textContent=Math.round(pct)+'%';
          }
        },100);
      },delay);
      return;
    }

    if(step.type==='scan'){
      setTimeout(function(){
        var t=addMsg('','<div class="av av-ai">AI</div><div class="bub bai"><div class="tdots"><span></span><span></span><span></span></div></div>');
        var tid=t.id='typr-'+Date.now();
        setTimeout(function(){
          var x=document.getElementById(tid);if(x)x.remove();
          addMsg('','<div class="av av-ai">AI</div><div class="bub bai">문서를 수신했습니다. ISO 9001:2015 기준으로 분석을 시작합니다.</div>');
          setTimeout(function(){
            addMsg('','<div class="av av-ai">AI</div><div class="bub bai" style="font-size:12px;line-height:1.9;"><div style="display:flex;align-items:center;gap:7px;margin-bottom:2px;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>4.1 조직 상황 — 적합</div><div style="display:flex;align-items:center;gap:7px;margin-bottom:2px;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>5.1 리더십 및 의지표명 — 적합</div><div style="display:flex;align-items:center;gap:7px;margin-bottom:2px;"><span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block;flex-shrink:0;"></span>6.2.2 품질목표 달성 기획 — 검토 중...</div><div style="display:flex;align-items:center;gap:7px;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>8.1 운영 기획 및 관리 — 적합</div></div>');
            setTimeout(function(){showStep(idx+1);},1000);
          },900);
        },1400);
      },delay);
      return;
    }

    if(step.type==='scan-low'){
      setTimeout(function(){
        var t=addMsg('','<div class="av av-ai">AI</div><div class="bub bai"><div class="tdots"><span></span><span></span><span></span></div></div>');
        var tid=t.id='typr-'+Date.now();
        setTimeout(function(){
          var x=document.getElementById(tid);if(x)x.remove();
          addMsg('','<div class="av av-ai">AI</div><div class="bub bai">문서를 수신했습니다. 분석을 시작합니다.</div>');
          setTimeout(function(){
            addMsg('','<div class="av av-ai">AI</div><div class="bub bai">분석이 완료되었습니다.</div>');
            setTimeout(function(){showStep(idx+1);},800);
          },900);
        },1400);
      },delay);
      return;
    }

    var d=delay;
    var t2=addMsg('','<div class="av av-ai">AI</div><div class="bub bai"><div class="tdots"><span></span><span></span><span></span></div></div>');
    t2.id='typr-'+Date.now();
    var t2id=t2.id;
    setTimeout(function(){var x=document.getElementById(t2id);if(x)x.remove();},d+1300);
    d+=1500;

    step.msgs.forEach(function(msg){
      setTimeout(function(){
        addMsg('','<div class="av av-ai">AI</div><div class="bub '+msg.bub+'">'+msg.tx+'</div>');
      },d);
      d+=1000;
    });

    setTimeout(function(){
      var old=document.getElementById('chat-btn-area');if(old)old.remove();
      if(step.btn){
        var urow=document.createElement('div');urow.className='crow urow';urow.id='user-btn-row';
        var btn=document.createElement('button');btn.className='chat-btn';btn.textContent=step.btn;
        btn.onclick=function(){
          var ur=document.getElementById('user-btn-row');
          if(ur){ur.innerHTML='<div class="bub bu">'+step.btn+'</div><div class="av av-u">나</div>';}
          currentStep++;
          if(currentStep<allSteps.length){showStep(currentStep);}
        };
        urow.appendChild(btn);wrap.appendChild(urow);
        setTimeout(function(){urow.classList.add('show');},30);
        wrap.scrollTop=wrap.scrollHeight;
      } else {
        document.getElementById('bnext').disabled=false;
        var done=document.createElement('div');
        done.style.cssText='font-size:12px;color:#888;text-align:center;padding:10px 0;';
        done.textContent='AI 검토가 완료되었습니다. 아래 다음 버튼을 눌러주세요.';
        wrap.appendChild(done);wrap.scrollTop=wrap.scrollHeight;
      }
    },d);
  }

  showStep(0);
}

function makeLikert(items,tid){
  var el=document.getElementById(tid);if(!el)return;
  el.innerHTML=items.map(function(item,i){
    return'<div class="qb"><div class="ql"><span class="qn">'+(i+1)+'</span>'+item.lb+'</div>'+
      '<div class="lanc"><span>전혀 아니다</span><span>매우 그렇다</span></div>'+
      '<div class="lrow">'+[1,2,3,4,5,6,7].map(function(v){
        return'<label><input type="radio" name="'+item.id+'" value="'+v+'"><div class="lbtn">'+v+'</div></label>';
      }).join('')+'</div></div>';
  }).join('');
}

function initAll(){
  var rb=document.getElementById('resp-box');
  if(rb)rb.innerHTML=isHighResp?respHTML.high:respHTML.low;
  var remind=isHighExp?aiRemindHigh:aiRemindLow;
  ['remind-s7','remind-s8','remind-s9'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.innerHTML='<div class="remind-ai">'+remind+'</div>';
  });
  var mcr=document.getElementById('mc-resp-box');
  if(mcr){mcr.innerHTML=mcRespItems.map(function(item,i){
    return'<div class="qb"><div class="ql"><span class="qn">'+(i+1)+'</span>'+item.lb+'</div>'+
      '<div class="lanc"><span>전혀 아니다</span><span>매우 그렇다</span></div>'+
      '<div class="lrow">'+[1,2,3,4,5,6,7].map(function(v){
        return'<label><input type="radio" name="'+item.id+'" value="'+v+'"><div class="lbtn">'+v+'</div></label>';
      }).join('')+'</div></div>';
  }).join('');}
  var mce=document.getElementById('mc-exp-box');
  if(mce){mce.innerHTML=mcExpItems.map(function(item,i){
    return'<div class="qb"><div class="ql"><span class="qn">'+(i+1)+'</span>'+item.lb+'</div>'+
      '<div class="lanc"><span>전혀 아니다</span><span>매우 그렇다</span></div>'+
      '<div class="lrow">'+[1,2,3,4,5,6,7].map(function(v){
        return'<label><input type="radio" name="'+item.id+'" value="'+v+'"><div class="lbtn">'+v+'</div></label>';
      }).join('')+'</div></div>';
  }).join('');}
  makeLikert(s7Items,'s7box');
  makeLikert(s8Items,'s8box');
  makeLikert(s9Items,'s9box');
}

function updateProg(){
  var pct=Math.round((cur/(TOTAL-1))*100);
  document.getElementById('pfill').style.width=pct+'%';
  document.getElementById('ppct').textContent=pct+'%';
  var labs=['연구 동의','자격 확인','상황 도입','업무 상황','AI 분석','상황 판단','조작 점검','인식 1/2','인식 2/2','사용 의도','기본 정보','개인정보'];
  document.getElementById('ptxt').textContent=labs[cur]||'';
}

function showSec(n){
  document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('active');});
  var sec=document.getElementById('s'+n);if(sec)sec.classList.add('active');
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
  if(cur===6)return[].concat(mcRespItems,mcExpItems).every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===7)return s7Items.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===8)return s8Items.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===9)return s9Items.every(function(i){return document.querySelector('input[name="'+i.id+'"]:checked');});
  if(cur===10)return['qgender','qage','qfield','qindustry','qcompsize','qrank','qexp','qedu','qai'].every(function(n){return document.querySelector('input[name="'+n+'"]:checked');});
  return true;
}

function gv(name){
  var el=document.querySelector('input[name="'+name+'"]:checked');if(!el)return'';
  if(el.value==='기타'){var m={qfield:'field-etc',qrank:'rank-etc',qindustry:'industry-etc'};if(m[name]){var t=document.getElementById(m[name]).value.trim();return t?'기타: '+t:'기타';}}
  return el.value;
}

function collectData(){
  var data={timestamp:new Date().toLocaleString('ko-KR'),group:grp,resp_cond:isHighResp?'고책임':'저책임',exp_cond:isHighExp?'설명높음':'설명낮음',action:(document.querySelector('input[name="action"]:checked')||{}).value||''};
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
  document.getElementById('thkd').innerHTML='<div class="tdr"><span class="tdk">응답 시각</span><span class="tdv">'+data.timestamp+'</span></div>';
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
  if(dir===1&&!validate()){if(cur!==1)alert('모든 항목에 응답해 주세요.');return;}
  if(dir===1&&cur===TOTAL-1){submitData(collectData());return;}
  cur=Math.max(0,Math.min(TOTAL-1,cur+dir));
  showSec(cur);
}

document.addEventListener('change',function(e){
  if(e.target.name==='qfield'){document.getElementById('field-etc').style.display=e.target.value==='기타'?'block':'none';}
  if(e.target.name==='qrank'){document.getElementById('rank-etc').style.display=e.target.value==='기타'?'block':'none';}
  if(e.target.name==='qindustry'){document.getElementById('industry-etc').style.display=e.target.value==='기타'?'block':'none';}
  if(e.target.name==='pvagree'){document.getElementById('pvfields').style.display=e.target.value==='yes'?'block':'none';}
});

document.getElementById('bprev').addEventListener('click',function(){navigate(-1);});
document.getElementById('bnext').addEventListener('click',function(){navigate(1);});

initAll();
showSec(0);

});
