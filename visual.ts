// Défis tactiles complémentaires, sans glisser-déposer, jouables sur petit écran.
type Challenge = {title:string; instruction:string; items:{label:string;hint:string;answer:string;art:string}[]; choices:string[]};
const connectorArt=(shape:string)=>`<svg viewBox="0 0 170 110" role="img" aria-label="Illustration d'un connecteur"><rect x="18" y="18" width="134" height="74" rx="15" fill="#e8eef9" stroke="#9aaac8" stroke-width="3"/><g transform="translate(85 55)">${shape}</g></svg>`;
const portShapes:Record<string,string>={
 'USB-A':'<rect x="-32" y="-15" width="64" height="30" rx="3" fill="#414f68"/><rect x="-26" y="-10" width="52" height="20" rx="2" fill="#d8e0ee"/><rect x="-24" y="1" width="48" height="7" fill="#f3f6fc"/>',
 'USB-C':'<rect x="-33" y="-13" width="66" height="26" rx="13" fill="#485772"/><rect x="-28" y="-8" width="56" height="16" rx="8" fill="#d8e0ee"/><rect x="-21" y="-2" width="42" height="4" rx="2" fill="#8596b5"/>',
 'HDMI':'<path d="M-34 -17H34L27 17H-27Z" fill="#3f4b62"/><path d="M-27 -10H27L22 9H-22Z" fill="#d8e0ee"/><path d="M-20 0H20" stroke="#70809c" stroke-width="3"/>',
 'RJ45':'<path d="M-30 -22H30V22H-30Z" fill="#46536b"/><path d="M-23 -15H23V14H-23Z" fill="#d9e3ef"/><path d="M-15 -16V0M-9 -16V0M-3 -16V0M3 -16V0M9 -16V0M15 -16V0" stroke="#e7b45e" stroke-width="3"/>',
 'VGA':'<path d="M-38 -16L-29 -23H29L38 -16L32 21H-32Z" fill="#405070"/><path d="M-29 -12L-23 -17H23L29 -12L25 11H-25Z" fill="#9cb4d3"/>'+Array.from({length:15},(_,i)=>`<circle cx="${-17+(i%5)*8}" cy="${-8+Math.floor(i/5)*8}" r="2" fill="#344762"/>`).join(''),
 'DisplayPort':'<path d="M-31 -19H19L31 -7V19H-31Z" fill="#475771"/><path d="M-23 -11H16L23 -4V11H-23Z" fill="#d7e0ee"/>',
 'USB-B':'<path d="M-25 -22H25V22H-25Z" fill="#455371"/><path d="M-17 -14H17V14H-17Z" fill="#d7e0ee"/><rect x="-14" y="-9" width="28" height="13" fill="#7688a5"/>',
 'Micro-USB':'<path d="M-34 -10H34L27 10H-27Z" fill="#485770"/><path d="M-27 -5H27L22 5H-22Z" fill="#d8e0ee"/>',
 'Jack 3,5 mm':'<rect x="-34" y="-7" width="58" height="14" rx="5" fill="#b8c3d6"/><rect x="-34" y="-7" width="8" height="14" fill="#303d54"/><rect x="-9" y="-7" width="5" height="14" fill="#303d54"/><rect x="15" y="-7" width="5" height="14" fill="#303d54"/>',
 'DC-IN':'<circle r="25" fill="#475570"/><circle r="17" fill="#dee5ee"/><circle r="8" fill="#647793"/>',
 'Mini-USB':'<path d="M-30 -15H30L25 15H-25Z" fill="#45536e"/><path d="M-22 -8H22L19 8H-19Z" fill="#d5deeb"/>'
};
const ports:Challenge={title:'Laboratoire des connecteurs',instruction:'Observe la forme de la prise, puis choisis son nom.',choices:Object.keys(portShapes),items:Object.entries(portShapes).map(([label,art])=>({label,art:connectorArt(art),answer:label,hint:'Regarde la silhouette et les détails du connecteur.'}))};
const keyboard:Challenge={title:'Clavier AZERTY belge',instruction:'Observe la touche mise en évidence, puis sélectionne le caractère ou l’action correspondante.',choices:['@','é','è','ç','à','€','Maj + lettre','Ctrl + C','Ctrl + V','Retour arrière'],items:[
 {label:'AltGr + 2',answer:'@',hint:'Maintenir AltGr et appuyer sur 2.',art:'2'},
 {label:'Touche é',answer:'é',hint:'La touche é du clavier belge.',art:'é'},
 {label:'Touche è',answer:'è',hint:'La touche è du clavier belge.',art:'è'},
 {label:'Touche ç',answer:'ç',hint:'La touche ç du clavier belge.',art:'ç'},
 {label:'Touche à',answer:'à',hint:'La touche à du clavier belge.',art:'à'},
 {label:'AltGr + E',answer:'€',hint:'Combinaison courante sur AZERTY belge.',art:'E'},
 {label:'Maj + lettre',answer:'Maj + lettre',hint:'Écrit une majuscule ponctuelle.',art:'⇧'},
 {label:'Ctrl + C',answer:'Ctrl + C',hint:'Raccourci qui copie.',art:'C'},
 {label:'Ctrl + V',answer:'Ctrl + V',hint:'Raccourci qui colle.',art:'V'},
 {label:'Retour arrière',answer:'Retour arrière',hint:'Efface le caractère avant le curseur.',art:'⌫'}
]};
const components:Challenge={title:'Atelier de montage',instruction:'Place chaque pièce dans la zone qui correspond à son rôle dans l’ordinateur.',choices:['Calcul et exécution','Mémoire de travail','Stockage durable','Alimentation électrique','Refroidissement','Carte principale','Mémoire non volatile'],items:[
 {label:'Processeur (CPU)',answer:'Calcul et exécution',hint:'Il exécute les instructions.',art:'⚙️'},
 {label:'Barrette de RAM',answer:'Mémoire de travail',hint:'Elle garde temporairement les données utilisées.',art:'▥'},
 {label:'Disque SSD',answer:'Stockage durable',hint:'Les fichiers restent après l’arrêt.',art:'▣'},
 {label:'Disque HDD',answer:'Stockage durable',hint:'Stocke les fichiers sur des plateaux magnétiques.',art:'◉'},
 {label:'Bloc d’alimentation',answer:'Alimentation électrique',hint:'Il apporte l’énergie aux composants.',art:'🔋'},
 {label:'Ventilateur',answer:'Refroidissement',hint:'Il fait circuler l’air.',art:'✺'},
 {label:'Carte mère',answer:'Carte principale',hint:'Elle relie les composants entre eux.',art:'▦'},
 {label:'ROM',answer:'Mémoire non volatile',hint:'Elle conserve des instructions sans alimentation.',art:'▤'}
]};
const activities=[ports,keyboard,components];
export function visualGames(mount:HTMLElement,back:()=>void){let activity=0;let index=0;let points=0;let answered=false;
 const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
 const renderMenu=()=>{mount.innerHTML=`<main class="visual-main"><button class="back-button" id="vback">← Accueil</button><div class="visual-title"><div class="eyebrow">ATELIER INTERACTIF</div><h1>Les défis visuels de Pixel</h1><p>Trois mini-jeux tactiles pour observer et manipuler les notions autrement.</p></div><div class="visual-menu">${activities.map((a,i)=>`<button class="visual-tile" data-activity="${i}"><span class="visual-emoji">${['🔌','⌨️','🧩'][i]}</span><strong>${esc(a.title)}</strong><small>${a.items.length} défis</small><span>Jouer →</span></button>`).join('')}</div></main>`;mount.querySelector('#vback')?.addEventListener('click',back);mount.querySelectorAll<HTMLButtonElement>('[data-activity]').forEach(b=>b.addEventListener('click',()=>{activity=Number(b.dataset.activity);index=0;points=0;renderQuestion();}));};
 const renderQuestion=()=>{const a=activities[activity];if(index===a.items.length){mount.innerHTML=`<main class="visual-main"><section class="visual-panel visual-finish"><div class="visual-emoji">⭐</div><h1>Défi terminé !</h1><p>${points} bonne${points>1?'s':''} réponse${points>1?'s':''} sur ${a.items.length}.</p><button class="primary-button" id="vmenu">Choisir un autre atelier →</button></section></main>`;mount.querySelector('#vmenu')?.addEventListener('click',renderMenu);return;}
 answered=false;const item=a.items[index];const question=activity===2?`Quelle zone du PC correspond à « ${esc(item.label)} » ?`:`${activity===0?'Quel connecteur est représenté ?':`Quel résultat ou raccourci correspond à « ${esc(item.label)} » ?`}`;
 const candidates=[item.answer,...a.choices.filter(x=>x!==item.answer).sort((x,y)=>hash(x,index)-hash(y,index)).slice(0,3)].sort((x,y)=>hash(x,index+7)-hash(y,index+7));
 mount.innerHTML=`<main class="visual-main"><button class="back-button" id="vback">← Les défis visuels</button><section class="visual-panel"><div class="visual-progress"><strong>${esc(a.title)}</strong><span>${index+1} / ${a.items.length} · ⭐ ${points}</span></div><div class="progress-track"><div style="width:${index/a.items.length*100}%"></div></div><h2>${question}</h2>${activity===0?`<div class="connector-illustration">${item.art}</div>`:activity===1?`<div class="keyboard-illustration"><div class="keyrow">${['A','Z','E','R','T','Y','U','I','O','P'].map(k=>`<span>${k}</span>`).join('')}</div><div class="keyrow">${['Q','S','D','F','G','H','J','K','L','M'].map(k=>`<span>${k}</span>`).join('')}</div><div class="keyrow"><span>Ctrl</span><span>AltGr</span><span class="litkey">${esc(item.art)}</span><span>Maj</span><span>↵</span></div></div>`:`<div class="component-illustration"><div class="pc-outline"><div class="pc-icon">${item.art}</div><strong>${esc(item.label)}</strong></div></div>`}<div class="visual-answers">${candidates.map(c=>`<button class="option visual-option" data-answer="${esc(c)}">${esc(c)}</button>`).join('')}</div><div id="vfeedback" aria-live="polite"></div><button class="primary-button visual-next" id="vnext" hidden>Question suivante →</button></section></main>`;
 mount.querySelector('#vback')?.addEventListener('click',renderMenu);mount.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(b=>b.addEventListener('click',()=>{if(answered)return;answered=true;const ok=b.dataset.answer===item.answer;if(ok)points++;mount.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(btn=>{btn.disabled=true;if(btn.dataset.answer===item.answer)btn.classList.add('right-answer');else if(btn===b)btn.classList.add('wrong-answer');});mount.querySelector('#vfeedback')!.innerHTML=`<div class="feedback ${ok?'success':'error'}"><strong>${ok?'🎉 Bravo !':'💡 À retenir'}</strong><p>${esc(item.hint)} Bonne réponse : <strong>${esc(item.answer)}</strong>.</p></div>`;const next=mount.querySelector<HTMLButtonElement>('#vnext')!;next.hidden=false;next.textContent=index===a.items.length-1?'Voir mon score →':'Question suivante →';}));mount.querySelector('#vnext')?.addEventListener('click',()=>{index++;renderQuestion();});};
 function hash(s:string,seed:number){let n=seed*101+31;for(const c of s)n=(n*33+c.charCodeAt(0))|0;return n;}
 renderMenu();}
