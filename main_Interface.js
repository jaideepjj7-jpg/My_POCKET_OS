
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
const W=470,H=970,S=W*0.375;
const N=620;
const P=[];
for(let i=0;i<N;i++){
  const a=Math.random()*Math.PI*2;
  P.push({i,hue:(i/N)*360,size:1.9+Math.random()*2.8,
    sx:(Math.random()-.5)*2.4,sy:(Math.random()-.5)*2.8,
    gr:Math.random()*0.12,ga:a,ph:Math.random()*6.28,
    fa:Math.random()*Math.PI*2,fr:0.35+Math.pow(Math.random(),0.7)*1.0,
    x:0,y:0,fx:0,fy:0});
}
function sampleText(w,h,scale,draw){
  const o=document.createElement('canvas');o.width=w;o.height=h;
  const c=o.getContext('2d');c.fillStyle='#fff';c.textAlign='center';c.textBaseline='alphabetic';
  draw(c);
  let d=[],pts=[];try{d=c.getImageData(0,0,w,h).data}catch(e){}
  for(let y=0;y<h;y+=3)for(let x=0;x<w;x+=3)if(d[(y*w+x)*4+3]>128)pts.push([(x-w/2)/w*scale,(y-h/2)/w*scale]);
  for(let i=pts.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[pts[i],pts[j]]=[pts[j],pts[i]]}
  if(pts.length<20){for(let i=0;i<300;i++){const a=i/300*6.283;pts.push([Math.cos(a)*0.4,Math.sin(a)*0.4])}}
  return pts;
}
const JPTS=sampleText(300,360,1.3,c=>{c.font='bold 320px system-ui,Arial,sans-serif';c.fillText('J',150,300)});
const TPTS=sampleText(800,320,2.5,c=>{
  c.font='600 64px system-ui,Arial,sans-serif';c.fillText('Created by',400,95);
  c.font='bold 190px system-ui,Arial,sans-serif';c.fillText('Jaideep',400,260);
});
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const outE=t=>1-Math.pow(1-t,3);

const tgtScatter=p=>[p.sx,p.sy];
const tgtCenter=p=>[Math.cos(p.ga)*p.gr,Math.sin(p.ga)*p.gr];
const tgtJ=p=>JPTS[p.i%JPTS.length];
const tgtText=p=>TPTS[p.i%TPTS.length];
function tgtStar(p){const th=p.i/N*Math.PI*2;const r=(0.55+0.45*Math.abs(Math.cos(2.5*th)))*(p.i%3?1:0.5);
  return[Math.sin(th)*r*1.05,-Math.cos(th)*r*1.05]}
function tgtStar8(p){const th=p.i/N*Math.PI*2;const r=(0.45+0.55*Math.abs(Math.cos(4*th)))*(p.i%3?1:0.5);
  return[Math.sin(th)*r*1.1,-Math.cos(th)*r*1.1]}
function tgtHeart(p){const t=p.i/N*Math.PI*2,k=(p.i%3?1:0.55);
  return[16*Math.pow(Math.sin(t),3)/17*k,-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/17*k-0.05]}
function tgtFirework(p){return[Math.cos(p.fa)*p.fr*0.95,Math.sin(p.fa)*p.fr*1.3+0.2]}

const PH=[
 {a:1.0,b:2.3,f:tgtScatter,e:outE},
 {a:2.3,b:3.2,f:tgtCenter,e:ease},
 {a:3.2,b:4.4,f:tgtJ,e:ease},
 {a:4.4,b:5.1,f:tgtCenter,e:ease},
 {a:5.1,b:6.3,f:tgtStar,e:ease},
 {a:6.3,b:7.0,f:tgtCenter,e:ease},
 {a:7.0,b:8.2,f:tgtStar8,e:ease},
 {a:8.2,b:8.9,f:tgtCenter,e:ease},
 {a:8.9,b:10.1,f:tgtHeart,e:ease},
 {a:10.1,b:10.8,f:tgtCenter,e:ease},
 {a:10.8,b:12.2,f:tgtFirework,e:outE},
 {a:12.2,b:13.6,f:tgtText,e:ease},
];
const HOLD=13.6,TOTAL=15;
const pastel=(h,a)=>`hsla(${h},85%,72%,${a})`;
let t0=performance.now(),cur=-1,done=false;
const cx=W/2,cy=H/2;

function frame(now){
  if(done)return;
  let t=Math.max(0,(now-t0)/1000);
  if(t>=TOTAL){t=TOTAL;done=true;setTimeout(()=>{ window.location.href='lock_screen.html'},1000)}
  else requestAnimationFrame(frame);
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='rgba(10,10,20,0.28)';ctx.fillRect(0,0,W,H);

  let idx=-1;for(let k=0;k<PH.length;k++)if(t>=PH[k].a&&t<PH[k].b)idx=k;
  if(idx!==cur){
    if(idx>=0)for(const p of P){if(idx===0){p.fx=0;p.fy=0}else{p.fx=p.x;p.fy=p.y}}
    cur=idx;
  }
  ctx.globalCompositeOperation='lighter';
  if(t<1.0){
    const r=S*0.16*outE(t)+0.001;
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*2.6);
    g.addColorStop(0,'rgba(255,255,255,0.95)');g.addColorStop(0.25,pastel((t*120)%360,0.8));g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*2.6,0,7);ctx.fill();
  }
  if(t>=10.8&&t<11.3){
    const k=1-(t-10.8)/0.5,r=S*(0.2+0.5*(1-k));
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    g.addColorStop(0,`rgba(255,255,255,${0.9*k})`);g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();
  }
  if(t>=1.0){
    const ph=idx>=0?PH[idx]:null;
    const inText=idx===-1&&t>=HOLD;
    const shimmer=inText?0.006:0.012;
    const settle=t>=13.3?Math.min(1,(t-13.3)/0.7):0;
    for(const p of P){
      let tx,ty;
      if(ph){const [ux,uy]=ph.f(p),e=ph.e((t-ph.a)/(ph.b-ph.a));tx=p.fx+(ux-p.fx)*e;ty=p.fy+(uy-p.fy)*e}
      else{[tx,ty]=inText?tgtText(p):tgtCenter(p)}
      p.x=tx;p.y=ty;
      const w=shimmer*Math.sin(t*3+p.ph);
      const X=cx+(tx+w)*S,Y=cy+(ty+w*0.8)*S;
      const r=p.size*(inText||idx===11?0.8:1)*(0.9+0.3*Math.sin(t*4+p.ph));
      const hue=(p.hue+t*40)%360,pa=1-settle;
      ctx.fillStyle=pastel(hue,0.9*pa);ctx.beginPath();ctx.arc(X,Y,r,0,7);ctx.fill();
      ctx.fillStyle=pastel(hue,0.12*pa);ctx.beginPath();ctx.arc(X,Y,r*3.2,0,7);ctx.fill();
    }
    if(settle>0){
      const k=S*2.5/800;
      ctx.save();
      ctx.globalCompositeOperation='source-over';
      ctx.translate(cx,cy);ctx.scale(k,k);
      ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.globalAlpha=settle;
      const g=ctx.createLinearGradient(-400,0,400,0);
      g.addColorStop(0,'hsl(330,85%,82%)');g.addColorStop(0.5,'hsl(200,85%,82%)');g.addColorStop(1,'hsl(150,80%,80%)');
      ctx.fillStyle=g;
      ctx.font='600 64px system-ui,Arial,sans-serif';ctx.fillText('Created by',0,-65);
      ctx.font='bold 190px system-ui,Arial,sans-serif';ctx.fillText('Jaideep',0,100);
      ctx.restore();
    }
  }
}
ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,W,H);
requestAnimationFrame(frame);
