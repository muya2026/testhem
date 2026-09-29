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
  let selectedGame = 'psych', deck = 'odd', remoteDeck = 'odd', mode = 'local', game = null, currentPlayerId = null, localAnswerIndex = 0, localVoteIndex = 0, localGate = false, pendingVotes = {}, onlineDraftText = '', onlineDraftTruth = true, onlineDraftVotes = {}, poller = null, remoteSession = null, targetFocus = -1;
  const usedPrompts = new Set();
  const savedSession = code => { try { return JSON.parse(localStorage.getItem(`afterlight-room-${code}`) || 'null'); } catch { return null; } };
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
  let userName='';try{userName=(localStorage.getItem('testhem-player-name')||localStorage.getItem('afterlight-player-name')||'').trim().slice(0,18);}catch{}
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
    if(m.key!=='psych'&&mode==='online'){mode='local';$$('.mode-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode==='local'));$$('.mode-panel').forEach(p=>p.classList.toggle('active',p.id==='localPanel'));}
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
  // The main CTA is wired to the spatial world picker above; no page-scroll navigation.
  $$('[data-demo]').forEach(btn => btn.addEventListener('click', () => {
    const guessed = btn.dataset.demo === 'true'; const result = $('#demoResult');
    $$('#demoActions button').forEach(b => { b.disabled = true; b.classList.toggle('picked', b === btn); });
    result.innerHTML = `<b>${guessed ? 'BLUFF. YOU CAUGHT IT.' : 'BLUFF. IT GOT YOU.'}</b><span>This sample was invented. In the real game, the story comes from your crew—which makes it much harder to tell.</span><button type="button" id="demoPlay">MAKE IT PERSONAL ↗</button>`;
    result.classList.add('visible'); $('#demoPlay').addEventListener('click', () => { $('#playNow').click(); openSetup(); });
  }));
  $('#startLocal').addEventListener('click', () => {
    if (names.length < 2) return $('#localError').textContent = 'Add at least one friend. The best lies need an audience.';
    if(selectedGame!=='psych')mode='local'; usedPrompts.clear(); game = { mode: 'local', gameType:selectedGame, roomCode: 'LOCAL TABLE', hostId: 'local-host', stage: 'answer', round: 1, deck, prompt: pickGamePrompt(selectedGame), questionSet:selectedGame==='threeQ'?threeQuestionSets[Math.floor(Math.random()*threeQuestionSets.length)]:null, players: names.map((name, i) => ({ id: `p${i}-${makeId()}`, name, score: 0 })), submissions: [], votes: [] };
    localAnswerIndex = 0; localVoteIndex = 0; localGate = false; pendingVotes = {}; currentPlayerId = null; closeSetup(); overlayOpen(); render();
  });

  $('#exitGame').addEventListener('click', overlayClose);
  $('#gameOverlay').addEventListener('click', e => { if (e.target === $('#gameOverlay')) overlayClose(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#gameOverlay').classList.contains('open')) overlayClose(); });

  function onlineError(msg) { $('#onlineError').textContent = msg; }
  const config = () => window.TESTHEM_CONFIG || window.AFTERLIGHT_CONFIG || {};
  const publicApiKey = () => config().supabasePublishableKey || config().supabaseAnonKey;
  if (config().supabaseUrl && publicApiKey()) $('#backendNote').textContent = 'ONLINE ROOMS CONNECTED · INVITES ARE PRIVATE LINKS';
  async function rpc(name, params) {
    const c = config(), apiKey = publicApiKey(); if (!c.supabaseUrl || !apiKey) throw new Error('Add the Supabase project URL and publishable key to config.js. Local games work without Supabase.');
    const headers = { apikey: apiKey, 'Content-Type': 'application/json' }; if (c.supabaseAnonKey) headers.Authorization = `Bearer ${c.supabaseAnonKey}`;
    const response = await fetch(`${c.supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/${name}`, { method: 'POST', headers, body: JSON.stringify(params) });
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
    catch(e){$('#guestbookStatus').textContent='THE WALL IS NOT READY';$('#markError').textContent=`${e.message} If the room schema already exists, run supabase-guestbook-migration.sql in Supabase SQL Editor.`;$('#guestbookList').replaceChildren();}
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
  function cacheRoom(session) { localStorage.setItem(`afterlight-room-${session.code}`, JSON.stringify(session)); }
  function setRemoteRoom(session, state) { closeSetup(); remoteSession = session; currentPlayerId = session.playerId; remoteDeck = state.deck || 'odd'; onlineDraftText = ''; onlineDraftTruth = true; onlineDraftVotes = {}; game = { ...state, mode: 'online' }; overlayOpen(); render(); clearInterval(poller); poller = setInterval(loadRemote, 1800); }
  async function loadRemote() {
    if (!remoteSession) return;
    try { const view = await rpc('afterlight_get_room', { p_code: remoteSession.code, p_room_key: remoteSession.key, p_player_id: remoteSession.playerId }); const next = { ...view, mode: 'online' }; if (JSON.stringify(next) !== JSON.stringify(game)) { game = next; render(); } }
    catch (e) { $('#gameContent').innerHTML = `<div class="online-wait"><strong>RECONNECTING TO THE ROOM</strong>${esc(e.message)}</div>`; }
  }
  async function onlineAction(action, data = {}) {
    if (!remoteSession) return;
    try { const view = await rpc('afterlight_game_action', { p_code: remoteSession.code, p_room_key: remoteSession.key, p_player_id: remoteSession.playerId, p_action: action, p_data: data }); if (action === 'submit') { onlineDraftText = ''; onlineDraftTruth = true; } if (action === 'vote') onlineDraftVotes = {}; game = { ...view, mode: 'online' }; render(); }
    catch (e) { toast(e.message); }
  }
  async function createOnline() {
    onlineError(''); if(selectedGame!=='psych')return onlineError('Online rooms currently run Psych! The Truth Bluff. Pick it in the 3D game deck, or play this mode in the same room.'); const name = $('#onlineName').value.trim().slice(0, 18); if (!name) return onlineError('Choose a player name first.');
    const id = makeId();
    try {
      const out = await rpc('afterlight_create_room', { p_host_id: id, p_host_name: name });
      const session = { code: out.code, key: out.key, playerId: id, name, host: true }; cacheRoom(session);
      const joinHash = `#join=${encodeURIComponent(out.code)}&key=${encodeURIComponent(out.key)}`; history.replaceState(null, '', location.pathname + location.search + joinHash);
      setRemoteRoom(session, out.state);
    } catch (e) { onlineError(e.message); }
  }
  async function joinOnline() {
    onlineError(''); if(selectedGame!=='psych')return onlineError('Online invites currently support Psych! The Truth Bluff. Pick that mode first, or use the same-room version.'); const invite = parseInvite($('#roomInvite').value); const name = $('#onlineName').value.trim().slice(0, 18);
    if (!name) return onlineError('Enter your name above first.'); if (!invite?.code) return onlineError('Paste a room invite link or code.');
    let key = invite.key;
    const old = savedSession(invite.code); if (!key && old?.key) key = old.key;
    if (!key) return onlineError('Paste the full private invite link—not only the six-letter code.');
    const id = old?.playerId || makeId();
    try {
      const state = await rpc('afterlight_join_room', { p_code: invite.code, p_room_key: key, p_player_id: id, p_player_name: name });
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
      $('#skipSet').addEventListener('click',()=>{game.submissions.push({id:makeId(),player_id:p.id,is_pass:true});nextLocalAnswer();});return;
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
      $('#submitFact').addEventListener('click',()=>{const text=$('#hiddenFact').value.trim();if(text.length<4)return toast('A few words is enough.');game.submissions.push({id:makeId(),player_id:p.id,text,is_pass:false});nextLocalAnswer();});$('#skipFact').addEventListener('click',()=>{game.submissions.push({id:makeId(),player_id:p.id,is_pass:true});nextLocalAnswer();});return;
    }
    if(type==='questionJar'){
      game.jarQuestions=game.jarQuestions||{};if(!game.jarQuestions[p.id]){const used=Object.values(game.jarQuestions);const choices=jarPrompts.filter(q=>!used.includes(q));game.jarQuestions[p.id]=(choices.length?choices:jarPrompts)[Math.floor(Math.random()*(choices.length||jarPrompts.length))];}
      const q=game.jarQuestions[p.id];root.innerHTML=`<div class="game-eyebrow">QUESTION JAR · DRAWN FOR ${esc(p.name.toUpperCase())}</div><h2>Answer, pass, or spin.</h2><div class="game-prompt"><small>YOUR QUESTION</small><strong>${esc(q)}</strong><em>Share only what feels good. You can pass without explaining.</em></div><div class="game-form"><textarea id="jarAnswer" maxlength="180" placeholder="Your answer (or pass)..."></textarea><div class="game-actions"><button class="button-primary" id="submitJar">DROP IT IN <span>↗</span></button><button class="button-secondary" id="skipJar">PASS THIS QUESTION</button></div></div>`;
      $('#submitJar').addEventListener('click',()=>{const text=$('#jarAnswer').value.trim();if(text.length<2)return toast('Write a few words, or pass.');game.submissions.push({id:makeId(),player_id:p.id,question:q,text,is_pass:false});nextLocalAnswer();});$('#skipJar').addEventListener('click',()=>{game.submissions.push({id:makeId(),player_id:p.id,question:q,is_pass:true});nextLocalAnswer();});return;
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
      root.innerHTML = `<div class="pass-screen"><span class="pass-lock">◉</span><span class="game-eyebrow">ANSWERS ARE IN · VOTING TIME</span><h2>Pass to ${esc(p.name)}.</h2><p class="game-sub">Guess whether each answer is real or bluff. Your own answer is hidden from the pile and cannot be voted on.</p><button class="button-primary" id="readyVote">I'M ${esc(p.name.toUpperCase())} <span>↗</span></button><div class="progress-label" style="margin-top:15px">${game.votes.length / Math.max(game.players.length, 1) | 0} OF ${game.players.length} BALLOTS COMPLETE</div></div>`;
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
    root.innerHTML=`<div class="game-eyebrow">${label} · ROUND ${game.round}</div><h2>${type==='questionJar'?'The best bits stay with you.':'Did you read them right?'}</h2><p class="game-sub">${scoring}</p><div class="scoreboard">${board.map(p=>`<span class="score-chip">${esc(p.name)} <b>${p.now}</b></span>`).join('')}</div><div>${rows}</div><div class="game-actions">${canNext?'<button class="button-primary" id="nextRound">RUN IT BACK <span>↗</span></button>':'<span class="online-wait"><strong>ROUND SCORES LOCKED</strong>The host can start another round whenever the crew is ready.</span>'}<button class="button-secondary" id="closeResults">BACK TO THE GAME DECK</button></div>`;
    $('#nextRound')?.addEventListener('click',async()=>{if(game.mode==='online'){const next=pickPrompt(game.deck||'odd');await onlineAction('start',{prompt:next,deck:game.deck||'odd'});}else{game.players.forEach(p=>{p.score=(p.score||0)+(points[p.id]||0);});game.round++;game.prompt=pickGamePrompt(game.gameType);game.questionSet=game.gameType==='threeQ'?threeQuestionSets[Math.floor(Math.random()*threeQuestionSets.length)]:null;game.jarQuestions={};game.submissions=[];game.votes=[];localAnswerIndex=0;localVoteIndex=0;localGate=false;pendingVotes={};game.stage='answer';render();}});
    $('#closeResults').addEventListener('click',()=>{overlayClose();resetWorld();});
  }

  function renderOnline(root) {
    if (game.stage === 'lobby') {
      const isHost = currentPlayerId === game.hostId;
      const url = `${location.origin}${location.pathname}${location.search}#join=${encodeURIComponent(remoteSession.code)}&key=${encodeURIComponent(remoteSession.key)}`;
      root.innerHTML = `<div class="game-eyebrow">PRIVATE ONLINE ORBIT · ROOM ${esc(remoteSession.code)}</div><h2>${isHost ? 'Your room is open.' : 'You made it.'}</h2><p class="game-sub">Send the invite to your friends. Two or more players to start. Answers stay hidden until everyone is ready.</p><div class="online-code">${esc(remoteSession.code)} <button class="button-secondary" id="copyInvite">COPY INVITE LINK</button></div><div class="scoreboard">${game.players.map(p => `<span class="score-chip">${esc(p.name)}${p.id === game.hostId ? ' · HOST' : ''}</span>`).join('')}</div>${isHost ? `<div class="deck-picker"><span class="small-label">CHOOSE A DECK FOR ROUND ONE</span><div class="deck-options">${[['odd','ODDLY SPECIFIC'],['deep','DEEP ORBIT'],['either','WOULD YOU RATHER']].map(([k,v])=>`<button class="deck-option ${k===remoteDeck?'selected':''}" data-remote-deck="${k}">${v}</button>`).join('')}</div></div><div class="game-actions"><button class="button-primary" id="startOnlineRound" ${game.players.length<2?'disabled':''}>START THE ROUND <span>↗</span></button></div>` : `<div class="online-wait"><strong>WAITING FOR THE HOST</strong>The host will light the fuse when everyone is here.</div>`}<p class="setup-error" id="roomInlineError"></p>`;
      $('#copyInvite')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(url); toast('Private invite copied. Send it to your crew.'); } catch { toast(url); } });
      $$('[data-remote-deck]', root).forEach(b => b.addEventListener('click', () => { remoteDeck = b.dataset.remoteDeck; $$('[data-remote-deck]', root).forEach(x => x.classList.toggle('selected', x === b)); }));
      $('#startOnlineRound')?.addEventListener('click', async () => { const prompt = pickPrompt(remoteDeck); await onlineAction('start', { prompt, deck: remoteDeck }); });
      return;
    }
    if (game.stage === 'answer') {
      const mine = game.submissions?.find(s => s.player_id === currentPlayerId);
      if (mine) { root.innerHTML = `<div class="game-eyebrow">ANSWER RECEIVED · ${game.submissionCount}/${game.players.length}</div><h2>You're in the mix.</h2><div class="online-wait"><strong>WAITING FOR YOUR ORBIT</strong>Your friends are writing their answers. No one can see yours until the reveal.</div><div class="progress-rail"><i style="width:${(game.submissionCount/game.players.length)*100}%"></i></div><div class="progress-label">${game.submissionCount} OF ${game.players.length} ANSWERS LOCKED</div>`; return; }
      root.innerHTML = `<div class="game-eyebrow">ONLINE ROUND ${game.round} · ${game.submissionCount}/${game.players.length} ANSWERS IN</div><h2>Your call: true or bluff?</h2><p class="game-sub">Everyone else is writing too. Your answer stays sealed until the whole room is ready.</p>${promptMarkup()}<div class="game-form"><textarea id="onlineAnswer" maxlength="180" placeholder="Write your answer... (or pass)"></textarea><div class="truth-choice"><button class="${onlineDraftTruth?'chosen':''}" data-online-truth="true">✦ &nbsp;THIS IS TRUE</button><button class="${!onlineDraftTruth?'chosen':''}" data-online-truth="false">⌁ &nbsp;I MADE IT UP</button></div><div class="game-actions"><button class="button-primary" id="sendOnlineAnswer">SEAL MY ANSWER <span>↗</span></button><button class="button-secondary" id="passOnline">PASS</button></div></div>`;
      $('#onlineAnswer').value = onlineDraftText; $('#onlineAnswer').addEventListener('input', e => { onlineDraftText = e.target.value; });
      $$('[data-online-truth]', root).forEach(b => b.addEventListener('click', () => { $$('[data-online-truth]', root).forEach(x => x.classList.remove('chosen')); b.classList.add('chosen'); onlineDraftTruth = b.dataset.onlineTruth === 'true'; }));
      $('#sendOnlineAnswer').addEventListener('click', async () => { const text = $('#onlineAnswer').value.trim(); if (text.length < 3) return toast('A few words is enough.'); await onlineAction('submit', { text, is_truth: onlineDraftTruth }); });
      $('#passOnline').addEventListener('click', async () => onlineAction('submit', { is_pass: true })); return;
    }
    if (game.stage === 'vote') {
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
    if (prior) { remoteSession = prior; currentPlayerId = prior.playerId; rpc('afterlight_get_room', { p_code: prior.code, p_room_key: prior.key, p_player_id: prior.playerId }).then(state => setRemoteRoom(prior, state)).catch(() => { $('#roomInvite').value = location.href; }); }
    else { $$('.mode-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode==='online')); $$('.mode-panel').forEach(p=>p.classList.toggle('active',p.id==='onlinePanel')); mode='online'; $('#roomInvite').value=location.href; resumeRoomAfterIdentity=!userName; openSetup(); }
  }
  initInvite();

  // Three-dimensional observatory: the sky is a time-aware atmospheric shader;
  // game portals live in navigable world space, not in a flat carousel.
  let focusPortal=()=>{}, resetCamera=()=>{};
  const canvas=$('#universe'),world=$('#world');
  const skyVS=`attribute vec2 aPosition; varying vec2 vUv; void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
  const skyFS=`precision highp float; varying vec2 vUv; uniform vec2 uResolution; uniform float uTime,uSky,uHour,uMoonPhase;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} 
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);} 
    float fbm(vec2 p){float v=0.,a=.52;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+vec2(7.1,3.8);a*=.49;}return v;}
    void main(){vec2 uv=vUv;float aspect=uResolution.x/uResolution.y;float horizon=.245;float h=smoothstep(horizon-.04,.96,uv.y);
      vec3 zenith=vec3(.018,.037,.084),mid=vec3(.035,.105,.19),horizonCol=vec3(.13,.24,.32);
      vec3 dawnZen=vec3(.075,.12,.27),dawnMid=vec3(.50,.34,.39),dawnHor=vec3(.99,.59,.36);
      vec3 dayZen=vec3(.075,.34,.64),dayMid=vec3(.24,.61,.82),dayHor=vec3(.69,.83,.86);
      vec3 duskZen=vec3(.045,.045,.15),duskMid=vec3(.37,.19,.38),duskHor=vec3(.97,.40,.28);
      vec3 nCol=mix(horizonCol,mix(mid,zenith,smoothstep(.18,.9,h)),h);
      vec3 dwn=mix(dawnHor,mix(dawnMid,dawnZen,smoothstep(.14,1.,h)),h);
      vec3 day=mix(dayHor,mix(dayMid,dayZen,smoothstep(.15,1.,h)),h);
      vec3 dsk=mix(duskHor,mix(duskMid,duskZen,smoothstep(.16,1.,h)),h);
      vec3 col=nCol;if(uSky<.5)col=nCol;else if(uSky<1.5)col=dwn;else if(uSky<2.5)col=day;else col=dsk;
      float flow=uTime*.003;float cloudA=fbm(vec2(uv.x*3.0+flow,uv.y*10.0-flow*.35));float cloudB=fbm(vec2(uv.x*7.3-flow*.55,uv.y*19.0+flow*.2));float cloudBand=1.-smoothstep(.18,.55,uv.y);float cloudMask=smoothstep(.53,.79,cloudA*.72+cloudB*.28)*cloudBand;
      vec3 cloudNight=vec3(.25,.34,.48),cloudDay=vec3(.91,.95,.97),cloudDawn=vec3(.97,.64,.51),cloudDusk=vec3(.82,.38,.36);vec3 cloudCol=uSky<.5?cloudNight:(uSky<1.5?cloudDawn:(uSky<2.5?cloudDay:cloudDusk));
      float cloudOpacity=cloudMask*(uSky<.5?.32:.48);col=mix(col,cloudCol,cloudOpacity);
      float hourAngle=(uHour-12.)/12.*3.14159265;float sunX=.5+.38*cos(hourAngle);float daylight=clamp((sin((uHour-6.)/12.*3.14159265)+.15)*1.5,0.,1.);float sunY=.28+.52*max(0.,sin((uHour-6.)/12.*3.14159265));vec2 sunPos=vec2(sunX,sunY);float sd=length((uv-sunPos)*vec2(aspect,1.));float sunGlow=exp(-sd*sd*180.);float sunDisk=1.-smoothstep(.009,.013,sd);vec3 sunColor=uSky<1.5?vec3(1.,.73,.51):vec3(1.,.91,.72);col+=sunColor*sunGlow*(uSky==2.? .55:.9);col=mix(col,sunColor,sunDisk*daylight*.9);
      vec2 moonPos=vec2(.76,.67);vec2 mxy=(uv-moonPos)*vec2(aspect,1.);float md=length(mxy);float moonEdge=1.-smoothstep(.025,.028,md);float mx=mxy.x/.026;float my=mxy.y/.026;float sphereZ=sqrt(max(0.,1.-mx*mx-my*my));float phaseAngle=uMoonPhase*6.2831853;vec3 moonNormal=normalize(vec3(mx,my,sphereZ));float moonLight=max(dot(moonNormal,normalize(vec3(cos(phaseAngle),sin(phaseAngle),.72))),0.);float moonGate=1.-smoothstep(.008,.04,daylight);vec3 moonColor=mix(vec3(.34,.43,.58),vec3(.90,.91,.79),.35+.65*moonLight);col+=vec3(.25,.37,.62)*exp(-md*md*110.)*.13*moonGate;col=mix(col,moonColor,moonEdge*moonGate*(.25+.75*moonLight));
      vec2 cells=uv*vec2(250.,130.);vec2 id=floor(cells),f=fract(cells)-.5;float rnd=hash(id);float star=(1.-smoothstep(.008,.035,length(f)))*step(.992,rnd);float twinkle=.55+.45*sin(uTime*(1.1+hash(id+13.)*2.5)+rnd*45.);float night=1.-smoothstep(.15,.75,daylight);col+=mix(vec3(.61,.75,.98),vec3(.83,.73,1.),hash(id+5.))*star*twinkle*night*.8;
      float milky=fbm(vec2(uv.x*5.+uv.y*2.,uv.y*5.-flow*.4));float band=exp(-pow((uv.x*.55+uv.y*.72-.65),2.)*45.);col+=vec3(.22,.31,.50)*band*milky*night*.11;
      float haze=exp(-pow((uv.y-horizon)*13.,2.));col+=mix(vec3(.48,.30,.30),vec3(.60,.76,.86),smoothstep(.15,.7,daylight))*haze*(uSky==1.||uSky==3.? .18:.11);
      float vig=1.-smoothstep(.45,1.15,length((uv-.5)*vec2(aspect*.78,1.)));col*=.78+.22*vig;gl_FragColor=vec4(col,1.);}`;
  const objVS=`attribute vec3 aPosition;attribute vec3 aNormal;uniform mat4 uMVP,uModel;varying vec3 vNormal,vWorld,vLocal;void main(){vec4 w=uModel*vec4(aPosition,1.);vWorld=w.xyz;vLocal=aPosition;vNormal=normalize(mat3(uModel)*aNormal);gl_Position=uMVP*vec4(aPosition,1.);}`;
  const objFS=`precision highp float;uniform float uKind,uTime;uniform vec3 uTint,uLight;varying vec3 vNormal,vWorld,vLocal;void main(){vec3 N=normalize(vNormal),L=normalize(uLight-vWorld),V=normalize(vec3(0.,1.,5.)-vWorld);float diff=max(dot(N,L),0.);float fres=pow(1.-max(dot(N,V),0.),2.2);float pulse=.78+.22*sin(uTime*1.7+uTint.r*8.);if(uKind>10.5){if(uKind<11.5){vec3 c=uTint*(.82+.5*diff)+uTint*fres*.65;gl_FragColor=vec4(c,1.);}else{float bands=.5+.5*sin(vLocal.x*9.+uTime*1.4);vec3 c=uTint*(.35+fres*1.6)*pulse+vec3(.12,.17,.26)*bands;gl_FragColor=vec4(c,.60); }return;}float lit=.18+.82*diff;vec3 c=uTint*lit+uTint*fres*.28;gl_FragColor=vec4(c,1.);}`;
  const lineVS=`attribute vec3 aPosition;uniform mat4 uMVP;void main(){gl_Position=uMVP*vec4(aPosition,1.);}`;
  const lineFS=`precision mediump float;uniform vec4 uColor;void main(){gl_FragColor=uColor;}`;
  function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s));return null;}return s;}
  function program(gl,vs,fs){const v=shader(gl,gl.VERTEX_SHADER,vs),f=shader(gl,gl.FRAGMENT_SHADER,fs);if(!v||!f)return null;const p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){console.warn(gl.getProgramInfoLog(p));return null;}return p;}
  const mat={identity:()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),mul:(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;},trans:(x,y,z)=>{const o=mat.identity();o[12]=x;o[13]=y;o[14]=z;return o;},scale:(x,y,z)=>new Float32Array([x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1]),rx:a=>new Float32Array([1,0,0,0,0,Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1]),ry:a=>new Float32Array([Math.cos(a),0,-Math.sin(a),0,0,1,0,0,Math.sin(a),0,Math.cos(a),0,0,0,0,1]),rz:a=>new Float32Array([Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1,0,0,0,0,1]),persp:(fov,aspect,n,f)=>{const t=1/Math.tan(fov/2),nf=1/(n-f);return new Float32Array([t/aspect,0,0,0,0,t,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0]);},look:(eye,center)=>{const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l)},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];const z=norm([eye[0]-center[0],eye[1]-center[1],eye[2]-center[2]]),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}};
  function sphereMesh(gl,lat=24,lon=32){const p=[],n=[],ix=[];for(let y=0;y<=lat;y++){const v=y/lat,ph=v*Math.PI;for(let x=0;x<=lon;x++){const u=x/lon,th=u*Math.PI*2,px=-Math.cos(th)*Math.sin(ph),py=Math.cos(ph),pz=Math.sin(th)*Math.sin(ph);p.push(px,py,pz);n.push(px,py,pz);}}for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){const a=y*(lon+1)+x,b=a+lon+1;ix.push(a,b,a+1,b,b+1,a+1);}return mesh(gl,p,n,ix);}
  function torusMesh(gl,R=1,r=.055,major=40,minor=8){const p=[],n=[],ix=[];for(let i=0;i<=major;i++){const u=i/major*Math.PI*2;for(let j=0;j<=minor;j++){const v=j/minor*Math.PI*2;const x=(R+r*Math.cos(v))*Math.cos(u),y=(R+r*Math.cos(v))*Math.sin(u),z=r*Math.sin(v);p.push(x,y,z);n.push(Math.cos(v)*Math.cos(u),Math.cos(v)*Math.sin(u),Math.sin(v));}}for(let i=0;i<major;i++)for(let j=0;j<minor;j++){const a=i*(minor+1)+j,b=a+minor+1;ix.push(a,b,a+1,b,b+1,a+1);}return mesh(gl,p,n,ix);}
  function mesh(gl,p,n,ix){const pb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(p),gl.STATIC_DRAW);const nb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(n),gl.STATIC_DRAW);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ix),gl.STATIC_DRAW);return{pb,nb,ib,count:ix.length};}
  function rgb(hex){const n=parseInt(String(hex).replace('#',''),16);return[((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255];}
  function initWebGL(){
    let gl;try{gl=canvas.getContext('webgl',{alpha:false,antialias:true,powerPreference:'high-performance'});}catch(e){}if(!gl){document.body.classList.add('webgl-fallback');return;}
    const skyP=program(gl,skyVS,skyFS),objP=program(gl,objVS,objFS),lineP=program(gl,lineVS,lineFS);if(!skyP||!objP||!lineP){document.body.classList.add('webgl-fallback');return;}
    const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const sphere=sphereMesh(gl),torus=torusMesh(gl);const gridData=[];for(let x=-16;x<=16;x+=1)gridData.push(x,-.7,-5,x,-.7,-32);for(let z=-5;z>=-32;z-=1)gridData.push(-16,-.7,z,16,-.7,z);const gridBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,gridBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(gridData),gl.STATIC_DRAW);const orbitBuffers=orbitRadii.map((r,i)=>{const a=[];for(let j=0;j<=180;j++){const q=j/180*Math.PI*2;a.push(Math.cos(q)*r,orbitCenter[1]+Math.sin(q+orbitPhases[i]*.37)*r*.055,orbitCenter[2]+Math.sin(q)*r*orbitTilts[i]);}const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(a),gl.STATIC_DRAW);return{buffer:b,count:a.length/3};});
    const loc=(p,n)=>gl.getAttribLocation(p,n),un=(p,n)=>gl.getUniformLocation(p,n);
    const skyL={pos:loc(skyP,'aPosition'),res:un(skyP,'uResolution'),time:un(skyP,'uTime'),sky:un(skyP,'uSky'),hour:un(skyP,'uHour'),moon:un(skyP,'uMoonPhase')};
    const objL={pos:loc(objP,'aPosition'),normal:loc(objP,'aNormal'),mvp:un(objP,'uMVP'),model:un(objP,'uModel'),kind:un(objP,'uKind'),time:un(objP,'uTime'),tint:un(objP,'uTint'),light:un(objP,'uLight')};
    const lineL={pos:loc(lineP,'aPosition'),mvp:un(lineP,'uMVP'),color:un(lineP,'uColor')};
    let cssW=0,cssH=0,dpr=1;const eye=[0,1.55,1.0];let yaw=0,pitch=.015,yawTarget=0,pitchTarget=.015;let keys={},drag=null,mouse={x:-999,y:-999},selectedScreen=[];let lastTime=0,sceneTime=0,hover=-1;
    const orbitRadii=[7.8,7.2,6.6,6.0,6.6,7.2,7.8],orbitPhases=[2.65,2.35,1.98,1.57,1.15,.8,.5],orbitRates=[.052,.058,.067,.08,.067,.058,.052],orbitTilts=[.23,.27,.31,.35,.39,.43,.47],orbitCenter=[0,2.05,-17];
    function portalAt(i,t){const a=orbitPhases[i]+t*orbitRates[i],r=orbitRadii[i],tilt=orbitTilts[i];return[Math.cos(a)*r,orbitCenter[1]+Math.sin(a+orbitPhases[i]*.37)*r*.055,orbitCenter[2]+Math.sin(a)*r*tilt];}
    function getView(){const cp=Math.cos(pitch),dir=[Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp];const center=[eye[0]+dir[0],eye[1]+dir[1],eye[2]+dir[2]];return{dir,view:mat.look(eye,center)};}
    function portalTarget(i){const p=portalAt(i,sceneTime);const dx=p[0]-eye[0],dy=p[1]-eye[1],dz=p[2]-eye[2];yawTarget=Math.atan2(dx,-dz);pitchTarget=Math.atan2(dy,Math.hypot(dx,dz));}
    focusPortal=i=>portalTarget(i);resetCamera=()=>{eye[0]=0;eye[1]=1.55;eye[2]=1;yawTarget=0;pitchTarget=.015;};
    const getSky=()=>{const h=new Date().getHours()+new Date().getMinutes()/60;let sky=0;if(h>=5&&h<8)sky=1;else if(h>=8&&h<17)sky=2;else if(h>=17&&h<20)sky=3;const phase=((Date.now()/86400000+4.867)%29.53059)/29.53059;return{h,sky,phase};};
    const portalPositionsFor=()=>gameCatalog.map((_,i)=>portalAt(i,sceneTime));
    function drawMesh(meshObj,model,vp,kind,tint,time,alpha=false){gl.useProgram(objP);gl.bindBuffer(gl.ARRAY_BUFFER,meshObj.pb);gl.enableVertexAttribArray(objL.pos);gl.vertexAttribPointer(objL.pos,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,meshObj.nb);gl.enableVertexAttribArray(objL.normal);gl.vertexAttribPointer(objL.normal,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshObj.ib);gl.uniformMatrix4fv(objL.mvp,false,mat.mul(vp,model));gl.uniformMatrix4fv(objL.model,false,model);gl.uniform1f(objL.kind,kind);gl.uniform1f(objL.time,time);gl.uniform3fv(objL.tint,tint);gl.uniform3f(objL.light,0,6,4);if(alpha){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);}gl.drawElements(gl.TRIANGLES,meshObj.count,gl.UNSIGNED_SHORT,0);if(alpha){gl.depthMask(true);gl.disable(gl.BLEND);}}
    function project(p,vp,w,h){const q=[p[0],p[1],p[2],1],c=[0,0,0,0];for(let i=0;i<4;i++)c[i]=vp[i]*q[0]+vp[4+i]*q[1]+vp[8+i]*q[2]+vp[12+i];if(c[3]<=.05)return null;const nx=c[0]/c[3],ny=c[1]/c[3],nz=c[2]/c[3];return{x:(nx*.5+.5)*w,y:(1-(ny*.5+.5))*h,z:nz,visible:nz>-1.1&&nz<1.1};}
    function drawGrid(vp){gl.useProgram(lineP);gl.bindBuffer(gl.ARRAY_BUFFER,gridBuffer);gl.enableVertexAttribArray(lineL.pos);gl.vertexAttribPointer(lineL.pos,3,gl.FLOAT,false,0,0);gl.uniformMatrix4fv(lineL.mvp,false,vp);gl.uniform4f(lineL.color,.38,.59,.73,.12);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.LINES,0,gridData.length/3);gl.disable(gl.BLEND);}
    function drawOrbits(vp){gl.useProgram(lineP);gl.enableVertexAttribArray(lineL.pos);gl.uniformMatrix4fv(lineL.mvp,false,vp);gl.uniform4f(lineL.color,.49,.66,.84,.25);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);orbitBuffers.forEach(o=>{gl.bindBuffer(gl.ARRAY_BUFFER,o.buffer);gl.vertexAttribPointer(lineL.pos,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.LINE_STRIP,0,o.count);});gl.depthMask(true);gl.disable(gl.BLEND);}
    function drawCore(vp,t){const base=mat.trans(...orbitCenter);const star=mat.mul(base,mat.scale(.4,.4,.4));drawMesh(sphere,star,vp,1,[1,.63,.27],t);const halo=mat.mul(base,mat.mul(mat.rx(.22),mat.scale(.72,.72,.72)));drawMesh(torus,halo,vp,11,[1,.62,.25],t);}
    function updateLabels(vp,w,h){selectedScreen=portalPositionsFor().map((p,i)=>project(p,vp,w,h));let nearest=-1,dist=76;selectedScreen.forEach((p,i)=>{const el=portalElements[i];if(!p||!p.visible){el.style.opacity='0';el.style.pointerEvents='none';return;}el.style.left=`${p.x}px`;el.style.top=`${p.y}px`;el.style.opacity=p.z>.94?'.35':'1';el.style.pointerEvents=p.z>.98?'none':'auto';const d=Math.hypot(mouse.x-p.x,mouse.y-p.y);if(d<dist){dist=d;nearest=i;}});hover=nearest;portalElements.forEach((e,i)=>e.classList.toggle('is-hovered',i===hover));$('#worldCoords').textContent=`X ${eye[0].toFixed(1)} · Z ${eye[2].toFixed(1)}`;}
    function drawPortals(vp,t){gameCatalog.forEach((game,i)=>{const p=portalAt(i,t),color=rgb(game.color),hovered=i===hover,selected=i===sceneSelectIndex&&$('#portalFocus').classList.contains('visible');const s=hovered||selected?1.08:1;const a=orbitPhases[i]+t*orbitRates[i];const base=mat.mul(mat.trans(p[0],p[1],p[2]),mat.mul(mat.ry(Math.sin(a)*.055),mat.rz(Math.sin(a*.5)*.018)));const ringModel=mat.mul(base,mat.scale(.92*s,1.12*s,.92*s));drawMesh(torus,ringModel,vp,11,color,t);const innerModel=mat.mul(base,mat.scale(.70*s,.88*s,.095));drawMesh(sphere,innerModel,vp,12,color,t,true);const innerRing=mat.mul(base,mat.mul(mat.rx(.02),mat.scale(.77*s,.94*s,.78*s)));drawMesh(torus,innerRing,vp,11,color.map(v=>Math.min(1,v*1.25+.1)),t);const sa=t*(.31+i*.025)+orbitPhases[i],sat=mat.mul(mat.trans(p[0]+Math.cos(sa)*1.3,p[1]+Math.sin(sa)*.48,p[2]+Math.sin(sa)*.32),mat.scale(.105,.105,.105));drawMesh(sphere,sat,vp,1,color.map(v=>Math.min(1,v*.8+.2)),t);});}
    function render(now){const dt=Math.min(.04,(now-lastTime*1000||16)/1000);lastTime=now/1000;const motion=matchMedia('(prefers-reduced-motion: reduce)').matches?.25:1;sceneTime=now*.001*motion;const d=Math.min(devicePixelRatio||1,1.6),w=innerWidth,h=innerHeight;if(w!==cssW||h!==cssH||d!==dpr){cssW=w;cssH=h;dpr=d;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;gl.viewport(0,0,canvas.width,canvas.height);}
      if(!drag){const forward=[Math.sin(yaw),0,-Math.cos(yaw)],right=[Math.cos(yaw),0,Math.sin(yaw)],speed=dt*4.7;if(keys.KeyW||keys.ArrowUp){eye[0]+=forward[0]*speed;eye[2]+=forward[2]*speed;}if(keys.KeyS||keys.ArrowDown){eye[0]-=forward[0]*speed;eye[2]-=forward[2]*speed;}if(keys.KeyA||keys.ArrowLeft){eye[0]-=right[0]*speed;eye[2]-=right[2]*speed;}if(keys.KeyD||keys.ArrowRight){eye[0]+=right[0]*speed;eye[2]+=right[2]*speed;}if(keys.KeyQ)eye[1]-=speed;if(keys.KeyE)eye[1]+=speed;if(keys.KeyW||keys.KeyS||keys.KeyA||keys.KeyD||keys.ArrowUp||keys.ArrowDown||keys.ArrowLeft||keys.ArrowRight){targetFocus=-1;$('#portalFocus').classList.remove('visible');$('#welcomeHud').classList.add('quiet');}}
      yaw+=Math.atan2(Math.sin(yawTarget-yaw),Math.cos(yawTarget-yaw))*.055;pitch+=(pitchTarget-pitch)*.055;pitch=Math.max(-.55,Math.min(.55,pitch));eye[0]=Math.max(-16,Math.min(16,eye[0]));eye[1]=Math.max(.6,Math.min(5,eye[1]));eye[2]=Math.max(-11,Math.min(5,eye[2]));
      gl.disable(gl.DEPTH_TEST);gl.useProgram(skyP);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(skyL.pos);gl.vertexAttribPointer(skyL.pos,2,gl.FLOAT,false,0,0);const sky=getSky();gl.uniform2f(skyL.res,canvas.width,canvas.height);gl.uniform1f(skyL.time,now*.001*motion);gl.uniform1f(skyL.sky,sky.sky);gl.uniform1f(skyL.hour,sky.h);gl.uniform1f(skyL.moon,sky.phase);gl.drawArrays(gl.TRIANGLES,0,3);
      gl.clear(gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);const proj=mat.persp(48*Math.PI/180,w/h,.1,100);const {view}=getView();const vp=mat.mul(proj,view);updateLabels(vp,w,h);drawOrbits(vp);drawGrid(vp);drawCore(vp,sceneTime);drawPortals(vp,sceneTime);
      if(hover>=0&&mouse.x>=0&&portalElements[hover]){world.style.cursor='pointer';}else world.style.cursor='';requestAnimationFrame(render);}
    world.addEventListener('pointerdown',e=>{mouse={x:e.clientX,y:e.clientY};if(e.target.closest('button,input,textarea,select,a,.welcome-hud,.portal-focus,.demo-hud,.setup-panel,.field-guide'))return;drag={x:e.clientX,y:e.clientY,moved:false};world.setPointerCapture?.(e.pointerId);});
    world.addEventListener('pointermove',e=>{mouse={x:e.clientX,y:e.clientY};if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;if(drag.moved){yawTarget-=dx*.0042;pitchTarget+=dy*.0032;targetFocus=-1;$('#portalFocus').classList.remove('visible');$('#welcomeHud').classList.add('quiet');}drag.x=e.clientX;drag.y=e.clientY;}});
    world.addEventListener('pointerup',e=>{if(!drag)return;const moved=drag.moved;drag=null;if(!moved&&hover>=0){if($('#portalFocus').classList.contains('visible')&&sceneSelectIndex===hover)openSetup();else selectPortal(hover);}});
    world.addEventListener('pointercancel',()=>{drag=null;});
    world.addEventListener('wheel',e=>{if(e.target.closest('#setupPanel,#fieldGuide')||$('#gameOverlay').classList.contains('open'))return;e.preventDefault();const d=e.deltaY>0?1:-1;eye[0]+=Math.sin(yaw)*d*.7;eye[2]-=Math.cos(yaw)*d*.7;targetFocus=-1;$('#portalFocus').classList.remove('visible');},{passive:false});
    document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;if(['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){keys[e.code]=true;e.preventDefault();}if(e.code==='Enter'&&$('#portalFocus').classList.contains('visible')&&!$('#gameOverlay').classList.contains('open'))openSetup();});
    const moveKey={up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD'};$$('[data-move]').forEach(btn=>{const code=moveKey[btn.dataset.move];btn.addEventListener('pointerdown',e=>{e.preventDefault();keys[code]=true;btn.setPointerCapture?.(e.pointerId);});const release=()=>{keys[code]=false;};btn.addEventListener('pointerup',release);btn.addEventListener('pointercancel',release);btn.addEventListener('lostpointercapture',release);});
    document.addEventListener('keyup',e=>{keys[e.code]=false;});window.addEventListener('blur',()=>keys={});
    $('#backToSky').addEventListener('click',()=>{resetWorld();});
    requestAnimationFrame(render);
  }
  initWebGL();
})();
