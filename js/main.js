(function(){
'use strict';
var d=document,root=d.documentElement,body=d.body;
root.classList.add('js');
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
function $(s,c){return (c||d).querySelector(s)}function $$(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}

/* loader */
body.classList.add('loading');
var loader=$('.loader'),started=Date.now();
function finish(){var wait=Math.max(0,(reduce?0:1300)-(Date.now()-started));setTimeout(function(){if(loader)loader.classList.add('done');body.classList.remove('loading');root.classList.add('ready');},wait)}
if(d.readyState==='complete')finish();else window.addEventListener('load',finish);
setTimeout(finish,4000);

var y=$('.year');if(y)y.textContent=String(new Date().getFullYear());

/* reveal */
var rev=$$('.reveal');
if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});rev.forEach(function(el,i){el.style.transitionDelay=(i%3)*0.08+'s';io.observe(el)})}else rev.forEach(function(el){el.classList.add('in')});

/* nav + menu */
var nav=$('.nav'),btn=$('.menu-btn'),menu=$('#menu');
function closeMenu(focus){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-label','Abrir menu');body.style.overflow='';if(focus)btn.focus()}
btn.addEventListener('click',function(){var open=!menu.classList.contains('open');if(!open)return closeMenu();menu.classList.add('open');btn.setAttribute('aria-expanded','true');btn.setAttribute('aria-label','Fechar menu');body.style.overflow='hidden';var f=$('a',menu);if(f)f.focus()});
$$('a',menu).forEach(function(a){a.addEventListener('click',function(){if(menu.classList.contains('open'))closeMenu()})});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open'))closeMenu(true)});
menu.addEventListener('keydown',function(e){if(e.key!=='Tab'||!menu.classList.contains('open'))return;var f=[btn].concat($$('a',menu)),i=f.indexOf(d.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}});

/* scroll effects */
var heroMedia=$('.hero-media'),par=$$('.parallax'),ticking=false,mx=0,my=0;
function onScroll(){var sy=window.pageYOffset;nav.classList.toggle('scrolled',sy>40);if(reduce)return;
 if(heroMedia&&sy<window.innerHeight*1.2)heroMedia.style.transform='translate3d('+(mx*-14)+'px,'+(sy*0.3+my*-10)+'px,0) rotateX('+(my*2)+'deg) rotateY('+(mx*-2)+'deg)';
 par.forEach(function(el){var r=el.getBoundingClientRect(),c=r.top+r.height/2-window.innerHeight/2;el.style.transform='translate3d(0,'+(c*parseFloat(el.dataset.speed||0))+'px,0)'});ticking=false}
window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
if(fine&&!reduce)window.addEventListener('mousemove',function(e){mx=e.clientX/window.innerWidth-.5;my=e.clientY/window.innerHeight-.5;if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});

/* tilt */
if(fine&&!reduce)$$('.tilt').forEach(function(el){el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform='rotateX('+(-y*8)+'deg) rotateY('+(x*10)+'deg) translateZ(0)'});el.addEventListener('mouseleave',function(){el.style.transform=''})});

/* magnetic + cursor */
if(fine&&!reduce){
 $$('.magnetic').forEach(function(el){el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.3)+'px,'+((e.clientY-r.top-r.height/2)*.35)+'px)'});el.addEventListener('mouseleave',function(){el.style.transform=''})});
 var cur=$('.cursor'),cx=0,cy=0,tx=0,ty=0;
 window.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;cur.classList.add('on')},{passive:true});
 d.addEventListener('mouseleave',function(){cur.classList.remove('on')});
 (function loop(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform='translate3d('+cx+'px,'+cy+'px,0)';requestAnimationFrame(loop)})();
 $$('a,button,.carousel').forEach(function(el){el.addEventListener('mouseenter',function(){cur.classList.add('big')});el.addEventListener('mouseleave',function(){cur.classList.remove('big')})});
}

/* 3D carousel */
var car=$('.carousel'),ring=$('.ring');
if(car&&ring){var cards=$$('.c-card',ring);cards.forEach(function(c){c.style.setProperty('--i',c.dataset.i)});var n=cards.length,step=360/n,idx=0,rot=0;
 function tz(){var w=cards[0].offsetWidth;var z=Math.round((w/2)/Math.tan(Math.PI/n))+40;cards.forEach(function(c){c.style.setProperty('--tz',z+'px')});car.style.perspective=(z*3.4)+'px'}
 function set(){ring.style.transform='translateZ(-'+(cards[0].style.getPropertyValue('--tz')||'420px')+') rotateY('+rot+'deg)';cards.forEach(function(c,i){var a=((i*step+rot)%360+360)%360;c.setAttribute('aria-hidden',a>step/2&&a<360-step/2?'true':'false')})}
 function go(k){idx+=k;rot=-idx*step;set()}
 tz();set();window.addEventListener('resize',function(){tz();set()});
 $('.c-prev').addEventListener('click',function(){go(-1)});$('.c-next').addEventListener('click',function(){go(1)});
 car.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}if(e.key==='ArrowRight'){e.preventDefault();go(1)}});
 var sx=null,base=0;car.addEventListener('pointerdown',function(e){sx=e.clientX;base=rot;ring.style.transition='none'});
 window.addEventListener('pointermove',function(e){if(sx===null)return;rot=base+(e.clientX-sx)*.3;ring.style.transform='translateZ(-'+cards[0].style.getPropertyValue('--tz')+') rotateY('+rot+'deg)'});
 window.addEventListener('pointerup',function(){if(sx===null)return;sx=null;ring.style.transition='';idx=Math.round(-rot/step);rot=-idx*step;set()});
 window.addEventListener('pointercancel',function(){if(sx===null)return;sx=null;ring.style.transition='';idx=Math.round(-rot/step);rot=-idx*step;set()});
 if(!reduce){var auto=setInterval(function(){if(sx===null&&!car.matches(':hover')&&d.activeElement!==car)go(1)},4200);d.addEventListener('visibilitychange',function(){if(d.hidden)clearInterval(auto)})}
}

/* lightbox */
var lb=$('.lb'),lbImg=$('.lb-img'),lbCap=$('.lb-cap'),items=$$('.g-item'),cur_i=0,lastFocus=null;
function show(i){cur_i=(i+items.length)%items.length;var a=items[cur_i],im=$('img',a);lbImg.src=a.getAttribute('href');lbImg.alt=im.alt;lbImg.width=+a.dataset.w;lbImg.height=+a.dataset.h;lbCap.textContent=im.alt+'  ·  '+(cur_i+1)+'/'+items.length}
function openLb(i){lastFocus=d.activeElement;show(i);lb.hidden=false;body.style.overflow='hidden';requestAnimationFrame(function(){lb.classList.add('show')});$('.lb-close').focus()}
function closeLb(){lb.classList.remove('show');lb.hidden=true;body.style.overflow='';if(lastFocus)lastFocus.focus()}
items.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();openLb(i)})});
$('.lb-close').addEventListener('click',closeLb);$('.lb-prev').addEventListener('click',function(){show(cur_i-1)});$('.lb-next').addEventListener('click',function(){show(cur_i+1)});
lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
d.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')closeLb();else if(e.key==='ArrowLeft')show(cur_i-1);else if(e.key==='ArrowRight')show(cur_i+1);else if(e.key==='Tab'){var f=$$('button',lb),k=f.indexOf(d.activeElement);if(e.shiftKey&&k<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&k===f.length-1){e.preventDefault();f[0].focus()}}});
var tsx=null;lb.addEventListener('touchstart',function(e){tsx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){if(tsx===null)return;var dx=e.changedTouches[0].clientX-tsx;if(Math.abs(dx)>50)show(cur_i+(dx<0?1:-1));tsx=null});

/* hero waves (canvas 2D, lightweight) */
var cv=$('.waves');
if(cv&&cv.getContext&&!reduce){var ctx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),t=0,vis=true;
 function size(){W=cv.offsetWidth;H=cv.offsetHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
 size();var lastW=window.innerWidth;window.addEventListener('resize',function(){if(window.innerWidth!==lastW){lastW=window.innerWidth;size()}});
 if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(cv);
 (function draw(){requestAnimationFrame(draw);if(!vis||d.hidden)return;t+=0.008;ctx.clearRect(0,0,W,H);
  for(var l=0;l<4;l++){ctx.beginPath();var amp=8+l*5,base=H*(.35+l*.17);ctx.moveTo(0,H);for(var x=0;x<=W;x+=12){ctx.lineTo(x,base+Math.sin(x*.006+t*(1.2+l*.3)+l)*amp+Math.sin(x*.013-t*1.7)*amp*.4)}ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle='rgba('+(31-l*6)+','+(122-l*20)+','+(140-l*22)+','+(0.16+l*0.12)+')';ctx.fill()}
 })();
}
})();
