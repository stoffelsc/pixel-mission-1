import './style.css';
import { categories, questions, type CategoryId, type Question } from './questions';

type Save = Record<CategoryId, number>;
const app = document.querySelector<HTMLDivElement>('#app')!;
const storageKey = 'pixel-mission1-v2';
const defaultSave = (): Save => ({ hardware:0,components:0,peripherals:0,connectors:0,keyboard:0 });
function readSave(): Save { try { const raw = JSON.parse(localStorage.getItem(storageKey) || '{}') as Partial<Save>; return { ...defaultSave(), ...raw }; } catch { return defaultSave(); } }
let saved = readSave();
let active: CategoryId = 'hardware';
let quizMode=false;
let quizList:Question[]=[];
let quizResults:Record<CategoryId,{ok:number;total:number}>={hardware:{ok:0,total:0},components:{ok:0,total:0},peripherals:{ok:0,total:0},connectors:{ok:0,total:0},keyboard:{ok:0,total:0}};
let index = 0;
let score = 0;
let answered = false;
let selected = new Set<string>();
let matched: [string,string][] = [];
let chosenLeft: string | null = null;
let arranged: string[] = [];
let typed = '';
let lastCorrect = false;
let visualChoice = "";
const h = (value: string) => value.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
const list = () => quizMode ? quizList : questions.filter(q=>q.category === active);
const current = () => list()[index];
const cat = () => categories.find(c=>c.id===active)!;
const countStars = () => Object.entries(saved).filter(([k,n])=>n >= Math.ceil(questions.filter(q=>q.category===k).length*0.75)).length;
const mascot = (_mood: 'happy' | 'thinking' = 'happy') => `<img class="real-mascot" src="./images/pixel.webp" alt="Pixel, la mascotte bleue du Monde de Pixel" />`;
function portSvg(name: string): string {
 const lookup:Record<string,string>={'HDMI':'hdmi','VGA':'vga','DisplayPort':'displayport','RJ45':'rj45','Jack 3,5 mm':'jack','USB-A':'usb-a','USB-B':'usb-b','USB-C':'usb-c','Mini-USB':'mini-usb','Micro-USB':'micro-usb','DC-IN':'dc-in','ram':'ram','rom':'rom','ssd':'ssd','hdd-internal':'hdd-internal','hdd-external':'hdd-external','usb':'usb','cpu':'cpu'};
 const file=lookup[name];
 if(name==='DisplayPort')return `<div class="tech-photo dp-exact"><svg viewBox="0 0 680 370" role="img" aria-label="Connecteur DisplayPort avec un angle supérieur droit coupé"><defs><linearGradient id="dpsteel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eef3f8"/><stop offset=".23" stop-color="#8996a5"/><stop offset=".58" stop-color="#cfd7df"/><stop offset="1" stop-color="#526478"/></linearGradient><linearGradient id="dpbody" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3e4856"/><stop offset="1" stop-color="#101b29"/></linearGradient></defs><rect width="680" height="370" rx="25" fill="#e7f7ff"/><ellipse cx="343" cy="301" rx="230" ry="29" fill="#8db9d4" opacity=".3"/><path d="M65 141L230 141L230 253L65 253Q33 200 65 141Z" fill="#1a2535" stroke="#526477" stroke-width="7"/><path d="M224 108L460 108L565 200L565 283L224 283Z" fill="url(#dpbody)" stroke="#263749" stroke-width="10"/><path d="M273 121L466 121L552 200L552 276L273 276Z" fill="url(#dpsteel)" stroke="#536780" stroke-width="9"/><path d="M307 149L447 149L513 207L513 246L307 246Z" fill="#111d2c" stroke="#63758a" stroke-width="5"/><g fill="#e4b451">${Array.from({length:16},(_,i)=>'<rect x="'+(319+i%8*22)+'" y="'+(177+Math.floor(i/8)*23)+'" width="14" height="12" rx="2"/>').join('')}</g><path d="M466 121L552 200" stroke="#ffffff" stroke-opacity=".85" stroke-width="8"/><path d="M470 121L550 201" stroke="#213a57" stroke-width="2"/></svg></div>`;return file ? `<div class="tech-photo ${file==='rom'?'rom-photo':''}"><img src="./images/${file}.webp" alt="Observe cet élément informatique" loading="eager"/></div>` : '';
}
function computerSvg():string{
 return `<div class="computer-diagram" role="group" aria-label="Composants stylisés d’une unité centrale"><div class="pc-frame"><div class="motherboard"><span class="circuit-line l1"></span><span class="circuit-line l2"></span><button type="button" data-component="CPU" class="pc-part cpu"><span>▣</span><small>CPU</small></button><button type="button" data-component="RAM" class="pc-part ram"><span>▥▥</span><small>RAM</small></button><button type="button" data-component="SSD" class="pc-part ssd"><span>▤</span><small>SSD</small></button><button type="button" data-component="Ventilateur" class="pc-part fan"><span>✺</span><small>Ventilateur</small></button></div></div></div>`;
}
function keyboardHtml():string{
 const keyrows=[
 [['²',''],['&','1'],['é','2'],['"','3'],["'",'4'],['(','5'],['-','6'],['è','7'],['_','8'],['ç','9'],['à','0 · @'],[')','°'],['=','+'],['⌫','']],
 [['Tab',''],['A',''],['Z',''],['E','€'],['R',''],['T',''],['Y',''],['U',''],['I',''],['O',''],['P',''],['^','¨'],['$','£'],['Entrée','']],
 [['Verr Maj',''],['Q',''],['S',''],['D',''],['F',''],['G',''],['H',''],['J',''],['K',''],['L',''],['M',''],['ù','%'],['*','µ']],
 [['Maj',''],['<','>'],['W',''],['X',''],['C',''],['V',''],['B',''],['N',''],[',','?'],[';','.'],[':','/'],['!','§'],['Maj','']],
 [['Ctrl',''],['Win',''],['Alt',''],['Espace',''],['AltGr',''],['Menu',''],['Ctrl','']]
 ];
 return `<div class="keyboard-scroll"><div class="virtual-keyboard fr-fr" role="group" aria-label="Clavier entier AZERTY français France">${keyrows.map(row=>`<div class="key-row">${row.map(([key,sub])=>{let id=key==='AltGr'?'AltGr':key==='à'?'0':key;const long=key.length>3?'wide-key':'';return `<button type="button" data-key="${h(id)}" class="virtual-key ${long}" aria-label="Touche ${h(id)}">${h(key)}${sub?`<small>${h(sub)}</small>`:''}</button>`}).join('')}</div>`).join('')}</div></div>`;
}
function shell(content: string) {
 app.innerHTML = `<div class="world"><div class="orbs" aria-hidden="true"><i></i><i></i><i></i></div><div class="layout"><header class="topbar"><button class="brand" data-action="home" aria-label="Retour à l'accueil"><span class="brand-mark">P</span><span><strong>LE MONDE DE PIXEL</strong><small>Apprendre en jouant</small></span></button><div class="top-right"><span class="mission-pill">✨ Mission 01</span><span class="star-count" title="Rubriques réussies">⭐ ${countStars()} / 5</span></div></header>${content}<footer class="footer">Mission 1 · Mon poste de travail <span>•</span> Formation numérique <span>•</span> Sans publicité</footer></div></div>`;
 app.querySelector<HTMLButtonElement>('[data-action="home"]')?.addEventListener('click', home);
}
function home() {
 quizMode=false;

 const done = categories.filter(c=>saved[c.id]>0).length;
 shell(`<main><section class="hero"><div class="hero-copy"><div class="eyebrow">TON AVENTURE NUMÉRIQUE</div><h1>Mission 1<span class="title-accent">.</span><br><span>Mon poste de travail</span></h1><p>Aide Pixel à retrouver ses connaissances ! Explore les défis, gagne des étoiles et deviens incollable sur l’ordinateur.</p><div class="hero-stats"><div><strong>5</strong><small>univers à explorer</small></div><div><strong>12</strong><small>questions par rubrique</small></div><div><strong>${done}/5</strong><small>univers essayés</small></div></div></div><div class="hero-art"><div class="speech">Prêt·e pour le défi ?</div>${mascot()}<span class="spark s1">✦</span><span class="spark s2">✧</span><span class="spark s3">✳</span><div class="ground"></div></div></section><section class="section-intro"><div><div class="eyebrow">CHOISIS TA RUBRIQUE</div><h2>À toi de jouer !</h2><p>12 questions par rubrique · 60 questions d’entraînement · Quiz bilan de 20 questions.</p></div><div class="legend">⭐ Étoile obtenue à partir de 75 %</div></section><div class="category-grid">${categories.map((c,n)=>`<button class="category-card ${c.accent}" data-cat="${c.id}"><span class="card-top"><span class="cat-icon">${c.icon}</span><span class="cat-number">0${n+1}</span></span><span class="cat-title">${h(c.title)}</span><span class="cat-subtitle">${h(c.subtitle)}</span><span class="cat-bottom"><span class="card-progress">${saved[c.id] ? `${saved[c.id]}/${questions.filter(q=>q.category===c.id).length} · ${saved[c.id] >= Math.ceil(questions.filter(q=>q.category===c.id).length*.75) ? '⭐ Réussi' : 'À améliorer'}` : 'Pas encore joué'}</span><span class="arrow-circle">↗</span></span></button>`).join('')}</div><section class="final-quiz-promo"><div><span>🏆 ÉVALUATION FINALE</span><h2>Le grand quiz de Pixel</h2><p>20 questions : 4 par rubrique. Découvre tes réussites et ce qu’il te reste à retravailler.</p></div><button class="primary-button" data-action="start-quiz">Commencer le quiz →</button></section></main>`);
 app.querySelector('[data-action="start-quiz"]')?.addEventListener('click',startQuiz);
 app.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.cat as CategoryId)));
}
function start(category: CategoryId) { quizMode=false; active=category;index=0;score=0; resetQuestion(); renderQuestion(); }
function startQuiz(){quizMode=true;active='hardware';index=0;score=0;quizResults={hardware:{ok:0,total:0},components:{ok:0,total:0},peripherals:{ok:0,total:0},connectors:{ok:0,total:0},keyboard:{ok:0,total:0}};quizList=categories.flatMap(c=>{const set=questions.filter(q=>q.category===c.id).filter(q=>q.type!=='pair'&&q.type!=='order'&&q.type!=='board');return c.id==='keyboard'?[set[0],set[4],set[5],set[8]]:set.slice(0,4);});resetQuestion();renderQuestion();}
function resetQuestion(){answered=false;selected=new Set();matched=[];chosenLeft=null;arranged=[];typed='';lastCorrect=false;visualChoice='';}
function options(q: Question): string {
 if(q.type==='visual')return `<div class="illustration-panel">${portSvg(q.visual!)}</div><div class="options">${q.choices!.map((v,i)=>`<button class="option" data-opt="${i}" aria-pressed="false"><span class="option-letter">${'ABCD'[i]}</span><span>${h(v)}</span><span class="option-check">✓</span></button>`).join('')}</div>`;
 if(q.type==='board')return `<p class="diagram-guide">Touche l’emplacement correspondant au composant demandé.</p>${computerSvg()}<div id="board-status" class="selection-note">Sélectionne une zone du schéma.</div>`;
 if(q.type==='azerty')return `<p class="diagram-guide">Choisis les touches à presser simultanément.</p>${keyboardHtml()}<div id="board-status" class="selection-note">Aucune touche choisie.</div>`;
 if(q.type==='choice'||q.type==='multi')return `<div class="options">${q.choices!.map((v,i)=>`<button class="option" data-opt="${i}" aria-pressed="false"><span class="option-letter">${'ABCD'[i]}</span><span>${h(v)}</span><span class="option-check">✓</span></button>`).join('')}</div>`;
 if(q.type==='input') return `${keyboardHtml()}<div class="input-wrap"><label for="answer-input">Ta réponse</label><input id="answer-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Écris ta réponse ici…" maxlength="60"/><span>Respecte les accents et les caractères demandés.</span></div>`;
 if(q.type==='pair')return `<div class="match-hint">1. Touche un élément à gauche, puis sa correspondance à droite.</div><div class="match-grid"><div class="match-col">${q.pairs!.map(([a],i)=>`<button class="match-item" data-left="${i}">${h(a)}</button>`).join('')}</div><div class="match-col">${[...q.pairs!].reverse().map(([,b],i)=>`<button class="match-item" data-right="${i}">${h(b)}</button>`).join('')}</div></div><div class="selection-note" id="selection-note">${q.pairs!.length} associations à trouver.</div>`;
 return `<div class="match-hint">Appuie sur les éléments dans le bon ordre.</div><div class="order-preview" id="order-preview">Ton ordre apparaîtra ici…</div><div class="order-options">${[...q.items!].reverse().map((v,i)=>`<button class="order-item" data-order="${i}">${h(v)} <span>＋</span></button>`).join('')}</div><button class="reset-order" data-action="clear-order">↺ Recommencer l’ordre</button>`;
}
function renderQuestion(){
 const q=current();const n=list().length;const progress=Math.round(index/n*100);
 shell(`<main class="game-main"><div class="game-head"><button class="back-button" data-action="back">← Les rubriques</button><div class="mini-score">⭐ ${score} point${score>1?'s':''}</div></div><div class="challenge-banner ${cat().accent}"><span class="banner-icon">${cat().icon}</span><div><span class="eyebrow">${quizMode?'QUIZ FINAL · '+h(categories.find(c=>c.id===q.category)!.title):'RUBRIQUE '+(categories.findIndex(c=>c.id===active)+1)+' / 5'}</span><h2>${quizMode?'Évaluation des connaissances':h(cat().title)}</h2></div><span class="banner-pixel">✦</span></div><div class="progress-label"><span>Question <strong>${index+1}</strong> sur <strong>${n}</strong></span><span>${progress}% terminé</span></div><div class="progress-track"><div style="width:${progress}%"></div></div><section class="question-card"><div class="question-header"><span class="type-tag">${({visual:'Reconnaissance visuelle',board:'Schéma interactif',azerty:'Clavier interactif',choice:'Choix / Vrai ou faux',multi:'Plusieurs réponses',pair:'Associations',input:'À écrire',order:'Remettre en ordre'} as const)[q.type]}</span><span class="question-decoration">✳</span></div><h1>${h(q.prompt)}</h1>${q.caption?`<p class="question-caption">${h(q.caption)}</p>`:''}${options(q)}<div id="feedback" aria-live="polite"></div><div class="question-actions"><span class="action-hint">${q.type==='multi'?'Plusieurs bonnes réponses possibles':q.type==='pair'?'Associe tous les éléments':q.type==='order'?'Chaque élément compte': 'Prends le temps de réfléchir'}</span><button class="primary-button" id="check" disabled>Vérifier ma réponse <span>→</span></button></div></section><div class="game-tip">💡 <span><strong>Le conseil de Pixel :</strong> Une erreur, c’est une occasion d’apprendre !</span></div></main>`);
 app.querySelector('[data-action="back"]')?.addEventListener('click',home);
 const check=app.querySelector<HTMLButtonElement>('#check')!;
 if(q.type==='choice'||q.type==='multi'||q.type==='visual')app.querySelectorAll<HTMLButtonElement>('[data-opt]').forEach(btn=>btn.addEventListener('click',()=>{
 if(answered)return;const val=q.choices![Number(btn.dataset.opt)];if(q.type==='choice'||q.type==='visual')selected=new Set([val]);else if(selected.has(val))selected.delete(val);else selected.add(val);
 app.querySelectorAll<HTMLButtonElement>('[data-opt]').forEach(b=>{const on=selected.has(q.choices![Number(b.dataset.opt)]);b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});check.disabled=selected.size===0;
 }));
 if(q.type==='board')app.querySelectorAll<HTMLButtonElement>('[data-component]').forEach(b=>b.addEventListener('click',()=>{if(answered)return;visualChoice=b.dataset.component!;app.querySelectorAll('[data-component]').forEach(x=>x.classList.toggle('chosen',x===b));app.querySelector('#board-status')!.textContent=`Zone choisie : ${visualChoice}`;check.disabled=false;}));
 if(q.type==='azerty')app.querySelectorAll<HTMLButtonElement>('[data-key]').forEach(b=>b.addEventListener('click',()=>{if(answered)return;const key=b.dataset.key!;if(selected.has(key))selected.delete(key);else selected.add(key);b.classList.toggle('chosen',selected.has(key));app.querySelector('#board-status')!.textContent=selected.size?`Touches : ${[...selected].join(' + ')}`:'Aucune touche choisie.';check.disabled=selected.size===0;}));
 if(q.type==='input')app.querySelector<HTMLInputElement>('#answer-input')?.addEventListener('input',e=>{typed=(e.target as HTMLInputElement).value;check.disabled=!typed.trim();});
 if(q.type==='pair'){
 const left=app.querySelectorAll<HTMLButtonElement>('[data-left]');const right=app.querySelectorAll<HTMLButtonElement>('[data-right]');
 left.forEach(b=>b.addEventListener('click',()=>{if(answered||b.disabled)return;chosenLeft=q.pairs![Number(b.dataset.left)][0];left.forEach(x=>x.classList.remove('selected'));b.classList.add('selected');}));
 right.forEach(b=>b.addEventListener('click',()=>{if(answered||b.disabled||!chosenLeft)return;const val=[...q.pairs!].reverse()[Number(b.dataset.right)][1];matched.push([chosenLeft,val]);const l=[...left].find(x=>q.pairs![Number(x.dataset.left)][0]===chosenLeft)!;l.disabled=true;l.classList.remove('selected');l.classList.add('paired');b.disabled=true;b.classList.add('paired');const palette=['#e4f2ff','#e9f8e8','#fff1d8','#f4e5ff'];const color=palette[(matched.length-1)%palette.length];l.style.background=color;b.style.background=color;l.style.borderColor=color;b.style.borderColor=color;chosenLeft=null;app.querySelector('#selection-note')!.textContent=`${matched.length}/${q.pairs!.length} associations réalisées`;check.disabled=matched.length!==q.pairs!.length;}));
 }
 if(q.type==='order'){
 const buttons=app.querySelectorAll<HTMLButtonElement>('[data-order]');buttons.forEach(b=>b.addEventListener('click',()=>{if(answered||b.disabled)return;arranged.push([...q.items!].reverse()[Number(b.dataset.order)]);b.disabled=true;b.classList.add('paired');app.querySelector('#order-preview')!.textContent=arranged.map((a,i)=>`${i+1}. ${a}`).join('  →  ');check.disabled=arranged.length!==q.items!.length;}));
 app.querySelector('[data-action="clear-order"]')?.addEventListener('click',()=>{arranged=[];buttons.forEach(b=>{b.disabled=false;b.classList.remove('paired');});app.querySelector('#order-preview')!.textContent='Ton ordre apparaîtra ici…';check.disabled=true;});
 }
 check.addEventListener('click',()=>answered?next():validate());
}
const normalize = (s: string) => s.normalize('NFC').trim().toLocaleLowerCase('fr-FR').replace(/\s+/g,' ');
function validate(){
 if(answered)return;const q=current();if(q.type==='choice'||q.type==='multi'||q.type==='visual')lastCorrect=selected.size===q.correct!.length&&q.correct!.every(v=>selected.has(v));
 else if(q.type==='board')lastCorrect=visualChoice===q.target;
 else if(q.type==='azerty'){const keys=q.target!.split(' + ').map(v=>v==='AltGr'?'AltGr':v);lastCorrect=selected.size===keys.length&&keys.every(v=>selected.has(v));}
 else if(q.type==='input')lastCorrect=q.accepted!.some(v=>normalize(v)===normalize(typed));
 else if(q.type==='pair')lastCorrect=matched.length===q.pairs!.length&&matched.every(([a,b])=>q.pairs!.some(([x,y])=>x===a&&y===b));
 else lastCorrect=arranged.join('\u0000')===q.correct!.join('\u0000');
 answered=true;if(lastCorrect)score++;if(quizMode){quizResults[q.category].total++;if(lastCorrect)quizResults[q.category].ok++;}
 app.querySelectorAll<HTMLButtonElement>('.option,.match-item,.order-item,.reset-order,[data-component],[data-key]').forEach(b=>{b.disabled=true;});
 app.querySelector<HTMLInputElement>('#answer-input')?.setAttribute('disabled','true');
 if(q.type==='choice'||q.type==='multi'||q.type==='visual')app.querySelectorAll<HTMLButtonElement>('.option').forEach(b=>{const val=q.choices![Number(b.dataset.opt)];if(q.correct!.includes(val))b.classList.add('right-answer');else if(selected.has(val))b.classList.add('wrong-answer');});
 const answer=q.type==='board'||q.type==='azerty'?`<div class="solution">Réponse : ${h(q.target!)}</div>`:q.type==='choice'||q.type==='multi'||q.type==='visual'?`<div class="solution">Réponse${q.correct!.length>1?'s':''} : ${q.correct!.map(h).join(' · ')}</div>`:q.type==='input'?`<div class="solution">Réponse : ${h(q.accepted![0])}</div>`:'';
 app.querySelector('#feedback')!.innerHTML=`<div class="feedback ${lastCorrect?'success':'error'}"><strong>${lastCorrect?'🎉 Bien joué !':'💪 Continue, tu progresses !'}</strong><p>${h(q.explanation)}</p>${!lastCorrect?answer:''}</div>`;
 const check=app.querySelector<HTMLButtonElement>('#check')!;check.disabled=false;check.innerHTML=index===list().length-1?'Voir mon résultat <span>→</span>':'Question suivante <span>→</span>';
 app.querySelector('.action-hint')!.textContent=lastCorrect?'+1 point gagné !':'Tu peux retenter ce défi plus tard.';
}
function next(){if(index<list().length-1){index++;resetQuestion();renderQuestion();}else finish();}
function finish(){if(quizMode){const result=categories.map(c=>{const d=quizResults[c.id];const pct=d.total?Math.round(d.ok/d.total*100):0;return `<div class="quiz-domain"><strong>${c.icon} ${h(c.title)} : ${d.ok}/${d.total}</strong><span class="quiz-meter"><i style="width:${pct}%"></i></span><p>${pct===100?'Excellent : notions maîtrisées.':pct>=75?'Bien : vérifie encore les notions où tu hésites.':pct>=50?'À consolider : révise les exemples et refais la rubrique.':'Priorité : retravaille cette rubrique et recommence les exercices.'}</p></div>`}).join('');shell(`<main class="result-main"><section class="result-card"><div class="result-art">${mascot()}</div><div class="eyebrow">BILAN DES 5 RUBRIQUES</div><h1>Ton bilan de connaissances</h1><div class="score-circle"><strong>${score}<small>/20</small></strong><span>bonnes réponses</span></div><p>Voici les notions à retravailler, rubrique par rubrique :</p><div class="quiz-results">${result}</div><div class="result-buttons"><button class="secondary-button" data-action="redo-quiz">↻ Refaire le quiz</button><button class="primary-button" data-action="menu">Retour à l’accueil →</button></div></section></main>`);app.querySelector('[data-action="redo-quiz"]')?.addEventListener('click',startQuiz);app.querySelector('[data-action="menu"]')?.addEventListener('click',home);return;}saved[active]=Math.max(saved[active],score);try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{}
 const success=score>=Math.ceil(list().length*.75);const detail=score===list().length?'Parfait ! Toutes les réponses sont correctes.':success?'Super ! Tu maîtrises bien cette rubrique.':'Tu as appris plein de choses ! Rejoue pour gagner ton étoile.';
 shell(`<main class="result-main"><section class="result-card"><div class="result-art">${mascot()}<div class="result-spark">${success?'⭐':'✨'}</div></div><div class="eyebrow">DÉFI TERMINÉ</div><h1>${success?'Mission accomplie !':'Belle exploration !'}</h1><p class="result-subtitle">${h(detail)}</p><div class="score-circle"><strong>${score}<small>/ ${list().length}</small></strong><span>bonnes réponses</span></div><div class="result-chip">${cat().icon} ${h(cat().title)} ${success?'· ⭐ Étoile débloquée':'· Encore un effort !'}</div><div class="result-buttons"><button class="secondary-button" data-action="replay">↻ Rejouer</button><button class="primary-button" data-action="menu">Autres rubriques →</button></div></section></main>`);
 app.querySelector('[data-action="replay"]')?.addEventListener('click',()=>start(active));app.querySelector('[data-action="menu"]')?.addEventListener('click',home);
}
home();
