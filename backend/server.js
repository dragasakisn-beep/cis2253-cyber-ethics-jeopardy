'use strict';
const {App}=require('@slack/bolt');
const express=require('express');
const crypto=require('node:crypto');
const PORT=Number(process.env.PORT||3000);
const key=process.env.INSTRUCTOR_KEY;
const channel=process.env.SLACK_CHANNEL_ID;
if(!key||!process.env.SLACK_APP_TOKEN||!process.env.SLACK_BOT_TOKEN||!process.env.SLACK_SIGNING_SECRET){
  console.error('Missing required backend secrets: INSTRUCTOR_KEY, SLACK_APP_TOKEN, SLACK_BOT_TOKEN or SLACK_SIGNING_SECRET');process.exit(1);
}
const slack=new App({token:process.env.SLACK_BOT_TOKEN,appToken:process.env.SLACK_APP_TOKEN,signingSecret:process.env.SLACK_SIGNING_SECRET,socketMode:true});
const http=express();http.disable('x-powered-by');http.use(express.json({limit:'10kb'}));
const state={round:0,armed:false,winner:null,question:'',teams:['Team 1','Team 2','Team 3','Team 4'],users:new Map(),history:[]};
const strip=s=>String(s||'').replace(/[<>\r\n]/g,'').slice(0,100);
function view(){return {round:state.round,armed:state.armed,winner:state.winner,question:state.question,teams:state.teams,attempts:state.history.length}}
function buzz(id,name,source){
  if(!state.armed)return {success:false,message:'Buzzer is closed. Wait for the instructor.'};
  const team=state.users.get(id);
  if(team===undefined)return {success:false,message:'Register a team first with /team 1, /team 2, /team 3 or /team 4.'};
  if(state.winner)return {success:false,message:'This question has already been claimed.'};
  const winner={userId:id,name:strip(name||id),teamIndex:team,teamName:state.teams[team],source,receivedAt:new Date().toISOString()};
  state.winner=winner;state.armed=false;state.history.push({round:state.round,...winner});
  console.log('Winning buzzer: round',state.round,'user',id);
  return {success:true,message:'FIRST BUZZ! '+winner.name+' — '+winner.teamName};
}
slack.command('/team',async({command,ack,respond})=>{
  await ack();
  if(channel&&command.channel_id!==channel)return respond({text:'Use this command in the designated CIS2253 game channel.',response_type:'ephemeral'});
  const i=Number(command.text.trim())-1;
  if(!Number.isInteger(i)||i<0||i>=4)return respond({text:'Use /team 1, /team 2, /team 3, or /team 4.',response_type:'ephemeral'});
  state.users.set(command.user_id,i);
  await respond({text:'Registered for '+state.teams[i]+'. Use /buzz when the instructor opens a question.',response_type:'ephemeral'});
});
slack.command('/buzz',async({command,ack,respond})=>{const r=channel&&command.channel_id!==channel?{message:'Use /buzz in the CIS2253 game channel.'}:buzz(command.user_id,command.user_name,'slash');await ack();await respond({text:r.message,response_type:'ephemeral'})});
slack.action('cis2253_buzz',async({ack,body,respond})=>{
  const u=body.user||{};
  const r=channel&&body.channel?.id!==channel?{message:'This button is not in the configured game channel.'}:buzz(u.id,u.name||u.username||u.id,'button');
  await ack();
  if(respond)await respond({text:r.message,response_type:'ephemeral',replace_original:false});
});
http.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin',process.env.FRONTEND_ORIGIN||'https://dragasakisn-beep.github.io');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, X-Instructor-Key');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Vary','Origin');
  if(req.method==='OPTIONS')return res.sendStatus(204);
  next();
});
http.get('/health',(req,res)=>res.json({ok:true,service:'CIS2253 Slack buzzer'}));
function hostOnly(req,res,next){
  const a=Buffer.from(req.get('X-Instructor-Key')||''),b=Buffer.from(key);
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(401).json({error:'Invalid instructor key'});
  next();
}
http.use('/api/host',hostOnly);
http.get('/api/host/status',(req,res)=>res.json(view()));
http.post('/api/host/teams',(req,res)=>{
  const t=req.body?.teams;
  if(!Array.isArray(t)||t.length!==4||t.some(x=>typeof x!=='string'||!x.trim()||x.length>40))return res.status(400).json({error:'Four valid team names required'});
  state.teams=t.map(strip);res.json(view());
});
http.post('/api/host/arm',(req,res)=>{state.round++;state.armed=true;state.winner=null;state.question=strip(req.body?.question);res.json(view())});
http.post('/api/host/close',(req,res)=>{state.armed=false;res.json(view())});
http.post('/api/host/post-button',async(req,res)=>{
  if(!channel)return res.status(400).json({error:'Configure SLACK_CHANNEL_ID on the server first'});
  try{
    await slack.client.chat.postMessage({channel,text:'CIS2253 Cyber Ethics Jeopardy — press BUZZ IN',blocks:[
      {type:'section',text:{type:'mrkdwn',text:'*CYBER ETHICS JEOPARDY*\nRegister once using `/team 1` through `/team 4`. Press *BUZZ IN* when the instructor opens a question.'}},
      {type:'actions',elements:[{type:'button',action_id:'cis2253_buzz',text:{type:'plain_text',text:'BUZZ IN'},style:'primary'}]}
    ]});
    res.json({message:'Buzzer button posted to Slack.'});
  }catch(e){console.error('Slack send error:',e.data?.error||e.message);res.status(502).json({error:'Slack could not post. Check channel ID, bot membership, and chat:write.'})}
});
http.get('/join',(req,res)=>res.type('html').send('<!doctype html><html><meta name="viewport" content="width=device-width"><title>CIS2253 Buzzer</title><body style="background:#0c1b30;color:#eaf3ff;font:17px system-ui;padding:40px;max-width:600px;margin:auto"><h1>CIS2253 Jeopardy</h1><p>Open your class Slack channel. Enter <strong>/team 1</strong> through <strong>/team 4</strong> to register, then use <strong>/buzz</strong> or the button posted by the instructor when a question opens.</p></body></html>'));
(async()=>{await slack.start();http.listen(PORT,'0.0.0.0',()=>console.log('CIS2253 Slack buzzer backend listening on port',PORT))})().catch(e=>{console.error('Unable to start Slack backend:',e.message);process.exit(1)});
