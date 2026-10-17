/* 全站圖片點擊放大（BNI 富真分會官網）
   規則：頁面上顯示寬度 ≥ 200px 的圖都能點；已經有自己放大功能的（首頁主題簡報 EDM、成功見證相簿）、小圖示與 logo 不處理。
   放大後：點圖＝切換 2 倍；點背景、✕、Esc 關閉；左右鍵或兩側箭頭看同一頁的前後張。 */
(function(){
  if(window.__zoomInit)return;window.__zoomInit=true;
  var css='.zm{position:fixed;inset:0;z-index:9999;background:rgba(3,6,10,.95);display:none;align-items:center;justify-content:center;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}'
  +'.zm.on{display:flex}.zm-box{width:100%;height:100%;overflow:auto;display:flex;align-items:center;justify-content:center;padding:56px 12px 64px;-webkit-overflow-scrolling:touch}'
  +'.zm-box.big{align-items:flex-start;justify-content:flex-start}'
  +'.zm img{display:block;max-width:96vw;max-height:calc(100vh - 130px);width:auto;height:auto;object-fit:contain;border-radius:3px;box-shadow:0 30px 100px rgba(0,0,0,.8);cursor:zoom-in}'
  +'.zm-box.big img{max-width:none;max-height:none;width:200vw;cursor:zoom-out}'
  +'.zm-x,.zm-n,.zm-p{position:fixed;background:rgba(5,9,15,.6);border:1px solid rgba(255,255,255,.28);color:#fff;border-radius:3px;cursor:pointer;font-size:22px;line-height:1;width:44px;height:44px;display:flex;align-items:center;justify-content:center;z-index:2}'
  +'.zm-x{top:14px;right:16px}.zm-p{left:12px;top:50%;margin-top:-22px}.zm-n{right:12px;top:50%;margin-top:-22px}'
  +'.zm-x:hover,.zm-n:hover,.zm-p:hover{background:#fff;color:#05090f}'
  +'.zm-cap{position:fixed;left:0;right:0;bottom:0;padding:10px 70px 14px;text-align:center;color:#eef2f7;font-size:16px;line-height:1.5;background:linear-gradient(180deg,transparent,rgba(3,6,10,.85))}'
  +'.zm-cnt{position:fixed;top:24px;left:18px;color:#9aa8ba;font-size:16px}'
  +'img[data-zm]{cursor:zoom-in}@media(max-width:640px){.zm-cap{padding:10px 56px 14px;font-size:16px}.zm-p{left:6px}.zm-n{right:6px}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var el=document.createElement('div');el.className='zm';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
  el.innerHTML='<button class="zm-x" aria-label="關閉">✕</button><button class="zm-p" aria-label="上一張">‹</button><button class="zm-n" aria-label="下一張">›</button><div class="zm-cnt"></div><div class="zm-box"><img alt=""></div><div class="zm-cap"></div>';
  document.body.appendChild(el);
  var box=el.querySelector('.zm-box'),im=el.querySelector('img'),cap=el.querySelector('.zm-cap'),cnt=el.querySelector('.zm-cnt'),list=[],idx=0;
  function skip(i){
    if(i.closest('.lbx,.zm,.edm-card,.next-item,[data-nozoom]'))return true;
    if(i.id==='albumImg'||i.id==='lbxImg')return true;
    var r=i.getBoundingClientRect();return r.width<200||r.height<100;
  }
  function collect(){return [].slice.call(document.images).filter(function(i){return !skip(i)&&i.currentSrc})}
  function show(k){
    idx=(k+list.length)%list.length;var i=list[idx];
    im.src=i.currentSrc||i.src;im.alt=i.alt||'';box.classList.remove('big');
    cap.textContent=i.alt||'';cap.style.display=i.alt?'block':'none';
    cnt.textContent=list.length>1?(idx+1)+' / '+list.length:'';
    var m=list.length>1?'flex':'none';el.querySelector('.zm-p').style.display=m;el.querySelector('.zm-n').style.display=m;
    box.scrollTop=0;box.scrollLeft=0;
  }
  function open(i){list=collect();var k=list.indexOf(i);if(k<0){list=[i];k=0}show(k);el.classList.add('on');document.body.style.overflow='hidden'}
  function close(){el.classList.remove('on');document.body.style.overflow='';im.src=''}
  document.addEventListener('click',function(e){
    var t=e.target;
    if(el.classList.contains('on')){
      if(t===im){box.classList.toggle('big');return}
      if(t.closest('.zm-n')){show(idx+1);return}
      if(t.closest('.zm-p')){show(idx-1);return}
      if(t.closest('.zm-x')||t===el||t===box){close()}
      return;
    }
    if(t.tagName==='IMG'&&!skip(t)){
      var a=t.closest('a[href]');if(a&&!/^#/.test(a.getAttribute('href'))&&!a.classList.contains('top1-pic')){return}
      e.preventDefault();open(t);
    }
  });
  document.addEventListener('keydown',function(e){
    if(!el.classList.contains('on'))return;
    if(e.key==='Escape')close();else if(e.key==='ArrowRight')show(idx+1);else if(e.key==='ArrowLeft')show(idx-1);
  });
  /* 可點的圖給放大鏡游標 */
  function mark(){collect().forEach(function(i){i.setAttribute('data-zm','1')})}
  window.addEventListener('load',function(){mark();setTimeout(mark,1500)});
  new MutationObserver(function(){mark()}).observe(document.body,{childList:true,subtree:true});
})();
