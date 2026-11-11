(function(){
'use strict';
var d=document,root=d.documentElement,body=d.body,w=window;
root.classList.add('js');
var mqReduce=w.matchMedia('(prefers-reduced-motion: reduce)'),reduce=mqReduce.matches;
var fine=w.matchMedia('(hover: hover) and (pointer: fine)').matches;
function $(s,c){return (c||d).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
function on(el,ev,fn,o){if(el)el.addEventListener(ev,fn,o||false)}
var raf=w.requestAnimationFrame||function(f){return setTimeout(f,16)};

/* scroll lock (counter so menu + lightbox don't fight).
   overflow:hidden alone makes iOS drop the scroll offset and detach position:fixed,
   so the open menu paints off-screen. Pin the body instead and restore on close. */
var locks=0,lockedY=0,holdY=null;
function lock(){if(locks++===0){lockedY=w.pageYOffset||root.scrollTop||0;holdY=lockedY;root.style.setProperty('--lock-y','-'+lockedY+'px');root.classList.add('lock')}}
function unlock(){if(locks>0&&--locks===0){var y=lockedY;holdY=y;root.classList.remove('lock');root.style.removeProperty('--lock-y');var prev=root.style.scrollBehavior;root.style.scrollBehavior='auto';w.scrollTo(0,y);root.style.scrollBehavior=prev;holdY=null}}
/* make background inert while a modal layer is open */
var bg=$$('main, footer, .wa-float, .skip');
function setInert(v){bg.forEach(function(el){if(v){el.setAttribute('inert','');el.setAttribute('aria-hidden','true')}else{el.removeAttribute('inert');el.removeAttribute('aria-hidden')}})}
function trap(e,list){var f=list.filter(function(x){return x&&x.offsetParent!==null});if(!f.length)return;var i=f.indexOf(d.activeElement);
 if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&(i===-1||i===f.length-1)){e.preventDefault();f[0].focus()}}

/* loader */
var loader=$('.loader'),started=Date.now(),finished=false;
if(loader)body.classList.add('loading');
function finish(){if(finished)return;finished=true;var wait=Math.max(0,(reduce?0:900)-(Date.now()-started));setTimeout(function(){if(loader)loader.classList.add('done');body.classList.remove('loading');root.classList.add('ready');setTimeout(function(){if(loader&&loader.parentNode)loader.parentNode.removeChild(loader)},1400)},wait)}
if(d.readyState==='complete')finish();else on(w,'load',finish);
setTimeout(finish,3000);

var y=$('.year');if(y)y.textContent=String(new Date().getFullYear());

/* reveal */
var rev=$$('.reveal');
if('IntersectionObserver' in w&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0.01});rev.forEach(function(el,i){el.style.transitionDelay=(i%3)*0.08+'s';io.observe(el)})}
else rev.forEach(function(el){el.classList.add('in')});

/* nav + menu */
var nav=$('.nav'),btn=$('.menu-btn'),menu=$('#menu'),menuOpen=false;
function focusEl(el){if(el&&el.focus){try{el.focus({preventScroll:true})}catch(err){el.focus()}}}
function closeMenu(focus){if(!menuOpen)return;menuOpen=false;menu.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Abrir menu');setInert(false);unlock();if(focus)focusEl(btn)}
function openMenu(){if(menuOpen)return;menuOpen=true;menu.classList.add('open');btn.setAttribute('aria-expanded','true');btn.setAttribute('aria-label','Fechar menu');setInert(true);lock();var f=$('a',menu);if(f)setTimeout(function(){focusEl(f)},50)}
if(btn&&menu){
 on(btn,'click',function(){menuOpen?closeMenu(true):openMenu()});
 $$('a',menu).forEach(function(a){on(a,'click',function(){closeMenu(false)})});
 var mqDesk=w.matchMedia('(min-width: 901px)');var desk=function(){if(mqDesk.matches)closeMenu(false)};
 if(mqDesk.addEventListener)mqDesk.addEventListener('change',desk);else if(mqDesk.addListener)mqDesk.addListener(desk);
}

/* scroll effects */
var heroMedia=$('.hero-media'),par=$$('.parallax'),ticking=false,mx=0,my=0;
function frame(){ticking=false;var sy=holdY!==null?holdY:(w.pageYOffset||0),vh=w.innerHeight;if(nav)nav.classList.toggle('scrolled',sy>40);if(reduce||holdY!==null)return;
 if(heroMedia&&sy<vh*1.2)heroMedia.style.transform='translate3d('+(mx*-14)+'px,'+(sy*0.3+my*-10)+'px,0) rotateX('+(my*2)+'deg) rotateY('+(mx*-2)+'deg)';
 for(var i=0;i<par.length;i++){var r=par[i].getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)continue;par[i].style.transform='translate3d(0,'+((r.top+r.height/2-vh/2)*parseFloat(par[i].getAttribute('data-speed')||0)).toFixed(1)+'px,0)'}}
function req(){if(!ticking){ticking=true;raf(frame)}}
on(w,'scroll',req,{passive:true});on(w,'resize',req);frame();
if(fine&&!reduce)on(w,'mousemove',function(e){mx=e.clientX/w.innerWidth-0.5;my=e.clientY/w.innerHeight-0.5;req()},{passive:true});

/* tilt */
if(fine&&!reduce)$$('.tilt').forEach(function(el){on(el,'mousemove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-0.5,yy=(e.clientY-r.top)/r.height-0.5;el.style.transform='rotateX('+(-yy*8)+'deg) rotateY('+(x*10)+'deg)'});on(el,'mouseleave',function(){el.style.transform=''})});

/* magnetic + cursor (desktop only) */
if(fine&&!reduce){
 $$('.magnetic').forEach(function(el){on(el,'mousemove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*0.3)+'px,'+((e.clientY-r.top-r.height/2)*0.35)+'px)'});on(el,'mouseleave',function(){el.style.transform=''})});
 var cur=$('.cursor'),cx=0,cy=0,tx=0,ty=0,running=false;
 var loop=function(){cx+=(tx-cx)*0.2;cy+=(ty-cy)*0.2;cur.style.transform='translate3d('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px,0)';if(Math.abs(tx-cx)>0.3||Math.abs(ty-cy)>0.3)raf(loop);else running=false};
 if(cur){on(w,'mousemove',function(e){tx=e.clientX;ty=e.clientY;cur.classList.add('on');if(!running){running=true;raf(loop)}},{passive:true});
 on(d.documentElement,'mouseleave',function(){cur.classList.remove('on')});
 on(d,'mouseover',function(e){var t=e.target.closest&&e.target.closest('a,button,.carousel');cur.classList.toggle('big',!!t)});}
}

/* 3D carousel */
var car=$('.carousel'),ring=$('.ring');
if(car&&ring){
 var cards=$$('.c-card',ring);cards.forEach(function(c){c.style.setProperty('--i',c.getAttribute('data-i'))});
 var n=cards.length,step=360/n,idx=0,rot=0,z=420,status=$('#c-status'),drag=null,auto=null,moved=false;
 ring.style.setProperty('--step',step+'deg');
 var titles=cards.map(function(c){var s=$('strong',c);return s?s.textContent:''});
 var tz=function(){var cw=cards[0].offsetWidth||300;z=Math.round((cw/2)/Math.tan(Math.PI/n))+40;cards.forEach(function(c){c.style.setProperty('--tz',z+'px')});car.style.perspective=(z*3.4)+'px'};
 var apply=function(){ring.style.transform='translateZ(-'+z+'px) rotateY('+rot+'deg)'};
 var set=function(announce){apply();var front=((-idx%n)+n)%n;cards.forEach(function(c,i){c.setAttribute('aria-hidden',i===front?'false':'true')});if(announce&&status)status.textContent=(front+1)+' de '+n+': '+titles[front]};
 var go=function(k){idx+=k;rot=-idx*step;set(true)};
 tz();set(false);
 var rt=null;on(w,'resize',function(){clearTimeout(rt);rt=setTimeout(function(){tz();set(false)},120)});
 on($('.c-prev'),'click',function(){go(-1);restart()});on($('.c-next'),'click',function(){go(1);restart()});
 on(car,'keydown',function(e){if(e.key==='ArrowLeft'){e.preventDefault();go(-1);restart()}else if(e.key==='ArrowRight'){e.preventDefault();go(1);restart()}});
 on(car,'dragstart',function(e){e.preventDefault()});
 var end=function(){if(!drag)return;drag=null;ring.style.transition='';idx=Math.round(-rot/step);rot=-idx*step;set(moved);restart()};
 on(car,'pointerdown',function(e){if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,base:rot,id:e.pointerId};moved=false;stop();ring.style.transition='none'});
 on(car,'pointermove',function(e){if(!drag||e.pointerId!==drag.id)return;var dx=e.clientX-drag.x;if(!moved&&Math.abs(dx)>6){moved=true;try{car.setPointerCapture(e.pointerId)}catch(_){}}if(moved){rot=drag.base+dx*0.3;apply()}});
 on(car,'pointerup',end);on(car,'pointercancel',end);on(car,'lostpointercapture',end);
 var stop=function(){if(auto){clearInterval(auto);auto=null}};
 var start=function(){stop();if(reduce||d.hidden)return;auto=setInterval(function(){if(!drag&&!car.matches(':hover')&&d.activeElement!==car&&!menuOpen&&!lbOpen)go(1)},4500)};
 var restart=function(){start()};
 var visible=false;if('IntersectionObserver' in w){new IntersectionObserver(function(es){visible=es[0].isIntersecting;visible?start():stop()}).observe(car)}else start();
 on(d,'visibilitychange',function(){if(d.hidden)stop();else if(visible)start()});
}

/* lightbox */
var lb=$('.lb'),lbImg=$('.lb-img'),lbCap=$('.lb-cap'),allItems=$$('.g-item'),items=allItems,cur_i=0,lastFocus=null,lbOpen=false,pushed=false;
function groupOf(a){var name=a.getAttribute('data-gallery')||'casa';return allItems.filter(function(x){return (x.getAttribute('data-gallery')||'casa')===name})}
function preload(i){var a=items[(i+items.length)%items.length];if(a){var im=new Image();im.src=a.getAttribute('href')}}
function show(i){cur_i=(i+items.length)%items.length;var a=items[cur_i],im=$('img',a);lbImg.src=a.getAttribute('href');lbImg.alt=im.alt;lbImg.width=+a.getAttribute('data-w');lbImg.height=+a.getAttribute('data-h');lbCap.textContent=im.alt+' · '+(cur_i+1)+'/'+items.length;preload(cur_i+1);preload(cur_i-1)}
function openLb(i){if(lbOpen){show(i);return}lbOpen=true;lastFocus=d.activeElement;show(i);lb.hidden=false;setInert(true);if(nav)nav.setAttribute('inert','');lock();raf(function(){lb.classList.add('show')});$('.lb-close').focus();
 try{history.pushState({lb:1},'');pushed=true}catch(_){pushed=false}}
function closeLb(fromPop){if(!lbOpen)return;lbOpen=false;lb.classList.remove('show');lb.hidden=true;setInert(false);if(nav)nav.removeAttribute('inert');unlock();if(lastFocus&&lastFocus.focus)lastFocus.focus();
 if(pushed&&!fromPop){pushed=false;try{history.back()}catch(_){}}else pushed=false}
if(lb&&allItems.length){
 allItems.forEach(function(a){on(a,'click',function(e){if(e.ctrlKey||e.metaKey||e.shiftKey||e.button===1)return;e.preventDefault();items=groupOf(a);openLb(items.indexOf(a))})});
 on($('.lb-close'),'click',function(){closeLb(false)});on($('.lb-prev'),'click',function(){show(cur_i-1)});on($('.lb-next'),'click',function(){show(cur_i+1)});
 on(lb,'click',function(e){if(e.target===lb||e.target.tagName==='FIGURE')closeLb(false)});
 on(w,'popstate',function(){if(lbOpen)closeLb(true)});
 var tsx=null,tsy=0;on(lb,'touchstart',function(e){if(e.touches.length!==1){tsx=null;return}tsx=e.touches[0].clientX;tsy=e.touches[0].clientY},{passive:true});
 on(lb,'touchend',function(e){if(tsx===null)return;var t=e.changedTouches[0],dx=t.clientX-tsx,dy=t.clientY-tsy;tsx=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))show(cur_i+(dx<0?1:-1));else if(dy>90&&Math.abs(dy)>Math.abs(dx))closeLb(false)},{passive:true});
}

/* global keys */
on(d,'keydown',function(e){
 if(lbOpen){if(e.key==='Escape'){e.preventDefault();closeLb(false)}else if(e.key==='ArrowLeft')show(cur_i-1);else if(e.key==='ArrowRight')show(cur_i+1);else if(e.key==='Tab')trap(e,$$('button',lb));return}
 if(menuOpen){if(e.key==='Escape'){e.preventDefault();closeMenu(true)}else if(e.key==='Tab')trap(e,[btn].concat($$('a',menu)))}
});

/* hero waves: canvas 2D, paused offscreen / hidden tab, DPR capped */
var cv=$('.waves');
if(cv&&cv.getContext&&!reduce){var ctx=cv.getContext('2d');if(ctx){var W=0,H=0,dpr=1,id=0,vis=true,t0=0;
 var size=function(){dpr=Math.min(w.devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;if(!W||!H)return;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
 size();if('ResizeObserver' in w)new ResizeObserver(function(){size()}).observe(cv);else on(w,'resize',size);
 var draw=function(ts){id=0;if(!vis||d.hidden)return;if(!t0)t0=ts;var t=(ts-t0)/1000*0.5;ctx.clearRect(0,0,W,H);
  for(var l=0;l<4;l++){ctx.beginPath();var amp=8+l*5,base=H*(0.35+l*0.17);ctx.moveTo(0,H);for(var x=0;x<=W+12;x+=12)ctx.lineTo(x,base+Math.sin(x*0.006+t*(1.2+l*0.3)+l)*amp+Math.sin(x*0.013-t*1.7)*amp*0.4);ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle='rgba('+(31-l*6)+','+(122-l*20)+','+(140-l*22)+','+(0.16+l*0.12)+')';ctx.fill()}
  id=raf(draw)};
 var kick=function(){if(!id&&vis&&!d.hidden)id=raf(draw)};
 if('IntersectionObserver' in w)new IntersectionObserver(function(es){vis=es[0].isIntersecting;kick()}).observe(cv);
 on(d,'visibilitychange',kick);kick();
}}
})();
