(()=>{
const L=window.LV,C=window.LVC,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P={};L.projects.forEach(p=>P[p.id]=p);
const nm=id=>C.names[id]||[P[id].title,''];
const pic=(k,sizes='100vw',alt='')=>`<img src="img/mz/${k}-800.webp" srcset="img/mz/${k}-800.webp 800w, img/mz/${k}-1600.webp 1600w" sizes="${sizes}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const cut=(k,alt)=>`<img src="img/cut/${k}-700.webp" srcset="img/cut/${k}-700.webp 700w, img/cut/${k}-1400.webp 1400w" sizes="(max-width:600px) 90vw, 33vw" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const card=(id,extra='')=>{const p=P[id],[t,s]=nm(id);return `<a class="card rv" href="#project/${id}"><div class="cimg">${cut(p.img,t)}</div><h3>${esc(t)}</h3><p>${esc(s)}</p>${extra}</a>`};

/* ---------- интро: логотип мягко появляется и уходит ---------- */
const intro=$('#intro');
let seen=false;try{seen=sessionStorage.getItem('lv6_intro')==='1'}catch(e){}
if(seen||matchMedia('(prefers-reduced-motion:reduce)').matches){intro.remove()}
else{
 requestAnimationFrame(()=>intro.classList.add('show'));
 setTimeout(()=>intro.classList.add('hide'),1500);
 setTimeout(()=>intro.classList.add('gone'),2000);
 setTimeout(()=>intro.remove(),2900);
 try{sessionStorage.setItem('lv6_intro','1')}catch(e){}
}

/* ---------- галерея (лайтбокс) ---------- */
const G={tc:C.tc.map(([k,c])=>[k,c])};
const lb=$('#lb');let cur=[],ci=0;
const show=()=>{const [k,c]=cur[ci];$('#lbImg').src=`img/mz/${k}-1600.webp`;$('#lbImg').alt=c||'';$('#lbC').textContent=`${ci+1} / ${cur.length}`};
const open=(set,i)=>{cur=G[set];ci=+i||0;show();lb.showModal()};
$('#lbX').onclick=()=>lb.close();
$('#lbP').onclick=()=>{ci=(ci-1+cur.length)%cur.length;show()};
$('#lbN').onclick=()=>{ci=(ci+1)%cur.length;show()};
lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='FIGURE')lb.close()});
document.addEventListener('keydown',e=>{if(!lb.open)return;if(e.key==='ArrowLeft')$('#lbP').click();if(e.key==='ArrowRight')$('#lbN').click()});
let tx=0;lb.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)(d>0?$('#lbP'):$('#lbN')).click()});
document.addEventListener('click',e=>{const t=e.target.closest('[data-gal]');if(t){e.preventDefault();open(t.dataset.gal,t.dataset.i)}});

/* ---------- статичные списки ---------- */
$('#allProjects').innerHTML=L.projects.map(p=>card(p.id)).join('');
/* слайдер: одна фотография, листается влево-вправо */
function slider(el,set,name,alt){
 el.innerHTML=`<div class="sl-t">${set.map(([k],i)=>`<figure class="sl-s ph" data-gal="${name}" data-i="${i}">${pic(k,'(max-width:1400px) 100vw, 1360px',alt)}</figure>`).join('')}</div>`+(set.length>1?`<button class="sl-b sl-p" type="button" aria-label="Предыдущее фото">←</button><button class="sl-b sl-n" type="button" aria-label="Следующее фото">→</button><span class="sl-c">1 / ${set.length}</span>`:'');
 const t=$('.sl-t',el);if(set.length<2)return;
 const go=d=>t.scrollBy({left:d*t.clientWidth,behavior:'smooth'});
 $('.sl-p',el).onclick=()=>go(-1);$('.sl-n',el).onclick=()=>go(1);
 t.addEventListener('scroll',()=>{$('.sl-c',el).textContent=`${Math.round(t.scrollLeft/t.clientWidth)+1} / ${set.length}`},{passive:true});
 el.tabIndex=0;el.onkeydown=e=>{if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1)};
}
slider($('#tcSl'),C.tc,'tc','Визуализация техцентра Levshitsky');
$('#tcSvc').innerHTML=C.services.map(([t,d])=>`<li class="rv"><b>${t}</b><span>${d}</span></li>`).join('');
/* слайд-шоу проектов на главной */
const sl=$('#projSlides'),sk=['m23','m10','m09','m02','m06','m03','m12','m20','m05'];
sl.innerHTML=sk.map((k,i)=>`<img src="img/mz/${k}-1600.webp" srcset="img/mz/${k}-800.webp 800w, img/mz/${k}-1600.webp 1600w" sizes="(max-width:1400px) 100vw, 1360px" alt="Проект Levshitsky" ${i?'loading="lazy"':''} class="${i?'':'on'}">`).join('');
let si=0;setInterval(()=>{if(document.hidden)return;const im=$$('img',sl);im[si].classList.remove('on');si=(si+1)%im.length;im[si].classList.add('on')},3500);
const st=a=>a.map(([t,d])=>`<li class="rv"><b>${t}</b><span>${d}</span></li>`).join('');
$('#tcSteps').innerHTML=st(C.steps);$('#abSteps').innerHTML=st(C.steps);$('#aucSteps').innerHTML=st(C.auctionSteps);
$('#aucRules').innerHTML=C.auctionRules.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('');
$('#lots').innerHTML=C.lots.map(([id,s])=>card(id,`<span class="st">${s}</span><p>Стартовая цена: по&nbsp;запросу</p>`)).join('');
$('#newsList').innerHTML=[...L.news].sort((a,b)=>b.iso.localeCompare(a.iso)).map(n=>`<a class="ncard rv" href="#article/${n.id}"><div class="ph">${pic(n.img,'(max-width:860px) 100vw, 33vw',n.title)}</div><p class="lbl">${esc(n.date)}</p><h3>${esc(n.title)}</h3><p class="txt">${esc(n.lead)}</p></a>`).join('');

/* ---------- «Обсудить проект»: по одному вопросу на экран ---------- */
const Q=[
 {k:'need',q:'Что нужно сделать?',h:'Можно выбрать несколько',multi:1,o:['Реставрация','Тюнинг','Покраска','Салон','Колёса','Детейлинг и плёнка','Подбор машины','Аукцион']},
 {k:'car',q:'Какая машина?',h:'Марка, модель и год, если знаете',input:'Например, Mercedes W124, 1993'},
 {k:'when',q:'Когда начать?',o:['Сейчас','В течение месяца','Позже','Пока присматриваюсь']},
 {k:'budget',q:'Какой бюджет?',o:['До 3 млн ₽','3–10 млн ₽','От 10 млн ₽','Обсудим']},
 {k:'via',q:'Куда ответить?',h:'Ассистент напишет в течение нескольких минут, 24/7',o:['Telegram','WhatsApp','Звонок','Почта'],final:1}
];
const ph={Telegram:'@ник или номер',WhatsApp:'Номер телефона',Звонок:'Номер телефона',Почта:'Адрес почты'};
$$('[data-form]').forEach(box=>{
 const A={need:[]};if(box.dataset.preset)A.need=[box.dataset.preset];
 let i=0;
 const draw=(dir=1)=>{
  const s=Q[i];
  const opts=s.o?`<div class="opts">${s.o.map(o=>`<button type="button" class="opt${(s.multi?A[s.k].includes(o):A[s.k]===o)?' on':''}" data-v="${o}" aria-pressed="${s.multi?A[s.k].includes(o):A[s.k]===o}">${o}</button>`).join('')}</div>`:'';
  const inp=s.input?`<input class="field big" id="wz-car" value="${esc(A.car||'')}" placeholder="${s.input}" autocomplete="off">`:'';
  const fin=s.final?`<div class="two wz-fin"><input class="field" id="wz-name" placeholder="Ваше имя" value="${esc(A.name||'')}" autocomplete="name"><input class="field" id="wz-ct" placeholder="${ph[A.via]||'Контакт'}" value="${esc(A.contact||'')}"></div><label class="agree"><input type="checkbox" id="wz-ok"${A.ok?' checked':''}><span>Согласен с <a href="#privacy">политикой конфиденциальности</a></span></label>`:'';
  const canNext=s.multi?A.need.length:s.o&&!s.final?!!A[s.k]:true;
  box.innerHTML=`<div class="wz" style="--p:${(i+1)/Q.length*100}%">
   <div class="wz-top"><span class="wz-n">${i+1} / ${Q.length}</span><span class="wz-bar"></span></div>
   <div class="wz-step ${dir>0?'in-r':'in-l'}">
    <h3 class="wz-q">${s.q}</h3>${s.h?`<p class="wz-h">${s.h}</p>`:''}
    ${opts}${inp}${fin}
    <p class="ferr" role="alert"></p>
   </div>
   <div class="wz-nav">${i?'<button type="button" class="btn ghost wz-back">Назад</button>':'<span></span>'}
    ${s.final?'<button type="button" class="btn wz-send">Отправить</button>':(s.multi||s.input)?`<button type="button" class="btn wz-next"${canNext?'':' disabled'}>Дальше</button>`:'<span class="wz-tip">Выберите вариант</span>'}</div>
  </div>`;
  const f=$('.wz',box),err=$('.ferr',box);
  $$('.opt',f).forEach(b=>b.onclick=()=>{
   const v=b.dataset.v;
   if(s.multi){A.need=A.need.includes(v)?A.need.filter(x=>x!==v):[...A.need,v];b.classList.toggle('on');b.setAttribute('aria-pressed',b.classList.contains('on'));$('.wz-next',f).disabled=!A.need.length}
   else if(s.final){A.via=v;keep();draw(0)}
   else{A[s.k]=v;$$('.opt',f).forEach(x=>x.classList.toggle('on',x===b));setTimeout(()=>{i++;draw(1)},260)}
  });
  const keep=()=>{const c=$('#wz-car',f);if(c)A.car=c.value;const n=$('#wz-name',f);if(n){A.name=n.value;A.contact=$('#wz-ct',f).value;A.ok=$('#wz-ok',f).checked}};
  const nx=$('.wz-next',f);if(nx)nx.onclick=()=>{keep();i++;draw(1)};
  const bk=$('.wz-back',f);if(bk)bk.onclick=()=>{keep();i--;draw(-1)};
  const ci=$('#wz-car',f);if(ci){ci.focus({preventScroll:true});ci.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();nx.click()}}}
  const sd=$('.wz-send',f);if(sd)sd.onclick=()=>{keep();
   const miss=[];if(!A.via)miss.push('куда ответить');if(!A.name?.trim())miss.push('имя');if(!A.contact?.trim())miss.push('контакт');
   if(miss.length){err.textContent='Укажите: '+miss.join(', ')+'.';return}
   if(!A.ok){err.textContent='Подтвердите согласие с политикой.';return}
   // Демо: отправка на сервер подключается при запуске сайта.
   const rows=[['Работы',A.need.join(', ')],['Машина',A.car],['Когда',A.when],['Бюджет',A.budget],['Ответим',A.via+': '+A.contact]].filter(r=>r[1]);
   box.innerHTML=`<div class="wz done"><p class="lbl red">Заявка принята</p><h3 class="wz-q">${esc(A.name)}, спасибо</h3><p class="wz-h">Ассистент ответит в течение нескольких минут, круглосуточно.</p><dl>${rows.map(([a,b])=>`<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></div>`;
  };
 };
 draw(1);
});

/* ---------- чат ассистента ---------- */
const cb=$('#chatBody');
const say=(t,who='bot')=>{const m=document.createElement('div');m.className='msg '+who;m.textContent=t;cb.append(m);cb.scrollTop=cb.scrollHeight;return m};
const reply=t=>{const m=say('Печатает…');m.classList.add('typing');setTimeout(()=>{m.classList.remove('typing');m.textContent=t;cb.scrollTop=cb.scrollHeight},700)};
say('Здравствуйте! Я ассистент Levshitsky и отвечаю круглосуточно. Спросите про работы, сроки или аукцион, или выберите вопрос ниже.');
$('#chatQuick').innerHTML=C.faq.map((q,i)=>`<button type="button" data-q="${i}">${q[0]}</button>`).join('');
$('#chatQuick').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const [q,a]=C.faq[b.dataset.q];say(q,'me');reply(a)});
$('#chatForm').addEventListener('submit',e=>{e.preventDefault();const v=$('#chatIn').value.trim();if(!v)return;say(v,'me');$('#chatIn').value='';
 const hit=C.faq.find(([q])=>q.toLowerCase().split(/\W+/).some(w=>w.length>4&&v.toLowerCase().includes(w.slice(0,5))));
 reply(hit?hit[1]:'Спасибо, передам вопрос мастеру. Чтобы ответ пришёл вам, оставьте контакт в форме ниже.')});

/* ---------- роутер ---------- */
const views=$$('[data-view]'),hdr=$('#hdr');
const setMeta=t=>document.title=t?t+' — Levshitsky':'Levshitsky — ателье и техцентр';
function route(){
 let h=location.hash.slice(1)||'home';
 if(['h-about','main'].includes(h))return;
 let [v,arg]=h.split('/');
 if(v==='project'&&!P[arg])v='notfound';
 if(v==='article'&&!L.news.find(n=>n.id===arg))v='notfound';
 if(!views.some(x=>x.dataset.view===v))v='notfound';
 views.forEach(x=>x.classList.toggle('on',x.dataset.view===v));
 $$('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.nav===v||(v==='project'&&a.dataset.nav==='projects')));
 const titles={home:'',projects:'Проекты',techcenter:'Техцентр',auction:'Аукцион',config:'Конфигуратор',about:'Об ателье',news:'Журнал',contact:'Связаться',privacy:'Политика конфиденциальности',notfound:'Страница не найдена'};
 setMeta(titles[v]);
 if(v==='project'){
  const p=P[arg],[t,s]=nm(arg);setMeta(t);
  $('#pjTitle').textContent=t;$('#pjSub').textContent=s;
  $('#pjCut').src=`img/cut/${p.img}-1400.webp`;$('#pjCut').alt=t;
  $('#pjStory').textContent=p.story;
  $('#pjSpecs').innerHTML=p.specs.filter(r=>r[0]!=='Статус').map(([a,b])=>`<div><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join('');
  const n=p.img.slice(1),ints=['a','b','c'].map(x=>'i'+n+x).filter(k=>DIMS.has(k));
  const shots=(p.shots||[]).map(([k,c])=>[k,c]).filter(([k])=>DIMS.has(k));
  const set=[[p.img,t],...ints.map((k,i)=>[k,['Салон','Салон: детали','Салон: другой ракурс'][i]]),...shots.filter(([k])=>!ints.includes(k))];
  G.pj=set;
  slider($('#pjSl'),set,'pj',t);
  const ids=L.projects.map(x=>x.id),i=ids.indexOf(arg),pv=ids[(i-1+ids.length)%ids.length],nx=ids[(i+1)%ids.length];
  $('#pjPrev').href='#project/'+pv;$('#pjPrev').innerHTML=`<small>Предыдущий</small>${esc(nm(pv)[0])}`;
  $('#pjNext').href='#project/'+nx;$('#pjNext').innerHTML=`<small>Следующий</small>${esc(nm(nx)[0])}`;
  $('#pjMore').innerHTML=[1,2,3].map(k=>card(ids[(i+k)%ids.length])).join('');
 }
 if(v==='article'){
  const a=L.news.find(n=>n.id===arg);setMeta(a.title);
  $('#arMeta').textContent=a.date;$('#arTitle').textContent=a.title;$('#arLead').textContent=a.lead;
  $('#arImg').src=`img/mz/${a.img}-1600.webp`;$('#arImg').alt=a.title;
  $('#arBody').innerHTML=a.body.map(x=>`<p>${esc(x)}</p>`).join('');
 }
 document.body.classList.toggle('is-home',v==='home');
 scrollTo(0,0);onScroll();reveal();
 const vid=$('#heroVideo');if(v==='home'){vid.play().catch(()=>{})}else vid.pause();
 $('#mnav').hidden=true;$('#burger').setAttribute('aria-expanded','false');
}
// какие фото реально есть в папке img/mz (без лишних запросов к несуществующим файлам)
const DIMS=new Set(['i01a','i01b','i01c','i02a','i02b','i02c','i03a','i03b','i03c','i04a','i04b','i04c','i05a','i05b','i05c','i06a','i06b','i06c','i07a','i07b','i07c','i08a','i08b','i08c','i09a','i09b','i09c','i10a','i10b','i10c','i11a','i11c','i20a','i20b','i20c','i22a','i22b','i22c','i23a','i23b','i23c','i25a','i25b','i25c','m21','m24','m26','m27','m28','m16','m17','m18','m19']);

/* шапка: на первом экране главной прозрачная, без логотипа */
function onScroll(){document.body.classList.toggle('at-hero',document.body.classList.contains('is-home')&&scrollY<innerHeight*.8)}
addEventListener('scroll',onScroll,{passive:true});

/* появление блоков */
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'}):null;
function reveal(){$$('[data-view].on .rv:not(.vis)').forEach(el=>io?io.observe(el):el.classList.add('vis'))}

$('#burger').onclick=()=>{const m=$('#mnav'),o=m.hidden;m.hidden=!o;$('#burger').setAttribute('aria-expanded',String(o))};
addEventListener('hashchange',route);route();
})();
