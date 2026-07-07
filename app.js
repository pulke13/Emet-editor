/* Emet Editor - mobile PWA
   Tabbed rich-text editor mirroring the Windows compact text editor.
   Text/metadata in localStorage; binary assets (images, audio, files) in IndexedDB.
   Everything stays on the device. */

const K = {
  tabs:'emet_editor_tabs_v1', active:'emet_editor_active',
  lang:'emet_editor_lang', theme:'emet_editor_theme', fs:'emet_editor_fontsize',
  snips:'emet_editor_snippets', rems:'emet_editor_reminders'
};

/* ---------- translations ---------- */
const I18N = {
  en:{ langLabel:'עב', appTitle:'Emet Editor', menu:'Menu',
    navigation:'Bookmarks / Navigation', snippets:'Snippets', reminders:'Reminders',
    export_html:'Export this tab (.html)', export_txt:'Export this tab (.txt)',
    backup:'Back up everything', restore:'Restore from backup', delete_tab:'Delete current tab',
    rename_tab:'Rename tab', tab_name:'Name', save:'Save',
    ph_find:'Find...', ph_replace:'Replace with...', find_next:'Next', replace:'Replace', replace_all:'All',
    words:'words', chars:'chars', saved:'saved', saving:'saving...',
    t_added:'New tab', t_deleted:'Tab deleted', t_renamed:'Renamed',
    confirm_del_tab:'Delete this tab and its text? This cannot be undone.',
    confirm_restore:'This will REPLACE everything with the backup. Continue?',
    exported:'Exported', restored:'Backup restored', backed_up:'Backup saved', badfile:'Not a valid backup file',
    replaced_all:'Replaced', not_found:'Not found', textcolor:'Text color', highlight:'Highlight',
    ph_untitled:'Untitled', ph_start:'Start typing...',
    insert:'Insert', ins_table:'Table', ins_image:'Image', ins_file:'File attachment', ins_audio:'Audio note',
    rows:'Rows', cols:'Columns',
    bookmark:'Bookmark this line', bm_remove:'Remove bookmark', no_bookmarks:'No bookmarks yet',
    snip_save:'Save selection as snippet', no_snippets:'No snippets yet', snip_label:'Name this snippet:',
    select_first:'Select some text first', inserted:'Inserted', snip_saved:'Snippet saved', deleted:'Deleted',
    rem_add:'Add reminder', rem_edit:'Edit reminder', rem_title:'Title', rem_time:'Time', rem_color:'Color',
    no_reminders:'No reminders yet', rem_saved:'Reminder saved', rem_fired:'Reminder', allow_notif:'Allow notifications for alarms',
    rec_start:'Start recording', rec_stop:'Stop', rec_insert:'Insert into note', recording:'Recording...', tap_record:'Tap to record',
    mic_denied:'Microphone not available',
    image_opts:'Image', img_small:'Small', img_medium:'Medium', img_full:'Full width', img_delete:'Delete image',
    table_added:'Table inserted', image_added:'Image added', file_added:'File attached', audio_added:'Audio note added',
    open:'Open' },
  he:{ langLabel:'EN', appTitle:'עורך אמת', menu:'תפריט',
    navigation:'סימניות / ניווט', snippets:'קטעים שמורים', reminders:'תזכורות',
    export_html:'ייצא לשונית זו (‎.html)', export_txt:'ייצא לשונית זו (‎.txt)',
    backup:'גבה הכל', restore:'שחזר מגיבוי', delete_tab:'מחק לשונית נוכחית',
    rename_tab:'שנה שם לשונית', tab_name:'שם', save:'שמור',
    ph_find:'חיפוש...', ph_replace:'החלף ב...', find_next:'הבא', replace:'החלף', replace_all:'הכל',
    words:'מילים', chars:'תווים', saved:'נשמר', saving:'שומר...',
    t_added:'לשונית חדשה', t_deleted:'הלשונית נמחקה', t_renamed:'השם שונה',
    confirm_del_tab:'למחוק את הלשונית והטקסט שלה? לא ניתן לבטל.',
    confirm_restore:'פעולה זו תחליף את הכל בגיבוי. להמשיך?',
    exported:'יוצא', restored:'הגיבוי שוחזר', backed_up:'הגיבוי נשמר', badfile:'קובץ גיבוי לא תקין',
    replaced_all:'הוחלף', not_found:'לא נמצא', textcolor:'צבע טקסט', highlight:'הדגשה',
    ph_untitled:'ללא שם', ph_start:'התחל להקליד...',
    insert:'הוספה', ins_table:'טבלה', ins_image:'תמונה', ins_file:'צירוף קובץ', ins_audio:'הקלטה קולית',
    rows:'שורות', cols:'עמודות',
    bookmark:'סמן שורה זו', bm_remove:'הסר סימנייה', no_bookmarks:'אין סימניות עדיין',
    snip_save:'שמור בחירה כקטע', no_snippets:'אין קטעים שמורים', snip_label:'שם לקטע:',
    select_first:'סמן קודם טקסט', inserted:'נוסף', snip_saved:'הקטע נשמר', deleted:'נמחק',
    rem_add:'הוסף תזכורת', rem_edit:'ערוך תזכורת', rem_title:'כותרת', rem_time:'שעה', rem_color:'צבע',
    no_reminders:'אין תזכורות עדיין', rem_saved:'התזכורת נשמרה', rem_fired:'תזכורת', allow_notif:'אשר התראות לתזכורות',
    rec_start:'התחל הקלטה', rec_stop:'עצור', rec_insert:'הוסף לפתק', recording:'מקליט...', tap_record:'הקש כדי להקליט',
    mic_denied:'המיקרופון אינו זמין',
    image_opts:'תמונה', img_small:'קטנה', img_medium:'בינונית', img_full:'רוחב מלא', img_delete:'מחק תמונה',
    table_added:'הטבלה נוספה', image_added:'התמונה נוספה', file_added:'הקובץ צורף', audio_added:'ההקלטה נוספה',
    open:'פתח' }
};
let lang = localStorage.getItem(K.lang) || 'en';
function t(k){ return (I18N[lang]&&I18N[lang][k]) || I18N.en[k] || k; }

const TEXT_COLORS = ['#f2f2f5','#FF4C4C','#007BFF','#28a745','#FFBF00','#a855f7','#ff8c00','#000000'];
const HILITE_COLORS = ['transparent','#FFEB3B','#7CFC00','#00E5FF','#FF80AB','#FFAB40','#B388FF','#E0E0E0'];
const BM_COLORS = ['#FF4C4C','#FFBF00','#28a745','#007BFF','#a855f7'];
const REM_COLORS = ['#007BFF','#FF4C4C','#28a745','#FFBF00','#a855f7'];

/* ---------- IndexedDB (binary assets) ---------- */
let _db=null;
function db(){
  return _db ? Promise.resolve(_db) : new Promise((res,rej)=>{
    const r = indexedDB.open('emet_editor', 1);
    r.onupgradeneeded = ()=> r.result.createObjectStore('assets');
    r.onsuccess = ()=>{ _db=r.result; res(_db); };
    r.onerror = ()=> rej(r.error);
  });
}
async function putAsset(id, blob){ const d=await db(); return new Promise((res,rej)=>{ const tx=d.transaction('assets','readwrite'); tx.objectStore('assets').put(blob,id); tx.oncomplete=res; tx.onerror=()=>rej(tx.error); }); }
async function getAsset(id){ const d=await db(); return new Promise((res)=>{ const tx=d.transaction('assets','readonly'); const rq=tx.objectStore('assets').get(id); rq.onsuccess=()=>res(rq.result||null); rq.onerror=()=>res(null); }); }
async function allAssets(){ const d=await db(); return new Promise((res)=>{ const tx=d.transaction('assets','readonly'); const st=tx.objectStore('assets'); const out={}; const cur=st.openCursor(); cur.onsuccess=e=>{ const c=e.target.result; if(c){ out[c.key]=c.value; c.continue(); } else res(out); }; cur.onerror=()=>res(out); }); }

/* ---------- data ---------- */
let tabs = load();
let activeId = localStorage.getItem(K.active);
let fontSize = parseInt(localStorage.getItem(K.fs)) || 17;
let snippets = loadJSON(K.snips, []);
let reminders = loadJSON(K.rems, []);

function load(){
  try{ const a=JSON.parse(localStorage.getItem(K.tabs)); if(Array.isArray(a)&&a.length) return a; }catch(e){}
  return [{ id:uid(), name:'', html:'', dir:'ltr' }];
}
function loadJSON(key, def){ try{ return JSON.parse(localStorage.getItem(key))||def; }catch(e){ return def; } }
function persist(){ localStorage.setItem(K.tabs, JSON.stringify(tabs)); localStorage.setItem(K.active, activeId); }
function saveSnips(){ localStorage.setItem(K.snips, JSON.stringify(snippets)); }
function saveRems(){ localStorage.setItem(K.rems, JSON.stringify(reminders)); }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function activeTab(){ return tabs.find(x=>x.id===activeId) || tabs[0]; }

/* ---------- elements ---------- */
const editor   = document.getElementById('editor');
const tabStrip = document.getElementById('tabStrip');

/* ---------- language & theme ---------- */
function applyLang(){
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang==='he') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=> el.textContent = t(el.getAttribute('data-i18n')));
  document.querySelectorAll('[data-i18n-ph]').forEach(el=> el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))));
  document.getElementById('btnLang').textContent = t('langLabel');
  editor.setAttribute('data-ph', t('ph_start'));
  renderTabs(); updateStatus();
}
function toggleLang(){ lang = lang==='en'?'he':'en'; localStorage.setItem(K.lang,lang); applyLang(); }
function applyTheme(){
  const th = localStorage.getItem(K.theme)||'dark';
  document.documentElement.setAttribute('data-theme', th);
  document.querySelector('meta[name=theme-color]').setAttribute('content', th==='dark'?'#121212':'#eceef2');
}
function toggleTheme(){ const cur=localStorage.getItem(K.theme)||'dark'; localStorage.setItem(K.theme, cur==='dark'?'light':'dark'); applyTheme(); }

/* ---------- tabs ---------- */
function renderTabs(){
  tabStrip.innerHTML='';
  tabs.forEach(tb=>{
    const el=document.createElement('div');
    el.className='tab'+(tb.id===activeId?' active':'');
    el.innerHTML=`<span class="tname">${esc(tb.name||t('ph_untitled'))}</span><span class="tx" data-close-tab="${tb.id}">&times;</span>`;
    el.querySelector('.tname').addEventListener('click', ()=>switchTab(tb.id));
    el.querySelector('.tname').addEventListener('dblclick', ()=>openRename(tb.id));
    el.querySelector('[data-close-tab]').addEventListener('click', e=>{ e.stopPropagation(); closeTab(tb.id); });
    tabStrip.appendChild(el);
  });
  const add=document.createElement('button'); add.className='tab-add'; add.textContent='+';
  add.addEventListener('click', addTab); tabStrip.appendChild(add);
}
async function loadActiveIntoEditor(){
  const tb=activeTab();
  editor.innerHTML = tb.html||'';
  editor.setAttribute('dir', tb.dir||'ltr');
  editor.style.textAlign = (tb.dir==='rtl')?'right':'left';
  await resolveAssets();
  updateStatus();
}
function switchTab(id){ commitEditor(); activeId=id; persist(); renderTabs(); loadActiveIntoEditor(); }
function addTab(){
  commitEditor();
  const tb={ id:uid(), name:'', html:'', dir: lang==='he'?'rtl':'ltr' };
  tabs.push(tb); activeId=tb.id; persist(); renderTabs(); loadActiveIntoEditor();
  toast(t('t_added')); editor.focus();
}
function closeTab(id){
  if(!confirm(t('confirm_del_tab'))) return;
  if(tabs.length===1){ tabs=[{ id:uid(), name:'', html:'', dir:'ltr' }]; activeId=tabs[0].id; }
  else { const i=tabs.findIndex(x=>x.id===id); tabs.splice(i,1); if(activeId===id) activeId=tabs[Math.max(0,i-1)].id; }
  persist(); renderTabs(); loadActiveIntoEditor(); toast(t('t_deleted'));
}
let renameId=null;
function openRename(id){ renameId=id; const tb=tabs.find(x=>x.id===id);
  document.getElementById('renameInput').value=tb.name||''; openSheet('renameWrap');
  setTimeout(()=>document.getElementById('renameInput').focus(),200); }
function saveRename(){ const tb=tabs.find(x=>x.id===renameId); if(!tb) return;
  tb.name=document.getElementById('renameInput').value.trim(); persist(); renderTabs(); closeSheet('renameWrap'); toast(t('t_renamed')); }

/* ---------- asset resolve / normalize ---------- */
async function resolveAssets(){
  const els = editor.querySelectorAll('[data-asset]');
  for(const el of els){
    const blob = await getAsset(el.getAttribute('data-asset'));
    if(!blob) continue;
    const url = URL.createObjectURL(blob);
    if(el.tagName==='IMG') el.src=url;
    else el._url = url;   // chips resolve on demand
  }
}
function normalizeHtml(html){
  // strip transient blob: URLs so saved content stays valid across sessions
  return html.replace(/\s(?:src|href)="blob:[^"]*"/g,'');
}

/* ---------- editor save ---------- */
let saveTimer;
function commitEditor(){ const tb=activeTab(); if(tb){ tb.html=normalizeHtml(editor.innerHTML); tb.dir=editor.getAttribute('dir')||'ltr'; } }
function scheduleSave(){
  document.getElementById('stSaved').textContent=t('saving');
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>{ commitEditor(); persist(); document.getElementById('stSaved').textContent=t('saved'); },500);
}

/* ---------- formatting ---------- */
function exec(cmd,val){ editor.focus(); document.execCommand(cmd,false,val||null); commitEditor(); persist(); refreshToolbarState(); }
function refreshToolbarState(){
  ['bold','italic','underline','strikeThrough'].forEach(cmd=>{
    const b=document.querySelector(`.tb[data-cmd="${cmd}"]`);
    if(b){ try{ b.classList.toggle('on', document.queryCommandState(cmd)); }catch(e){} }
  });
}
function changeFontSize(delta){ fontSize=Math.max(12,Math.min(34,fontSize+delta));
  document.documentElement.style.setProperty('--efs', fontSize+'px'); localStorage.setItem(K.fs,fontSize); }
function toggleDir(){ const tb=activeTab(); const next=(editor.getAttribute('dir')==='rtl')?'ltr':'rtl';
  editor.setAttribute('dir',next); editor.style.textAlign=next==='rtl'?'right':'left'; tb.dir=next; persist(); }
function autoDetectDir(){ const tb=activeTab(); if(tb._dirLocked) return;
  if(/[֐-׿]/.test(editor.innerText||'') && editor.getAttribute('dir')!=='rtl'){
    editor.setAttribute('dir','rtl'); editor.style.textAlign='right'; tb.dir='rtl'; } }

/* ---------- color pickers ---------- */
function openColor(mode){
  document.getElementById('colorTitle').textContent = mode==='text'? t('textcolor') : t('highlight');
  const box=document.getElementById('colorSwatches');
  const list = mode==='text'? TEXT_COLORS : HILITE_COLORS;
  box.innerHTML=list.map(c=>{ const bg=c==='transparent'?'repeating-linear-gradient(45deg,#888,#888 4px,#bbb 4px,#bbb 8px)':c;
    return `<div class="sw" data-c="${c}" style="background:${bg}"></div>`; }).join('');
  box.querySelectorAll('[data-c]').forEach(el=> el.addEventListener('click', ()=>{
    const c=el.dataset.c;
    if(mode==='text') exec('foreColor',c); else exec('hiliteColor', c==='transparent'?'transparent':c);
    closeSheet('colorWrap'); }));
  openSheet('colorWrap');
}

/* ---------- insert helpers ---------- */
function insertAtCaret(html){ editor.focus(); document.execCommand('insertHTML',false,html); commitEditor(); persist(); updateStatus(); }

/* tables */
function insertTable(){
  const r=Math.max(1,Math.min(20,parseInt(document.getElementById('tblRows').value)||2));
  const c=Math.max(1,Math.min(10,parseInt(document.getElementById('tblCols').value)||2));
  let html='<table><tbody>';
  for(let i=0;i<r;i++){ html+='<tr>'; for(let j=0;j<c;j++) html+='<td>&nbsp;</td>'; html+='</tr>'; }
  html+='</tbody></table><p><br></p>';
  insertAtCaret(html); closeSheet('tableWrap'); toast(t('table_added'));
}

/* images */
async function addImage(file){
  const id=uid(); await putAsset(id,file); const url=URL.createObjectURL(file);
  insertAtCaret(`<img data-asset="${id}" src="${url}" style="max-width:100%;border-radius:6px;">&nbsp;`);
  closeSheet('insertWrap'); toast(t('image_added'));
}

/* file attachments */
async function addAttachment(file){
  const id=uid(); await putAsset(id,file);
  const name=esc(file.name||'file');
  insertAtCaret(`<span class="chip file" contenteditable="false" data-asset="${id}" data-name="${name}">&#128206; ${name}</span>&nbsp;`);
  closeSheet('insertWrap'); toast(t('file_added'));
}

/* ---------- audio note (recording) ---------- */
let mediaRec=null, recChunks=[], recBlob=null, recTimer=null, recStart=0;
function openAudio(){
  recBlob=null; recChunks=[];
  document.getElementById('audioTimer').textContent='0:00';
  document.getElementById('audioState').textContent=t('tap_record');
  document.getElementById('audioRec').textContent=t('rec_start');
  document.getElementById('audioInsert').style.display='none';
  const pv=document.getElementById('audioPreview'); pv.style.display='none'; pv.src='';
  closeSheet('insertWrap'); openSheet('audioWrap');
}
async function toggleRec(){
  if(mediaRec && mediaRec.state==='recording'){ mediaRec.stop(); return; }
  let stream;
  try{ stream=await navigator.mediaDevices.getUserMedia({audio:true}); }
  catch(e){ toast(t('mic_denied')); return; }
  recChunks=[]; mediaRec=new MediaRecorder(stream);
  mediaRec.ondataavailable=e=>{ if(e.data.size) recChunks.push(e.data); };
  mediaRec.onstop=()=>{
    stream.getTracks().forEach(tr=>tr.stop());
    clearInterval(recTimer);
    recBlob=new Blob(recChunks,{type:recChunks[0]?recChunks[0].type:'audio/webm'});
    const pv=document.getElementById('audioPreview'); pv.src=URL.createObjectURL(recBlob); pv.style.display='block';
    document.getElementById('audioRec').textContent=t('rec_start');
    document.getElementById('audioState').textContent='';
    document.getElementById('audioInsert').style.display='block';
  };
  mediaRec.start(); recStart=Date.now();
  document.getElementById('audioRec').textContent=t('rec_stop');
  document.getElementById('audioState').textContent=t('recording');
  clearInterval(recTimer);
  recTimer=setInterval(()=>{ const s=Math.floor((Date.now()-recStart)/1000);
    document.getElementById('audioTimer').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); },250);
}
async function insertAudio(){
  if(!recBlob) return;
  const id=uid(); await putAsset(id,recBlob);
  insertAtCaret(`<span class="chip audio" contenteditable="false" data-asset="${id}">&#9654; ${t('ins_audio')}</span>&nbsp;`);
  closeSheet('audioWrap'); toast(t('audio_added'));
}

/* ---------- chip / image interactions ---------- */
let currentImg=null;
editor.addEventListener('click', async (e)=>{
  const img=e.target.closest('img[data-asset]');
  if(img){ currentImg=img; openSheet('imageOptWrap'); return; }
  const chip=e.target.closest('.chip[data-asset]');
  if(!chip) return;
  const id=chip.getAttribute('data-asset');
  const blob=await getAsset(id); if(!blob) return;
  const url=chip._url || URL.createObjectURL(blob);
  if(chip.classList.contains('audio')){
    const p=document.getElementById('chipPlayer');
    if(p.src===url && !p.paused){ p.pause(); } else { p.src=url; p.play().catch(()=>{}); }
  } else {
    const a=document.createElement('a'); a.href=url; a.download=chip.getAttribute('data-name')||'file'; a.click();
  }
});
function applyImgWidth(w){ if(currentImg){ currentImg.style.width=w; currentImg.style.maxWidth='100%'; commitEditor(); persist(); } closeSheet('imageOptWrap'); }
function deleteImg(){ if(currentImg){ currentImg.remove(); currentImg=null; commitEditor(); persist(); updateStatus(); } closeSheet('imageOptWrap'); }

/* ---------- bookmarks + navigation ---------- */
function currentBlock(){
  const sel=getSelection(); if(!sel.rangeCount) return null;
  let node=sel.anchorNode; if(!node) return null;
  let el = node.nodeType===3 ? node.parentNode : node;
  while(el && el!==editor && el.parentNode!==editor) el=el.parentNode;
  if(el===editor || !el){ document.execCommand('formatBlock',false,'div');
    node=getSelection().anchorNode; el=node&&node.nodeType===3?node.parentNode:node;
    while(el && el!==editor && el.parentNode!==editor) el=el.parentNode; }
  return (el&&el!==editor)?el:null;
}
function openBookmark(){
  const box=document.getElementById('bmSwatches');
  box.innerHTML=BM_COLORS.map(c=>`<div class="sw" data-c="${c}" style="background:${c}"></div>`).join('');
  box.querySelectorAll('[data-c]').forEach(el=> el.addEventListener('click', ()=> markBookmark(el.dataset.c)));
  openSheet('bookmarkWrap');
}
function markBookmark(color){
  const el=currentBlock(); if(!el){ closeSheet('bookmarkWrap'); return; }
  el.classList.add('bm'); el.dataset.color=color;
  el.style.borderInlineStart='4px solid '+color; el.style.paddingInlineStart='8px';
  if(!el.id) el.id='bm_'+uid();
  commitEditor(); persist(); closeSheet('bookmarkWrap');
}
function removeBookmark(){
  const el=currentBlock(); if(el && el.classList.contains('bm')){
    el.classList.remove('bm'); el.style.borderInlineStart=''; el.style.paddingInlineStart=''; delete el.dataset.color;
    commitEditor(); persist(); }
  closeSheet('bookmarkWrap');
}
function openNav(){
  const list=document.getElementById('navList');
  const bms=[...editor.querySelectorAll('.bm')];
  if(!bms.length){ list.innerHTML=`<div class="empty2">${esc(t('no_bookmarks'))}</div>`; }
  else list.innerHTML='';
  bms.forEach(b=>{
    const row=document.createElement('div'); row.className='lrow';
    const txt=(b.innerText||'').trim().slice(0,60)||'(—)';
    row.innerHTML=`<span class="ldot" style="background:${b.dataset.color||'#888'}"></span><span class="lbody">${esc(txt)}</span>`;
    row.addEventListener('click', ()=>{ closeSheet('navWrap'); b.scrollIntoView({behavior:'smooth',block:'center'}); });
    list.appendChild(row);
  });
  closeSheet('menuWrap'); openSheet('navWrap');
}

/* ---------- snippets ---------- */
function selectionHtml(){ const sel=getSelection(); if(!sel.rangeCount||sel.isCollapsed) return '';
  const d=document.createElement('div'); d.appendChild(sel.getRangeAt(0).cloneContents()); return d.innerHTML; }
function saveSnippet(){
  const html=selectionHtml(); if(!html){ toast(t('select_first')); return; }
  const label=prompt(t('snip_label'), (getSelection().toString()||'').slice(0,24));
  if(label===null) return;
  snippets.push({ id:uid(), label:label.trim()||t('ph_untitled'), html }); saveSnips(); renderSnippets(); toast(t('snip_saved'));
}
function renderSnippets(){
  const list=document.getElementById('snipList');
  if(!snippets.length){ list.innerHTML=`<div class="empty2">${esc(t('no_snippets'))}</div>`; return; }
  list.innerHTML='';
  snippets.forEach(s=>{
    const row=document.createElement('div'); row.className='lrow';
    row.innerHTML=`<span class="lbody">${esc(s.label)}</span><span class="lx" data-del="${s.id}">&times;</span>`;
    row.querySelector('.lbody').addEventListener('click', ()=>{ closeSheet('snippetsWrap'); insertAtCaret(s.html); toast(t('inserted')); });
    row.querySelector('[data-del]').addEventListener('click', e=>{ e.stopPropagation();
      snippets=snippets.filter(x=>x.id!==s.id); saveSnips(); renderSnippets(); toast(t('deleted')); });
    list.appendChild(row);
  });
}
function openSnippets(){ renderSnippets(); closeSheet('menuWrap'); openSheet('snippetsWrap'); }

/* ---------- reminders + alarms ---------- */
let editingRem=null, remColor=REM_COLORS[0];
function openReminders(){ renderReminders(); closeSheet('menuWrap'); openSheet('remindersWrap'); }
function renderReminders(){
  const list=document.getElementById('remList');
  if(!reminders.length){ list.innerHTML=`<div class="empty2">${esc(t('no_reminders'))}</div>`; return; }
  list.innerHTML='';
  reminders.slice().sort((a,b)=>(a.time||'').localeCompare(b.time||'')).forEach(r=>{
    const row=document.createElement('div'); row.className='lrow';
    row.innerHTML=`<span class="ldot" style="background:${r.color||'#007BFF'}"></span>
      <span class="lbody">${esc(r.title)}<div class="lsub">${esc(r.time||'')}</div></span>
      <span class="lx" data-del="${r.id}">&times;</span>`;
    row.querySelector('.lbody').addEventListener('click', ()=> openReminderEdit(r));
    row.querySelector('[data-del]').addEventListener('click', e=>{ e.stopPropagation();
      reminders=reminders.filter(x=>x.id!==r.id); saveRems(); renderReminders(); toast(t('deleted')); });
    list.appendChild(row);
  });
}
function buildRemSwatches(){
  const box=document.getElementById('remSwatches');
  box.innerHTML=REM_COLORS.map(c=>`<div class="sw ${c===remColor?'sel':''}" data-c="${c}" style="background:${c}"></div>`).join('');
  box.querySelectorAll('[data-c]').forEach(el=> el.addEventListener('click', ()=>{ remColor=el.dataset.c;
    box.querySelectorAll('.sw').forEach(s=>s.classList.remove('sel')); el.classList.add('sel'); }));
}
function openReminderEdit(r){
  editingRem = r || null;
  document.getElementById('remEditTitle').textContent = r? t('rem_edit') : t('rem_add');
  document.getElementById('remTitle').value = r? r.title : '';
  document.getElementById('remTime').value = r? (r.time||'') : '';
  remColor = r? (r.color||REM_COLORS[0]) : REM_COLORS[0];
  buildRemSwatches();
  if(('Notification' in window) && Notification.permission==='default') Notification.requestPermission();
  openSheet('reminderEditWrap');
}
function saveReminder(){
  const title=document.getElementById('remTitle').value.trim();
  const time=document.getElementById('remTime').value;
  if(!title){ toast(t('select_first')); return; }
  if(editingRem){ editingRem.title=title; editingRem.time=time; editingRem.color=remColor; editingRem.firedOn=''; }
  else reminders.push({ id:uid(), title, time, color:remColor, firedOn:'' });
  saveRems(); renderReminders(); closeSheet('reminderEditWrap'); toast(t('rem_saved'));
}
function todayStr(){ const d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function checkAlarms(){
  const now=new Date(), ts=todayStr();
  reminders.forEach(r=>{
    if(!r.time || r.firedOn===ts) return;
    const [h,m]=r.time.split(':').map(Number);
    const when=new Date(); when.setHours(h,m,0,0);
    const passed=(now-when)/1000;
    if(passed>=0 && passed<=60){ r.firedOn=ts; saveRems(); fireAlarm(r); }
  });
}
function fireAlarm(r){
  try{ if(('Notification' in window)&&Notification.permission==='granted') new Notification(t('rem_fired'),{body:r.title,icon:'icon-192.png'}); }catch(e){}
  try{ navigator.vibrate && navigator.vibrate([300,150,300]); }catch(e){}
  try{ const ac=new (window.AudioContext||window.webkitAudioContext)(); const o=ac.createOscillator(),g=ac.createGain();
    o.frequency.value=880; o.connect(g); g.connect(ac.destination); g.gain.value=0.15; o.start(); setTimeout(()=>{o.stop();ac.close();},600); }catch(e){}
  toast(t('rem_fired')+': '+r.title);
}

/* ---------- find / replace ---------- */
function toggleFind(){ const f=document.getElementById('findbar'); f.classList.toggle('open');
  if(f.classList.contains('open')) document.getElementById('findInput').focus(); }
function findNext(){ const q=document.getElementById('findInput').value; if(!q) return; editor.focus();
  const ok=window.find?window.find(q,false,false,true):false; if(!ok) toast(t('not_found')); }
function replaceOne(){ const q=document.getElementById('findInput').value, r=document.getElementById('replaceInput').value; if(!q) return;
  const sel=getSelection();
  if(sel&&sel.toString()&&sel.toString().toLowerCase()===q.toLowerCase()){ document.execCommand('insertText',false,r); commitEditor(); persist(); }
  findNext(); }
function replaceAll(){ const q=document.getElementById('findInput').value, r=document.getElementById('replaceInput').value; if(!q) return;
  let count=0; const walk=document.createTreeWalker(editor,NodeFilter.SHOW_TEXT); const nodes=[]; while(walk.nextNode()) nodes.push(walk.currentNode);
  const rx=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');
  nodes.forEach(n=>{ if(rx.test(n.nodeValue)) n.nodeValue=n.nodeValue.replace(rx,()=>{count++;return r;}); });
  commitEditor(); persist(); updateStatus(); toast(count?(t('replaced_all')+' '+count):t('not_found')); }

/* ---------- export / backup ---------- */
function download(filename,content,mime){ const b=new Blob([content],{type:mime}); const u=URL.createObjectURL(b);
  const a=document.createElement('a'); a.href=u; a.download=filename; a.click(); URL.revokeObjectURL(u); }
function exportHtml(){ commitEditor(); const tb=activeTab();
  const doc=`<!DOCTYPE html><html dir="${tb.dir}"><head><meta charset="utf-8"><title>${esc(tb.name||t('ph_untitled'))}</title></head><body>${editor.innerHTML}</body></html>`;
  download(safeName(tb.name)+'.html',doc,'text/html'); toast(t('exported')); closeSheet('menuWrap'); }
function exportTxt(){ commitEditor(); const tb=activeTab();
  download(safeName(tb.name)+'.txt', editor.innerText, 'text/plain'); toast(t('exported')); closeSheet('menuWrap'); }
async function backupAll(){
  commitEditor();
  // include binary assets as base64 so the backup is self-contained
  const assets=await allAssets(); const enc={};
  for(const id in assets){ enc[id]=await blobToDataURL(assets[id]); }
  const payload={ v:2, tabs, snippets, reminders, assets:enc };
  download(`Emet_Editor_Backup_${stamp()}.json`, JSON.stringify(payload), 'application/json');
  toast(t('backed_up')); closeSheet('menuWrap');
}
function restoreFrom(file){
  const rd=new FileReader();
  rd.onload=async ()=>{ try{
    const data=JSON.parse(rd.result);
    const tb = Array.isArray(data)? data : data.tabs;
    if(!Array.isArray(tb)||!tb.length) throw 0;
    if(!confirm(t('confirm_restore'))) return;
    tabs = tb.map(x=>({ id:x.id||uid(), name:x.name||'', html:x.html||'', dir:x.dir||'ltr' }));
    if(!Array.isArray(data)){
      snippets = data.snippets||[]; reminders = data.reminders||[]; saveSnips(); saveRems();
      if(data.assets){ for(const id in data.assets){ await putAsset(id, await dataURLtoBlob(data.assets[id])); } }
    }
    activeId=tabs[0].id; persist(); renderTabs(); await loadActiveIntoEditor(); closeSheet('menuWrap'); toast(t('restored'));
  }catch(e){ toast(t('badfile')); } };
  rd.readAsText(file);
}
function blobToDataURL(blob){ return new Promise(res=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(blob); }); }
async function dataURLtoBlob(u){ return (await fetch(u)).blob(); }

/* ---------- status / helpers ---------- */
function updateStatus(){
  const txt=editor.innerText.trim(); const words=txt?txt.split(/\s+/).length:0;
  document.getElementById('stWords').textContent=words+' '+t('words');
  document.getElementById('stChars').textContent=editor.innerText.length+' '+t('chars');
}
function openSheet(id){ document.getElementById(id).classList.add('open'); }
function closeSheet(id){ document.getElementById(id).classList.remove('open'); }
let toastTimer;
function toast(m){ const el=document.getElementById('toast'); el.textContent=m; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),1800); }
function esc(s){ return (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function safeName(n){ return (n||'untitled').replace(/[^\w֐-׿ -]/g,'_').slice(0,40)||'untitled'; }
function stamp(){ const d=new Date(); return `${d.getFullYear()}_${String(d.getMonth()+1).padStart(2,'0')}_${String(d.getDate()).padStart(2,'0')}`; }

/* ---------- wiring ---------- */
editor.addEventListener('input', ()=>{ scheduleSave(); updateStatus(); autoDetectDir(); });
editor.addEventListener('keyup', refreshToolbarState);
editor.addEventListener('mouseup', refreshToolbarState);

document.querySelectorAll('.tb[data-cmd]').forEach(b=> b.addEventListener('click', ()=> exec(b.dataset.cmd)));
document.querySelectorAll('.tb[data-size]').forEach(b=> b.addEventListener('click', ()=> changeFontSize(b.dataset.size==='up'?2:-2)));
document.getElementById('tbTextColor').addEventListener('click', ()=> openColor('text'));
document.getElementById('tbHiliteColor').addEventListener('click', ()=> openColor('hilite'));
document.getElementById('tbDir').addEventListener('click', ()=>{ activeTab()._dirLocked=true; toggleDir(); });
document.getElementById('tbInsert').addEventListener('click', ()=> openSheet('insertWrap'));
document.getElementById('tbBookmark').addEventListener('click', openBookmark);

document.getElementById('insTable').addEventListener('click', ()=>{ closeSheet('insertWrap'); openSheet('tableWrap'); });
document.getElementById('insImage').addEventListener('click', ()=> document.getElementById('imageFile').click());
document.getElementById('insFile').addEventListener('click', ()=> document.getElementById('attachFile').click());
document.getElementById('insAudio').addEventListener('click', openAudio);
document.getElementById('imageFile').addEventListener('change', e=>{ if(e.target.files[0]) addImage(e.target.files[0]); e.target.value=''; });
document.getElementById('attachFile').addEventListener('change', e=>{ if(e.target.files[0]) addAttachment(e.target.files[0]); e.target.value=''; });
document.getElementById('tblInsert').addEventListener('click', insertTable);
document.getElementById('bmRemove').addEventListener('click', removeBookmark);

document.getElementById('audioRec').addEventListener('click', toggleRec);
document.getElementById('audioInsert').addEventListener('click', insertAudio);

document.querySelectorAll('[data-imgw]').forEach(el=> el.addEventListener('click', ()=> applyImgWidth(el.dataset.imgw)));
document.getElementById('imgDelete').addEventListener('click', deleteImg);

document.getElementById('snipSave').addEventListener('click', saveSnippet);
document.getElementById('remAdd').addEventListener('click', ()=> openReminderEdit(null));
document.getElementById('remSave').addEventListener('click', saveReminder);

document.getElementById('btnFind').addEventListener('click', toggleFind);
document.getElementById('findClose').addEventListener('click', toggleFind);
document.getElementById('findNext').addEventListener('click', findNext);
document.getElementById('replaceOne').addEventListener('click', replaceOne);
document.getElementById('replaceAll').addEventListener('click', replaceAll);

document.getElementById('btnLang').addEventListener('click', toggleLang);
document.getElementById('btnTheme').addEventListener('click', toggleTheme);
document.getElementById('btnMenu').addEventListener('click', ()=> openSheet('menuWrap'));
document.getElementById('renameSave').addEventListener('click', saveRename);

document.getElementById('miNav').addEventListener('click', openNav);
document.getElementById('miSnippets').addEventListener('click', openSnippets);
document.getElementById('miReminders').addEventListener('click', openReminders);
document.getElementById('miExportHtml').addEventListener('click', exportHtml);
document.getElementById('miExportTxt').addEventListener('click', exportTxt);
document.getElementById('miBackup').addEventListener('click', backupAll);
document.getElementById('miRestore').addEventListener('click', ()=> document.getElementById('restoreFile').click());
document.getElementById('restoreFile').addEventListener('change', e=>{ if(e.target.files[0]) restoreFrom(e.target.files[0]); });
document.getElementById('miDeleteTab').addEventListener('click', ()=>{ closeSheet('menuWrap'); closeTab(activeId); });

document.querySelectorAll('[data-close]').forEach(el=> el.addEventListener('click', ()=>{
  ['menuWrap','renameWrap','colorWrap','insertWrap','tableWrap','bookmarkWrap','navWrap','snippetsWrap','remindersWrap','reminderEditWrap','audioWrap','imageOptWrap'].forEach(closeSheet); }));

/* ---------- init ---------- */
if(!activeId || !tabs.find(x=>x.id===activeId)) activeId=tabs[0].id;
applyTheme(); changeFontSize(0); applyLang(); loadActiveIntoEditor(); persist();
setInterval(checkAlarms, 15000); checkAlarms();
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
