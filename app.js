(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const decks = {
    odd: [
      ['ODDLY SPECIFIC', 'What is a completely ordinary thing you would get suspicious of if it happened twice in a row?', 'Be honest—or invent the most convincing answer.'],
      ['ODDLY SPECIFIC', 'What is the least impressive thing you are secretly proud of?', 'A tiny flex still counts.'],
      ['ODDLY SPECIFIC', 'What fictional character would absolutely block you?', 'Your real answer or a very convincing bluff.'],
      ['ODDLY SPECIFIC', 'What is a small hill you would happily die on?', 'The more oddly specific, the better.'],
      ['ODDLY SPECIFIC', 'What is the weirdest thing you have ever confidently misunderstood?', 'A real memory or a made-up masterpiece.'],
      ['ODDLY SPECIFIC', 'If your search history had a mascot, what would it be?', 'Nobody is checking. Probably.']
    ],
    deep: [
      ['DEEP ORBIT · OPTIONAL', 'What small kindness do you remember for longer than the person probably knows?', 'Keep it light if you want. Passing is always okay.'],
      ['DEEP ORBIT · OPTIONAL', 'What tiny thing can make a genuinely bad day 2% better?', 'Answer honestly, or make one up.'],
      ['DEEP ORBIT · OPTIONAL', 'What is a compliment you still remember?', 'No explanation required. You can skip this prompt.'],
      ['DEEP ORBIT · OPTIONAL', 'What part of your personality do your friends notice before you do?', 'This is a conversation game, not a personality test.'],
      ['DEEP ORBIT · OPTIONAL', 'What ordinary moment would you like to revisit for five minutes?', 'Share only what feels comfortable.']
    ],
    either: [
      ['WOULD YOU RATHER', 'Would you rather understand every animal, or speak every human language? Defend your choice.', 'Tell the truth—or bluff about which power you picked.'],
      ['WOULD YOU RATHER', 'Would you rather be able to pause time for ten seconds, or rewind one minute once a day?', 'The group guesses if that is really your pick.'],
      ['WOULD YOU RATHER', 'Would you rather have a personal theme song, or a laugh track that only you can hear?', 'Make your explanation convincing.'],
      ['WOULD YOU RATHER', 'Would you rather explore the deep ocean or orbit Saturn for a day?', 'No wrong answer. Some questionable reasons, though.'],
      ['WOULD YOU RATHER', 'Would you rather be famous for something silly or anonymous for something brilliant?', 'Your actual choice—or a sneaky fake.']
    ]
  };
  const wouldYouRatherPrompts = [
    ['WOULD YOU RATHER · ROUND 01','Which would you actually choose?', 'Pick privately. Friends will predict your answer.', 'Understand every animal', 'Speak every language'],
    ['WOULD YOU RATHER · ROUND 02','Which weird superpower would you actually take?', 'Pick privately. Friends will predict your answer.', 'Pause time for 10 seconds', 'Rewind one minute each day'],
    ['WOULD YOU RATHER · ROUND 03','Which kind of fame would you choose?', 'Pick privately. Friends will predict your answer.', 'Famous for something silly', 'Unknown but quietly brilliant'],
    ['WOULD YOU RATHER · ROUND 04','Where would you spend one whole day?', 'Pick privately. Friends will predict your answer.', 'Deep ocean station', 'A tiny moon of Saturn']
  ];
  const threeQuestionSets = [
    ['What tiny thing improves your mood instantly?','What is a skill you wish you had learned sooner?','Which fictional place would you visit for one afternoon?'],
    ['What snack deserves more respect?','What is something you are oddly good at?','What would your personal theme song sound like?'],
    ['What small kindness do you still remember?','What is your most useless talent?','Which everyday object would you save from an alien museum?']
  ];
  const jarPrompts = [
    'What is a tiny hill you would happily die on?','What smell teleports you somewhere else?','What is your most harmless unpopular opinion?','What would your 10-year-old self find cool about you now?','What is a compliment you still remember?','What object in your room has the best backstory?','What would your autobiography be called if it were extremely inaccurate?','Which song instantly changes the weather in your brain?','What is the weirdest thing you are sentimental about?'
  ];
  const binaryRoomPrompts = [
    ['READ THE ROOM','Choose what you would genuinely pick.','Then predict which side the group will choose.','Unlimited free food','Unlimited free travel'],
    ['READ THE ROOM','Pick privately, then call the room’s majority.','Can you predict your crew?','Always arrive 10 minutes early','Always arrive 10 minutes late'],
    ['READ THE ROOM','Which would your group rather give up?','Make your majority prediction before reveal.','Music for a month','Memes for a month'],
    ['READ THE ROOM','Your pick is private. The group majority is the mystery.','Predict the room, then see what happens.','Know every language','Know every instrument']
  ];
  const gameCatalog = [
    {key:'psych',title:'Psych! The Truth Bluff',kicker:'THE BLUFFING CLASSIC',glyph:'⌁',color:'#8deaff',description:'Answer a strange prompt honestly—or invent a lie your friends will buy. Can they tell which is which?',rules:['Each player writes one answer and marks it true or bluff.','Everyone votes on the anonymous answers.','Score for correct reads; bluffers score for every friend fooled.']},
    {key:'twoTruths',title:'Two Truths & a Lie',kicker:'THE PARTY CLASSIC',glyph:'◈',color:'#d2ff73',description:'Three claims about one player. Two are real. One is a lie. The group has to find the fake.',rules:['Each person writes three short statements.','Mark one statement as the lie.','Friends pick the lie; reveal all three together.']},
    {key:'wyr',title:'Would You Rather?',kicker:'PICK A SIDE',glyph:'↔',color:'#ffc886',description:'Choose between two impossible options, defend your choice, then see who actually knows what you would pick.',rules:['Everyone secretly picks A or B and gives a reason.','Friends predict each player’s choice.','Correct predictions earn points.']},
    {key:'threeQ',title:'Three Questions',kicker:'THREE ANSWERS · ONE BLUFF',glyph:'⁇',color:'#d4a8ff',description:'Answer three different questions. Two real answers and one invented answer. Can your crew spot the odd one out?',rules:['Each player answers three quick prompts.','Choose one answer to make up.','The group guesses which answer is the bluff.']},
    {key:'questionJar',title:'Question Jar',kicker:'NO SCORE · ALL STORY',glyph:'☼',color:'#8de0b9',description:'Draw a question, share as much or as little as you want, and vote for the answer that surprised you most.',rules:['Each player draws one different prompt.','Answer, pass, or keep it light.','Vote for the most surprising answer; no one gets ranked for honesty.']},
    {key:'hiddenTruth',title:'Hidden Truth',kicker:'WHO SAID THAT?',glyph:'◎',color:'#f99bcf',description:'Everyone leaves one harmless true fact without a name. Match each fact to the friend who shared it.',rules:['Write one true, low-stakes fact.','Guess which friend wrote each anonymous fact.','Score for recognizing your people.']},
    {key:'readRoom',title:'Read the Room',kicker:'PREDICT THE GROUP',glyph:'◉',color:'#7db5ff',description:'Make a private A/B choice, predict what the group will choose, then see whether your read was right.',rules:['Everyone privately picks A or B.','Before the reveal, predict the room’s majority.','Correct majority predictions earn points.']}
  ];
  let selectedGame = 'psych', deck = 'odd', remoteDeck = 'odd', mode = 'local', game = null, currentPlayerId = null, localAnswerIndex = 0, localVoteIndex = 0, localGate = false, pendingVotes = {}, onlineDraftText = '', onlineDraftTruth = true, onlineDraftVotes = {}, onlineDraftForm = {}, poller = null, remoteSession = null, targetFocus = -1;
  const usedPrompts = new Set();
  const savedSession = code => { try { return JSON.parse(localStorage.getItem(`testhem-room-${code}`) || 'null'); } catch { return null; } };
  const makeId = () => { if (globalThis.crypto?.randomUUID) return crypto.randomUUID(); const b = Array.from({length:16}, () => Math.floor(Math.random()*256)); b[6]=(b[6]&15)|64; b[8]=(b[8]&63)|128; const h=b.map(x=>x.toString(16).padStart(2,'0')).join(''); return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = msg => { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2600); };
  const overlayOpen = () => { $('#gameOverlay').classList.add('open'); $('#gameOverlay').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  function overlayClose() { $('#gameOverlay').classList.remove('open'); $('#gameOverlay').setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; clearInterval(poller); poller = null; }

  // Location permission is intentionally not requested: the sky follows device local time and IANA timezone.
  function updateClock() {
    const date = new Date(); const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'LOCAL TIME';
    const clock = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', timeZone: zone }).format(date);
    $('#localClock').textContent = clock;
    $('#timezone').textContent = zone.toUpperCase();
    const h = date.getHours(); let sky = 'night', label = 'NIGHT SIDE', icon = '☾';
    if (h >= 5 && h < 8) { sky = 'dawn'; label = 'FIRST LIGHT'; icon = '☼'; }
    else if (h >= 8 && h < 17) { sky = 'day'; label = 'DAY SIDE'; icon = '☀'; }
    else if (h >= 17 && h < 20) { sky = 'dusk'; label = 'LAST LIGHT'; icon = '☾'; }
    document.body.dataset.sky = sky; $('#skyMood').textContent = label; $('#skyIcon').textContent = icon;
  }
  updateClock(); setInterval(updateClock, 30000);

  // Each visit starts with a named host; the name is kept on this device for a personal welcome.
  let userName='';try{userName=(localStorage.getItem('testhem-player-name')||'').trim().slice(0,18);}catch{}
  let resumeRoomAfterIdentity=false;let names=userName?[userName]:[];
  function paintNames(){
    $('#playerList').innerHTML=names.map((n,i)=>`<span class="player-chip ${i===0?'host-chip':''}">${esc(n)}${i===0?'<small>YOU</small>':''}<button type="button" aria-label="Remove ${esc(n)}" data-remove="${i}" ${i===0?'disabled title="Your seat stays at the table"':''}>×</button></span>`).join('');
    $$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{if(Number(b.dataset.remove)===0)return;names.splice(Number(b.dataset.remove),1);paintNames();}));
  }
  function applyIdentity(){
    $('#visitorName').value=userName;$('#welcomeName').textContent=userName?`Welcome back, ${userName}.`:'Before you enter, tell us your name.';
    $('#observerName').textContent=userName?`${userName.toUpperCase()}’S ORBIT`:'OBSERVATORY 07';
    $('#identityHint').textContent=userName?`Saved on this device · ${userName} is player one for a local game.`:'Your name becomes player one when you start a local table.';
    $('#saveIdentity').innerHTML=userName?'UPDATE NAME <span>✓</span>':'SAVE NAME <span>↗</span>';
    $('#playNow').disabled=!userName;$('#onlineName').value=userName;
    $('#playerHint').textContent=userName?`${userName} is player one. Add at least one friend to start.`:'Save your name above first, then add a friend.';
    paintNames();
  }
  function saveIdentity(){
    const candidate=$('#visitorName').value.trim().slice(0,18);if(!candidate){if(userName){$('#visitorName').value=userName;return true;}$('#identityHint').textContent='Type a name first—your crew should know who invited them.';$('#visitorName').focus();return false;}
    const previous=userName;const others=names.filter((n,i)=>i!==0&&n.toLowerCase()!==previous.toLowerCase());if(others.some(n=>n.toLowerCase()===candidate.toLowerCase())){$('#identityHint').textContent='That name is already in the crew. Choose a different one.';return false;}
    userName=candidate;names=[userName,...others];try{localStorage.setItem('testhem-player-name',userName);}catch{}applyIdentity();if(resumeRoomAfterIdentity){resumeRoomAfterIdentity=false;setTimeout(()=>openSetup(),0);}return true;
  }
  applyIdentity();$('#saveIdentity').addEventListener('click',saveIdentity);$('#visitorName').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveIdentity();}});
  function addName(){const input=$('#playerName');const n=input.value.trim().slice(0,18);if(!n)return;if(names.length>=8)return $('#localError').textContent='Maximum 8 players for one device.';if(names.some(x=>x.toLowerCase()===n.toLowerCase()))return $('#localError').textContent='Give everyone a different name.';names.push(n);input.value='';$('#localError').textContent='';paintNames();$('#playerHint').textContent=`${names.length} players ready. Add names or start the game.`;}
  $('#addPlayer').addEventListener('click',addName);$('#playerName').addEventListener('keydown',e=>{if(e.key==='Enter')addName();});
  $$('.mode-tab').forEach(btn => btn.addEventListener('click', () => { $$('.mode-tab').forEach(b => b.classList.toggle('active', b === btn)); $$('.mode-panel').forEach(p => p.classList.toggle('active', p.id === `${btn.dataset.mode}Panel`)); mode = btn.dataset.mode; }));
  $$('.deck-option').forEach(btn => btn.addEventListener('click', () => { $$('.deck-option').forEach(b => b.classList.toggle('selected', b === btn)); deck = btn.dataset.deck; }));
  const portalElements=[]; let sceneSelectIndex=0;
  function openSetup(){if(!userName){resetWorld();if(!saveIdentity()){toast('Add your name first to save your seat.');return;}}else saveIdentity();$('#setupPanel').classList.add('open');$('#setupPanel').setAttribute('aria-hidden','false');setTimeout(()=>$(mode==='online'?'#onlineName':'#playerName').focus({preventScroll:true}),250);}
  function closeSetup(){$('#setupPanel').classList.remove('open');$('#setupPanel').setAttribute('aria-hidden','true');}
  function openGuide(){ $('#fieldGuide').classList.add('open');$('#fieldGuide').setAttribute('aria-hidden','false'); }
  function closeGuide(){ $('#fieldGuide').classList.remove('open');$('#fieldGuide').setAttribute('aria-hidden','true'); }
  function buildWorldLabels(){
    const host=$('#worldLabels');host.innerHTML=gameCatalog.map((m,i)=>`<button type="button" class="world-label" data-portal="${i}" style="--portal:${m.color}" aria-label="Select game ${i+1}: ${esc(m.title)}"><span class="label-number">0${i+1}</span><span class="label-name">${esc(m.title)}</span></button>`).join('');
    portalElements.push(...$$('[data-portal]',host));portalElements.forEach((el,i)=>el.addEventListener('click',()=>selectPortal(i)));
  }
  function selectPortal(index){
    sceneSelectIndex=(index+gameCatalog.length)%gameCatalog.length;const m=gameCatalog[sceneSelectIndex];selectedGame=m.key;
    // All seven games support online rooms, so keep the FAR APART tab whatever portal is picked.
    $('#focusIndex').textContent=`PORTAL ${String(sceneSelectIndex+1).padStart(2,'0')} / 07`;
    $('#focusGameKicker').textContent=m.kicker;$('#focusGameTitle').textContent=m.title;$('#setupGameTitle').textContent=m.title;
    $('#focusGameDescription').textContent=m.description;$('#focusRules').innerHTML=m.rules.map((r,i)=>`<div><b>0${i+1}</b> · ${esc(r)}</div>`).join('');
    $('#deckPicker').style.display=m.key==='psych'?'':'none';
    portalElements.forEach((e,i)=>e.classList.toggle('is-selected',i===sceneSelectIndex));
    $('#portalFocus').classList.add('visible');$('#welcomeHud').classList.add('quiet');
    $('#worldStatusText').textContent=`PORTAL ${String(sceneSelectIndex+1).padStart(2,'0')} SELECTED · PRESS ENTER OR CLICK ENTER THIS GAME`;
    targetFocus=sceneSelectIndex;focusPortal(sceneSelectIndex);
  }
  function resetWorld(){targetFocus=-1;resetCamera();portalElements.forEach(e=>e.classList.remove('is-selected'));$('#portalFocus').classList.remove('visible');$('#welcomeHud').classList.remove('quiet');$('#worldStatusText').textContent='7 GAMES IN ORBIT · CLICK A NAME OR CHOOSE A GAME';}
  buildWorldLabels();$('#portalFocus').classList.remove('visible');
  $('#playNow').addEventListener('click',()=>{if(saveIdentity())selectPortal(sceneSelectIndex);});
  $('#enterPortal').addEventListener('click',openSetup);$('#closeSetup').addEventListener('click',closeSetup);
  $('#chooseGame').addEventListener('click',openGuide);$('#helpOpen').addEventListener('click',openGuide);$('#helpClose').addEventListener('click',closeGuide);$('#returnView').addEventListener('click',resetWorld);
  $('#howToPlay').addEventListener('click',openGuide);
  $('#fieldGuide').addEventListener('click',e=>{if(e.target===$('#fieldGuide'))closeGuide();});
  $('#guideGrid').innerHTML=gameCatalog.map((m,i)=>`<article class="guide-game" style="--portal:${m.color}"><header><span class="guide-number">0${i+1}</span><b>${esc(m.title)}</b></header><small>${esc(m.description)}<br><br>${m.rules.map((r,n)=>`${n+1}. ${esc(r)}`).join('<br>')}</small><button class="guide-play" data-guide-play="${i}">PLAY THIS GAME <span>↗</span></button></article>`).join('');
  $$('[data-guide-play]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.guidePlay);if(!saveIdentity()){closeGuide();resetWorld();$('#visitorName').focus();toast('Add your name to save your seat first.');return;}closeGuide();selectPortal(i);openSetup();}));
  $('#playNow').setAttribute('aria-label','Select the first portal and open its game setup');
  $('#setupPanel').addEventListener('click',e=>{if(e.target===$('#setupPanel'))closeSetup();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSetup();closeGuide();closeGuestbook();}});
  const pickUnique = (key, list) => { let choices=list.filter(p=>!usedPrompts.has(`${key}:${p[1]}`)); if(!choices.length){list.forEach(p=>usedPrompts.delete(`${key}:${p[1]}`));choices=list;} const item=choices[Math.floor(Math.random()*choices.length)];usedPrompts.add(`${key}:${item[1]}`);return item; };
  const pickPrompt = d => pickUnique(d, decks[d] || decks.odd);
  function pickGamePrompt(type){
    if(type==='psych')return pickPrompt(deck);
    if(type==='wyr')return pickUnique('wyr',wouldYouRatherPrompts);
    if(type==='readRoom')return pickUnique('room',binaryRoomPrompts);
    if(type==='threeQ')return ['THREE QUESTIONS · ONE BLUFF','Answer three quick questions. One answer is made up.','Two honest answers, one convincing lie.'];
    if(type==='twoTruths')return ['TWO TRUTHS & A LIE','Write three short statements about yourself.','Two are true. One is a lie. Pick your lie privately.'];
    if(type==='hiddenTruth')return ['HIDDEN TRUTH','Write one harmless, real fact about yourself.','Keep it one sentence. Your crew will guess who wrote it.'];
    return ['QUESTION JAR','Draw a question, share a story—or pass.','The group will vote for the answer that surprised them most.'];
  }
  function remoteRoundData(type, deckChoice='odd'){
    const data={gameType:type,prompt:type==='psych'?pickPrompt(deckChoice):pickGamePrompt(type),deck:deckChoice};
    if(type==='threeQ')data.questionSet=threeQuestionSets[Math.floor(Math.random()*threeQuestionSets.length)];
    return data;
  }
  // The main CTA is wired to the spatial world picker above; no page-scroll navigation.
  $$('[data-demo]').forEach(btn => btn.addEventListener('click', () => {
    const guessed = btn.dataset.demo === 'true'; const result = $('#demoResult');
    $$('#demoActions button').forEach(b => { b.disabled = true; b.classList.toggle('picked', b === btn); });
    result.innerHTML = `<b>${guessed ? 'BLUFF. YOU CAUGHT IT.' : 'BLUFF. IT GOT YOU.'}</b><span>This sample was invented. In the real game, the story comes from your crew—which makes it much harder to tell.</span><button type="button" id="demoPlay">MAKE IT PERSONAL ↗</button>`;
    result.classList.add('visible'); $('#demoPlay').addEventListener('click', () => { $('#playNow').click(); openSetup(); });
  }));
  $('#startLocal').addEventListener('click', () => {
    if (names.length < 2) return $('#localError').textContent = 'Add at least one friend. The best lies need an audience.';
    usedPrompts.clear(); game = { mode: 'local', gameType:selectedGame, roomCode: 'LOCAL TABLE', hostId: 'local-host', stage: 'answer', round: 1, deck, prompt: pickGamePrompt(selectedGame), questionSet:selectedGame==='threeQ'?threeQuestionSets[Math.floor(Math.random()*threeQuestionSets.length)]:null, players: names.map((name, i) => ({ id: `p${i}-${makeId()}`, name, score: 0 })), submissions: [], votes: [] };
    localAnswerIndex = 0; localVoteIndex = 0; localGate = false; pendingVotes = {}; currentPlayerId = null; closeSetup(); overlayOpen(); render();
  });

  const requestExit = () => { if (game?.mode === 'local' && game.stage !== 'reveal' && (game.submissions.length || game.votes.length) && !confirm('Leave this game? Answers from this round will be lost.')) return; overlayClose(); };
  $('#exitGame').addEventListener('click', requestExit);
  $('#gameOverlay').addEventListener('click', e => { if (e.target === $('#gameOverlay')) requestExit(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#gameOverlay').classList.contains('open')) requestExit(); });

  function onlineError(msg) { $('#onlineError').textContent = msg; }
  const config = () => window.TESTHEM_CONFIG || {};
  const publicApiKey = () => config().supabasePublishableKey || config().supabaseAnonKey;
  if (config().supabaseUrl && publicApiKey()) $('#backendNote').textContent = 'ONLINE ROOMS CONNECTED · INVITES ARE PRIVATE LINKS';
  async function rpc(name, params) {
    const c = config(), apiKey = publicApiKey(); if (!c.supabaseUrl || !apiKey) throw new Error('Add the Supabase project URL and publishable key to config.js. Local games work without Supabase.');
    const headers = { apikey: apiKey, 'Content-Type': 'application/json' }; if (c.supabaseAnonKey) headers.Authorization = `Bearer ${c.supabaseAnonKey}`;
    const response = await fetch(`${String(c.supabaseUrl).trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '')}/rest/v1/rpc/${name}`, { method: 'POST', headers, body: JSON.stringify(params) });
    let body; try { body = await response.json(); } catch { body = null; }
    if (!response.ok) throw new Error(body?.message || body?.details || 'Could not reach the game room. Check the database setup and invite link.');
    return body;
  }
  let markWallReady=false;
  function openGuestbook(){
    $('#guestbookPanel').classList.add('open');$('#guestbookPanel').setAttribute('aria-hidden','false');
    if(!$('#markName').value)$('#markName').value=userName;
    loadMarkWall();setTimeout(()=>$('#markName').focus({preventScroll:true}),120);
  }
  function closeGuestbook(){$('#guestbookPanel').classList.remove('open');$('#guestbookPanel').setAttribute('aria-hidden','true');}
  function markVisitorId(){try{let id=localStorage.getItem('testhem-mark-visitor');if(!id){id=makeId();localStorage.setItem('testhem-mark-visitor',id);}return id;}catch{return makeId();}}
  function paintMarks(marks){
    const host=$('#guestbookList');host.replaceChildren();
    if(!marks.length){const empty=document.createElement('p');empty.className='empty-marks';empty.textContent='The bin is quiet. Leave the first mark if you like.';host.append(empty);return;}
    marks.forEach(mark=>{const card=document.createElement('article');card.className='mark-card';const top=document.createElement('div');top.className='mark-card-top';const name=document.createElement('strong');name.textContent=mark.display_name||'A friend';const date=document.createElement('time');const stamp=new Date(mark.created_at);date.textContent=Number.isNaN(stamp.getTime())?'JUST NOW':stamp.toLocaleString();top.append(name,date);const text=document.createElement('p');text.textContent=mark.mark||'';card.append(top,text);host.append(card);});
  }
  async function loadMarkWall(){
    markWallReady=false;$('#markSubmit').disabled=true;$('#markError').textContent='';
    if(!config().supabaseUrl||!publicApiKey()){$('#guestbookStatus').textContent='The wall is not connected yet. Games still work locally; add the Supabase URL/key and run the mark-wall migration to enable public marks.';$('#guestbookList').replaceChildren();return;}
    $('#guestbookStatus').textContent='FETCHING THE LATEST MARKS…';
    try{const data=await rpc('testhem_get_marks',{p_limit:40});const marks=Array.isArray(data?.marks)?data.marks:[];paintMarks(marks);markWallReady=true;$('#markSubmit').disabled=false;$('#guestbookStatus').textContent=`${marks.length} ${marks.length===1?'MARK':'MARKS'} FROM THE COMMUNITY`;}
    catch(e){$('#guestbookStatus').textContent='THE WALL IS NOT READY';$('#markError').textContent=`${e.message} Run supabase-schema.sql in the Supabase SQL Editor to install the rooms and mark wall.`;$('#guestbookList').replaceChildren();}
  }
  $('#guestbookOpen').addEventListener('click',openGuestbook);$('#guestbookClose').addEventListener('click',closeGuestbook);
  $('#guestbookPanel').addEventListener('click',e=>{if(e.target===$('#guestbookPanel'))closeGuestbook();});
  $('#markForm').addEventListener('submit',async e=>{
    e.preventDefault();$('#markError').textContent='';
    if(!markWallReady)return $('#markError').textContent='The mark wall is not connected. Check the Supabase setup instructions.';
    if(!$('#markConsent').checked)return $('#markError').textContent='Please confirm your name and mark can be shown publicly.';
    const name=$('#markName').value.trim().slice(0,24),mark=$('#markText').value.trim().slice(0,180),website=$('#markWebsite').value.trim();
    if(!name||!mark)return $('#markError').textContent='Add a display name and a short mark first.';
    const submit=$('#markSubmit');submit.disabled=true;submit.textContent='DROPPING YOUR MARK…';
    try{await rpc('testhem_leave_mark',{p_visitor_id:markVisitorId(),p_display_name:name,p_mark:mark,p_consent:true,p_website:website});$('#markText').value='';$('#markConsent').checked=false;await loadMarkWall();$('#guestbookStatus').textContent='YOUR MARK IS ON THE WALL · THANK YOU';}
    catch(err){$('#markError').textContent=err.message;}
    finally{submit.innerHTML='DROP MY MARK <span>↗</span>';submit.disabled=!markWallReady;}
  });
  function parseInvite(value) {
    const raw = value.trim();
    if (!raw) return null;
    try {
      if (/^https?:/i.test(raw)) { const u = new URL(raw); const q = new URLSearchParams(u.hash.replace(/^#/, '')); return { code: q.get('join') || '', key: q.get('key') || '' }; }
    } catch {}
    const match = raw.match(/^([A-Z0-9]{6})\s*[|\s]\s*([0-9a-f-]{30,})$/i);
    if (match) return { code: match[1].toUpperCase(), key: match[2] };
    return { code: raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6), key: '' };
  }
  function cacheRoom(session) { localStorage.setItem(`testhem-room-${session.code}`, JSON.stringify(session)); }
  function setRemoteRoom(session, state) { closeSetup(); remoteSession = session; currentPlayerId = session.playerId; remoteFails = 0; remoteDeck = state.deck || 'odd'; selectedGame = state.gameType || 'psych'; $('#setupGameTitle').textContent = gameCatalog.find(m=>m.key===selectedGame)?.title || 'Psych! The Truth Bluff'; onlineDraftText = ''; onlineDraftTruth = true; onlineDraftVotes = {}; onlineDraftForm = {}; game = { ...state, mode: 'online' }; overlayOpen(); render(); clearInterval(poller); poller = setInterval(loadRemote, 1800); }
  let remoteFails = 0;
  const MAX_REMOTE_FAILS = 8;
  async function loadRemote() {
    if (!remoteSession) return;
    try { const view = await rpc('testhem_get_room', { p_code: remoteSession.code, p_room_key: remoteSession.key, p_player_id: remoteSession.playerId }); remoteFails = 0; const next = { ...view, mode: 'online' }; if (JSON.stringify(next) !== JSON.stringify(game)) { game = next; render(); } }
    catch (e) {
      remoteFails++;
      if (remoteFails >= MAX_REMOTE_FAILS) {
        // The room kept failing for ~15s: stop hammering the server and offer a clean exit.
        clearInterval(poller); poller = null;
        $('#gameContent').innerHTML = `<div class="online-wait"><strong>SIGNAL LOST</strong>${esc(e.message)} The room may have ended or your connection dropped.</div><div class="game-actions"><button class="button-secondary" id="retryRemote">TRY RECONNECTING <span>↗</span></button><button class="button-secondary" id="leaveDeadRoom">LEAVE ROOM</button></div>`;
        $('#retryRemote').addEventListener('click', () => { remoteFails = 0; clearInterval(poller); poller = setInterval(loadRemote, 1800); toast('Trying the room again…'); loadRemote(); });
        $('#leaveDeadRoom').addEventListener('click', () => { remoteSession = null; game = null; overlayClose(); history.replaceState(null, '', location.pathname + location.search); });
        return;
      }
      $('#gameContent').innerHTML = `<div class="online-wait"><strong>RECONNECTING TO THE ROOM</strong>${esc(e.message)} Retrying automatically… (${remoteFails}/${MAX_REMOTE_FAILS})</div>`;
    }
  }
  async function onlineAction(action, data = {}) {
    if (!remoteSession) return;
    try { const view = await rpc('testhem_game_action', { p_code: remoteSession.code, p_room_key: remoteSession.key, p_player_id: remoteSession.playerId, p_action: action, p_data: data }); if (action === 'submit') { onlineDraftText = ''; onlineDraftTruth = true; onlineDraftForm = {}; } if (action === 'vote') onlineDraftVotes = {}; game = { ...view, mode: 'online' }; render(); }
    catch (e) { toast(e.message); }
  }
  async function createOnline() {
    onlineError(''); const name = $('#onlineName').value.trim().slice(0, 18); if (!name) return onlineError('Choose a player name first.');
    const id = makeId();
    try {
      const out = await rpc('testhem_create_room', { p_host_id: id, p_host_name: name });
      const session = { code: out.code, key: out.key, playerId: id, name, host: true }; cacheRoom(session);
      const joinHash = `#join=${encodeURIComponent(out.code)}&key=${encodeURIComponent(out.key)}`; history.replaceState(null, '', location.pathname + location.search + joinHash);
      const state = await rpc('testhem_set_room_game', { p_code: out.code, p_room_key: out.key, p_player_id: id, p_game_type: selectedGame });
      setRemoteRoom(session, state);
    } catch (e) { onlineError(e.message); }
  }
  async function joinOnline() {
    onlineError(''); const invite = parseInvite($('#roomInvite').value); const name = $('#onlineName').value.trim().slice(0, 18);
    if (!name) return onlineError('Enter your name above first.'); if (!invite?.code) return onlineError('Paste a room invite link or code.');
    let key = invite.key;
    const old = savedSession(invite.code); if (!key && old?.key) key = old.key;
    if (!key) return onlineError('Paste the full private invite link—not only the six-letter code.');
    const id = old?.playerId || makeId();
    try {
      const state = await rpc('testhem_join_room', { p_code: invite.code, p_room_key: key, p_player_id: id, p_player_name: name });
      const session = { code: invite.code, key, playerId: id, name, host: false }; cacheRoom(session);
      history.replaceState(null, '', location.pathname + location.search + `#join=${encodeURIComponent(invite.code)}&key=${encodeURIComponent(key)}`);
      setRemoteRoom(session, state);
    } catch (e) { onlineError(e.message); }
  }
  $('#createOnline').addEventListener('click', createOnline); $('#joinOnline').addEventListener('click', joinOnline);
  $('#roomInvite').addEventListener('keydown', e => { if (e.key === 'Enter') joinOnline(); });

  function promptMarkup() { const [tag, q, hint] = game.prompt || ['PROMPT', 'Tell a story.', 'Truth or bluff.']; return `<div class="game-prompt"><small>${esc(tag)} · ROUND ${game.round || 1}</small><strong>${esc(q)}</strong><em>${esc(hint)}</em></div>`; }
  function render() {
    if (!game) return;
    $('#roundLabel').textContent = `ROUND ${game.round || 1}`;
    $('#roomCodeLabel').textContent = game.mode === 'online' ? `ROOM ${game.roomCode}` : 'PASS THE DEVICE';
    const content = $('#gameContent');
    if (game.mode === 'online') return renderOnline(content);
    if (game.stage === 'answer') return renderLocalAnswer(content);
    if (game.stage === 'vote') return renderLocalVote(content);
    if (game.stage === 'reveal') return renderReveal(content);
  }
  function renderLocalAnswer(root) {
    if(game.gameType && game.gameType!=='psych') return renderOtherLocalAnswer(root);
    const players = game.players; const p = players[localAnswerIndex];
    if (!p) { beginLocalVote(); return; }
    const mine = game.submissions.some(s => s.player_id === p.id);
    if (mine) { localAnswerIndex++; return renderLocalAnswer(root); }
    if (!localGate) {
      root.innerHTML = `<div class="pass-screen"><span class="pass-lock">◈</span><span class="game-eyebrow">HIDE THE SCREEN · PASS THE DEVICE</span><h2>Pass to ${esc(p.name)}.</h2><p class="game-sub">Only ${esc(p.name)} should read their answer. Everyone else, respectfully look at literally anything else.</p><button class="button-primary" id="readyTurn">I'M ${esc(p.name.toUpperCase())} <span>↗</span></button><div class="progress-rail"><i style="width:${localAnswerIndex / players.length * 100}%"></i></div><div class="progress-label">ANSWER ${localAnswerIndex + 1} OF ${players.length}</div></div>`;
      $('#readyTurn').addEventListener('click', () => { localGate = true; renderLocalAnswer(root); }); return;
    }
    root.innerHTML = `<div class="game-eyebrow">${game.deck === 'deep' ? 'DEEP ORBIT · PASS ANYTIME' : 'WRITE YOUR ANSWER IN SECRET'}</div><h2>${esc(p.name)}, truth or bluff?</h2><p class="game-sub">Answer the prompt honestly—or make something up that your friends will believe. Nobody sees who wrote what until the reveal.</p>${promptMarkup()}<div class="game-form"><textarea id="answerText" maxlength="180" placeholder="Your answer (keep it under 180 characters)..."></textarea><div class="truth-choice"><button class="chosen" data-truth="true">✦ &nbsp;THIS IS TRUE</button><button data-truth="false">⌁ &nbsp;I MADE IT UP</button></div><div class="game-actions"><button class="button-primary" id="submitLocalAnswer">LOCK IT IN <span>↗</span></button><button class="button-secondary" id="skipLocal">PASS THIS ONE</button></div></div>`;
    let truth = true; $$('.truth-choice button', root).forEach(b => b.addEventListener('click', () => { $$('.truth-choice button', root).forEach(x => x.classList.remove('chosen')); b.classList.add('chosen'); truth = b.dataset.truth === 'true'; }));
    $('#submitLocalAnswer').addEventListener('click', () => { const text = $('#answerText').value.trim(); if (text.length < 3) return toast('A few words is enough.'); game.submissions.push({ id: makeId(), player_id: p.id, text, is_truth: truth, is_pass: false }); nextLocalAnswer(); });
    $('#skipLocal').addEventListener('click', () => { game.submissions.push({ id: makeId(), player_id: p.id, text: '', is_truth: false, is_pass: true }); nextLocalAnswer(); });
    $('#answerText').focus({ preventScroll: true });
  }
  function renderOtherLocalAnswer(root) {
    const p=game.players[localAnswerIndex]; if(!p){beginLocalVote();return;}
    if(game.submissions.some(s=>s.player_id===p.id)){localAnswerIndex++;return renderOtherLocalAnswer(root);}
    if(!localGate){root.innerHTML=`<div class="pass-screen"><span class="pass-lock">◈</span><span class="game-eyebrow">PRIVATE TURN · KEEP THE SCREEN CLOSE</span><h2>Pass to ${esc(p.name)}.</h2><p class="game-sub">The next screen is just for you. Everyone else: eyes off, curiosity later.</p><button class="button-primary" id="readyTurn">I'M ${esc(p.name.toUpperCase())} <span>↗</span></button><div class="progress-label" style="margin-top:15px">PLAYER ${localAnswerIndex+1} OF ${game.players.length}</div></div>`;$('#readyTurn').addEventListener('click',()=>{localGate=true;renderOtherLocalAnswer(root);});return;}
    const type=game.gameType;
    if(type==='twoTruths'||type==='threeQ'){
      const prompts=type==='threeQ'?game.questionSet:['Statement one','Statement two','Statement three'];
      root.innerHTML=`<div class="game-eyebrow">${type==='twoTruths'?'TWO TRUTHS & A LIE':'THREE QUESTIONS · ONE BLUFF'}</div><h2>${esc(p.name)}, write three.</h2><p class="game-sub">${type==='twoTruths'?'Enter three statements: two true, one lie.':'Answer all three questions honestly except one answer you invent.'} Pick which one is fake before you lock it in.</p><div class="statement-list">${prompts.map((q,i)=>`<div class="statement-entry"><label><span>0${i+1}</span>${esc(q)}</label><textarea data-statement="${i}" maxlength="150" placeholder="${type==='twoTruths'?'Write a short statement...':'Your answer...'}"></textarea><button type="button" class="lie-select" data-lie="${i}">⌁ &nbsp;THIS ONE IS THE LIE</button></div>`).join('')}</div><div class="game-actions"><button class="button-primary" id="submitSet">LOCK MY THREE <span>↗</span></button><button class="button-secondary" id="skipSet">PASS THIS ROUND</button></div>`;
      let lieIndex=null;$$('[data-lie]',root).forEach(b=>b.addEventListener('click',()=>{$$('[data-lie]',root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');lieIndex=Number(b.dataset.lie);}));
      $('#submitSet').addEventListener('click',()=>{const items=$$('[data-statement]',root).map(x=>x.value.trim());if(items.some(x=>x.length<2))return toast('Fill all three with a few words.');if(lieIndex===null)return toast('Mark which one is the lie.');game.submissions.push({id:makeId(),player_id:p.id,items,lie_index:lieIndex,is_pass:false});nextLocalAnswer();});
      $('#skipSet').addEventListener('click',()=>{game.submissions.push({id:makeId(),player_id:p.id,is_pass:true});nextLocalAnswer();});$('[data-statement="0"]',root)?.focus({preventScroll:true});return;
    }
    if(type==='wyr'){
      const [tag,q,hint,a,b]=game.prompt;root.innerHTML=`<div class="game-eyebrow">WOULD YOU RATHER? · YOUR PICK IS SECRET</div><h2>${esc(p.name)}, choose your fate.</h2>${promptMarkup()}<div class="choice-pair"><button data-choice="A"><b>A</b><span>${esc(a)}</span></button><button data-choice="B"><b>B</b><span>${esc(b)}</span></button></div><label class="reason-label">SELL YOUR CHOICE IN ONE LINE</label><textarea class="game-textarea" id="choiceReason" maxlength="120" placeholder="Why is this obviously the better option?"></textarea><div class="game-actions"><button class="button-primary" id="submitChoice">SEAL MY PICK <span>↗</span></button><button class="button-secondary" id="skipChoice">PASS</button></div>`;
      let choice='';$$('[data-choice]',root).forEach(b=>b.addEventListener('click',()=>{$$('[data-choice]',root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');choice=b.dataset.choice;}));
      $('#submitChoice').addEventListener('click',()=>{const text=$('#choiceReason').value.trim();if(!choice)return toast('Pick A or B.');if(text.length<2)return toast('Give your friends a reason to doubt you.');game.submissions.push({id:makeId(),player_id:p.id,choice,text});nextLocalAnswer();});$('#skipChoice').addEventListener('click',()=>{game.submissions.push({id:makeId(),player_id:p.id,is_pass:true});nextLocalAnswer();});return;
    }
    if(type==='readRoom'){
      const [tag,q,hint,a,b]=game.prompt;root.innerHTML=`<div class="game-eyebrow">READ THE ROOM · PRIVATE PICK</div><h2>${esc(p.name)}, what’s your answer?</h2>${promptMarkup()}<div class="choice-pair"><button data-choice="A"><b>A</b><span>${esc(a)}</span></button><button data-choice="B"><b>B</b><span>${esc(b)}</span></button></div><div class="game-actions"><button class="button-primary" id="submitChoice">LOCK MY PICK <span>↗</span></button><button class="button-secondary" id="skipChoice">PASS</button></div>`;
      let choice='';$$('[data-choice]',root).forEach(b=>b.addEventListener('click',()=>{$$('[data-choice]',root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');choice=b.dataset.choice;}));$('#submitChoice').addEventListener('click',()=>{if(!choice)return toast('Pick A or B.');game.submissions.push({id:makeId(),player_id:p.id,choice});nextLocalAnswer();});$('#skipChoice').addEventListener('click',()=>{game.submissions.push({id:makeId(),player_id:p.id,is_pass:true});nextLocalAnswer();});return;
    }
    if(type==='hiddenTruth'){
      root.innerHTML=`<div class="game-eyebrow">HIDDEN TRUTH · ONE SENTENCE, NO NAMES</div><h2>${esc(p.name)}, leave one real clue.</h2>${promptMarkup()}<div class="game-form"><textarea id="hiddenFact" maxlength="150" placeholder="A harmless fact your friends might not know..."></textarea><div class="game-actions"><button class="button-primary" id="submitFact">SEAL THE FACT <span>↗</span></button><button class="button-secondary" id="skipFact">PASS</button></div></div>`;
      $('#submitFact').addEventListener('click',()=>{const text=$('#hiddenFact').value.trim();if(text.length<4)return toast('A few words is enough.');game.submissions.push({id:makeId(),player_id:p.id,text,is_pass:false});nextLocalAnswer();});$('#skipFact').addEventListener('click',()=>{game.submissions.push({id:makeId(),player_id:p.id,is_pass:true});nextLocalAnswer();});$('#hiddenFact').focus({preventScroll:true});return;
    }
    if(type==='questionJar'){
      game.jarQuestions=game.jarQuestions||{};if(!game.jarQuestions[p.id]){const used=Object.values(game.jarQuestions);const choices=jarPrompts.filter(q=>!used.includes(q));game.jarQuestions[p.id]=(choices.length?choices:jarPrompts)[Math.floor(Math.random()*(choices.length||jarPrompts.length))];}
      const q=game.jarQuestions[p.id];root.innerHTML=`<div class="game-eyebrow">QUESTION JAR · DRAWN FOR ${esc(p.name.toUpperCase())}</div><h2>Answer, pass, or spin.</h2><div class="game-prompt"><small>YOUR QUESTION</small><strong>${esc(q)}</strong><em>Share only what feels good. You can pass without explaining.</em></div><div class="game-form"><textarea id="jarAnswer" maxlength="180" placeholder="Your answer (or pass)..."></textarea><div class="game-actions"><button class="button-primary" id="submitJar">DROP IT IN <span>↗</span></button><button class="button-secondary" id="skipJar">PASS THIS QUESTION</button></div></div>`;
      $('#submitJar').addEventListener('click',()=>{const text=$('#jarAnswer').value.trim();if(text.length<2)return toast('Write a few words, or pass.');game.submissions.push({id:makeId(),player_id:p.id,question:q,text,is_pass:false});nextLocalAnswer();});$('#skipJar').addEventListener('click',()=>{game.submissions.push({id:makeId(),player_id:p.id,question:q,is_pass:true});nextLocalAnswer();});$('#jarAnswer').focus({preventScroll:true});return;
    }
  }
  function nextLocalAnswer() { localAnswerIndex++; localGate = false; if (localAnswerIndex >= game.players.length) beginLocalVote(); else render(); }
  function beginLocalVote() { game.stage = 'vote'; localVoteIndex = 0; localGate = false; pendingVotes = {}; if (game.submissions.filter(s => !s.is_pass).length === 0) game.stage = 'reveal'; render(); }
  function renderLocalVote(root) {
    if(game.gameType && game.gameType!=='psych') return renderOtherLocalVote(root);
    const active = game.players.filter(p => !game.votes.some(v => v.voter_id === p.id));
    const p = active[0];
    if (!p) { game.stage = 'reveal'; return renderReveal(root); }
    const targets = game.submissions.filter(s => !s.is_pass && s.player_id !== p.id);
    if (!targets.length) { game.votes.push({ voter_id: p.id, submission_id: null, guess_truth: false, no_op: true }); return renderLocalVote(root); }
    if (!localGate) {
      root.innerHTML = `<div class="pass-screen"><span class="pass-lock">◉</span><span class="game-eyebrow">ANSWERS ARE IN · VOTING TIME</span><h2>Pass to ${esc(p.name)}.</h2><p class="game-sub">Guess whether each answer is real or bluff. Your own answer is hidden from the pile and cannot be voted on.</p><button class="button-primary" id="readyVote">I'M ${esc(p.name.toUpperCase())} <span>↗</span></button><div class="progress-label" style="margin-top:15px">${new Set(game.votes.map(v => v.voter_id)).size} OF ${game.players.length} BALLOTS COMPLETE</div></div>`;
      $('#readyVote').addEventListener('click', () => { localGate = true; renderLocalVote(root); }); return;
    }
    if (!targets.length) { game.stage = 'reveal'; return renderReveal(root); }
    root.innerHTML = `<div class="game-eyebrow">${esc(p.name.toUpperCase())} IS ON THE CASE</div><h2>Which answers are real?</h2><p class="game-sub">Mark every answer from your friends. You'll score for reading them right; they score for fooling you.</p><div class="answer-grid">${targets.map((s, i) => `<article class="answer-card" data-vote-card="${esc(s.id)}"><p>${esc(s.text)}</p><span class="anonymous">TRANSMISSION ${String(i + 1).padStart(2, '0')}</span><div class="vote-control"><button data-guess="true">✦ REAL</button><button data-guess="false">⌁ BLUFF</button></div></article>`).join('')}</div><div class="game-actions"><button class="button-primary" id="submitLocalVotes">LOCK MY GUESSES <span>↗</span></button></div>`;
    $$('[data-vote-card]', root).forEach(card => $$('[data-guess]', card).forEach(b => b.addEventListener('click', () => { $$('[data-guess]', card).forEach(x => x.classList.remove('selected', 'real', 'bluff')); b.classList.add('selected', b.dataset.guess === 'true' ? 'real' : 'bluff'); pendingVotes[card.dataset.voteCard] = b.dataset.guess === 'true'; })));
    $('#submitLocalVotes').addEventListener('click', () => { if (targets.some(s => pendingVotes[s.id] === undefined)) return toast('Mark every answer—or skip this ballot.'); targets.forEach(s => game.votes.push({ voter_id: p.id, submission_id: s.id, guess_truth: pendingVotes[s.id] })); pendingVotes = {}; localGate = false; render(); });
  }
  function renderOtherLocalVote(root) {
    const p=game.players.find(x=>!game.votes.some(v=>v.voter_id===x.id));if(!p){game.stage='reveal';return renderReveal(root);}
    const type=game.gameType,targets=game.submissions.filter(s=>!s.is_pass&&s.player_id!==p.id);
    if(type==='readRoom'){
      const [tag,q,hint,a,b]=game.prompt;if(!localGate){root.innerHTML=`<div class="pass-screen"><span class="pass-lock">◉</span><span class="game-eyebrow">PREDICT THE MAJORITY</span><h2>Pass to ${esc(p.name)}.</h2><p class="game-sub">The crew has locked in private answers. Guess which option got the most votes.</p><button class="button-primary" id="readyVote">I'M ${esc(p.name.toUpperCase())} <span>↗</span></button></div>`;$('#readyVote').addEventListener('click',()=>{localGate=true;renderOtherLocalVote(root);});return;}
      root.innerHTML=`<div class="game-eyebrow">READ THE ROOM · YOUR GUESS</div><h2>What did the room choose?</h2><div class="choice-pair"><button data-majority="A"><b>A</b><span>${esc(a)}</span></button><button data-majority="B"><b>B</b><span>${esc(b)}</span></button></div><div class="game-actions"><button class="button-primary" id="submitMajority">LOCK MY PREDICTION <span>↗</span></button></div>`;let guess='';$$('[data-majority]',root).forEach(b=>b.addEventListener('click',()=>{$$('[data-majority]',root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');guess=b.dataset.majority;}));$('#submitMajority').addEventListener('click',()=>{if(!guess)return toast('Pick the side you think won.');game.votes.push({voter_id:p.id,guess_majority:guess});localGate=false;render();});return;
    }
    if(!targets.length){game.votes.push({voter_id:p.id,no_op:true});return renderOtherLocalVote(root);}
    if(!localGate){root.innerHTML=`<div class="pass-screen"><span class="pass-lock">◈</span><span class="game-eyebrow">PRIVATE VOTE · PASS THE DEVICE</span><h2>Pass to ${esc(p.name)}.</h2><p class="game-sub">Your answer is not in your own voting pile. Make your picks quietly, then lock them in.</p><button class="button-primary" id="readyVote">I'M ${esc(p.name.toUpperCase())} <span>↗</span></button></div>`;$('#readyVote').addEventListener('click',()=>{localGate=true;renderOtherLocalVote(root);});return;}
    if(type==='twoTruths'||type==='threeQ'){
      root.innerHTML=`<div class="game-eyebrow">${type==='twoTruths'?'TWO TRUTHS & A LIE':'THREE QUESTIONS'}</div><h2>Find each player’s lie.</h2><p class="game-sub">Choose one of their three lines. You get a point for each lie you spot.</p><div class="answer-grid">${targets.map((s,si)=>`<article class="answer-card" data-lie-card="${s.id}"><small class="anonymous">PLAYER ${String(si+1).padStart(2,'0')} · WHICH IS FAKE?</small>${s.items.map((t,i)=>`<button class="statement-vote" data-lie-guess="${i}" data-sub="${s.id}"><b>0${i+1}</b><span>${esc(t)}</span></button>`).join('')}</article>`).join('')}</div><div class="game-actions"><button class="button-primary" id="submitLieVotes">LOCK MY GUESSES <span>↗</span></button></div>`;
      const picks={};$$('[data-lie-guess]',root).forEach(b=>b.addEventListener('click',()=>{const sid=b.dataset.sub;$$(`[data-sub="${sid}"]`,root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');picks[sid]=Number(b.dataset.lieGuess);}));$('#submitLieVotes').addEventListener('click',()=>{if(targets.some(s=>picks[s.id]===undefined))return toast('Pick one lie for each friend.');targets.forEach(s=>game.votes.push({voter_id:p.id,submission_id:s.id,guess_index:picks[s.id]}));localGate=false;render();});return;
    }
    if(type==='wyr'){
      const a=game.prompt[3],b=game.prompt[4];root.innerHTML=`<div class="game-eyebrow">WOULD YOU RATHER? · READ YOUR FRIENDS</div><h2>What did each person choose?</h2><p class="game-sub">Read their reason. Guess the option they picked.</p><div class="answer-grid">${targets.map((s,i)=>`<article class="answer-card" data-choice-card="${s.id}"><p>“${esc(s.text)}”</p><small class="anonymous">PLAYER ${String(i+1).padStart(2,'0')}</small><div class="vote-control"><button data-wyr-guess="A" data-sub="${s.id}">A · ${esc(a)}</button><button data-wyr-guess="B" data-sub="${s.id}">B · ${esc(b)}</button></div></article>`).join('')}</div><div class="game-actions"><button class="button-primary" id="submitWyrVotes">LOCK MY GUESSES <span>↗</span></button></div>`;const picks={};$$('[data-wyr-guess]',root).forEach(b=>b.addEventListener('click',()=>{const sid=b.dataset.sub;$$(`[data-sub="${sid}"]`,root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');picks[sid]=b.dataset.wyrGuess;}));$('#submitWyrVotes').addEventListener('click',()=>{if(targets.some(s=>picks[s.id]===undefined))return toast('Predict every friend’s pick.');targets.forEach(s=>game.votes.push({voter_id:p.id,submission_id:s.id,guess_choice:picks[s.id]}));localGate=false;render();});return;
    }
    if(type==='hiddenTruth'){
      root.innerHTML=`<div class="game-eyebrow">HIDDEN TRUTH · WHO SAID IT?</div><h2>Match each fact to a friend.</h2><p class="game-sub">A fact can only have one author. No self-votes.</p><div class="answer-grid">${targets.map((s,i)=>`<article class="answer-card" data-owner-card="${s.id}"><p>“${esc(s.text)}”</p><small class="anonymous">FACT ${String(i+1).padStart(2,'0')} · PICK THE AUTHOR</small><select class="author-pick" data-owner-pick="${s.id}"><option value="">Choose a friend…</option>${game.players.filter(x=>x.id!==p.id).map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></article>`).join('')}</div><div class="game-actions"><button class="button-primary" id="submitAuthorVotes">LOCK MY MATCHES <span>↗</span></button></div>`;$('#submitAuthorVotes').addEventListener('click',()=>{const picks=$$('[data-owner-pick]',root);if(picks.some(x=>!x.value))return toast('Match every fact to a friend.');targets.forEach(s=>game.votes.push({voter_id:p.id,submission_id:s.id,guess_player_id:$(`[data-owner-pick="${s.id}"]`,root).value}));localGate=false;render();});return;
    }
    if(type==='questionJar'){
      root.innerHTML=`<div class="game-eyebrow">QUESTION JAR · VOTE FOR THE SURPRISE</div><h2>Which answer stayed with you?</h2><p class="game-sub">Vote for one friend’s response. No vote on your own answer.</p><div class="answer-grid">${targets.map((s,i)=>`<button class="answer-card jar-vote" data-jar-vote="${s.id}"><small class="anonymous">${esc(s.question||'QUESTION')} · PLAYER ${String(i+1).padStart(2,'0')}</small><p>${esc(s.text)}</p><span class="vote-hint">✳ &nbsp;I’M VOTING FOR THIS STORY</span></button>`).join('')}</div><div class="game-actions"><button class="button-primary" id="submitJarVote">LOCK MY VOTE <span>↗</span></button></div>`;let chosen='';$$('[data-jar-vote]',root).forEach(b=>b.addEventListener('click',()=>{$$('[data-jar-vote]',root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');chosen=b.dataset.jarVote;}));$('#submitJarVote').addEventListener('click',()=>{if(!chosen)return toast('Pick the story you want to hear more about.');game.votes.push({voter_id:p.id,submission_id:chosen});localGate=false;render();});return;
    }
  }
  function revealData() {
    const pts=Object.fromEntries(game.players.map(p=>[p.id,0])); const type=game.gameType||'psych';
    const add=(id,n=1)=>{if(id)pts[id]=(pts[id]||0)+n;};
    if(type==='psych'){game.votes.forEach(v=>{const s=game.submissions.find(x=>x.id===v.submission_id);if(!s)return;if(v.guess_truth===s.is_truth)add(v.voter_id);if(!s.is_truth&&v.guess_truth)add(s.player_id);});}
    else if(type==='twoTruths'||type==='threeQ'){game.votes.forEach(v=>{const s=game.submissions.find(x=>x.id===v.submission_id);if(!s)return;if(v.guess_index===s.lie_index)add(v.voter_id);else add(s.player_id);});}
    else if(type==='wyr'){game.votes.forEach(v=>{const s=game.submissions.find(x=>x.id===v.submission_id);if(s&&v.guess_choice===s.choice)add(v.voter_id);});}
    else if(type==='hiddenTruth'){game.votes.forEach(v=>{const s=game.submissions.find(x=>x.id===v.submission_id);if(!s)return;if(v.guess_player_id===s.player_id)add(v.voter_id);else add(s.player_id);});}
    else if(type==='readRoom'){const active=game.submissions.filter(s=>!s.is_pass);const a=active.filter(s=>s.choice==='A').length,b=active.filter(s=>s.choice==='B').length;const majority=a===b?null:(a>b?'A':'B');if(majority)game.votes.forEach(v=>{if(v.guess_majority===majority)add(v.voter_id);});}
    else if(type==='questionJar'){const counts={};game.votes.forEach(v=>{if(v.submission_id)counts[v.submission_id]=(counts[v.submission_id]||0)+1;});const max=Math.max(0,...Object.values(counts));if(max>0)Object.entries(counts).filter(([,n])=>n===max).forEach(([id])=>{const s=game.submissions.find(x=>x.id===id);if(s)add(s.player_id,2);});}
    return pts;
  }
  async function makeResultImage(points, board){
    const W=1200,H=630,canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d');
    const rounded=(x,y,w,h,r)=>{if(ctx.roundRect){ctx.roundRect(x,y,w,h,r);return;}ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();};
    const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#030813');bg.addColorStop(.57,'#0b1a2d');bg.addColorStop(1,'#06101c');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    const halo=ctx.createRadialGradient(955,305,8,955,305,340);halo.addColorStop(0,'rgba(78,133,161,.28)');halo.addColorStop(1,'rgba(3,8,19,0)');ctx.fillStyle=halo;ctx.fillRect(560,0,640,H);
    // quiet stars and the seven colored orbit-portals
    let seed=707;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    for(let i=0;i<140;i++){const x=rand()*W,y=rand()*H,r=.5+rand()*1.5;ctx.fillStyle=`rgba(205,225,245,${.15+rand()*.45})`;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
    ctx.save();ctx.translate(950,320);ctx.rotate(-.26);ctx.strokeStyle='rgba(136,234,255,.22)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,225,126,0,0,Math.PI*2);ctx.stroke();ctx.rotate(.83);ctx.strokeStyle='rgba(214,255,120,.16)';ctx.beginPath();ctx.ellipse(0,0,191,148,0,0,Math.PI*2);ctx.stroke();ctx.restore();
    const portalColors=['#8deaff','#d2ff73','#ffc886','#d4a8ff','#8de0b9','#f99bcf','#7db5ff'];
    const portalAngles=[-2.85,-2.0,-1.1,-.2,.7,1.6,2.5];
    portalAngles.forEach((a,i)=>{const x=950+Math.cos(a)*205,y=320+Math.sin(a)*112;ctx.shadowColor=portalColors[i];ctx.shadowBlur=15;ctx.strokeStyle=portalColors[i];ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle=portalColors[i];ctx.globalAlpha=.75;ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;});
    ctx.shadowColor='#d6ff78';ctx.shadowBlur=30;ctx.fillStyle='#e8ffae';ctx.beginPath();for(let i=0;i<16;i++){const a=-Math.PI/2+i*Math.PI/8,r=i%2===0?35:15;const x=950+Math.cos(a)*r,y=320+Math.sin(a)*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(196,220,249,.2)';ctx.lineWidth=1;ctx.beginPath();rounded(28,28,W-56,H-56,24);ctx.stroke();
    ctx.fillStyle='#d6ff78';ctx.font='bold 30px Arial,sans-serif';ctx.fillText('✳',75,85);ctx.fillStyle='#f2f6fd';ctx.font='700 30px Arial,sans-serif';ctx.fillText('testhem',116,82);ctx.fillStyle='#93a9c1';ctx.font='14px monospace';ctx.fillText('THE CREW SCORECARD',80,122);
    const title=gameCatalog.find(m=>m.key===(game.gameType||'psych'))?.title||'Game night';ctx.fillStyle='#eef4ff';ctx.font='700 42px Arial,sans-serif';ctx.fillText('ROUND RECAP',78,180);ctx.fillStyle='#d6ff78';ctx.font='600 21px Arial,sans-serif';ctx.fillText(title,80,211);ctx.fillStyle='#8da3bc';ctx.font='14px monospace';ctx.fillText(`ROUND ${game.round||1}  ·  ${board.length} PLAYERS`,80,239);
    const rows=board.slice(0,8),rowY=269,rowH=37;
    rows.forEach((p,i)=>{const y=rowY+i*rowH;ctx.fillStyle=i===0?'rgba(214,255,120,.12)':'rgba(225,238,255,.055)';ctx.beginPath();rounded(78,y,618,31,8);ctx.fill();ctx.fillStyle=i===0?'#d6ff78':'#90a4bb';ctx.font='bold 13px monospace';ctx.fillText(String(i+1).padStart(2,'0'),93,y+21);ctx.fillStyle='#edf4ff';ctx.font='600 16px Arial,sans-serif';let name=String(p.name||'Player');if(name.length>22)name=name.slice(0,21)+'…';ctx.fillText(name,137,y+21);ctx.textAlign='right';ctx.fillStyle='#bdc9d8';ctx.font='13px monospace';ctx.fillText('TOTAL',582,y+20);ctx.fillStyle=i===0?'#d6ff78':'#f1f5fb';ctx.font='bold 19px monospace';ctx.fillText(String(p.now??p.score??0),674,y+22);ctx.textAlign='left';});
    ctx.fillStyle='#9aadc2';ctx.font='13px Arial,sans-serif';ctx.fillText('Shareable recap: names and scores only. Private answers stay private.',80,583);ctx.fillStyle='#d6ff78';ctx.font='bold 13px monospace';ctx.textAlign='right';ctx.fillText('muya2026.github.io/testhem',1120,583);ctx.textAlign='left';
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Could not render the scorecard image.');
    const filename=`testhem-round-${game.round||1}-results.png`;
    if(typeof File!=='undefined'&&navigator.share&&navigator.canShare){const file=new File([blob],filename,{type:'image/png'});if(navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:`testhem · ${title}`,text:'Our crew’s testhem scorecard'});return;}catch(err){if(err?.name==='AbortError')return;}}}
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Scorecard saved. Share the PNG with your crew.');
  }
  function renderReveal(root) {
    game.stage='reveal';const type=game.gameType||'psych',points=revealData();
    const board=[...game.players].map(p=>({...p,now:(p.score||0)+(points[p.id]||0)})).sort((a,b)=>b.now-a.now);
    const rows=[...game.submissions].sort((a,b)=>Number(a.is_pass)-Number(b.is_pass)).map((s,i)=>{
      const p=game.players.find(x=>x.id===s.player_id);if(s.is_pass)return `<div class="reveal-row"><div><p>${esc(p?.name||'A player')} passed this round.</p><small>PASSING IS ALWAYS ALLOWED</small></div><span class="answer-verdict">PASSED</span></div>`;
      const votes=game.votes.filter(v=>v.submission_id===s.id);
      if(type==='psych'){const yes=votes.filter(v=>v.guess_truth).length;return `<div class="reveal-row"><div><p>“${esc(s.text)}”</p><small>FROM ${esc(p?.name||'PLAYER')} · ${yes} GUESSED REAL / ${votes.length-yes} GUESSED BLUFF</small></div><span class="answer-verdict ${s.is_truth?'truth':'bluff'}">${s.is_truth?'THE TRUTH':`BLUFF · FOOLED ${yes}`}</span></div>`;}
      if(type==='twoTruths'||type==='threeQ'){return `<div class="reveal-row reveal-tall"><div><p class="reveal-author">${esc(p?.name||'PLAYER')} ${type==='twoTruths'?'SAID':'ANSWERED'}</p>${(s.items||[]).map((t,j)=>`<p class="reveal-item ${j===s.lie_index?'is-lie':'is-true'}"><b>0${j+1}</b> ${esc(t)} ${j===s.lie_index?'— THE LIE':'— TRUE'}</p>`).join('')}<small>${votes.filter(v=>v.guess_index===s.lie_index).length} FRIENDS SPOTTED IT · ${votes.filter(v=>v.guess_index!==s.lie_index).length} WERE FOOLED</small></div><span class="answer-verdict bluff">LIE #0${s.lie_index+1}</span></div>`;}
      if(type==='wyr'){const opt=s.choice==='A'?game.prompt[3]:game.prompt[4];const hits=votes.filter(v=>v.guess_choice===s.choice).length;return `<div class="reveal-row"><div><p>“${esc(s.text)}”</p><small>${esc(p?.name||'PLAYER')} PICKED ${s.choice}: ${esc(opt)} · ${hits}/${votes.length} READ IT RIGHT</small></div><span class="answer-verdict truth">CHOICE ${s.choice}</span></div>`;}
      if(type==='hiddenTruth'){const hits=votes.filter(v=>v.guess_player_id===s.player_id).length;return `<div class="reveal-row"><div><p>“${esc(s.text)}”</p><small>THE AUTHOR WAS ${esc(p?.name||'PLAYER')} · ${hits} FRIENDS KNEW</small></div><span class="answer-verdict truth">FOUND ${hits}×</span></div>`;}
      if(type==='readRoom'){const [tag,q,hint,a,b]=game.prompt;const text=s.choice==='A'?a:b;const counts={A:game.submissions.filter(x=>!x.is_pass&&x.choice==='A').length,B:game.submissions.filter(x=>!x.is_pass&&x.choice==='B').length};const maj=counts.A===counts.B?'TIE':counts.A>counts.B?'A':'B';return `<div class="reveal-row"><div><p>${esc(p?.name||'PLAYER')} picked ${s.choice}: ${esc(text)}</p><small>THE ROOM: A ${counts.A} · B ${counts.B} · MAJORITY ${maj}</small></div><span class="answer-verdict ${s.choice===maj?'truth':'bluff'}">${s.choice===maj?'WITH THE ROOM':'OWN ORBIT'}</span></div>`;}
      if(type==='questionJar'){const stars=votes.length;return `<div class="reveal-row reveal-tall"><div><p class="reveal-author">${esc(p?.name||'PLAYER')} · ${esc(s.question||'QUESTION')}</p><p>${esc(s.text||'')}</p><small>${stars} FRIEND${stars===1?'':'S'} VOTED THIS STORY · WINNER EARNS 2</small></div><span class="answer-verdict ${stars?'truth':''}">✳ ${stars}</span></div>`;}
      return '';
    }).join('');
    const label={psych:'THE REVEAL',twoTruths:'TWO TRUTHS. ONE VERY BAD LIAR.',wyr:'SO THAT’S YOUR PICK.',threeQ:'THREE ANSWERS. ONE BLUFF.',questionJar:'THE JAR HAS SPOKEN.',hiddenTruth:'THE PEOPLE BEHIND THE FACTS.',readRoom:'THE ROOM HAS A MAJORITY.'}[type]||'THE REVEAL';
    const scoring={psych:'Correct reads earn a point; bluffers score for every friend they fooled.',twoTruths:'Spot the lie for a point. If you miss it, the storyteller gets the point.',wyr:'Each correct prediction of a friend’s choice is one point.',threeQ:'Spot the invented answer for a point. Miss it and the player gets the point.',questionJar:'The most-voted answer earns 2 points. Or ignore the score and keep talking.',hiddenTruth:'Correctly name the author for a point. A missed fact gives its author a point.',readRoom:'Call the group majority correctly and score a point.'}[type];
    const canNext=game.mode!=='online'||currentPlayerId===game.hostId;
    root.innerHTML=`<div class="game-eyebrow">${label} · ROUND ${game.round}</div><h2>${type==='questionJar'?'The best bits stay with you.':'Did you read them right?'}</h2><p class="game-sub">${scoring}</p><div class="scoreboard">${board.map(p=>`<span class="score-chip">${esc(p.name)} <b>${p.now}</b></span>`).join('')}</div><div class="result-share"><button class="button-secondary" id="shareResultImage">MAKE A BRANDED SCORECARD PNG <span>↗</span></button><small>Includes player names and scores—not private answers.</small></div><div>${rows}</div><div class="game-actions">${canNext?'<button class="button-primary" id="nextRound">RUN IT BACK <span>↗</span></button>':'<span class="online-wait"><strong>ROUND SCORES LOCKED</strong>The host can start another round whenever the crew is ready.</span>'}<button class="button-secondary" id="closeResults">BACK TO THE GAME DECK</button></div>`;
    $('#shareResultImage').addEventListener('click',async e=>{const b=e.currentTarget;b.disabled=true;const label=b.textContent;try{await makeResultImage(points,board);}catch(err){toast(err.message||'Could not make the image.');}finally{b.disabled=false;b.textContent=label;}});
    $('#nextRound')?.addEventListener('click',async()=>{if(game.mode==='online'){await onlineAction('start',remoteRoundData(game.gameType||'psych',game.deck||'odd'));}else{game.players.forEach(p=>{p.score=(p.score||0)+(points[p.id]||0);});game.round++;game.prompt=pickGamePrompt(game.gameType);game.questionSet=game.gameType==='threeQ'?threeQuestionSets[Math.floor(Math.random()*threeQuestionSets.length)]:null;game.jarQuestions={};game.submissions=[];game.votes=[];localAnswerIndex=0;localVoteIndex=0;localGate=false;pendingVotes={};game.stage='answer';render();}});
    $('#closeResults').addEventListener('click',()=>{overlayClose();resetWorld();});
  }

  function bindOnlineDraftFields(root){$$('[data-online-draft]',root).forEach(el=>{const key=el.dataset.onlineDraft;el.value=onlineDraftForm[key]??'';el.addEventListener('input',()=>{onlineDraftForm[key]=el.value;});});}
  function renderOnlineOtherAnswer(root){
    const type=game.gameType||'psych';
    const formField=(key,placeholder,max=150)=>`<textarea class="game-textarea" data-online-draft="${key}" maxlength="${max}" placeholder="${esc(placeholder)}"></textarea>`;
    const actions=(button='SEAL MY ANSWER')=>`<div class="game-actions"><button class="button-primary" id="sendOnlineOther">${button} <span>↗</span></button><button class="button-secondary" id="passOnlineOther">PASS THIS ROUND</button></div>`;
    if(type==='twoTruths'||type==='threeQ'){
      const prompts=type==='threeQ'?game.questionSet:['Statement one','Statement two','Statement three'];
      root.innerHTML=`<div class="game-eyebrow">${type==='twoTruths'?'TWO TRUTHS & A LIE':'THREE QUESTIONS · ONE BLUFF'}</div><h2>Write three. Hide one lie.</h2><p class="game-sub">Your lines stay private until everyone has answered. Passing is always fine.</p><div class="statement-list">${prompts.map((q,i)=>`<div class="statement-entry"><label><span>0${i+1}</span>${esc(q)}</label>${formField(`item${i}`,type==='twoTruths'?'Write a short statement…':'Your answer…')}</div>`).join('')}<div class="truth-choice">${[0,1,2].map(i=>`<button type="button" data-online-lie="${i}" class="${String(onlineDraftForm.lieIndex)===String(i)?'chosen':''}">⌁ &nbsp;LINE 0${i+1} IS THE LIE</button>`).join('')}</div></div>${actions('LOCK MY THREE')}`;
      bindOnlineDraftFields(root);$$('[data-online-lie]',root).forEach(b=>b.addEventListener('click',()=>{onlineDraftForm.lieIndex=b.dataset.onlineLie;$$('[data-online-lie]',root).forEach(x=>x.classList.toggle('chosen',x===b));}));
      $('#sendOnlineOther').addEventListener('click',async()=>{const items=[0,1,2].map(i=>(onlineDraftForm[`item${i}`]||'').trim()),lie_index=Number(onlineDraftForm.lieIndex);if(items.some(x=>x.length<2))return toast('Fill in all three lines.');if(![0,1,2].includes(lie_index))return toast('Mark which line is the lie.');await onlineAction('submit',{items,lie_index});});
    }else if(type==='wyr'||type==='readRoom'){
      const [, , ,a,b]=game.prompt;root.innerHTML=`<div class="game-eyebrow">${type==='wyr'?'WOULD YOU RATHER?':'READ THE ROOM'} · PRIVATE PICK</div><h2>${type==='wyr'?'Choose your fate.':'What’s your answer?'}</h2>${promptMarkup()}<div class="choice-pair"><button data-online-choice="A" class="${onlineDraftForm.choice==='A'?'selected':''}"><b>A</b><span>${esc(a)}</span></button><button data-online-choice="B" class="${onlineDraftForm.choice==='B'?'selected':''}"><b>B</b><span>${esc(b)}</span></button></div>${type==='wyr'?`<label class="reason-label">SELL YOUR CHOICE IN ONE LINE</label>${formField('reason','Why is this the better option?',120)}`:''}${actions(type==='wyr'?'SEAL MY PICK':'LOCK MY PICK')}`;
      bindOnlineDraftFields(root);$$('[data-online-choice]',root).forEach(b=>b.addEventListener('click',()=>{onlineDraftForm.choice=b.dataset.onlineChoice;$$('[data-online-choice]',root).forEach(x=>x.classList.toggle('selected',x===b));}));
      $('#sendOnlineOther').addEventListener('click',async()=>{const choice=onlineDraftForm.choice;if(!choice)return toast('Pick A or B.');if(type==='wyr'){const text=(onlineDraftForm.reason||'').trim();if(text.length<2)return toast('Give your crew a short reason.');await onlineAction('submit',{choice,text});}else await onlineAction('submit',{choice});});
    }else if(type==='hiddenTruth'){
      root.innerHTML=`<div class="game-eyebrow">HIDDEN TRUTH · ONE SENTENCE, NO NAMES</div><h2>Leave one real clue.</h2>${promptMarkup()}<div class="game-form">${formField('text','A harmless fact your friends may not know…',150)}${actions('SEAL THE FACT')}</div>`;bindOnlineDraftFields(root);$('#sendOnlineOther').addEventListener('click',async()=>{const text=(onlineDraftForm.text||'').trim();if(text.length<4)return toast('Write a few words, or pass.');await onlineAction('submit',{text});});
    }else if(type==='questionJar'){
      if(!onlineDraftForm.question)onlineDraftForm.question=jarPrompts[Math.floor(Math.random()*jarPrompts.length)];
      root.innerHTML=`<div class="game-eyebrow">QUESTION JAR · DRAWN FOR YOU</div><h2>Answer, pass, or spin.</h2><div class="game-prompt"><small>YOUR QUESTION</small><strong>${esc(onlineDraftForm.question)}</strong><em>Share only what feels good. You can pass without explaining.</em></div><div class="game-form">${formField('jarAnswer','Your answer…',180)}${actions('DROP IT IN')}</div>`;bindOnlineDraftFields(root);$('#sendOnlineOther').addEventListener('click',async()=>{const text=(onlineDraftForm.jarAnswer||'').trim();if(text.length<2)return toast('Write a few words, or pass.');await onlineAction('submit',{question:onlineDraftForm.question,text});});
    }
    $('#passOnlineOther').addEventListener('click',()=>onlineAction('submit',{is_pass:true}));
  }
  function renderOnlineOtherVote(root){
    const type=game.gameType||'psych',mine=game.myVotes||[],targets=game.submissions||[],pending={...onlineDraftVotes};
    if(mine.length>=(game.myExpectedVotes||0)&&game.myExpectedVotes!==undefined){root.innerHTML=`<div class="game-eyebrow">BALLOT LOCKED · ${game.voteCount}/${game.expectedVotes} IN</div><h2>Your guesses are sealed.</h2><div class="online-wait"><strong>WAITING FOR EVERY ORBIT</strong>The reveal opens when the room has finished voting.</div><div class="progress-rail"><i style="width:${game.expectedVotes?game.voteCount/game.expectedVotes*100:100}%"></i></div><div class="progress-label">${game.voteCount} OF ${game.expectedVotes} VOTES CAST</div>`;return;}
    if(type==='readRoom'){
      const [, , ,a,b]=game.prompt;root.innerHTML=`<div class="game-eyebrow">READ THE ROOM · ${game.voteCount}/${game.expectedVotes} PREDICTIONS IN</div><h2>What did the room choose?</h2><p class="game-sub">Your pick is private. Guess which option won the room.</p><div class="choice-pair"><button data-online-majority="A"><b>A</b><span>${esc(a)}</span></button><button data-online-majority="B"><b>B</b><span>${esc(b)}</span></button></div><div class="game-actions"><button class="button-primary" id="sendOnlineVote">LOCK MY PREDICTION <span>↗</span></button></div>`;
      let choice='';$$('[data-online-majority]',root).forEach(b=>b.addEventListener('click',()=>{choice=b.dataset.onlineMajority;$$('[data-online-majority]',root).forEach(x=>x.classList.toggle('selected',x===b));}));$('#sendOnlineVote').addEventListener('click',()=>choice?onlineAction('vote',{guess_majority:choice}):toast('Choose A or B.'));return;
    }
    if(type==='questionJar'){
      root.innerHTML=`<div class="game-eyebrow">QUESTION JAR · ${game.voteCount}/${game.expectedVotes} PICKS IN</div><h2>Which answer stays with you?</h2><div class="answer-grid">${targets.map((s,i)=>`<button class="answer-card" data-jar-target="${esc(s.id)}"><p>“${esc(s.text)}”</p><span class="anonymous">QUESTION · ${esc(s.question||'')}</span></button>`).join('')}</div>`;
      $$('[data-jar-target]',root).forEach(b=>b.addEventListener('click',()=>onlineAction('vote',{submission_id:b.dataset.jarTarget})));return;
    }
    const typeLabel=type==='twoTruths'?'WHICH LINE IS THE LIE?':type==='threeQ'?'WHICH ANSWER IS MADE UP?':type==='wyr'?'PREDICT THEIR PICK':'WHO WROTE THIS?';
    root.innerHTML=`<div class="game-eyebrow">${typeLabel} · ${game.voteCount}/${game.expectedVotes} GUESSES IN</div><h2>Make your calls.</h2><p class="game-sub">Answers are anonymous. You will not see your own answer here.</p><div class="answer-grid">${targets.map((s,i)=>{
      const prior=mine.find(v=>v.submission_id===s.id);const choice=prior?(type==='twoTruths'||type==='threeQ'?prior.guess_index:type==='wyr'?prior.guess_choice:prior.guess_player_id):pending[s.id];if(prior)pending[s.id]=choice;
      const body=(type==='twoTruths'||type==='threeQ')?(s.items||[]).map((t,j)=>`<button class="statement-vote ${String(choice)===String(j)?'selected':''}" data-online-target="${esc(s.id)}" data-online-value="${j}"><b>0${j+1}</b> ${esc(t)}</button>`).join(''):type==='wyr'?`<p>“${esc(s.text)}”</p><div class="vote-control"><button data-online-target="${esc(s.id)}" data-online-value="A" class="${choice==='A'?'selected':''}">PICK A</button><button data-online-target="${esc(s.id)}" data-online-value="B" class="${choice==='B'?'selected':''}">PICK B</button></div>`:`<p>“${esc(s.text)}”</p><select class="online-author-select" data-online-target="${esc(s.id)}"><option value="">Who wrote it?</option>${game.players.filter(p=>p.id!==currentPlayerId).map(p=>`<option value="${esc(p.id)}" ${choice===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>`;
      return `<article class="answer-card" data-online-card="${esc(s.id)}">${body}<span class="anonymous">TRANSMISSION ${String(i+1).padStart(2,'0')}</span></article>`;
    }).join('')}</div><div class="game-actions"><button class="button-primary" id="castOtherVotes">LOCK MY GUESSES <span>↗</span></button></div>`;
    $$('[data-online-target][data-online-value]',root).forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.onlineTarget;pending[id]=(type==='twoTruths'||type==='threeQ')?Number(b.dataset.onlineValue):b.dataset.onlineValue;onlineDraftVotes[id]=pending[id];$$(`[data-online-card="${CSS.escape(id)}"] [data-online-value]`,root).forEach(x=>x.classList.toggle('selected',x===b));}));
    $$('select[data-online-target]',root).forEach(sel=>sel.addEventListener('change',()=>{pending[sel.dataset.onlineTarget]=sel.value;onlineDraftVotes[sel.dataset.onlineTarget]=sel.value;}));
    $('#castOtherVotes').addEventListener('click',()=>{if(targets.some(s=>pending[s.id]===undefined||pending[s.id]===''))return toast('Make a guess for every answer.');const votes=targets.map(s=>{const v={submission_id:s.id};if(type==='twoTruths'||type==='threeQ')v.guess_index=pending[s.id];else if(type==='wyr')v.guess_choice=pending[s.id];else v.guess_player_id=pending[s.id];return v;});onlineAction('vote',{votes});});
  }
  function renderOnline(root) {
    if (game.stage === 'lobby') {
      const isHost = currentPlayerId === game.hostId;
      const url = `${location.origin}${location.pathname}${location.search}#join=${encodeURIComponent(remoteSession.code)}&key=${encodeURIComponent(remoteSession.key)}`;
      root.innerHTML = `<div class="game-eyebrow">${esc(gameCatalog.find(m=>m.key===game.gameType)?.title||'PSYCH!')} · PRIVATE ROOM ${esc(remoteSession.code)}</div><h2>${isHost ? 'Your room is open.' : 'You made it.'}</h2><p class="game-sub">Invite friends anywhere. Each person joins on their own phone or computer. Two or more players to start; answers stay hidden until the reveal.</p><div class="online-code">${esc(remoteSession.code)} <button class="button-secondary" id="copyInvite">COPY INVITE LINK</button></div><div class="scoreboard">${game.players.map(p => `<span class="score-chip">${esc(p.name)}${p.id === game.hostId ? ' · HOST' : ''}</span>`).join('')}</div>${isHost && (game.gameType||'psych')==='psych' ? `<div class="deck-picker"><span class="small-label">CHOOSE A DECK FOR ROUND ONE</span><div class="deck-options">${[['odd','ODDLY SPECIFIC'],['deep','DEEP ORBIT'],['either','WOULD YOU RATHER']].map(([k,v])=>`<button class="deck-option ${k===remoteDeck?'selected':''}" data-remote-deck="${k}">${v}</button>`).join('')}</div></div>` : ''}${isHost ? `<div class="game-actions"><button class="button-primary" id="startOnlineRound" ${game.players.length<2?'disabled':''}>START THE ROUND <span>↗</span></button></div>` : `<div class="online-wait"><strong>WAITING FOR THE HOST</strong>The host will light the fuse when everyone is here.</div>`}<p class="setup-error" id="roomInlineError"></p>`;
      $('#copyInvite')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(url); toast('Private invite copied. Send it to your crew.'); } catch { toast(url); } });
      $$('[data-remote-deck]', root).forEach(b => b.addEventListener('click', () => { remoteDeck = b.dataset.remoteDeck; $$('[data-remote-deck]', root).forEach(x => x.classList.toggle('selected', x === b)); }));
      $('#startOnlineRound')?.addEventListener('click', async () => { await onlineAction('start', remoteRoundData(game.gameType||selectedGame,remoteDeck)); });
      return;
    }
    if (game.stage === 'answer') {
      const mine = game.mySubmitted || game.submissions?.find(s => s.player_id === currentPlayerId);
      if (mine) { root.innerHTML = `<div class="game-eyebrow">ANSWER RECEIVED · ${game.submissionCount}/${game.players.length}</div><h2>You're in the mix.</h2><div class="online-wait"><strong>WAITING FOR YOUR ORBIT</strong>Your friends are writing their answers. No one can see yours until the reveal.</div><div class="progress-rail"><i style="width:${(game.submissionCount/game.players.length)*100}%"></i></div><div class="progress-label">${game.submissionCount} OF ${game.players.length} ANSWERS LOCKED</div>`; return; }
      if((game.gameType||'psych')!=='psych')return renderOnlineOtherAnswer(root);
      root.innerHTML = `<div class="game-eyebrow">ONLINE ROUND ${game.round} · ${game.submissionCount}/${game.players.length} ANSWERS IN</div><h2>Your call: true or bluff?</h2><p class="game-sub">Everyone else is writing too. Your answer stays sealed until the whole room is ready.</p>${promptMarkup()}<div class="game-form"><textarea id="onlineAnswer" maxlength="180" placeholder="Write your answer... (or pass)"></textarea><div class="truth-choice"><button class="${onlineDraftTruth?'chosen':''}" data-online-truth="true">✦ &nbsp;THIS IS TRUE</button><button class="${!onlineDraftTruth?'chosen':''}" data-online-truth="false">⌁ &nbsp;I MADE IT UP</button></div><div class="game-actions"><button class="button-primary" id="sendOnlineAnswer">SEAL MY ANSWER <span>↗</span></button><button class="button-secondary" id="passOnline">PASS</button></div></div>`;
      $('#onlineAnswer').value = onlineDraftText; $('#onlineAnswer').addEventListener('input', e => { onlineDraftText = e.target.value; });
      $$('[data-online-truth]', root).forEach(b => b.addEventListener('click', () => { $$('[data-online-truth]', root).forEach(x => x.classList.remove('chosen')); b.classList.add('chosen'); onlineDraftTruth = b.dataset.onlineTruth === 'true'; }));
      $('#sendOnlineAnswer').addEventListener('click', async () => { const text = $('#onlineAnswer').value.trim(); if (text.length < 3) return toast('A few words is enough.'); await onlineAction('submit', { text, is_truth: onlineDraftTruth }); });
      $('#passOnline').addEventListener('click', async () => onlineAction('submit', { is_pass: true })); return;
    }
    if (game.stage === 'vote') {
      if((game.gameType||'psych')!=='psych')return renderOnlineOtherVote(root);
      const mine = game.myVotes || []; const mineIds = new Set(mine.map(v => v.submission_id));
      if (mine.length >= (game.myExpectedVotes || 0) && game.myExpectedVotes !== undefined) { root.innerHTML = `<div class="game-eyebrow">BALLOT LOCKED · ${game.voteCount}/${game.expectedVotes} GUESSES IN</div><h2>You're a good secret-keeper.</h2><div class="online-wait"><strong>WAITING FOR THE ROOM TO VOTE</strong>Answers are still anonymous. The reveal happens once everyone is done.</div><div class="progress-rail"><i style="width:${game.expectedVotes ? game.voteCount/game.expectedVotes*100 : 100}%"></i></div><div class="progress-label">${game.voteCount} OF ${game.expectedVotes} VOTES CAST</div>`; return; }
      const targets = (game.submissions || []).filter(s => !(game.ownSubmissionIds || []).includes(s.id));
      if (!targets.length) { root.innerHTML = `<div class="online-wait"><strong>NO GUESSES NEEDED</strong>Everyone passed this one. Waiting for the reveal.</div>`; return; }
      const pending = { ...onlineDraftVotes };
      root.innerHTML = `<div class="game-eyebrow">READ THE ROOM · ${game.voteCount}/${game.expectedVotes} GUESSES IN</div><h2>Which answers are real?</h2><p class="game-sub">Every answer belongs to a player in your room. Your own answer is hidden from this pile.</p><div class="answer-grid">${targets.map((s,i) => { const prior=mine.find(v=>v.submission_id===s.id); const guess=prior?prior.guess_truth:pending[s.id]; if(prior) pending[s.id]=prior.guess_truth; return `<article class="answer-card" data-online-card="${esc(s.id)}"><p>“${esc(s.text)}”</p><span class="anonymous">TRANSMISSION ${String(i+1).padStart(2,'0')}</span><div class="vote-control"><button data-online-guess="true" class="${guess===true?'selected real':''}">✦ REAL</button><button data-online-guess="false" class="${guess===false?'selected bluff':''}">⌁ BLUFF</button></div></article>`; }).join('')}</div><div class="game-actions"><button class="button-primary" id="castOnlineVotes">LOCK MY GUESSES <span>↗</span></button></div>`;
      $$('[data-online-card]', root).forEach(card => $$('[data-online-guess]', card).forEach(b => b.addEventListener('click', () => { $$('[data-online-guess]', card).forEach(x => x.classList.remove('selected','real','bluff')); b.classList.add('selected', b.dataset.onlineGuess==='true'?'real':'bluff'); pending[card.dataset.onlineCard]=b.dataset.onlineGuess==='true'; onlineDraftVotes[card.dataset.onlineCard]=pending[card.dataset.onlineCard]; })));
      $('#castOnlineVotes').addEventListener('click', async () => { if(targets.some(s=>pending[s.id]===undefined))return toast('Guess on every answer—or pass this ballot.'); await onlineAction('vote',{votes:targets.map(s=>({submission_id:s.id,guess_truth:pending[s.id]}))}); }); return;
    }
    if (game.stage === 'reveal') return renderReveal(root);
  }

  // Read a shared invite from the URL fragment. The room key stays in the fragment, not the server request.
  function initInvite() {
    const params = new URLSearchParams(location.hash.replace(/^#/, '')); const code = params.get('join'); const key = params.get('key');
    if (!code || !key) return;
    const prior = savedSession(code);
    if (prior) { remoteSession = prior; currentPlayerId = prior.playerId; rpc('testhem_get_room', { p_code: prior.code, p_room_key: prior.key, p_player_id: prior.playerId }).then(state => setRemoteRoom(prior, state)).catch(() => { try { localStorage.removeItem(`testhem-room-${prior.code}`); } catch {} remoteSession = null; currentPlayerId = null; history.replaceState(null, '', location.pathname + location.search); mode = 'online'; $$('.mode-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode==='online')); $$('.mode-panel').forEach(p=>p.classList.toggle('active',p.id==='onlinePanel')); openSetup(); onlineError('That room is no longer available. Ask the host for a fresh invite, or start a new room.'); }); }
    else { $$('.mode-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode==='online')); $$('.mode-panel').forEach(p=>p.classList.toggle('active',p.id==='onlinePanel')); mode='online'; $('#roomInvite').value=location.href; resumeRoomAfterIdentity=!userName; openSetup(); }
  }
  initInvite();

  // Three-dimensional observatory: the sky is a time-aware atmospheric shader;
  // game portals live in navigable world space, not in a flat carousel.
  let focusPortal=()=>{}, resetCamera=()=>{};
  const canvas=$('#universe'),world=$('#world');
  const skyVS=`attribute vec2 aPosition; varying vec2 vUv; void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
  const skyFS=`precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime,uHour,uMoonPhase,uDoy,uYaw,uPitch;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm3(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*1.97+vec2(5.3,1.7);a*=.5;}return v;}
float fbm5(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+vec2(9.7,3.1);a*=.5;}return v;}
// value noise wrapped on x so the horizon ridge loops seamlessly with azimuth
float hashW(vec2 p,float per){p.x=mod(p.x,per);return hash(p);}
float noiseW(vec2 p,float per){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(hashW(i,per),hashW(i+vec2(1.,0.),per),u.x),mix(hashW(i+vec2(0.,1.),per),hashW(i+vec2(1.,1.),per),u.x),u.y);}
float ridgeH(float u){float v=noiseW(vec2(u*8.,3.7),8.)*.55+noiseW(vec2(u*24.,8.2),24.)*.30+noiseW(vec2(u*64.,1.9),64.)*.15;return 0.004+v*v*0.075;}

void main(){
  vec2 uv=vUv;
  float aspect=uResolution.x/uResolution.y;

  // ---- camera ray through this pixel: 48° vertical FOV rotated by live yaw/pitch,
  //      so the whole sky parallaxes with the observatory camera (true 3D dome)
  vec2 ndc=uv*2.-1.;
  float th=0.4452;
  vec3 rdv=normalize(vec3(ndc.x*th*aspect,ndc.y*th,-1.));
  float sy=sin(uYaw),cy=cos(uYaw),sp=sin(uPitch),cp=cos(uPitch);
  vec3 fwd=vec3(sy*cp,sp,-cy*cp);
  vec3 rgt=vec3(cy,0.,sy);
  vec3 upv=vec3(-sp*sy,cp,sp*cy);
  vec3 rd=normalize(rgt*rdv.x+upv*rdv.y+fwd);
  float azr=atan(rd.x,-rd.z+1e-5);

  // ---- sun path: civil hour + seasonal declination (fixed 20N, no geolocation)
  float decl=-0.4091*cos((uDoy+10.)/365.25*6.28318);
  float lat=0.3491;
  float ha=(uHour-12.)/12.*3.14159;
  float sinEl=sin(lat)*sin(decl)+cos(lat)*cos(decl)*cos(ha);
  float sunEl=asin(clamp(sinEl,-1.,1.))/1.5708;            // -1..1 elevation
  float elS=asin(clamp(sinEl,-1.,1.));                     // radians, for direction
  float dayW=smoothstep(-0.06,0.18,sunEl);                 // daylight weight
  float golden=exp(-pow((sunEl-0.03)*6.5,2.));             // golden-hour band
  float nightW=1.-smoothstep(-0.20,0.02,sunEl);            // deep-night weight
  float sunAz=-ha;                                         // rises screen-right, sets screen-left
  vec3 sunDir=vec3(sin(sunAz)*cos(elS),clamp(sinEl,-1.,1.),-cos(sunAz)*cos(elS));

  // ---- base atmosphere gradient (elevation-driven)
  float h=clamp(rd.y+0.04,0.,1.);
  vec3 nightCol=mix(vec3(0.016,0.034,0.070),vec3(0.004,0.010,0.030),pow(h,0.72));
  vec3 dayCol=mix(vec3(0.630,0.790,0.905),vec3(0.180,0.430,0.740),pow(h,0.80));
  vec3 col=mix(nightCol,dayCol,dayW);

  // warm forward scatter around the sun azimuth (twilight + low sun)
  float dAz=atan(sin(azr-sunAz),cos(azr-sunAz));
  float az=exp(-pow(dAz/2.63,2.));
  float lowBand=exp(-pow(h*1.9,2.));
  vec3 scatterC=mix(vec3(1.00,0.42,0.16),vec3(1.00,0.66,0.36),h);
  float fwdG=clamp(golden*az*lowBand*1.25+dayW*az*exp(-pow((sunEl-0.35)*3.,2.))*0.14,0.,1.);
  col=mix(col,scatterC,fwdG);
  // Belt of Venus: violet band above the glow at twilight
  col+=vec3(0.32,0.13,0.30)*golden*az*exp(-pow((h-0.30)*4.5,2.))*0.55;

  // ---- sun disc + bloom (angular chord scaled so the tuned sizes still hold)
  float sd=length(rd-sunDir)*0.45;
  float svis=max(dayW,golden*0.85);
  col+=scatterC*exp(-sd*2.6)*0.22*(golden+dayW*0.5);
  col+=mix(vec3(1.,0.55,0.25),vec3(1.,0.92,0.72),dayW)*(exp(-sd*14.)*0.9+exp(-sd*4.5)*0.25)*svis;
  float disc=1.-smoothstep(0.0095,0.0125,sd);
  col=mix(col,vec3(1.,0.97,0.90),disc*smoothstep(0.02,0.10,sunEl));

  // ---- stars: two magnitude tiers, color variation, twinkle, milky way
  //      azimuth wraps through fract(), so the star field is seamless when panning
  vec2 suv=vec2(fract(azr/6.28319+0.5),asin(clamp(rd.y,-1.,1.))/3.14159+0.5);
  float starGate=nightW*smoothstep(-0.10,0.06,rd.y);
  vec2 g1=suv*vec2(300.,170.);vec2 id1=floor(g1),f1=fract(g1)-.5;
  float r1=hash(id1);
  float s1=(1.-smoothstep(0.0,0.05,length(f1)))*step(0.972,r1)*0.55;
  vec2 g2=suv*vec2(150.,85.);vec2 id2=floor(g2),f2=fract(g2)-.5;
  float r2=hash(id2+71.3);
  float s2=(1.-smoothstep(0.0,0.09,length(f2)))*step(0.965,r2)*1.35;
  float tw=0.6+0.4*sin(uTime*(0.8+r1*3.)+r1*43.)*(0.6+0.4*sin(uTime*0.7+r2*29.));
  vec3 sC=mix(vec3(0.70,0.80,1.0),vec3(1.0,0.86,0.70),hash(id2+3.1));
  col+=sC*(s1+s2)*(0.55+0.45*tw)*starGate;
  // milky way: a tilted great-circle band on the direction sphere (no seams)
  float band=exp(-pow(dot(rd,vec3(0.16,0.62,-0.20))-0.43,2.)*26.);
  col+=vec3(0.26,0.34,0.56)*band*(0.35+0.65*fbm3(rd.xy*vec2(5.,9.)))*starGate*0.55;

  // ---- moon opposite the sun, phase-lit maria/craters
  float azM=sunAz+3.14159;
  float elM=0.55-elS*0.55;
  vec3 moonDir=vec3(sin(azM)*cos(elM),sin(elM),-cos(azM)*cos(elM));
  vec3 dM=rd-moonDir;
  float md=length(dM)*0.45;
  float mR=0.028;
  float inM=1.-smoothstep(mR*0.955,mR,md);
  vec3 t1=normalize(cross(moonDir,vec3(0.,1.,0.)));
  vec3 t2=cross(t1,moonDir);
  vec2 mm=vec2(dot(dM,t1),dot(dM,t2))*0.45/mR;
  float mz=sqrt(max(0.,1.-dot(mm,mm)));
  float ph=uMoonPhase*6.28318;
  vec3 ld=normalize(vec3(cos(ph),0.35*sin(ph)+0.15,0.72));
  float li=clamp(dot(normalize(vec3(mm.x,mm.y,mz)),ld),0.,1.);
  float crat=0.72+0.55*fbm3(mm*3.4+7.3);
  vec3 moonC=mix(vec3(0.10,0.13,0.20),vec3(0.93,0.94,0.88)*crat,li);
  float mgate=nightW+golden*0.55;
  col=mix(col,moonC,inM*mgate);
  col+=vec3(0.55,0.66,0.92)*exp(-md*6.5)*0.10*mgate;

  // ---- clouds: planar-projected domain-warped fbm (no azimuth seam), drifting,
  //      lit by sun and moon; perspective compresses them toward the horizon
  vec2 cuv=rd.xz/(abs(rd.y)+0.16)+vec2(uTime*0.0075,uTime*0.0018);
  float w1=fbm3(cuv*1.35);
  float w2=fbm3(cuv*1.35+5.2);
  float cl=fbm5(cuv+vec2(w1,w2)*0.65);
  float cover=smoothstep(0.46,0.72,cl)*smoothstep(-0.26,-0.04,rd.y);
  float lit=smoothstep(0.46,0.95,cl);
  vec3 cd=mix(vec3(0.62,0.68,0.78),vec3(1.02,1.00,0.97),lit);
  vec3 cn=mix(vec3(0.045,0.065,0.105),vec3(0.16,0.20,0.30),lit*0.8+0.15*exp(-md*3.)*mgate);
  vec3 cc=mix(cn,cd,dayW);
  cc=mix(cc,vec3(1.0,0.56,0.30),golden*az*0.85*lit);        // golden rims toward the sun
  cc+=vec3(0.9,0.95,1.)*exp(-md*5.)*0.10*mgate*lit;          // moonlit silver lining
  col=mix(col,cc,cover*0.88);
  // wispy cirrus aloft
  float cir=smoothstep(0.60,0.88,fbm3(cuv*3.2-vec2(w2,w1)*0.4))*0.16*smoothstep(0.15,0.67,rd.y)*(0.4+0.6*dayW);
  col=mix(col,mix(cn*1.4,cd,dayW),cir);

  // ---- occasional meteor (night only, brief streak across the dome)
  float cyc=uTime/21.;
  float n=floor(cyc),pp=fract(cyc);
  float hA=hash(vec2(n,1.7));
  float mAz=(hash(vec2(n,4.4))-.5)*6.28319;
  float mEl=0.30+0.50*hA;
  vec3 org=vec3(sin(mAz)*cos(mEl),sin(mEl),-cos(mAz)*cos(mEl));
  vec3 tangent=normalize(cross(org,vec3(0.,1.,0.))+vec3((hash(vec2(n,3.3))-.5)*0.9,0.,(hash(vec2(n,5.1))-.5)*0.9));
  float head=pp*30.;
  if(head<1.&&nightW>0.05){
    vec3 hd=normalize(org+tangent*head*1.1);
    vec3 dv=rd-hd;
    float paral=dot(dv,tangent);
    float perp=dot(dv,cross(tangent,hd));
    float streak=exp(-perp*perp*2000.)*exp(-max(paral,0.)*12.)*step(0.,paral)*exp(-head*2.4);
    col+=vec3(0.85,0.92,1.)*streak*nightW*1.4;
  }

  // ---- distant horizon ridge: a wrapped-noise silhouette that parallaxes with the
  //      camera, sitting in front of the sky and behind the observatory haze
  float azu=fract(azr/6.28319+0.5);
  float rh=ridgeH(azu);
  float ridgeBand=smoothstep(-0.16,-0.05,rd.y);
  float sil=(1.-smoothstep(rh-0.0035,rh+0.002,rd.y))*ridgeBand;
  vec3 ridgeC=mix(vec3(0.010,0.017,0.038),vec3(0.085,0.13,0.20),dayW);
  ridgeC=mix(ridgeC,scatterC*0.5,golden*az*0.45);            // twilight kiss on the ridgeline
  col=mix(col,ridgeC,sil);

  // ---- horizon haze + sun-side ground glow (atmosphere in front of the ridge)
  col+=mix(vec3(0.03,0.05,0.09),vec3(0.50,0.60,0.72),dayW)*exp(-pow(rd.y*6.5,2.))*0.22;
  col+=scatterC*exp(-pow((rd.y+0.02)*8.5,2.))*golden*az*0.38;

  // vignette (screen space)
  float vig=1.-smoothstep(0.45,1.25,length((uv-.5)*vec2(aspect*.8,1.)));
  col*=0.80+0.20*vig;
  gl_FragColor=vec4(col,1.);
}`;
  const objVS=`attribute vec3 aPosition;attribute vec3 aNormal;uniform mat4 uMVP,uModel;varying vec3 vNormal,vWorld,vLocal;void main(){vec4 w=uModel*vec4(aPosition,1.);vWorld=w.xyz;vLocal=aPosition;vNormal=normalize(mat3(uModel)*aNormal);gl_Position=uMVP*vec4(aPosition,1.);}`;
  const objFS=`precision highp float;
uniform float uKind,uTime;
uniform vec3 uTint,uLight,uFog,uCam;
varying vec3 vNormal,vWorld,vLocal;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec2(9.2,4.7);a*=.5;}return v;}
void main(){
  vec3 N=normalize(vNormal);
  vec3 L=normalize(uLight-vWorld);
  vec3 V=normalize(uCam-vWorld);
  float diff=max(dot(N,L),0.);
  float fres=pow(1.-max(dot(N,V),0.),2.4);
  float spec=pow(max(dot(reflect(-L,N),V),0.),42.);
  vec3 c;
  float alpha=1.;
  if(uKind>11.5){
    // portal energy core: animated vortex disc with spiral arms and hot center
    float r=length(vLocal.xy);
    float an=atan(vLocal.y,vLocal.x);
    float sw=fbm(vec2(an*1.6+r*3.5-uTime*1.1,r*5.5-uTime*0.7));
    float arms=0.5+0.5*sin(an*3.+r*8.-uTime*2.4+sw*3.);
    float core=exp(-r*3.6)*1.7;
    float edge=1.-smoothstep(0.62,1.02,r);
    float glow=(sw*0.75+arms*0.55)*edge+core;
    c=uTint*glow*1.25+vec3(1.,1.,1.)*core*0.30;
    alpha=clamp(glow*0.5+0.28,0.,1.)*edge;
  }else if(uKind>10.5){
    // metallic portal ring: brushed band, streak specular, colored fresnel rim
    float band=0.92+0.08*sin(atan(vLocal.y,vLocal.x)*26.+uTime*0.6);
    c=uTint*(0.30+0.75*diff)*band+uTint*fres*0.9+vec3(1.,0.96,0.86)*spec*1.6;
  }else if(uKind>1.5){
    // observatory core star: hot emitter with slow flare
    float flick=0.9+0.1*sin(uTime*3.1+vLocal.x*9.);
    c=uTint*(1.05+0.35*diff)*flick*1.35+uTint*fres*0.5;
  }else{
    // satellites / standard objects
    c=uTint*(0.20+0.80*diff)+uTint*fres*0.30+vec3(1.,0.97,0.90)*spec*0.35;
  }
  // aerial perspective into the time-of-day horizon color
  float fogF=1.-exp(-distance(uCam,vWorld)*0.024);
  c=mix(c,uFog,fogF*0.7);
  gl_FragColor=vec4(c,alpha);
}`;
  const lineVS=`attribute vec3 aPosition;uniform mat4 uMVP;uniform float uPhase,uGlow;uniform vec3 uCam;varying float vA;void main(){float a=atan(aPosition.z,aPosition.x);float lead=0.5+0.5*cos(a-uPhase);float ring=0.45+0.55*pow(lead,10.);float fade=exp(-distance(aPosition,uCam)*0.055);vA=uGlow<0.5?1.:(uGlow<1.5?ring:fade);gl_Position=uMVP*vec4(aPosition,1.);}`;
  const lineFS=`precision mediump float;uniform vec4 uColor;varying float vA;void main(){gl_FragColor=vec4(uColor.rgb,uColor.a*vA);}`;
  function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s));return null;}return s;}
  function program(gl,vs,fs){const v=shader(gl,gl.VERTEX_SHADER,vs),f=shader(gl,gl.FRAGMENT_SHADER,fs);if(!v||!f)return null;const p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){console.warn(gl.getProgramInfoLog(p));return null;}return p;}
  const mat={identity:()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),mul:(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;},trans:(x,y,z)=>{const o=mat.identity();o[12]=x;o[13]=y;o[14]=z;return o;},scale:(x,y,z)=>new Float32Array([x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1]),rx:a=>new Float32Array([1,0,0,0,0,Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1]),ry:a=>new Float32Array([Math.cos(a),0,-Math.sin(a),0,0,1,0,0,Math.sin(a),0,Math.cos(a),0,0,0,0,1]),rz:a=>new Float32Array([Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1,0,0,0,0,1]),persp:(fov,aspect,n,f)=>{const t=1/Math.tan(fov/2),nf=1/(n-f);return new Float32Array([t/aspect,0,0,0,0,t,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0]);},look:(eye,center)=>{const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l)},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];const z=norm([eye[0]-center[0],eye[1]-center[1],eye[2]-center[2]]),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}};
  function sphereMesh(gl,lat=24,lon=32){const p=[],n=[],ix=[];for(let y=0;y<=lat;y++){const v=y/lat,ph=v*Math.PI;for(let x=0;x<=lon;x++){const u=x/lon,th=u*Math.PI*2,px=-Math.cos(th)*Math.sin(ph),py=Math.cos(ph),pz=Math.sin(th)*Math.sin(ph);p.push(px,py,pz);n.push(px,py,pz);}}for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){const a=y*(lon+1)+x,b=a+lon+1;ix.push(a,b,a+1,b,b+1,a+1);}return mesh(gl,p,n,ix);}
  function torusMesh(gl,R=1,r=.055,major=40,minor=8){const p=[],n=[],ix=[];for(let i=0;i<=major;i++){const u=i/major*Math.PI*2;for(let j=0;j<=minor;j++){const v=j/minor*Math.PI*2;const x=(R+r*Math.cos(v))*Math.cos(u),y=(R+r*Math.cos(v))*Math.sin(u),z=r*Math.sin(v);p.push(x,y,z);n.push(Math.cos(v)*Math.cos(u),Math.cos(v)*Math.sin(u),Math.sin(v));}}for(let i=0;i<major;i++)for(let j=0;j<minor;j++){const a=i*(minor+1)+j,b=a+minor+1;ix.push(a,b,a+1,b,b+1,a+1);}return mesh(gl,p,n,ix);}
  function mesh(gl,p,n,ix){const pb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(p),gl.STATIC_DRAW);const nb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(n),gl.STATIC_DRAW);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ix),gl.STATIC_DRAW);return{pb,nb,ib,count:ix.length};}
  function rgb(hex){const n=parseInt(String(hex).replace('#',''),16);return[((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255];}
  function initWebGL(){
    let gl;try{gl=canvas.getContext('webgl',{alpha:false,antialias:true,powerPreference:'high-performance'});}catch(e){}if(!gl){document.body.classList.add('webgl-fallback');return;}
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.add('webgl-fallback');});
    const skyP=program(gl,skyVS,skyFS),objP=program(gl,objVS,objFS),lineP=program(gl,lineVS,lineFS);if(!skyP||!objP||!lineP){document.body.classList.add('webgl-fallback');return;}
    const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const sphere=sphereMesh(gl),torus=torusMesh(gl);const gridData=[];for(let x=-16;x<=16;x+=1)gridData.push(x,-.7,-5,x,-.7,-32);for(let z=-5;z>=-32;z-=1)gridData.push(-16,-.7,z,16,-.7,z);const gridBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,gridBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(gridData),gl.STATIC_DRAW);
    // Seven orbital planes around the core: nested radii, fanned inclination, staggered
    // nodes — a layered gyroscope. Declared BEFORE the buffers that use it (the previous
    // order threw a ReferenceError and silently killed the whole scene).
    const DEG=Math.PI/180,orbitCenter=[0,2.75,-17];
    const orbitRadii=[5.6,6.45,7.3,8.15,9.0,9.85,10.7];
    const orbitPhases=[2.65,2.35,1.98,1.57,1.15,.8,.5];
    const orbitRates=[.052,.058,.067,.08,.067,.058,.052];
    const orbitInc=[-16.5,-11,-5.5,0,5.5,11,16.5];
    const orbitNode=[8,49,90,131,172,213,254];
    const orbitCfg=orbitRadii.map((r,i)=>({r,ph:orbitPhases[i],rate:orbitRates[i],inc:orbitInc[i]*DEG,node:orbitNode[i]*DEG}));
    orbitCfg.forEach(o=>{o.model=mat.mul(mat.mul(mat.trans(...orbitCenter),mat.ry(o.node)),mat.rx(o.inc));});
    // Shared point math: rings and portals use the exact same transform, so every
    // portal rides precisely on its own orbit line.
    function orbitPoint(i,a){const o=orbitCfg[i],x=Math.cos(a)*o.r,z=Math.sin(a)*o.r,m=o.model;return[m[0]*x+m[8]*z+m[12],m[1]*x+m[9]*z+m[13],m[2]*x+m[10]*z+m[14]];}
    const orbitBuffers=orbitCfg.map(o=>{const a=[];for(let j=0;j<=240;j++){const q=j/240*Math.PI*2;a.push(Math.cos(q)*o.r,0,Math.sin(q)*o.r);}const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(a),gl.STATIC_DRAW);return{buffer:b,count:a.length/3};});
    const loc=(p,n)=>gl.getAttribLocation(p,n),un=(p,n)=>gl.getUniformLocation(p,n);
    const skyL={pos:loc(skyP,'aPosition'),res:un(skyP,'uResolution'),time:un(skyP,'uTime'),hour:un(skyP,'uHour'),moon:un(skyP,'uMoonPhase'),doy:un(skyP,'uDoy'),yaw:un(skyP,'uYaw'),pitch:un(skyP,'uPitch')};
    const objL={pos:loc(objP,'aPosition'),normal:loc(objP,'aNormal'),mvp:un(objP,'uMVP'),model:un(objP,'uModel'),kind:un(objP,'uKind'),time:un(objP,'uTime'),tint:un(objP,'uTint'),light:un(objP,'uLight'),fog:un(objP,'uFog'),cam:un(objP,'uCam')};
    const lineL={pos:loc(lineP,'aPosition'),mvp:un(lineP,'uMVP'),color:un(lineP,'uColor'),phase:un(lineP,'uPhase'),glow:un(lineP,'uGlow'),cam:un(lineP,'uCam')};
    let cssW=0,cssH=0,dpr=1;const eye=[0,1.55,1.0];let yaw=0,pitch=.015,yawTarget=0,pitchTarget=.015;let keys={},drag=null,mouse={x:-999,y:-999},selectedScreen=[];let lastTime=0,sceneTime=0,hover=-1;let swayYaw=0,swayPitch=0;
    function portalAt(i,t){const o=orbitCfg[i];return orbitPoint(i,o.ph+t*o.rate);}
    function getView(){const yy=yaw+swayYaw,pp2=pitch+swayPitch,cp=Math.cos(pp2),dir=[Math.sin(yy)*cp,Math.sin(pp2),-Math.cos(yy)*cp];const center=[eye[0]+dir[0],eye[1]+dir[1],eye[2]+dir[2]];return{dir,view:mat.look(eye,center)};}
    function portalTarget(i){const p=portalAt(i,sceneTime);const dx=p[0]-eye[0],dy=p[1]-eye[1],dz=p[2]-eye[2];yawTarget=Math.atan2(dx,-dz);pitchTarget=Math.atan2(dy,Math.hypot(dx,dz));}
    focusPortal=i=>portalTarget(i);resetCamera=()=>{eye[0]=0;eye[1]=1.55;eye[2]=1;yawTarget=0;pitchTarget=.015;};
    // Device-local civil time drives the whole sky: sun path, twilight, moon phase, cloud light.
    const getSky=()=>{const now=new Date();const h=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;const phase=((Date.now()/86400000+4.867)%29.53059)/29.53059;const doy=Math.floor((now-new Date(now.getFullYear(),0,0))/864e5);return{h,phase,doy};};
    const sstep=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
    const sunElevation=(h,doy)=>{const decl=-0.4091*Math.cos((doy+10)/365.25*2*Math.PI);const lat=0.3491;const ha=(h-12)/12*Math.PI;return Math.asin(Math.max(-1,Math.min(1,Math.sin(lat)*Math.sin(decl)+Math.cos(lat)*Math.cos(decl)*Math.cos(ha))))/(Math.PI/2);};
    // Matches the sky shader's horizon palette so 3D objects fade into the actual sky.
    let fogNow=[0.02,0.04,0.07];
    function updateFog(sunEl){const dayW=sstep(-0.06,0.18,sunEl);const golden=Math.exp(-Math.pow((sunEl-0.03)*6.5,2));const m=(a,b,t)=>a+(b-a)*t;fogNow=[m(0.016,0.55,dayW)+golden*0.10,m(0.034,0.62,dayW)+golden*0.03,m(0.070,0.75,dayW)+golden*0.005];}
    const portalPositionsFor=()=>gameCatalog.map((_,i)=>portalAt(i,sceneTime));
    function drawMesh(meshObj,model,vp,kind,tint,time,alpha=false){gl.useProgram(objP);gl.bindBuffer(gl.ARRAY_BUFFER,meshObj.pb);gl.enableVertexAttribArray(objL.pos);gl.vertexAttribPointer(objL.pos,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,meshObj.nb);gl.enableVertexAttribArray(objL.normal);gl.vertexAttribPointer(objL.normal,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshObj.ib);gl.uniformMatrix4fv(objL.mvp,false,mat.mul(vp,model));gl.uniformMatrix4fv(objL.model,false,model);gl.uniform1f(objL.kind,kind);gl.uniform1f(objL.time,time);gl.uniform3fv(objL.tint,tint);gl.uniform3f(objL.light,0,6,4);gl.uniform3fv(objL.fog,fogNow);gl.uniform3f(objL.cam,eye[0],eye[1],eye[2]);if(alpha){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);}gl.drawElements(gl.TRIANGLES,meshObj.count,gl.UNSIGNED_SHORT,0);if(alpha){gl.depthMask(true);gl.disable(gl.BLEND);}}
    function project(p,vp,w,h){const q=[p[0],p[1],p[2],1],c=[0,0,0,0];for(let i=0;i<4;i++)c[i]=vp[i]*q[0]+vp[4+i]*q[1]+vp[8+i]*q[2]+vp[12+i];if(c[3]<=.05)return null;const nx=c[0]/c[3],ny=c[1]/c[3],nz=c[2]/c[3];return{x:(nx*.5+.5)*w,y:(1-(ny*.5+.5))*h,z:nz,visible:nz>-1.1&&nz<1.1};}
    function drawGrid(vp){gl.useProgram(lineP);gl.bindBuffer(gl.ARRAY_BUFFER,gridBuffer);gl.enableVertexAttribArray(lineL.pos);gl.vertexAttribPointer(lineL.pos,3,gl.FLOAT,false,0,0);gl.uniformMatrix4fv(lineL.mvp,false,vp);gl.uniform1f(lineL.glow,0);gl.uniform1f(lineL.phase,0);gl.uniform3f(lineL.cam,eye[0],eye[1],eye[2]);gl.uniform4f(lineL.color,.38,.59,.73,.17);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.LINES,0,gridData.length/3);gl.disable(gl.BLEND);}
    function drawOrbits(vp,t){gl.useProgram(lineP);gl.enableVertexAttribArray(lineL.pos);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);const focusVisible=$('#portalFocus').classList.contains('visible');orbitBuffers.forEach((o,i)=>{const c=rgb(gameCatalog[i].color),hot=i===hover||(i===sceneSelectIndex&&focusVisible);gl.uniformMatrix4fv(lineL.mvp,false,mat.mul(vp,orbitCfg[i].model));gl.uniform1f(lineL.phase,orbitCfg[i].ph+t*orbitCfg[i].rate);gl.uniform1f(lineL.glow,1);gl.uniform4f(lineL.color,c[0],c[1],c[2],hot?.62:.30);gl.bindBuffer(gl.ARRAY_BUFFER,o.buffer);gl.vertexAttribPointer(lineL.pos,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.LINE_STRIP,0,o.count);});gl.depthMask(true);gl.disable(gl.BLEND);}
    function drawBeads(vp,t){gameCatalog.forEach((g,i)=>{const o=orbitCfg[i],color=rgb(g.color).map(v=>Math.min(1,v*.65+.35));for(let k=0;k<2;k++){const a=o.ph+t*o.rate*1.35+k*Math.PI+i*.9,p=orbitPoint(i,a),m=mat.mul(mat.trans(p[0],p[1],p[2]),mat.scale(.062,.062,.062));drawMesh(sphere,m,vp,2,color,t);}});}
    function drawCore(vp,t){const base=mat.trans(...orbitCenter);const star=mat.mul(base,mat.scale(.4,.4,.4));drawMesh(sphere,star,vp,2,[1,.63,.27],t);const halo=mat.mul(base,mat.mul(mat.rx(.22),mat.scale(.72,.72,.72)));drawMesh(torus,halo,vp,11,[1,.62,.25],t);}
    const worldCoordsEl=$('#worldCoords');let lastCoords='';
    function updateLabels(vp,w,h){selectedScreen=portalPositionsFor().map((p,i)=>project(p,vp,w,h));let nearest=-1,dist=76;selectedScreen.forEach((p,i)=>{const el=portalElements[i];if(!p||!p.visible){el.style.opacity='0';el.style.pointerEvents='none';return;}const far=Math.min(1,Math.max(0,(p.z-0.5)/0.45));el.style.left=`${p.x}px`;el.style.top=`${p.y}px`;el.style.transform=`translate(-50%,-50%) scale(${(1.22-0.42*far).toFixed(3)})`;el.style.zIndex=String(Math.max(1,Math.round((1-p.z)*80)));el.style.opacity=(1-far*0.72).toFixed(3);el.style.pointerEvents=p.z>.98?'none':'auto';const d=Math.hypot(mouse.x-p.x,mouse.y-p.y);if(d<dist){dist=d;nearest=i;}});hover=nearest;portalElements.forEach((e,i)=>e.classList.toggle('is-hovered',i===hover));const coords=`X ${eye[0].toFixed(1)} · Z ${eye[2].toFixed(1)}`;if(coords!==lastCoords){worldCoordsEl.textContent=coords;lastCoords=coords;}}
    function drawPortals(vp,t){const focusVisible=$('#portalFocus').classList.contains('visible');gameCatalog.forEach((game,i)=>{const p=portalAt(i,t),color=rgb(game.color),hovered=i===hover,selected=i===sceneSelectIndex&&focusVisible;const s=hovered||selected?1.08:1;const a=orbitPhases[i]+t*orbitRates[i];const base=mat.mul(mat.trans(p[0],p[1],p[2]),mat.mul(mat.ry(Math.sin(a)*.055),mat.rz(Math.sin(a*.5)*.018)));const ringModel=mat.mul(base,mat.scale(.92*s,1.12*s,.92*s));drawMesh(torus,ringModel,vp,11,color,t);const innerModel=mat.mul(base,mat.scale(.70*s,.88*s,.095));drawMesh(sphere,innerModel,vp,12,color,t,true);const innerRing=mat.mul(base,mat.mul(mat.rx(.02),mat.scale(.77*s,.94*s,.78*s)));drawMesh(torus,innerRing,vp,11,color.map(v=>Math.min(1,v*1.25+.1)),t);const sa=t*(.31+i*.025)+orbitPhases[i],sat=mat.mul(mat.trans(p[0]+Math.cos(sa)*1.3,p[1]+Math.sin(sa)*.48,p[2]+Math.sin(sa)*.32),mat.scale(.105,.105,.105));drawMesh(sphere,sat,vp,1,color.map(v=>Math.min(1,v*.8+.2)),t);});}
    const overlayEl=$('#gameOverlay'),motionQuery=matchMedia('(prefers-reduced-motion: reduce)');let overlayFrame=0;
    function render(now){
      // The game overlay is opaque, so the scene behind it only needs a slow repaint while it is open.
      if(overlayEl.classList.contains('open')){lastTime=now/1000;if(now-overlayFrame<250){requestAnimationFrame(render);return;}overlayFrame=now;}
      const dt=Math.min(.04,(now-lastTime*1000||16)/1000);lastTime=now/1000;const motion=motionQuery.matches?.25:1;sceneTime=now*.001*motion;const d=Math.min(devicePixelRatio||1,1.6),w=innerWidth,h=innerHeight;if(w!==cssW||h!==cssH||d!==dpr){cssW=w;cssH=h;dpr=d;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;gl.viewport(0,0,canvas.width,canvas.height);}
      if(!drag){const forward=[Math.sin(yaw),0,-Math.cos(yaw)],right=[Math.cos(yaw),0,Math.sin(yaw)],speed=dt*4.7;if(keys.KeyW||keys.ArrowUp){eye[0]+=forward[0]*speed;eye[2]+=forward[2]*speed;}if(keys.KeyS||keys.ArrowDown){eye[0]-=forward[0]*speed;eye[2]-=forward[2]*speed;}if(keys.KeyA||keys.ArrowLeft){eye[0]-=right[0]*speed;eye[2]-=right[2]*speed;}if(keys.KeyD||keys.ArrowRight){eye[0]+=right[0]*speed;eye[2]+=right[2]*speed;}if(keys.KeyQ)eye[1]-=speed;if(keys.KeyE)eye[1]+=speed;if(keys.KeyW||keys.KeyS||keys.KeyA||keys.KeyD||keys.ArrowUp||keys.ArrowDown||keys.ArrowLeft||keys.ArrowRight){targetFocus=-1;$('#portalFocus').classList.remove('visible');$('#welcomeHud').classList.add('quiet');}}
      yaw+=Math.atan2(Math.sin(yawTarget-yaw),Math.cos(yawTarget-yaw))*.055;pitch+=(pitchTarget-pitch)*.055;pitch=Math.max(-.55,Math.min(.55,pitch));eye[0]=Math.max(-16,Math.min(16,eye[0]));eye[1]=Math.max(.6,Math.min(5,eye[1]));eye[2]=Math.max(-11,Math.min(5,eye[2]));swayYaw=Math.sin(now*.00019)*.014*motion;swayPitch=Math.sin(now*.000147+2.1)*.009*motion;
      gl.disable(gl.DEPTH_TEST);gl.useProgram(skyP);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(skyL.pos);gl.vertexAttribPointer(skyL.pos,2,gl.FLOAT,false,0,0);const sky=getSky();gl.uniform2f(skyL.res,canvas.width,canvas.height);gl.uniform1f(skyL.time,now*.001*motion);gl.uniform1f(skyL.hour,sky.h);gl.uniform1f(skyL.moon,sky.phase);gl.uniform1f(skyL.doy,sky.doy);gl.uniform1f(skyL.yaw,yaw+swayYaw);gl.uniform1f(skyL.pitch,pitch+swayPitch);updateFog(sunElevation(sky.h,sky.doy));gl.drawArrays(gl.TRIANGLES,0,3);
      gl.clear(gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);const proj=mat.persp(48*Math.PI/180,w/h,.1,100);const {view}=getView();const vp=mat.mul(proj,view);updateLabels(vp,w,h);drawOrbits(vp,sceneTime);drawBeads(vp,sceneTime);drawGrid(vp);drawCore(vp,sceneTime);drawPortals(vp,sceneTime);
      if(hover>=0&&mouse.x>=0&&portalElements[hover]){world.style.cursor='pointer';}else world.style.cursor='';requestAnimationFrame(render);}
    world.addEventListener('pointerdown',e=>{mouse={x:e.clientX,y:e.clientY};if(e.target.closest('button,input,textarea,select,a,.welcome-hud,.portal-focus,.demo-hud,.setup-panel,.field-guide'))return;drag={x:e.clientX,y:e.clientY,moved:false};world.setPointerCapture?.(e.pointerId);});
    world.addEventListener('pointermove',e=>{mouse={x:e.clientX,y:e.clientY};if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;if(drag.moved){yawTarget-=dx*.0042;pitchTarget+=dy*.0032;targetFocus=-1;$('#portalFocus').classList.remove('visible');$('#welcomeHud').classList.add('quiet');}drag.x=e.clientX;drag.y=e.clientY;}});
    world.addEventListener('pointerup',e=>{if(!drag)return;const moved=drag.moved;drag=null;if(!moved&&hover>=0){if($('#portalFocus').classList.contains('visible')&&sceneSelectIndex===hover)openSetup();else selectPortal(hover);}});
    world.addEventListener('pointercancel',()=>{drag=null;});
    world.addEventListener('wheel',e=>{if(e.target.closest('#setupPanel,#fieldGuide,#guestbookPanel')||$('#gameOverlay').classList.contains('open'))return;e.preventDefault();const d=e.deltaY>0?1:-1;eye[0]+=Math.sin(yaw)*d*.7;eye[2]-=Math.cos(yaw)*d*.7;targetFocus=-1;$('#portalFocus').classList.remove('visible');},{passive:false});
    // Camera keys must not hijack dialogs: while a panel is open, arrows scroll it and WASD stays inert.
    const modalOpen=()=>['#gameOverlay','#setupPanel','#fieldGuide','#guestbookPanel'].some(s=>$(s)?.classList.contains('open'));
    document.addEventListener('keydown',e=>{if(e.target?.matches?.('input,textarea,select')||modalOpen())return;if(['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){keys[e.code]=true;e.preventDefault();}if(e.code==='Enter'&&$('#portalFocus').classList.contains('visible')&&!e.target?.closest?.('button,a,input,textarea,select'))openSetup();});
    const moveKey={up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD'};$$('[data-move]').forEach(btn=>{const code=moveKey[btn.dataset.move];btn.addEventListener('pointerdown',e=>{e.preventDefault();keys[code]=true;btn.setPointerCapture?.(e.pointerId);});const release=()=>{keys[code]=false;};btn.addEventListener('pointerup',release);btn.addEventListener('pointercancel',release);btn.addEventListener('lostpointercapture',release);});
    document.addEventListener('keyup',e=>{keys[e.code]=false;});window.addEventListener('blur',()=>keys={});
    $('#backToSky').addEventListener('click',()=>{resetWorld();});
    requestAnimationFrame(render);
  }
  initWebGL();
})();
