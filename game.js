'use strict';
const $=id=>document.getElementById(id),KEY='cis2253-jeopardy-v3';
const defaultGame=()=>({teams:[1,2,3,4].map(i=>({name:'Team '+i,score:0})),active:0,used:[]});
let game;try{game=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!game||!Array.isArray(game.teams)||game.teams.length!==4||!Array.isArray(game.used))game=defaultGame();
const persist=()=>localStorage.setItem(KEY,JSON.stringify(game));
const escapeAttr=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let current=null,clock=null,seconds=30;
const live={connected:false,url:'',key:'',interval:null};
function render(){
  $('teams').innerHTML=game.teams.map((t,i)=>'<div class="team '+(game.active===i?'active':'')+'"><input data-name="'+i+'" aria-label="Team '+(i+1)+' name" value="'+escapeAttr(t.name)+'"><div class="score">'+Number(t.score||0)+' <small>PTS</small></div><button class="btn btn-sm '+(game.active===i?'btn-info':'btn-outline')+'" data-team="'+i+'">'+(game.active===i?'Answering':'Select team')+'</button></div>').join('');
  document.querySelectorAll('[data-team]').forEach(b=>b.addEventListener('click',()=>{game.active=Number(b.dataset.team);persist();render()}));
  document.querySelectorAll('[data-name]').forEach(el=>el.addEventListener('change',()=>{game.teams[Number(el.dataset.name)].name=el.value.slice(0,40).trim()||'Team';persist();render()}));
  $('board').replaceChildren();
  for(const category of QUESTION_BANK){const el=document.createElement('div');el.className='cat';el.textContent=category.name;$('board').appendChild(el)}
  for(let row=0;row<5;row++)for(let column=0;column<6;column++){const id=column+'-'+row;const el=document.createElement('button');el.className='tile';el.textContent=(row+1)*100;el.disabled=game.used.includes(id);el.setAttribute('aria-label',QUESTION_BANK[column].name+' '+(row+1)*100+' points');el.onclick=()=>openQuestion(column,row);$('board').appendChild(el)}
}
function buzzText(s){$('live').textContent=s;$('winner').textContent=s}
function openQuestion(column,row){if(current)return;current={column,row,points:(row+1)*100};const q=QUESTION_BANK[column];$('qmeta').textContent=q.name+' · '+current.points+' POINTS';$('question').textContent=q.qa[row][0];$('answer').textContent=q.qa[row][1];$('answer').hidden=true;$('clock').textContent='';clearInterval(clock);$('dialog').classList.add('show');buzzText(live.connected?'Opening buzzer round…':'Offline play · choose answering team');if(live.connected)armBuzzer()}
function closeQuestion(delta){if(!current)return;game.teams[game.active].score+=delta*current.points;game.used.push(current.column+'-'+current.row);current=null;persist();render();clearInterval(clock);$('dialog').classList.remove('show');if(live.connected)request('/api/host/close','POST',{}).catch(e=>buzzText(e.message))}
$('correct').onclick=()=>closeQuestion(1);$('incorrect').onclick=()=>closeQuestion(-1);$('skip').onclick=()=>closeQuestion(0);
$('reveal').onclick=()=>{$('answer').hidden=false;clearInterval(clock)};
$('timer').onclick=()=>{clearInterval(clock);seconds=30;$('clock').textContent='30s';clock=setInterval(()=>{seconds--;$('clock').textContent=seconds>0?seconds+'s':'Time';if(seconds<=0)clearInterval(clock)},1000)};
$('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();
$('reset').onclick=()=>{if(confirm('Reset all scores and used questions?')){localStorage.removeItem(KEY);location.reload()}};
$('endpoint').value=localStorage.getItem('cis2253-buzzer-endpoint')||'';
function status(text){$('status').textContent=text}
async function request(path,method='GET',payload){if(!live.connected)throw Error('Connect the backend first');const response=await fetch(live.url+path,{method,headers:{'Content-Type':'application/json','X-Instructor-Key':live.key},...(payload?{body:JSON.stringify(payload)}:{})});const result=await response.json().catch(()=>({}));if(!response.ok)throw Error(result.error||'Request failed: '+response.status);return result}
$('connect').onclick=async()=>{const url=$('endpoint').value.trim().replace(/\/+$/,'');const key=$('instructorKey').value.trim();if(!/^https:\/\//.test(url)||!key)return alert('Enter an HTTPS backend URL and your private instructor key.');Object.assign(live,{connected:true,url,key});try{await request('/api/host/status');localStorage.setItem('cis2253-buzzer-endpoint',url);status('Connected');await syncTeams();clearInterval(live.interval);live.interval=setInterval(poll,1000);await poll()}catch(e){live.connected=false;status('Connection failed');alert('Cannot connect: '+e.message)}};
async function syncTeams(){if(!live.connected)return;try{await request('/api/host/teams','POST',{teams:game.teams.map(t=>t.name)});status('Connected · Teams synced')}catch(e){status(e.message)}}
async function armBuzzer(){if(!live.connected)return;try{await request('/api/host/arm','POST',{question:current?QUESTION_BANK[current.column].name+' · '+current.points+' points':'Practice round'});buzzText('Buzzers armed — waiting for a student')}catch(e){buzzText(e.message)}}
async function poll(){if(!live.connected)return;try{const d=await request('/api/host/status');status('Connected · '+(d.armed?'Buzzing open':d.winner?'Buzz locked':'Buzzing closed'));if(d.winner){const ix=d.winner.teamIndex;if(Number.isInteger(ix)&&ix>=0&&ix<4&&game.active!==ix){game.active=ix;persist();render()}buzzText('FIRST BUZZ: '+d.winner.name+' · '+d.winner.teamName)}else buzzText(d.armed?'Buzzers armed — waiting for first student':'Buzzers closed')}catch(e){status('Connection interrupted');console.warn(e.message)}}
$('sync').onclick=syncTeams;$('arm').onclick=armBuzzer;
$('close').onclick=async()=>{if(!live.connected)return;try{await request('/api/host/close','POST',{});buzzText('Buzzers closed')}catch(e){alert(e.message)}};
$('post').onclick=async()=>{if(!live.connected)return alert('Connect the backend first');try{const r=await request('/api/host/post-button','POST',{});alert(r.message)}catch(e){alert(e.message)}};
render();
