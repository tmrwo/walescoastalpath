

const SEC = Object.fromEntries(SECTIONS.map(s => [s.id, s]));


const ICON = {
  bed:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 18v-8h18v8M3 14h18M6 10V7h5v3"></path></svg>',
  bus:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="4" y="5" width="16" height="13" rx="2"></rect><path d="M4 12h16M8 18v2M16 18v2"></path></svg>',
  up:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 19V6M6 12l6-6 6 6"></path></svg>',
  down:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v13M6 12l6 6 6-6"></path></svg>',
  x:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>',
  pin:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11z"></path><circle cx="12" cy="10" r="2.2"></circle></svg>',
  swap:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h13l-3-3M20 16H7l3 3"></path></svg>',
  lunch:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 3v8a2 2 0 0 0 4 0V3M7 3v18M15 3c-1 3-1 6 0 9v9M15 12h3c0-4-1-7-3-9"></path></svg>',
  detour:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19c4 0 4-8 8-8s4 8 8 8M14 8l3-3 3 3"></path></svg>'
};

const POI_ICON = {
  view:'<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M3 19l6-10 4 6 2-3 6 7z"></path></svg>',
  sight:'<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 21h16M6 21V9l6-4 6 4v12M10 21v-5h4v5"></path></svg>',
  beach:'<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 15c3-3 6-3 9 0s6 3 9 0M3 20c3-3 6-3 9 0s6 3 9 0"></path><circle cx="17" cy="6" r="3"></circle></svg>',
  wildlife:'<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M3 12c4 0 6-4 10-4 3 0 5 2 8 2-2 3-5 4-8 4-3 0-5 3-7 5 1-3 0-5-3-7z"></path></svg>',
  lunch:'<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 3v8a2 2 0 0 0 4 0V3M7 3v18M15 3c-1 3-1 6 0 9v9M15 12h3c0-4-1-7-3-9"></path></svg>',
  town:'<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M3 21V8h7v13M10 21V4h11v17M6 12h1M6 16h1M14 8h1M18 8h1M14 12h1M18 12h1M14 16h1M18 16h1"></path></svg>'
};
const POI_LABEL = { view:'Viewpoint', sight:'Worth seeing', beach:'Beach', wildlife:'Wildlife', lunch:'Lunch stop', town:'Town / supplies' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => (n == null || n === '' || isNaN(n)) ? '—' : Number(n).toLocaleString('en-GB', {maximumFractionDigits:1});
const uid = () => Math.random().toString(36).slice(2, 10);
const TOTAL = SECTIONS.reduce((a, s) => a + s.miles, 0);
const south = () => state.direction === 'south';                       // walking Chepstow → Chester
const orderedSections = () => south() ? SECTIONS.slice().reverse() : SECTIONS.slice();
const sectionNo = s => orderedSections().indexOf(s) + 1;
const stageOrder = sec => { const idx = sec.stages.map((_, i) => i); return south() ? idx.reverse() : idx; };
// A stage as you'd walk it in the current direction (names, ascent/descent, profile)
const viewStage = (sec, i, rev = south()) => { const st = sec.stages[i]; return rev ? { frm: st.to, to: st.frm, up: st.down, down: st.up, hi: st.hi, mi: st.mi, prof: st.prof.slice().reverse(), rev: true } : { ...st, rev: false }; };
const secEnds = sec => south() ? [sec.to, sec.frm] : [sec.frm, sec.to];

// ---------- state ----------
const state = {
  view: 'map', sel: 'south', stageSel: null, tripId: null, filter: 'all', direction: 'south', confirmDelete: null, unit: 'mi',
  trips: [], ready: false, saveState: 'local'
};
let db = null;
let unsub = null;
const pending = new Map(); // tripId -> timer
const dirty = new Set();   // trips with a write in flight: remote snapshots must not clobber them

// ---------- geometry (British National Grid metres; y is negated for SVG) ----------
const P = pts => pts.map(p => p[0]+','+p[1]).join(' ');
const MI = 1609.344;
function bboxOf(arrs){ let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity; for (const a of arrs) for (const p of a) { if(p[0]<x0)x0=p[0]; if(p[0]>x1)x1=p[0]; if(p[1]<y0)y0=p[1]; if(p[1]>y1)y1=p[1]; } return {x:x0,y:y0,w:x1-x0,h:y1-y0}; }
function padBox(b, f, aspect){ let w=b.w*(1+2*f), h=b.h*(1+2*f); if (aspect) { if (w/h < aspect) w = h*aspect; else h = w/aspect; } return {x:b.x+b.w/2-w/2, y:b.y+b.h/2-h/2, w, h}; }
const secPts = s => s.stages.map(st => st.pts);
const FULL = padBox(bboxOf([...SECTIONS.flatMap(secPts), SECTIONS.map(s => [s.lx - 18000, s.ly - 4000]), SECTIONS.map(s => [s.lx + 18000, s.ly + 5000])]), 0.04);
// ---------- Leaflet map in British National Grid, with OS Maps API tiles ----------
const BNG_DEF = '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs';
const RES = [896, 448, 224, 112, 56, 28, 14, 7, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375];
const CRS27700 = new L.Proj.CRS('EPSG:27700', BNG_DEF, { origin: [-238375.0, 1376256.0], resolutions: RES });
const toLL = (x, y) => CRS27700.unproject(L.point(x, -y));          // our data keeps northing negated (SVG legacy)
const toXY = ll => { const p = CRS27700.project(ll); return [p.x, -p.y]; };
const llPts = pts => pts.map(p => toLL(p[0], p[1]));
const boxToBounds = b => L.latLngBounds(toLL(b.x, b.y + b.h), toLL(b.x + b.w, b.y));
const OS_ATTR = `Contains OS data © Crown copyright and database rights ${new Date().getFullYear()} · Route: Natural Resources Wales / OS (OGL) · Heights: OS Terrain 50 (OGL)`;
function osLayer(style){ const premiumTo = style === 'Leisure_27700' ? 9 : 13; return L.tileLayer(`https://api.os.uk/maps/raster/v1/zxy/${style}/{z}/{x}/{y}.png?key=${encodeURIComponent(CONFIG.osKey || '')}`, { maxNativeZoom: premiumTo, maxZoom: 12, minZoom: 0, attribution: OS_ATTR }); }
function baseLayers(){ return { 'OS Leisure (Explorer / Landranger)': osLayer('Leisure_27700'), 'OS Outdoor': osLayer('Outdoor_27700'), 'OS Light': osLayer('Light_27700') }; }
const noKey = () => !CONFIG.osKey || /PASTE/.test(CONFIG.osKey);

function makeLeafMap(el, opts = {}){
  const map = L.map(el, { crs: CRS27700, zoomControl: false, attributionControl: opts.attribution !== false, minZoom: 0, maxZoom: 12, scrollWheelZoom: opts.scroll !== false, dragging: opts.drag !== false, tap: false, zoomSnap: 0.25 });
  const bl = baseLayers(); const first = Object.values(bl)[opts.light ? 2 : 0]; first.addTo(map);
  if (opts.layers) L.control.layers(bl, null, { position: 'topright', collapsed: true }).addTo(map);
  if (noKey()) L.marker(toLL(280000, -250000), { icon: L.divIcon({ className: 'nokey', html: 'No OS Maps API key in config.js yet — the route still works, the map underneath is blank.', iconSize: [320, 60] }), interactive: false }).addTo(map);
  const m = { map, el, groups: {}, box: null };
  Object.defineProperty(m, 'box', { get(){ const b = map.getBounds(); const sw = toXY(b.getSouthWest()), ne = toXY(b.getNorthEast()); return { x: sw[0], y: ne[1], w: ne[0]-sw[0], h: sw[1]-ne[1] }; } });
  m.fit = (bb, f = 0.12) => { map.fitBounds(boxToBounds(padBox(bb, f)), { animate: false }); };
  m.set = bb => m.fit(bb, 0);
  m.zoomAt = f => f < 1 ? map.zoomIn() : map.zoomOut();
  m.scale = () => RES[Math.round(map.getZoom())] || RES[RES.length-1];
  m.apply = () => {};
  m.svg = el;
  m.set({ ...(opts.box || FULL) });
  return m;
}

// Elevation sparkline: prof is heights every ~200 m; yMax fixes the vertical scale so days compare.
function profileSvg(prof, yMax, w, h, cls){
  if (!prof || prof.length < 2) return '';
  const n = prof.length, top = 4;
  const pts = prof.map((v, i) => `${(i/(n-1)*w).toFixed(1)},${(h - Math.max(0, v)/yMax*(h-top)).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" class="${cls||'prof'}" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,${h} ${pts} ${w},${h}" fill="var(--seafill)"></polygon><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"></polyline></svg>`;
}
// ---------- along-route geometry for partial days ----------
function cumLen(pts){ const L=[0]; for (let i=1;i<pts.length;i++) L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1])); return L; }
function ptAt(pts, f){ const L=cumLen(pts), d=f*L[L.length-1]; for (let i=1;i<L.length;i++) if (L[i]>=d) { const t=(d-L[i-1])/((L[i]-L[i-1])||1); return [pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; } return pts[pts.length-1]; }
function slicePts(pts, f0, f1){ if (f1 <= f0) return []; const L=cumLen(pts), T=L[L.length-1], a=f0*T, b=f1*T; const out=[ptAt(pts,f0)]; for (let i=0;i<pts.length;i++) if (L[i]>a && L[i]<b) out.push(pts[i]); out.push(ptAt(pts,f1)); return out; }
// nearest point on a stage polyline to (x,y): fraction along it and distance
function projectOn(pts, x, y){ const L=cumLen(pts), T=L[L.length-1]; let best={d:Infinity}; for (let i=1;i<pts.length;i++){ const ax=pts[i-1][0],ay=pts[i-1][1],bx=pts[i][0],by=pts[i][1]; const dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy; const t=l2? Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/l2)) : 0; const px=ax+t*dx,py=ay+t*dy,d=Math.hypot(px-x,py-y); if (d<best.d) best={d,f:(L[i-1]+t*(L[i]-L[i-1]))/T,x:px,y:py}; } return best; }
function profSlice(prof, f0, f1){ const n=prof.length-1; const a=Math.max(0,Math.floor(f0*n)), b=Math.min(n,Math.ceil(f1*n)); return prof.slice(a, Math.max(a+1,b+1)); }
function upDown(prof){ let up=0,down=0,ref=prof[0]; for (const h of prof.slice(1)) { const dh=h-ref; if (dh>=3){up+=dh;ref=h;} else if (dh<=-3){down+=-dh;ref=h;} } return {up,down}; }
const dseg = d => d.seg ? d.seg : (d.stage != null ? { i0: d.stage, f0: 0, i1: d.stage, f1: 1 } : null);
function segStats(sec, seg){
  let mi=0, up=0, down=0, hi=-1e9, prof=[];
  for (let k=seg.i0; k<=seg.i1; k++) {
    const st=sec.stages[k]; if (!st) continue; const a = k===seg.i0 ? seg.f0 : 0, b = k===seg.i1 ? seg.f1 : 1; if (b<=a) continue;
    mi += st.mi*(b-a); const ps=profSlice(st.prof,a,b); const full=upDown(st.prof), part=upDown(ps);
    up += part.up * (full.up ? st.up/full.up : 1); down += part.down * (full.down ? st.down/full.down : 1);
    hi = Math.max(hi, ...ps); prof = prof.length ? prof.concat(ps.slice(1)) : ps;
  }
  return { mi: Math.round(mi*10)/10, up: Math.round(up/10)*10, down: Math.round(down/10)*10, hi: Math.round(hi), prof };
}
function segPtsList(sec, seg){ const out=[]; for (let k=seg.i0;k<=seg.i1;k++){ const st=sec.stages[k]; if(!st) continue; const a=k===seg.i0?seg.f0:0, b=k===seg.i1?seg.f1:1; if (b>a) out.push(slicePts(st.pts,a,b)); } return out; }
function segPoint(sec, i, f){ return ptAt(sec.stages[i].pts, f); }
const normPt = p => (p.f >= 0.999 ? { i: p.i + 1, f: 0 } : (p.f <= 0.001 ? { i: p.i, f: 0 } : p));
const ptEq = (p, q) => { if (!p || !q) return false; const a = normPt(p), b = normPt(q); return a.i === b.i && Math.abs(a.f - b.f) < 1e-6; };
function segMiles(sec, i, f){ let m=0; for (let k=0;k<i;k++) m+=sec.stages[k].mi; return m + sec.stages[i].mi*f; } // miles from the section's canonical start
function defaultName(sec, i, f){ if (f <= 0.001) return sec.stages[i].frm; if (f >= 0.999) return sec.stages[i].to; return ''; }
// the two ends of a day as walked: {i,f} canonical points
function dayEnds(d){ const s=dseg(d); if (!s) return null; const a={i:s.i0,f:s.f0}, b={i:s.i1,f:s.f1}; return d.rev ? {start:b, end:a} : {start:a, end:b}; }
function setDayEnds(sec, d, start, end, names){
  const fwd = (start.i < end.i) || (start.i === end.i && start.f <= end.f);
  const a = fwd ? start : end, b = fwd ? end : start;
  d.seg = { i0:a.i, f0:a.f, i1:b.i, f1:b.f }; d.stage = a.i; d.rev = !fwd; d.rest = false;
  const st = segStats(sec, d.seg);
  d.miles = st.mi; d.ascent = d.rev ? st.down : st.up; d.descent = d.rev ? st.up : st.down;
  d.from = (names && names.from) || defaultName(sec, start.i, start.f) || d.from || 'Point on the path';
  d.to   = (names && names.to)   || defaultName(sec, end.i, end.f)     || d.to   || 'Point on the path';
}
function isFullStage(d){ const s=dseg(d); return s && s.i0===s.i1 && s.f0<=0.001 && s.f1>=0.999; }

// ---------- coordinates: OSGB36 grid → WGS84, and OS grid refs ----------
function bngToLL(E, N){
  const a=6377563.396,b=6356256.909,F0=0.9996012717,lat0=49*Math.PI/180,lon0=-2*Math.PI/180,N0=-100000,E0=400000;
  const e2=1-(b*b)/(a*a),n=(a-b)/(a+b),n2=n*n,n3=n*n*n; let lat=lat0,M=0;
  do { lat=(N-N0-M)/(a*F0)+lat; const Ma=(1+n+1.25*n2+1.25*n3)*(lat-lat0), Mb=(3*n+3*n2+2.625*n3)*Math.sin(lat-lat0)*Math.cos(lat+lat0), Mc=(1.875*n2+1.875*n3)*Math.sin(2*(lat-lat0))*Math.cos(2*(lat+lat0)), Md=(35/24)*n3*Math.sin(3*(lat-lat0))*Math.cos(3*(lat+lat0)); M=b*F0*(Ma-Mb+Mc-Md); } while (N-N0-M>=0.00001);
  const cosLat=Math.cos(lat),sinLat=Math.sin(lat),tanLat=Math.tan(lat);
  const nu=a*F0/Math.sqrt(1-e2*sinLat*sinLat),rho=a*F0*(1-e2)/Math.pow(1-e2*sinLat*sinLat,1.5),eta2=nu/rho-1;
  const tan2=tanLat*tanLat,tan4=tan2*tan2,tan6=tan4*tan2,sec=1/cosLat,nu3=nu*nu*nu,nu5=nu3*nu*nu,nu7=nu5*nu*nu;
  const VII=tanLat/(2*rho*nu),VIII=tanLat/(24*rho*nu3)*(5+3*tan2+eta2-9*tan2*eta2),IX=tanLat/(720*rho*nu5)*(61+90*tan2+45*tan4),X=sec/nu,XI=sec/(6*nu3)*(nu/rho+2*tan2),XII=sec/(120*nu5)*(5+28*tan2+24*tan4),XIIA=sec/(5040*nu7)*(61+662*tan2+1320*tan4+720*tan6);
  const dE=E-E0,dE2=dE*dE,dE3=dE2*dE,dE4=dE2*dE2,dE5=dE3*dE2,dE6=dE4*dE2,dE7=dE5*dE2;
  const phi=lat-VII*dE2+VIII*dE4-IX*dE6, lam=lon0+X*dE-XI*dE3+XII*dE5-XIIA*dE7;
  const A2=6378137,B2=6356752.3142,e2b=1-(B2*B2)/(A2*A2);
  const sP=Math.sin(phi),cP=Math.cos(phi); const nu1=a/Math.sqrt(1-e2*sP*sP); const x=nu1*cP*Math.cos(lam),y=nu1*cP*Math.sin(lam),z=(1-e2)*nu1*sP;
  const tx=446.448,ty=-125.157,tz=542.060,s=-20.4894e-6,rx=0.1502/3600*Math.PI/180,ry=0.2470/3600*Math.PI/180,rz=0.8421/3600*Math.PI/180;
  const x2=tx+(1+s)*x-rz*y+ry*z,y2=ty+rz*x+(1+s)*y-rx*z,z2=tz-ry*x+rx*y+(1+s)*z;
  const p=Math.sqrt(x2*x2+y2*y2); let phi2=Math.atan2(z2,p*(1-e2b)); for (let i=0;i<6;i++){ const nu2=A2/Math.sqrt(1-e2b*Math.sin(phi2)**2); phi2=Math.atan2(z2+e2b*nu2*Math.sin(phi2),p); }
  return [phi2*180/Math.PI, Math.atan2(y2,x2)*180/Math.PI];
}
const svgToLL = (x, y) => bngToLL(x, -y);
function gridRef(E, N, digits=4){ const e100=Math.floor(E/100000), n100=Math.floor(N/100000); let l1=(19-n100)-(19-n100)%5+Math.floor((e100+10)/5), l2=(19-n100)*5%25+e100%5; if (l1>7) l1++; if (l2>7) l2++; const d=digits/2; const e=Math.floor((E%100000)/Math.pow(10,5-d)), n=Math.floor((N%100000)/Math.pow(10,5-d)); return String.fromCharCode(l1+65)+String.fromCharCode(l2+65)+String(e).padStart(d,'0')+String(n).padStart(d,'0'); }
function nearestTown(x, y){ let best=null, bd=Infinity; for (const [n,p] of Object.entries(TOWNS)) { const d=Math.hypot(p[0]-x,p[1]-y); if (d<bd){bd=d;best=n;} } return {name:best, km:bd/1000}; }
// external links for a point or an area (svg coords)
function linksFor(x, y, name){
  const [lat, lon] = svgToLL(x, y); const q = encodeURIComponent(name || ''); const gr = gridRef(x, -y, 4);
  return {
    wiki: name ? `https://en.wikipedia.org/w/index.php?search=${q}` : null,
    images: name ? `https://www.google.com/search?tbm=isch&q=${q}` : null,
    geograph: `https://www.geograph.org.uk/gridref/${gr}`,
    gmaps: `https://www.google.com/maps/@${lat.toFixed(5)},${lon.toFixed(5)},14z`,
    osmaps: `https://explore.osmaps.com/?lat=${lat.toFixed(5)}&lon=${lon.toFixed(5)}&zoom=14`,
    lat, lon, gr
  };
}
function areaLinks(box, clientW){
  const [lat, lon] = svgToLL(box.x + box.w/2, box.y + box.h/2);
  const [sLat, wLon] = svgToLL(box.x, box.y + box.h), [nLat, eLon] = svgToLL(box.x + box.w, box.y);
  const z = Math.max(8, Math.min(17, Math.round(Math.log2(156543 * Math.cos(lat*Math.PI/180) / (box.w / Math.max(300, clientW))))));
  const town = nearestTown(box.x + box.w/2, box.y + box.h/2).name;
  const bb = `ne_lat=${nLat.toFixed(5)}&ne_lng=${eLon.toFixed(5)}&sw_lat=${sLat.toFixed(5)}&sw_lng=${wLon.toFixed(5)}`;
  return [
    ['OS Maps (Explorer / Landranger)', `https://explore.osmaps.com/?lat=${lat.toFixed(5)}&lon=${lon.toFixed(5)}&zoom=${z}`],
    ['Google Maps', `https://www.google.com/maps/@${lat.toFixed(5)},${lon.toFixed(5)},${z}z`],
    ['Google Maps · places to stay', `https://www.google.com/maps/search/places+to+stay/@${lat.toFixed(5)},${lon.toFixed(5)},${z}z`],
    ['Google Maps · pubs & cafés', `https://www.google.com/maps/search/pubs+and+cafes/@${lat.toFixed(5)},${lon.toFixed(5)},${z}z`],
    ['Airbnb in this area', `https://www.airbnb.co.uk/s/homes?search_by_map=true&${bb}`],
    ['Booking.com near ' + town, `https://www.booking.com/searchresults.en-gb.html?ss=${encodeURIComponent(town + ', Wales')}`],
    ['Geograph photos of this square', `https://www.geograph.org.uk/gridref/${gridRef(box.x + box.w/2, -(box.y + box.h/2), 4)}`],
  ];
}
// ---------- units ----------
const KM = 1.609344;
const isKm = () => state.unit === 'km';
const fd = mi => { const v = isKm() ? mi*KM : mi; return fmt(Math.round(v*10)/10); };   // distance for display
const ud = () => isKm() ? 'km' : 'mi';
const toMi = v => isKm() ? v/KM : v;
const dispNum = mi => (mi === '' || mi == null) ? '' : Math.round((isKm() ? mi*KM : mi)*10)/10;

function sectionProfile(sec){ const all = sec.stages.flatMap(st => st.prof); const k = Math.max(1, Math.round(all.length / 300)); return all.filter((_, i) => i % k === 0); }
// ---------- derived ----------
// coverage[sectionId][stageIndex] = list of {f0,f1,kind,tripId} intervals (idea counts as planned)
function coverage(){
  const cov = {};
  for (const s of SECTIONS) cov[s.id] = s.stages.map(() => []);
  for (const t of state.trips) {
    const kind = t.status === 'walked' ? 'walked' : 'planned';
    for (const d of (t.days || [])) {
      const seg = dseg(d); if (!seg || !cov[t.sectionId]) continue;
      for (let k = seg.i0; k <= seg.i1; k++) { const a = k===seg.i0?seg.f0:0, b = k===seg.i1?seg.f1:1; if (b > a && cov[t.sectionId][k]) cov[t.sectionId][k].push({ f0:a, f1:b, kind, tripId:t.id }); }
    }
  }
  return cov;
}
function covFrac(list, kind){ const iv = list.filter(x => !kind || x.kind === kind).map(x => [x.f0, x.f1]).sort((a,b)=>a[0]-b[0]); let tot=0, cur=null; for (const [a,b] of iv) { if (!cur || a > cur[1]) { if (cur) tot += cur[1]-cur[0]; cur=[a,b]; } else cur[1] = Math.max(cur[1], b); } if (cur) tot += cur[1]-cur[0]; return Math.min(1, tot); }
function covKind(list){ if (!list || !list.length) return null; if (covFrac(list, 'walked') >= 0.5) return 'walked'; return 'planned'; }
function covTrip(list){ return list && list.length ? list[0].tripId : null; }
function milesBy(status, sectionId){
  return state.trips.filter(t => t.status === status && (!sectionId || t.sectionId === sectionId))
    .reduce((a, t) => a + (t.days||[]).reduce((b, d) => b + (Number(d.miles)||0), 0), 0);
}
function sectionStatus(id){
  const cov = coverage()[id];
  if (cov.every(c => covFrac(c, 'walked') >= 0.95)) return 'walked';
  if (cov.some(c => covFrac(c, 'walked') > 0)) return 'partly';
  if (cov.some(c => c.length)) return 'planned';
  return 'todo';
}

function dayHours(d){ const mi=(Number(d.miles)||0)+(Number(d.extra)||0), up=Number(d.ascent)||0; if(!mi) return null; return mi/2.5 + up/600; }
function dayGrade(h){ if(h==null) return null; return h<4 ? 'Easy' : h<6.5 ? 'Moderate' : 'Strenuous'; }

// ---------- persistence ----------
const LS_KEY = 'coastpath.trips';
function loadLocal(){ try { const r=localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function saveLocal(){ try { localStorage.setItem(LS_KEY, JSON.stringify(state.trips)); } catch {} }

function setStatus(){
  const db_ = document.getElementById('dirBtn'); if (db_) db_.innerHTML = `${ICON.swap} <span class="dirlong">Walking </span>${south() ? 'Chepstow → Chester' : 'Chester → Chepstow'}`;
  const ub = document.getElementById('unitBtn'); if (ub) ub.textContent = isKm() ? 'km' : 'mi';
  const el = document.getElementById('status');
  el.textContent = state.saveState === 'shared' ? 'Shared · saved' : state.saveState === 'saving' ? 'Saving…' : state.saveState === 'error' ? 'Couldn’t save — check your access' : (firebaseReady() ? 'Saved on this device only' : 'Not shared yet — add your Firebase config');
}

async function persistSettings(){
  try { localStorage.setItem('coastpath.direction', state.direction); } catch {}
  if (!db) return;
  try { await db.doc('settings/main').set({ direction: state.direction }); } catch (e) { console.error(e); }
}
async function persistTrip(t, immediate){
  saveLocal();
  if (!db) { setStatus(); return; }
  clearTimeout(pending.get(t.id)); dirty.add(t.id);
  const run = async () => {
    pending.delete(t.id);
    state.saveState = 'saving'; setStatus();
    try { await db.doc('trips/'+t.id).set(JSON.parse(JSON.stringify(t))); state.saveState = 'shared'; }
    catch (e) { state.saveState = 'error'; console.error(e); }
    if (!pending.has(t.id)) setTimeout(() => { if (!pending.has(t.id)) dirty.delete(t.id); }, 1500);
    setStatus();
  };
  if (immediate) run(); else pending.set(t.id, setTimeout(run, 600));
}
async function removeTrip(id){
  state.trips = state.trips.filter(t => t.id !== id);
  if (state.tripId === id) state.tripId = state.trips[0]?.id || null;
  saveLocal();
  if (db) { try { await db.doc('trips/'+id).delete(); } catch(e){ console.error(e); } }
  renderAll();
}

// ---------- shared storage: Firebase Firestore under a secret plan key ----------
function planKeyFromHash(){ const m = location.hash.match(/plan=([A-Za-z0-9_-]{20,})/); return m ? m[1] : null; }
function newKey(){ const a = new Uint8Array(18); crypto.getRandomValues(a); return btoa(String.fromCharCode(...a)).replace(/[+/=]/g, c => ({'+':'-','/':'_','=':''}[c])); }
const firebaseReady = () => CONFIG.firebase && CONFIG.firebase.apiKey && !/PASTE/.test(CONFIG.firebase.apiKey);
function showShare(){
  const bar = document.getElementById('shareBar'); if (!bar) return;
  const url = location.href.split('#')[0] + '#plan=' + state.planKey;
  bar.innerHTML = `<span>Share <b>this exact link</b> with anyone who should see and edit the plan:</span><input readonly value="${esc(url)}" aria-label="Plan link"><button type="button" class="btn small" id="copyLink">Copy link</button><button type="button" class="btn small" id="hideShare" aria-label="Hide">×</button>`;
  bar.hidden = false;
  bar.querySelector('#copyLink').addEventListener('click', async () => { try { await navigator.clipboard.writeText(url); bar.querySelector('#copyLink').textContent = 'Copied'; } catch { bar.querySelector('input').select(); } });
  bar.querySelector('#hideShare').addEventListener('click', () => { bar.hidden = true; try { localStorage.setItem('coastpath.sharehidden', state.planKey); } catch {} });
  try { if (localStorage.getItem('coastpath.sharehidden') === state.planKey) bar.hidden = true; } catch {}
}
async function importSeed(){
  try { const r = await fetch('seed.json', { cache: 'no-store' }); const seed = await r.json(); if (!Array.isArray(seed) || !seed.length) return 0;
    for (const t of seed) { if (!state.trips.some(x => x.id === t.id)) { state.trips.push(JSON.parse(JSON.stringify(t))); persistTrip(state.trips[state.trips.length-1], true); } }
    state.tripId = state.tripId || (state.trips[0] && state.trips[0].id); renderAll(); return seed.length;
  } catch (e) { console.error(e); return 0; }
}
async function connect(){
  state.trips = loadLocal(); if (migrate(state.trips).length) saveLocal();
  if (!state.tripId) state.tripId = state.trips[0]?.id || null;
  let key = planKeyFromHash();
  if (!key) { try { key = localStorage.getItem('coastpath.plan'); } catch {} if (!key) key = newKey(); history.replaceState(null, '', '#plan=' + key); }
  try { localStorage.setItem('coastpath.plan', key); } catch {}
  state.planKey = key; showShare();
  window.addEventListener('hashchange', () => { const k = planKeyFromHash(); if (k && k !== state.planKey) location.reload(); });
  renderAll();
  if (!firebaseReady()) { state.saveState = 'local'; state.ready = true; setStatus(); return; }
  try {
    firebase.initializeApp(CONFIG.firebase);
    await firebase.auth().signInAnonymously();
    const base = firebase.firestore().collection('plans').doc(key);
    db = { doc: p => { const [c, id] = p.split('/'); return base.collection(c).doc(id); }, collection: c => base.collection(c) };
  } catch (e) { console.error(e); state.saveState = 'error'; state.ready = true; setStatus(); return; }
  db.doc('settings/main').onSnapshot(snap => { const v = snap.exists ? snap.data() : null; if (v && (v.direction === 'south' || v.direction === 'north') && v.direction !== state.direction) { state.direction = v.direction; try { localStorage.setItem('coastpath.direction', v.direction); } catch {} renderAll(); } }, e => console.error(e));
  unsub = db.collection('trips').onSnapshot(snap => {
    const remote = snap.docs.filter(x => x.exists).map(x => ({ ...JSON.parse(JSON.stringify(x.data())), id: x.id }));
    if (!state.ready && remote.length === 0 && state.trips.length) { state.ready = true; state.saveState='shared'; state.trips.forEach(t => persistTrip(t, true)); return; }
    const byId = new Map(state.trips.map(t => [t.id, t]));
    for (const r of remote) { const loc = byId.get(r.id); if (dirty.has(r.id)) continue; if (loc) { for (const k of Object.keys(loc)) if (!(k in r)) delete loc[k]; Object.assign(loc, r); } else state.trips.push(r); }
    state.trips = state.trips.filter(t => dirty.has(t.id) || remote.some(r => r.id === t.id)).sort((a,b) => (a.created||0)-(b.created||0));
    migrate(state.trips).forEach(t => persistTrip(t, true));
    const firstEmpty = !state.ready && remote.length === 0;
    state.ready = true; state.saveState = 'shared';
    saveLocal();
    if (!state.tripId || !state.trips.some(t => t.id === state.tripId)) state.tripId = state.trips[0]?.id || null;
    if (!document.activeElement || !document.activeElement.closest('#tripMain, #tripSide')) renderAll(); else setStatus();
    if (firstEmpty) document.getElementById('seedBar').hidden = false;
  }, err => { console.error(err); state.saveState = 'error'; setStatus(); });
}

function migrate(trips){
  let changed = [];
  for (const t of trips) {
    const sec = SEC[t.sectionId]; if (!sec) continue;
    for (const d of (t.days||[])) {
      if (d.stage == null) continue;
      let st = sec.stages[d.stage];
      const ok = st && ((!d.rev && st.frm === d.from && st.to === d.to) || (d.rev && st.to === d.from && st.frm === d.to));
      if (!ok) {
        let j = sec.stages.findIndex(x => x.frm === d.from && x.to === d.to), rev = false;
        if (j < 0) { j = sec.stages.findIndex(x => x.to === d.from && x.frm === d.to); rev = j >= 0; }
        d.stage = j >= 0 ? j : null; d.rev = j >= 0 ? rev : !!d.rev; st = j >= 0 ? sec.stages[j] : null; if (!changed.includes(t)) changed.push(t);
      }
      if (st && (d.ascent === '' || d.ascent == null)) { d.ascent = d.rev ? st.down : st.up; d.descent = d.rev ? st.up : st.down; if (!changed.includes(t)) changed.push(t); }
      if (d.lunch == null) d.lunch = ''; if (d.extra == null) d.extra = '';
      if (!d.seg && d.stage != null) { d.seg = { i0: d.stage, f0: 0, i1: d.stage, f1: 1 }; if (!changed.includes(t)) changed.push(t); }
    }
  }
  return changed;
}
function flipDay(d){ if (d.rest) return; const f = d.from; d.from = d.to; d.to = f; const a = d.ascent; d.ascent = d.descent ?? ''; d.descent = a; d.rev = !d.rev; }
function reverseTrip(t){ t.days = (t.days||[]).slice().reverse(); t.days.forEach(flipDay); }
// ---------- trips ----------
function tripById(id){ return state.trips.find(t => t.id === id); }
function makeDay(sec, stageIdx, rev = south()){
  if (stageIdx == null) return { id: uid(), stage: null, from: '', to: '', miles: '', ascent: '', bed: '', travel: '', lunch: '', extra: '', rev: false };
  const st = sec.stages[stageIdx];
  const d = { id: uid(), stage: stageIdx, seg: { i0: stageIdx, f0: 0, i1: stageIdx, f1: 1 }, from: st.frm, to: st.to, miles: st.mi, ascent: st.up, descent: st.down, bed: '', travel: '', lunch: '', extra: '', rev: false };
  if (rev) flipDay(d);
  return d;
}
function createTrip({name, sectionId, status, when, from, to, reverse}){
  const sec = SEC[sectionId];
  const goSouth = south() !== !!reverse; // reverse means "against the current default"
  let days = [];
  if (from != null && to != null) {
    const lo = Math.min(from, to), hi = Math.max(from, to);
    const idx = []; for (let i = lo; i <= hi; i++) idx.push(i); if (goSouth) idx.reverse();
    days = idx.map(i => makeDay(sec, i, goSouth));
  }
  const t = { id: uid(), name: name || sec.short, sectionId, status, when: when || '', days, notes: [], created: Date.now() };
  state.trips.push(t);
  state.tripId = t.id;
  persistTrip(t, true);
  return t;
}

// ---------- the main map: route, coverage, stops, labels ----------
let bigLayers = null;
function renderBigMap(){
  const map = bigMap.map;
  if (!bigLayers) {
    bigLayers = { halo: L.layerGroup().addTo(map), base: L.layerGroup().addTo(map), cov: L.layerGroup().addTo(map), hit: L.layerGroup().addTo(map), towns: L.layerGroup(), pois: L.layerGroup(), labels: L.layerGroup().addTo(map), scale: null };
    // towns (dots + names), stops — built once
    for (const [n, p] of Object.entries(TOWNS)) L.circleMarker(toLL(p[0], p[1]), { radius: 3, color: 'var(--ink)', weight: 1.5, fillColor: '#fff', fillOpacity: 1, interactive: false }).bindTooltip(n, { permanent: true, direction: 'right', className: 'townlbl', offset: [4, 0] }).addTo(bigLayers.towns);
    POIS.forEach((p, k) => {
      const mk = L.circleMarker(toLL(p.x, p.y), { radius: 6, color: `var(--poi-${p.t})`, weight: 1.8, fillColor: '#fff', fillOpacity: 1 });
      mk.bindTooltip(p.n, { direction: 'top', className: 'poilbl', offset: [0, -6] });
      mk.bindPopup(() => poiPopupHtml(p), { maxWidth: 320, className: 'poipop' });
      mk.on('click', () => { state.sel = p.sec; state.stageSel = { sec: p.sec, i: p.st, fromMap: true }; renderBigMap(); renderPanel(); });
      mk.on('popupopen', e => loadWikiThumb(p, e.popup.getElement()));
      mk.addTo(bigLayers.pois);
    });
    const zoomLayers = () => { const z = map.getZoom(); const on = (g, show) => { if (show && !map.hasLayer(g)) g.addTo(map); if (!show && map.hasLayer(g)) map.removeLayer(g); }; on(bigLayers.towns, z >= 4); on(bigLayers.pois, z >= 5); document.getElementById('bigMap').classList.toggle('lbl-on', z >= 7); };
    map.on('zoomend', zoomLayers); zoomLayers();
    map.on('moveend', () => { try { localStorage.setItem('coastpath.view.box', JSON.stringify(bigMap.box)); } catch {} });
  }
  ['halo','base','cov','hit','labels'].forEach(k => bigLayers[k].clearLayers());
  const cov = coverage(); const selSec = SEC[state.sel];
  if (selSec) for (const st of selSec.stages) L.polyline(st.ll || (st.ll = llPts(st.pts)), { color: '#fff', weight: 13, opacity: 0.9, interactive: false, lineCap: 'round' }).addTo(bigLayers.halo);
  for (const s of SECTIONS) {
    const isSel = s.id === state.sel;
    s.stages.forEach((st, i) => {
      const ll = st.ll || (st.ll = llPts(st.pts));
      const bump = state.stageSel && state.stageSel.sec === s.id && state.stageSel.i === i ? 3 : 0;
      const w = (isSel ? 6.5 : 4) + bump;
      L.polyline(ll, { color: 'var(--todo)', weight: w, dashArray: '7 7', interactive: false, lineCap: 'round' }).addTo(bigLayers.base);
      for (const c of cov[s.id][i]) L.polyline(llPts(slicePts(st.pts, c.f0, c.f1)), { color: c.kind === 'walked' ? 'var(--ink)' : 'var(--accent)', weight: w, interactive: false, lineCap: 'round' }).addTo(bigLayers.cov);
      const hit = L.polyline(ll, { color: 'transparent', weight: 18, opacity: 0 });
      hit.bindTooltip(`${s.name} · ${viewStage(s, i).frm} → ${viewStage(s, i).to} · ${fd(st.mi)} ${ud()}`, { sticky: true, className: 'stagetip' });
      hit.on('click', () => { state.sel = s.id; state.stageSel = { sec: s.id, i, fromMap: true }; renderBigMap(); renderPanel(); });
      hit.addTo(bigLayers.hit);
    });
    const lab = L.marker(toLL(s.lx, s.ly), { icon: L.divIcon({ className: 'seclabel' + (isSel ? ' sel' : ''), html: esc(s.short), iconSize: null }), keyboard: false });
    lab.on('click', () => { state.sel = s.id; state.stageSel = null; renderBigMap(); renderPanel(); });
    lab.addTo(bigLayers.labels);
  }
  if (bigLayers.scale) bigLayers.scale.remove();
  bigLayers.scale = L.control.scale({ position: 'bottomright', metric: isKm(), imperial: !isKm(), maxWidth: 140 }).addTo(map);
  const walked = milesBy('walked'), planned = milesBy('planned') + milesBy('idea');
  document.getElementById('barWalked').style.width = Math.min(100, walked/TOTAL*100) + '%';
  document.getElementById('barPlanned').style.width = Math.min(100 - walked/TOTAL*100, planned/TOTAL*100) + '%';
  document.getElementById('overallLine').textContent = `${fd(TOTAL)} ${isKm()?'km':'miles'} · ${fd(walked)} walked · ${fd(planned)} planned`;
}
function poiPopupHtml(p){
  const L_ = linksFor(p.x, p.y, p.n);
  return `<div class="pp"><div class="hc-head"><span class="pi ${p.t}">${POI_ICON[p.t]}</span><div><b>${esc(p.n)}</b><div class="small muted">${esc(POI_LABEL[p.t])}${p.off >= 0.5 ? ` · ${p.off} km off the path` : ''} · ${L_.gr}</div></div></div><div class="wikithumb" data-q="${esc(p.n)}"></div><p>${esc(p.note)}</p><div class="hc-links"><a href="${L_.wiki}" target="_blank" rel="noopener">Wikipedia</a><a href="${L_.images}" target="_blank" rel="noopener">Images</a><a href="${L_.geograph}" target="_blank" rel="noopener">Geograph</a><a href="${L_.gmaps}" target="_blank" rel="noopener">Google Maps</a><a href="${L_.osmaps}" target="_blank" rel="noopener">OS Maps</a></div></div>`;
}
// Wikipedia summary + thumbnail for a stop (cached)
const wikiCache = new Map();
async function wikiInfo(q){
  if (wikiCache.has(q)) return wikiCache.get(q);
  const pr = (async () => {
    try {
      const u = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + ' Wales')}&gsrlimit=1&prop=pageimages|extracts|info&inprop=url&exintro=1&explaintext=1&exsentences=2&piprop=thumbnail&pithumbsize=360&format=json&origin=*`;
      const r = await fetch(u); const j = await r.json(); const pages = j.query && j.query.pages ? Object.values(j.query.pages) : [];
      if (!pages.length) return null; const pg = pages[0];
      return { title: pg.title, url: pg.fullurl, extract: pg.extract, thumb: pg.thumbnail ? pg.thumbnail.source : null };
    } catch { return null; }
  })();
  wikiCache.set(q, pr); return pr;
}
async function loadWikiThumb(p, container){
  const box = container && container.querySelector('.wikithumb'); if (!box) return;
  box.innerHTML = '<div class="small muted">Looking for a photo…</div>';
  const w = await wikiInfo(p.n);
  if (!w) { box.innerHTML = ''; return; }
  box.innerHTML = `${w.thumb ? `<a href="${w.url}" target="_blank" rel="noopener"><img src="${w.thumb}" alt="${esc(w.title)}" loading="lazy"></a>` : ''}${w.extract ? `<div class="small muted wikiext">${esc(w.extract)} <a href="${w.url}" target="_blank" rel="noopener">Wikipedia ↗</a></div>` : ''}`;
}
// Photos near a day's route from Wikimedia Commons (openly licensed)
const photoCache = new Map();
async function commonsNear(lat, lon, radius = 1500, limit = 8){
  const u = `https://commons.wikimedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${lat.toFixed(5)}|${lon.toFixed(5)}&ggsradius=${radius}&ggsnamespace=6&ggslimit=${limit}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=360&iiextmetadatafilter=Artist|LicenseShortName|ImageDescription&format=json&origin=*`;
  try { const r = await fetch(u); const j = await r.json(); const pages = j.query && j.query.pages ? Object.values(j.query.pages) : [];
    return pages.filter(pg => pg.imageinfo && pg.imageinfo[0] && /\.(jpe?g|png)$/i.test(pg.title)).map(pg => { const ii = pg.imageinfo[0], md = ii.extmetadata || {}; return { title: pg.title.replace(/^File:/, ''), thumb: ii.thumburl, page: ii.descriptionurl, artist: (md.Artist && md.Artist.value || '').replace(/<[^>]+>/g, ''), licence: md.LicenseShortName && md.LicenseShortName.value || '' }; });
  } catch { return []; }
}
async function loadDayPhotos(sec, d, box){
  const seg = dseg(d); if (!seg) return;
  box.innerHTML = '<div class="small muted">Searching Wikimedia Commons along this stretch…</div>';
  const key = JSON.stringify(seg);
  let list = photoCache.get(key);
  if (!list) {
    const pts = segPtsList(sec, seg).flat(); const L0 = cumLen(pts);
    const fracs = [0.08, 0.3, 0.5, 0.7, 0.92]; const seen = new Set(); list = [];
    for (const f of fracs) { const q = ptAt(pts, f); const [lat, lon] = svgToLL(q[0], q[1]); const got = await commonsNear(lat, lon, 1500, 6); for (const g of got) if (!seen.has(g.title)) { seen.add(g.title); list.push(g); } }
    photoCache.set(key, list);
  }
  if (!list.length) { box.innerHTML = '<div class="small muted">Nothing geotagged within 1.5 km of this stretch on Commons. Try the Geograph link above.</div>'; return; }
  box.innerHTML = `<div class="photoGrid">${list.slice(0, 12).map(g => `<a href="${g.page}" target="_blank" rel="noopener" title="${esc(g.title)}${g.artist ? ' · ' + esc(g.artist) : ''}${g.licence ? ' · ' + esc(g.licence) : ''}"><img src="${g.thumb}" alt="${esc(g.title)}" loading="lazy"><span>${esc(g.artist || '')}${g.licence ? ' · ' + esc(g.licence) : ''}</span></a>`).join('')}</div><div class="small muted">Photos from Wikimedia Commons, geotagged along this stretch; each is credited to its photographer and licensed as shown.</div>`;
}

function renderPanel(){
  const s = SEC[state.sel]; const el = document.getElementById('panel'); const keepScroll = el.scrollTop;
  const cov = coverage()[s.id];
  const st = sectionStatus(s.id);
  const label = { walked:'Walked', partly:'Partly walked', planned:'Planned', todo:'Not yet planned' }[st];
  const pillCls = st === 'walked' ? 'walked' : st === 'todo' ? 'todo' : 'planned';
  const walked = milesBy('walked', s.id), planned = milesBy('planned', s.id) + milesBy('idea', s.id);
  const trips = state.trips.filter(t => t.sectionId === s.id);
  const ascent = s.stages.reduce((a, x) => a + x.up, 0), hiPt = Math.max(...s.stages.map(x => x.hi));
  const unplanned = cov.filter(c => covFrac(c) < 0.999).length;
  const hi = state.stageSel && state.stageSel.sec === s.id ? state.stageSel.i : -1;
  el.innerHTML = `
    <div class="sectionHead">
      <div class="eyebrow">Section ${sectionNo(s)} of 8</div>
      <h2>${esc(s.name)}</h2>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="pill ${pillCls}">${label}</span><span class="small muted">${esc(secEnds(s)[0])} → ${esc(secEnds(s)[1])}</span></div>
    </div>
    <div class="stats3">
      <div class="stat"><b>${fd(s.miles)}</b><span>${isKm()?'km':'miles'}</span></div>
      <div class="stat warm"><b>${fmt(ascent)}</b><span>m ascent</span></div>
      <div class="stat"><b>${Math.round(s.miles/13)}</b><span>days at ${isKm()?'21 km':'13 mi'}</span></div>
    </div>
    <div>
      <div class="small muted" style="margin-bottom:4px">Elevation · high point ${fmt(hiPt)} m</div>
      ${profileSvg(south() ? sectionProfile(s).reverse() : sectionProfile(s), Math.max(100, hiPt), 340, 56, 'prof wide')}
    </div>
    <div>
      <div class="bar" aria-hidden="true"><i style="background:var(--ink);width:${Math.min(100,walked/s.miles*100)}%"></i><i style="background:var(--accent);width:${Math.min(100-walked/s.miles*100,planned/s.miles*100)}%"></i></div>
      <div class="small muted" style="margin-top:6px">${fd(walked)} ${ud()} walked · ${fd(planned)} ${ud()} planned · ${fd(Math.max(0,s.miles-walked-planned))} ${ud()} to go</div>
    </div>
    <div style="display:flex;gap:8px"><button type="button" class="btn small" id="zoomSection">Zoom to section</button><button type="button" class="btn small" id="zoomAll">Whole path</button></div>
    ${trips.length ? `<div style="display:flex;flex-direction:column;gap:8px">
      <div class="small muted">Trips in this section</div>
      ${trips.map(t => `<button type="button" class="tripLink" data-open="${t.id}"><span><span style="font-weight:600">${esc(t.name)}</span><br><span class="small muted">${(t.days||[]).length} days · ${fd(tripTotals(t).mi)} ${ud()}${t.when?' · '+esc(t.when):''}</span></span><span class="pill ${t.status}">${t.status[0].toUpperCase()+t.status.slice(1)}</span></button>`).join('')}
    </div>` : ''}
    <div style="display:flex;flex-direction:column;gap:8px">
      <div class="small muted">Stages · click one to zoom in</div>
      <div class="rows">${stageOrder(s).map((i, k) => { const c=covKind(cov[i]), x=viewStage(s, i); return `<button type="button" class="row stageRow" data-i="${i}" aria-current="${i===hi}"><div class="n ${c||''}">${k+1}</div><div class="name">${esc(x.frm)} → ${esc(x.to)}</div><div class="meta">${fd(x.mi)} ${ud()} · <span style="color:var(--warm)">${fmt(x.up)} m</span></div></button>`; }).join('')}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <div class="small muted">Suggested stops${hi >= 0 ? ' on this stage' : ''} · viewpoints, sights, lunch</div>
      <div class="poiList">${(hi >= 0 ? [hi] : stageOrder(s)).flatMap(i => { const list = POIS.filter(p => p.sec === s.id && p.st === i); return (south() ? list.slice().reverse() : list).map(p => `<button type="button" class="poi" data-poi="${POIS.indexOf(p)}" title="${esc(POI_LABEL[p.t])}"><span class="pi ${p.t}">${POI_ICON[p.t]}</span><span class="pn"><b>${esc(p.n)}</b><span class="small muted">${esc(p.note)}${p.off >= 0.5 ? ` · ${p.off} km off the path` : ''}</span></span></button>`); }).join('') || '<div class="small muted">Nothing listed yet for this stage.</div>'}</div>
    </div>
    <div style="display:flex;gap:10px;margin-top:auto;padding-top:6px">
      <button type="button" class="btn primary" id="planSection" style="flex-grow:1" ${unplanned?'':'disabled'}>${unplanned ? 'Plan a trip here' : 'Every stage is in a trip'}</button>
      <button type="button" class="btn" id="newTripHere">New trip</button>
    </div>`;
  el.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => { state.tripId = b.dataset.open; setView('trips'); }));
  el.querySelector('#planSection')?.addEventListener('click', () => { openTripDialog(s.id, state.stageSel && state.stageSel.sec === s.id ? state.stageSel.i : null); });
  el.querySelector('#newTripHere')?.addEventListener('click', () => { openTripDialog(s.id, null); });
  el.querySelector('#zoomSection').addEventListener('click', () => bigMap.fit(bboxOf(secPts(s))));
  el.querySelectorAll('.poi').forEach(b => attachHover(b, POIS[Number(b.dataset.poi)]));
  el.querySelectorAll('.poi').forEach(b => b.addEventListener('click', () => { const p = POIS[Number(b.dataset.poi)]; state.stageSel = { sec: p.sec, i: p.st }; renderBigMap(); renderPanel(); bigMap.fit({ x: p.x - 2500, y: p.y - 2500, w: 5000, h: 5000 }, 0.1); }));
  el.querySelector('#zoomAll').addEventListener('click', () => bigMap.set({...FULL}));
  el.querySelectorAll('.stageRow').forEach(b => b.addEventListener('click', () => { const i = Number(b.dataset.i); state.stageSel = { sec: s.id, i }; renderBigMap(); renderPanel(); bigMap.fit(bboxOf([s.stages[i].pts]), 0.25); }));
  el.scrollTop = keepScroll;
  if (hi >= 0 && state.stageSel && state.stageSel.fromMap) { el.querySelector(`.stageRow[data-i="${hi}"]`)?.scrollIntoView?.({ block: 'nearest' }); state.stageSel.fromMap = false; }
}

// ---------- rendering: trips ----------
function renderTripCards(){
  const el = document.getElementById('tripCards');
  const list = state.trips.filter(t => state.filter === 'all' || t.status === state.filter);
  if (!list.length) { el.innerHTML = `<div class="empty">${state.trips.length ? 'Nothing with this status yet.' : 'No trips yet. Pick a section on the map, or start one here.'}</div>`; return; }
  el.innerHTML = list.map(t => { const mi=tripTotals(t).mi; return `
    <button type="button" class="tripCard" data-id="${t.id}" aria-current="${t.id===state.tripId}">
      <div class="t"><span>${esc(t.name)}</span><span class="pill ${t.status}">${t.status[0].toUpperCase()+t.status.slice(1)}</span></div>
      <div class="small muted">${esc(SEC[t.sectionId]?.name || '')}</div>
      <div class="small muted">${(t.days||[]).length} days · ${fd(mi)} ${ud()}${t.when ? ' · '+esc(t.when) : ''}</div>
    </button>`; }).join('');
  el.querySelectorAll('.tripCard').forEach(b => b.addEventListener('click', () => { state.tripId = b.dataset.id; renderTrips(); }));
}

function renderTripMain(){
  const el = document.getElementById('tripMain'); const keepScroll = el.scrollTop;
  const t = tripById(state.tripId);
  if (!t) { el.innerHTML = `<div class="empty" style="margin:auto;max-width:420px">Choose a trip on the left, or create one.<br><br><button type="button" class="btn primary" id="emptyNew">+ New trip</button></div>`; el.querySelector('#emptyNew')?.addEventListener('click', () => openTripDialog(state.sel, null)); return; }
  const sec = SEC[t.sectionId];
  const days = t.days || [];
  const tot = tripTotals(t);
  const maxHi = Math.max(100, ...days.map(d => dseg(d) ? segStats(sec, dseg(d)).hi : 0));
  const cov = coverage()[t.sectionId];
  const free = sec.stages.map((s,i) => ({s,i})).filter(({i}) => covFrac(cov[i]) < 0.999 || !cov[i].some(c => c.tripId === t.id));
  const revMenu = days.length ? !!days[days.length-1].rev : south();
  const confirming = state.confirmDelete === t.id;
  el.innerHTML = `
    <div class="tripHead">
      <div style="display:flex;flex-direction:column;gap:6px;min-width:0;flex:1 1 320px">
        <div class="small muted">${esc(sec.name)}</div>
        <input class="title" data-f="name" value="${esc(t.name)}" aria-label="Trip name" maxlength="60">
        <div class="tripMeta">
          <span><b style="color:var(--ink)" data-tot="mi">${fd(tot.mi)}</b> ${ud()}${tot.extra ? ` <span class="small">(incl. <span data-tot="extra">${fd(tot.extra)}</span> off-route)</span>` : ''}</span>
          <span><b style="color:var(--warm)" data-tot="up">${tot.up ? fmt(tot.up) : '—'}</b> m ascent</span>
          <span><b style="color:var(--ink)">${days.length}</b> days</span>
          <select data-f="status" aria-label="Status"><option value="idea" ${t.status==='idea'?'selected':''}>Idea</option><option value="planned" ${t.status==='planned'?'selected':''}>Planned</option><option value="walked" ${t.status==='walked'?'selected':''}>Walked</option></select>
          <input data-f="when" value="${esc(t.when||'')}" placeholder="When" aria-label="When" maxlength="30" style="width:120px">
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <button type="button" class="btn" id="reverseTrip" title="Walk the whole trip in the opposite direction" ${days.length ? '' : 'disabled'}>⇄ Reverse direction</button>
        <div class="menu" id="addMenu">
          <button type="button" class="btn primary" id="addDayBtn" aria-haspopup="true" aria-expanded="false">+ Add day</button>
          <div class="pop">
            ${free.length ? `<div class="hd">Stages</div>${(revMenu ? free.slice().reverse() : free).map(({s,i}) => `<button type="button" data-stage="${i}"><span>${revMenu ? esc(s.to)+' → '+esc(s.frm) : esc(s.frm)+' → '+esc(s.to)}</span><span class="muted">${fd(s.mi)} ${ud()} · ${fmt(revMenu ? s.down : s.up)} m${cov[i].some(c => c.tripId !== t.id) ? ' · in another trip' : ''}</span></button>`).join('')}` : `<div class="hd">Every stage is already in this trip</div>`}
            <div class="hd">Or</div><button type="button" data-stage="custom"><span>Custom day</span><span class="muted">type your own start and end</span></button>
            <button type="button" data-stage="rest"><span>Rest day</span><span class="muted">no walking</span></button>
          </div>
        </div>
        ${confirming
          ? `<span class="small" style="display:inline-flex;align-items:center;gap:6px">Delete this trip? <button type="button" class="btn small danger" id="deleteYes">Delete</button><button type="button" class="btn small" id="deleteNo">Keep</button></span>`
          : `<button type="button" class="btn icon danger" id="deleteTrip" aria-label="Delete trip" title="Delete trip">${ICON.x}</button>`}
      </div>
    </div>
    <div class="small muted">Tip: use the pin buttons on a day to set your own start or finish anywhere on the route — a B&amp;B between two stage ends, say — and the distances and profile follow.</div>
    <div style="display:flex;flex-direction:column;gap:10px" id="dayList">
      ${days.length ? days.map((d, i) => dayCard(d, i, days, sec, maxHi)).join('') : `<div class="empty">No days yet. Add a stage from the list, or a custom day.</div>`}
    </div>`;
  el.scrollTop = keepScroll;

  el.querySelectorAll('[data-f]').forEach(inp => inp.addEventListener(inp.tagName==='SELECT'?'change':'input', () => {
    t[inp.dataset.f] = inp.value; persistTrip(t);
    if (inp.dataset.f !== 'name') renderTripCards(); else document.querySelector(`.tripCard[data-id="${t.id}"] .t span`)?.replaceChildren(document.createTextNode(t.name));
    if (inp.tagName==='SELECT') { renderTripSide(); renderBigMap(); }
  }));
  const menu = el.querySelector('#addMenu'), addBtn = el.querySelector('#addDayBtn');
  addBtn.addEventListener('click', e => { e.stopPropagation(); const open = menu.classList.toggle('open'); addBtn.setAttribute('aria-expanded', open); });
  menu.querySelectorAll('[data-stage]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.stage; const cur = t.days || []; const revNow = cur.length ? !!cur[cur.length-1].rev : south();
    const nd = v === 'rest' ? { ...makeDay(sec, null, false), rest: true, from: 'Rest day', to: '' } : makeDay(sec, v === 'custom' ? null : Number(v), revNow);
    t.days = [...cur, nd]; persistTrip(t); renderAll();
    if (v === 'custom') setTimeout(() => el.querySelector('.day:last-child [data-d="from"]')?.focus(), 0);
  }));
  el.querySelector('#reverseTrip').addEventListener('click', () => { reverseTrip(t); persistTrip(t); renderAll(); });
  el.querySelector('#deleteTrip')?.addEventListener('click', () => { state.confirmDelete = t.id; renderTripMain(); });
  el.querySelector('#deleteNo')?.addEventListener('click', () => { state.confirmDelete = null; renderTripMain(); });
  el.querySelector('#deleteYes')?.addEventListener('click', () => { state.confirmDelete = null; removeTrip(t.id); });
  el.querySelectorAll('.day').forEach(card => {
    const getDay = () => (t.days || []).find(x => x.id === card.dataset.day);
    card.querySelectorAll('[data-d]').forEach(inp => inp.addEventListener('input', () => {
      const d = getDay(); if (!d) return;
      const k = inp.dataset.d;
      d[k] = inp.type === 'number' ? (inp.value === '' ? '' : (k === 'miles' || k === 'extra' ? Math.round(toMi(Number(inp.value))*100)/100 : Number(inp.value))) : inp.value;
      persistTrip(t);
      if (['miles','ascent','extra'].includes(k)) refreshDerived(card, d, t);
    }));
    card.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
      const ds = t.days || [], d = getDay(); if (!d) return; const i = ds.indexOf(d);
      if (b.dataset.act === 'del') ds.splice(i, 1);
      if (b.dataset.act === 'rev') flipDay(d);
      if (b.dataset.act === 'up' && i > 0) [ds[i-1], ds[i]] = [ds[i], ds[i-1]];
      if (b.dataset.act === 'down' && i < ds.length-1) [ds[i+1], ds[i]] = [ds[i], ds[i+1]];
      if (b.dataset.act === 'merge' && i < ds.length-1) { const n = ds[i+1], e1 = dayEnds(d), e2 = dayEnds(n); if (e1 && e2) { setDayEnds(sec, d, e1.start, e2.end, { from: d.from, to: n.to }); d.bed = n.bed || d.bed; d.travel = n.travel || d.travel; ds.splice(i+1, 1); } }
      t.days = ds; persistTrip(t); renderAll();
    }));
    card.querySelectorAll('[data-lunch]').forEach(b => b.addEventListener('click', () => { const d = getDay(); if (!d) return; d.lunch = b.dataset.lunch; persistTrip(t); renderAll(); }));
    card.querySelectorAll('[data-zoom]').forEach(b => b.addEventListener('click', () => { const d = getDay(); const seg = d && dseg(d); if (!seg) return; state.sel = t.sectionId; state.stageSel = { sec: t.sectionId, i: seg.i0 }; setView('map'); bigMap.fit(bboxOf(segPtsList(sec, seg)), 0.25); }));
    card.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => { const d = getDay(); if (!d) return; openPicker(t, d, b.dataset.pick); }));
    card.querySelector('[data-copyprompt]')?.addEventListener('click', async e => { const d = getDay(); if (!d) return; const txt = guidePrompt(t, d); try { await navigator.clipboard.writeText(txt); e.target.textContent = 'Copied — now paste it into Claude'; } catch { window.prompt('Copy this prompt:', txt); } });
    card.querySelector('[data-guide-save]')?.addEventListener('click', () => { const d = getDay(); const ta = card.querySelector('.guideIn'); if (!d || !ta || !ta.value.trim()) return; d.guide = ta.value.trim(); persistTrip(t); renderTripMain(); });
    card.querySelector('[data-guide-edit]')?.addEventListener('click', () => { const d = getDay(); if (!d) return; const v = d.guide; delete d.guide; renderTripMain(); const ta = document.querySelector(`.day[data-day="${d.id}"] .guideIn`); if (ta) { ta.value = v; ta.closest('details').open = true; } });
    card.querySelector('[data-guide-clear]')?.addEventListener('click', () => { const d = getDay(); if (!d) return; delete d.guide; persistTrip(t); renderTripMain(); });
    card.querySelector('[data-photos]')?.addEventListener('click', e => { const d = getDay(); if (!d) return; e.target.hidden = true; loadDayPhotos(sec, d, card.querySelector('.photoBox')); });
    card.querySelectorAll('[data-hover]').forEach(elm => attachHover(elm, POIS[Number(elm.dataset.hover)]));
  });
}
function tripTotals(t){
  const days = t.days || [];
  const mi = days.reduce((a,d)=>a+(Number(d.miles)||0)+(Number(d.extra)||0),0), extra = days.reduce((a,d)=>a+(Number(d.extra)||0),0), up = days.reduce((a,d)=>a+(Number(d.ascent)||0),0);
  return { mi: Math.round(mi*10)/10, extra: Math.round(extra*10)/10, up };
}
function derivedLine(d){
  const h = dayHours(d), g = dayGrade(h); if (d.rest) return 'Legs up.';
  return `${h ? `~${h.toFixed(h<10?1:0)} h walking` : 'Add a distance for a time estimate'}${Number(d.extra) ? ` incl. ${fd(d.extra)} ${ud()} off-route` : ''}${g ? ` · <span class="pill ${g==='Strenuous'?'planned':'todo'}" style="${g==='Strenuous'?'background:var(--warm-soft);color:var(--ink)':''}">${g}</span>` : ''}`;
}
function poisFor(sec, d){
  const seg = dseg(d); if (!seg) return [];
  const list = POIS.filter(p => { if (p.sec !== sec.id || p.st < seg.i0 || p.st > seg.i1) return false; const st = sec.stages[p.st]; const f = projectOn(st.pts, p.x, p.y).f; const a = p.st===seg.i0?seg.f0:0, b = p.st===seg.i1?seg.f1:1; return f >= a-0.02 && f <= b+0.02; });
  return d.rev ? list.slice().reverse() : list;
}
function dayCard(d, i, days, sec, maxHi){
  const seg = dseg(d); const st = seg ? segStats(sec, seg) : null;
  const pois = poisFor(sec, d);
  const ends = dayEnds(d);
  const mid = seg ? segPoint(sec, seg.i0 === seg.i1 ? seg.i0 : seg.i0, seg.i0 === seg.i1 ? (seg.f0+seg.f1)/2 : 0.9) : null;
  const L = mid ? linksFor(mid[0], mid[1], `Wales Coast Path ${d.from} ${d.to}`) : null;
  const canMerge = i < days.length-1 && ends && dayEnds(days[i+1]) && ptEq(ends.end, dayEnds(days[i+1]).start);
  const stageLabel = seg ? (seg.i0 === seg.i1 ? `stage ${d.rev ? sec.stages.length - seg.i0 : seg.i0 + 1}${isFullStage(d) ? '' : ' (part)'}` : `stages ${d.rev ? sec.stages.length - seg.i1 : seg.i0 + 1}–${d.rev ? sec.stages.length - seg.i0 : seg.i1 + 1}`) : 'custom';
  const pin = which => `<button type="button" class="pin" data-pick="${which}" title="Choose this point on the map" aria-label="Choose ${which} on the map">${ICON.pin}</button>`;
  return `
      <div class="card day${d.rest ? ' rest' : ''}" data-day="${d.id}">
        <div class="num"><span class="small muted">Day</span><b>${i+1}</b></div>
        <div class="info">
          ${d.rest ? `<div class="route"><input class="inline" data-d="from" value="${esc(d.from)}" placeholder="Rest day" aria-label="Label"></div>`
          : `<div class="route">${pin('start')}<input class="inline" data-d="from" value="${esc(d.from)}" placeholder="Start" aria-label="Start"><span class="muted">→</span><input class="inline" data-d="to" value="${esc(d.to)}" placeholder="Finish" aria-label="Finish">${pin('finish')}</div>
          <div class="nums"><input class="inline num" type="number" step="0.5" min="0" data-d="miles" value="${dispNum(d.miles)}" placeholder="0" aria-label="Distance on the path"> ${ud()} <input class="inline num" type="number" step="10" min="0" data-d="ascent" value="${esc(d.ascent)}" placeholder="—" aria-label="Metres of ascent"> m ↑ <span class="small muted">· ${stageLabel}${seg && d.rev !== south() ? ' · against your default direction' : ''} ${seg ? `<button type="button" class="linkish" data-zoom="1">map</button>` : ''}${canMerge ? ` · <button type="button" class="linkish" data-act="merge">merge with day ${i+2}</button>` : ''}</span></div>`}
          <div class="logi">
            <label title="Where you sleep">${ICON.bed}<input class="inline" data-d="bed" value="${esc(d.bed)}" placeholder="Where you sleep" aria-label="Accommodation"></label>
            <label title="Transport or parking">${ICON.bus}<input class="inline" data-d="travel" value="${esc(d.travel)}" placeholder="Transport or parking" aria-label="Transport"></label>
            ${d.rest ? '' : `<label title="Lunch stop">${ICON.lunch}<input class="inline" data-d="lunch" value="${esc(d.lunch||'')}" placeholder="Lunch stop" aria-label="Lunch stop"></label>
            <label title="Extra distance off the path, e.g. to a B&amp;B inland">${ICON.detour}<input class="inline num" type="number" step="0.5" min="0" data-d="extra" value="${dispNum(d.extra)}" placeholder="0" aria-label="Extra distance off the path" style="width:64px"> <span class="small muted">${ud()} off-route</span></label>`}
          </div>
          ${pois.length ? `<div class="sugg"><span class="small muted">Along the way:</span>${pois.map(p => `<span class="chip ${p.t}" data-hover="${POIS.indexOf(p)}" tabindex="0">${POI_ICON[p.t]}${esc(p.n)}${p.t === 'lunch' ? `<button type="button" data-lunch="${esc(p.n)}" title="Set as lunch stop">+</button>` : ''}</span>`).join('')}</div>` : ''}
          ${L ? `<div class="links small"><a href="${L.geograph}" target="_blank" rel="noopener">Photos of this stretch (Geograph)</a> · <a href="${L.images}" target="_blank" rel="noopener">Image search</a> · <a href="${L.osmaps}" target="_blank" rel="noopener">OS Maps</a> · <a href="${L.gmaps}" target="_blank" rel="noopener">Google Maps</a></div>` : ''}
          ${d.rest ? '' : `<div class="photos"><button type="button" class="btn small" data-photos="1">Show photos along this stretch</button><div class="photoBox"></div></div>
          <details class="guide">
            <summary>Day guide${d.guide ? '' : ' <span class="small muted">— not written yet</span>'}</summary>
            <div class="guideBody">${d.guide ? `<div class="guideText">${esc(d.guide).replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br>")}</div><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button type="button" class="btn small" data-guide-edit="1">Edit</button><button type="button" class="btn small" data-copyprompt="1">Copy prompt again</button><button type="button" class="btn small" data-guide-clear="1">Clear</button></div>` : `<div class="small muted">A short narrative for this day — highlights in order, where it's tough, where to stop, what to skip if pressed. Copy the prompt (it carries this day's real numbers and the stops listed above), paste it into Claude, then paste the answer back here. It's saved for both of you.</div><div style="display:flex;gap:8px;margin:8px 0;flex-wrap:wrap"><button type="button" class="btn small primary" data-copyprompt="1">Copy the prompt</button><a class="btn small" href="https://claude.ai/new" target="_blank" rel="noopener">Open Claude ↗</a></div><textarea class="guideIn" rows="5" placeholder="Paste the guide here"></textarea><button type="button" class="btn small" data-guide-save="1" style="margin-top:6px">Save guide</button>`}</div>
          </details>`}
        </div>
        <div class="derived">
          <div class="dl">${derivedLine(d)}</div>
          ${st ? profileSvg(d.rev ? st.prof.slice().reverse() : st.prof, maxHi, 220, 48) + `<div class="small muted">High point ${fmt(st.hi)} m · ${fmt(d.descent ?? (d.rev ? st.up : st.down))} m descent</div>`
               : d.rest ? '' : `<div class="ascbar" aria-hidden="true"><i style="width:${Math.min(100,(Number(d.ascent)||0)/10)}%"></i></div><div class="small muted">Custom day — type the ascent if you know it</div>`}
        </div>
        <div class="acts">
          <button type="button" data-act="up" aria-label="Move day up" ${i===0?'disabled':''}>${ICON.up}</button>
          <button type="button" data-act="down" aria-label="Move day down" ${i===days.length-1?'disabled':''}>${ICON.down}</button>
          <button type="button" data-act="rev" aria-label="Walk this day the other way" title="Walk this day the other way" ${d.rest?'disabled':''}>${ICON.swap}</button>
          <button type="button" data-act="del" aria-label="Remove day">${ICON.x}</button>
        </div>
      </div>`;
}
function refreshDerived(card, d, t){
  card.querySelector('.derived .dl').innerHTML = derivedLine(d);
  const tot = tripTotals(t);
  const set = (k, v) => { const e = document.querySelector(`#tripMain [data-tot="${k}"]`); if (e) e.textContent = v; };
  set('mi', fd(tot.mi)); set('up', tot.up ? fmt(tot.up) : '—'); set('extra', fd(tot.extra));
  renderTripCards();
}

// ---------- day guide via Claude (sample capability) ----------
// ---------- day guide: a prompt you paste into Claude (no in-page AI outside claude.ai) ----------
function guidePrompt(t, d){
  const sec = SEC[t.sectionId]; const seg = dseg(d); const st = seg ? segStats(sec, seg) : null; const pois = poisFor(sec, d);
  const facts = [
    `Wales Coast Path, ${sec.name} section. Day ${ (t.days||[]).indexOf(d)+1 } of the trip "${t.name}".`,
    `Walk from ${d.from} to ${d.to}${d.rev ? ' (heading towards Chester, i.e. anticlockwise round Wales)' : ' (heading towards Chepstow, i.e. clockwise round Wales)'}.`,
    `Distance on the path ${fmt(d.miles)} miles${Number(d.extra)?` plus ${fmt(d.extra)} miles off-route to accommodation`:''}; ascent about ${fmt(d.ascent)} m, descent about ${fmt(d.descent)} m${st?`, high point ${st.hi} m`:''}.`,
    d.lunch ? `Planned lunch stop: ${d.lunch}.` : 'No lunch stop planned yet.', d.bed ? `Staying at: ${d.bed}.` : '',
    pois.length ? 'Known points along the way, in walking order: ' + pois.map(p => `${p.n} (${POI_LABEL[p.t].toLowerCase()}${p.off>=0.5?`, ${p.off} km off the path`:''}): ${p.note}`).join('; ') + '.' : 'No notable stops are listed for this stretch in our data.'
  ].filter(Boolean).join('\n');
  return `You are a knowledgeable, plain-speaking walking companion writing a short day guide for two people walking the Wales Coast Path in multi-day chunks.\n\nFACTS (trust these over memory):\n${facts}\n\nWrite about 180–230 words in British English, second person, 3–4 short paragraphs, no headings and no bullet points. Cover: how the day feels overall; the highlights in the order they'll meet them; where it's tough or exposed; a sensible lunch or rest point; anything worth a small detour, and anything people commonly skip if short of time; one practical note (tides, buses, range closures, shops) only if you are confident it applies. If you're unsure whether a pub or café still operates, say "check it's open". Do not invent precise facilities, prices or timetables. End with a single sentence on what to look forward to at the finish.`;
}

let miniMapObj = null;
function renderTripSide(){
  const el = document.getElementById('tripSide');
  const t = tripById(state.tripId);
  if (miniMapObj) { try { miniMapObj.map.remove(); } catch {} miniMapObj = null; }
  if (!t) { el.innerHTML = ''; return; }
  const sec = SEC[t.sectionId], cov = coverage();
  const notes = t.notes || [];
  let me = ''; try { me = localStorage.getItem('coastpath.me') || ''; } catch {}
  const legend = `<span class="lg"><svg width="16" height="16" viewBox="-8 -8 16 16"><circle r="6" fill="#fff" stroke="var(--accent)" stroke-width="2"></circle><circle r="2" fill="var(--accent)"></circle></svg>start</span><span class="lg"><svg width="16" height="16" viewBox="-8 -8 16 16"><circle r="4" fill="#fff" stroke="var(--ink)" stroke-width="1.5"></circle></svg>day break</span><span class="lg"><svg width="16" height="16" viewBox="-2 -14 16 16"><path d="M0,0 L0,-12 L10,-12 L10,-5 L1.5,-5 L1.5,0 Z" fill="var(--warm)"></path></svg>finish</span>`;
  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px">
      <div class="small muted">Where this sits</div>
      <div class="mini" id="miniMap" role="img" aria-label="Where this trip sits on the section"></div>
      <div class="legendRow">${legend}</div>
      <div class="small muted">${fd(tripTotals(t).mi)} of ${fd(sec.miles)} ${ud()} of the section${tripTotals(t).extra ? ' (incl. off-route)' : ''}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;flex-grow:1">
      <div style="display:flex;justify-content:space-between" class="small muted"><span>Notes on this trip</span><span>${notes.length}</span></div>
      ${notes.length ? notes.map((n, i) => `<div class="note"><div class="av ${i%2?'b':''}">${esc((n.by||'?').trim().slice(0,2).toUpperCase())}</div><div><p>${esc(n.text)}</p><div class="who">${esc(n.by||'Someone')}${n.at ? ' · '+new Date(n.at).toLocaleDateString('en-GB',{day:'numeric',month:'short'}) : ''}</div></div></div>`).join('') : '<div class="small muted">Nothing yet.</div>'}
      <form id="noteForm" style="display:flex;flex-direction:column;gap:8px;margin-top:auto">
        <label class="field">Your name<input name="by" value="${esc(me)}" maxlength="24" placeholder="So the other person knows who wrote it" required></label>
        <label class="field">Add a note<textarea name="text" rows="2" required maxlength="500" placeholder="Type here"></textarea></label>
        <button type="submit" class="btn" style="align-self:flex-end">Post note</button>
      </form>
    </div>`;
  const mm = makeLeafMap(el.querySelector('#miniMap'), { light: true, scroll: false, attribution: false, box: FULL });
  miniMapObj = mm; const map = mm.map;
  for (const st of sec.stages) L.polyline(st.ll || (st.ll = llPts(st.pts)), { color: 'var(--todo)', weight: 3, dashArray: '5 5', interactive: false }).addTo(map);
  sec.stages.forEach((st, i) => { for (const c of cov[sec.id][i]) if (c.tripId !== t.id) L.polyline(llPts(slicePts(st.pts, c.f0, c.f1)), { color: c.kind === 'walked' ? 'var(--ink)' : 'var(--accent)', weight: 3, opacity: 0.4, interactive: false }).addTo(map); });
  const sdays = (t.days||[]).map(d => ({ d, e: dayEnds(d) })).filter(x => x.e);
  const segs = sdays.flatMap(({d}) => segPtsList(sec, dseg(d)));
  for (const pts of segs) L.polyline(llPts(pts), { color: t.status === 'walked' ? 'var(--ink)' : 'var(--accent)', weight: 5, interactive: false }).addTo(map);
  sdays.forEach(({ d, e }, k) => { const q = segPoint(sec, e.start.i, e.start.f); const ll = toLL(q[0], q[1]);
    if (k === 0) { L.circleMarker(ll, { radius: 7, color: 'var(--accent)', weight: 2, fillColor: '#fff', fillOpacity: 1 }).bindTooltip(`Start: ${d.from}`).addTo(map); L.circleMarker(ll, { radius: 2.5, color: 'var(--accent)', fillColor: 'var(--accent)', fillOpacity: 1, weight: 0, interactive: false }).addTo(map); }
    else L.circleMarker(ll, { radius: 4, color: 'var(--ink)', weight: 1.5, fillColor: '#fff', fillOpacity: 1 }).bindTooltip(`Day ${k+1} starts: ${d.from}`).addTo(map); });
  if (sdays.length) { const last = sdays[sdays.length-1]; const q = segPoint(sec, last.e.end.i, last.e.end.f); L.marker(toLL(q[0], q[1]), { icon: L.divIcon({ className: 'flagicon', html: '<svg width="18" height="20" viewBox="-2 -14 16 16"><path d="M0,0 L0,-12 L10,-12 L10,-5 L1.5,-5 L1.5,0 Z" fill="#B8632C" stroke="#fff" stroke-width="0.8"></path></svg>', iconSize: [18, 20], iconAnchor: [2, 20] }) }).bindTooltip(`Finish: ${last.d.to}`).addTo(map); }
  mm.fit(bboxOf(segs.length ? segs : secPts(sec)), 0.18);
  el.querySelector('#noteForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target; const by = f.by.value.trim(), text = f.text.value.trim(); if (!by || !text) return;
    try { localStorage.setItem('coastpath.me', by); } catch {}
    t.notes = [...notes, { by, text, at: Date.now() }]; persistTrip(t, true); renderTripSide();
  });
}

function renderTrips(){ renderTripCards(); renderTripMain(); renderTripSide(); }
function renderAll(){ renderBigMap(); renderPanel(); renderTrips(); setStatus(); }

// ---------- dialog ----------
const dlg = document.getElementById('tripDialog'), form = document.getElementById('tripForm');
const F = n => form.elements.namedItem(n);
function fillDialogSections(){ document.getElementById('dlgSection').innerHTML = orderedSections().map((s, k) => `<option value="${s.id}">${k+1}. ${esc(s.name)}</option>`).join(''); }
fillDialogSections();
function dlgDir(){ return south() !== F('reverse').checked; }  // true = walking Chepstow→Chester for this trip
function fillDialogStages(defaultFrom){
  const sec = SEC[F('section').value]; const rev = dlgDir(); const cov = coverage()[sec.id];
  const order = sec.stages.map((_, i) => i); if (rev) order.reverse();
  const opt = i => { const v = viewStage(sec, i, rev); return `<option value="${i}">${esc(v.frm)} → ${esc(v.to)} · ${fd(v.mi)} ${ud()}${covFrac(cov[i]) > 0 ? ' · already in a trip' : ''}</option>`; };
  F('dfrom').innerHTML = order.map(opt).join(''); F('dto').innerHTML = order.map(opt).join('');
  let start = defaultFrom; if (start == null) { start = order.find(i => covFrac(cov[i]) < 0.5); if (start == null) start = order[0]; }
  const k = order.indexOf(start); F('dfrom').value = start; F('dto').value = order[Math.min(order.length-1, k+3)];
  updateDlgSummary();
}
function updateDlgSummary(){
  const sec = SEC[F('section').value]; const rev = dlgDir(); const order = sec.stages.map((_, i) => i); if (rev) order.reverse();
  let a = order.indexOf(Number(F('dfrom').value)), b = order.indexOf(Number(F('dto').value));
  if (b < a) { b = a; F('dto').value = F('dfrom').value; }
  const picked = order.slice(a, b+1);
  const mi = picked.reduce((x, i) => x + sec.stages[i].mi, 0), up = picked.reduce((x, i) => x + (rev ? sec.stages[i].down : sec.stages[i].up), 0);
  const empty = F('empty').checked;
  F('dfrom').disabled = empty; F('dto').disabled = empty;
  document.getElementById('dlgSummary').textContent = empty ? 'An empty trip.' : `${picked.length} day${picked.length===1?'':'s'} · ${fd(mi)} ${ud()} · ${fmt(up)} m ascent · ${rev ? 'heading for Chester' : 'heading for Chepstow'}`;
  document.getElementById('dlgRevLabel').textContent = south() ? 'Walk it the other way (Chester → Chepstow direction, against your default)' : 'Walk it the other way (Chepstow → Chester direction, against your default)';
}
function openTripDialog(sectionId, stageIdx){
  fillDialogSections(); form.reset(); F('section').value = sectionId || state.sel;
  F('name').value = ''; F('name').placeholder = SEC[F('section').value].short;
  fillDialogStages(typeof stageIdx === 'number' ? stageIdx : null);
  dlg.showModal(); F('name').focus();
}
F('section').addEventListener('change', () => { F('name').placeholder = SEC[F('section').value].short; fillDialogStages(null); });
F('reverse').addEventListener('change', () => fillDialogStages(Number(F('dfrom').value)));
F('empty').addEventListener('change', updateDlgSummary);
F('dfrom').addEventListener('change', updateDlgSummary); F('dto').addEventListener('change', updateDlgSummary);
document.getElementById('dlgCancel').addEventListener('click', () => dlg.close());
form.addEventListener('submit', e => {
  e.preventDefault();
  const empty = F('empty').checked;
  createTrip({ name: F('name').value.trim() || SEC[F('section').value].short, sectionId: F('section').value, status: F('status').value, when: F('when').value.trim(), from: empty ? null : Number(F('dfrom').value), to: empty ? null : Number(F('dto').value), reverse: F('reverse').checked });
  dlg.close(); setView('trips');
});

// ---------- wiring ----------
function setView(v){
  state.view = v;
  document.getElementById('mapView').hidden = v !== 'map';
  document.getElementById('tripsView').hidden = v !== 'trips';
  document.getElementById('tabMap').setAttribute('aria-pressed', v === 'map');
  document.getElementById('tabTrips').setAttribute('aria-pressed', v === 'trips');
  try { localStorage.setItem('coastpath.view', v); } catch {}
  renderAll(); if (v === 'map' && typeof bigMap !== 'undefined') setTimeout(() => bigMap.map.invalidateSize(), 0);
}
document.getElementById('tabMap').addEventListener('click', () => setView('map'));
document.getElementById('dirBtn').addEventListener('click', () => { state.direction = south() ? 'north' : 'south'; persistSettings(); renderAll(); });
document.getElementById('tabTrips').addEventListener('click', () => setView('trips'));
const bigMap = makeLeafMap(document.getElementById('bigMap'), { layers: true });
document.getElementById('zoomIn').addEventListener('click', () => bigMap.map.zoomIn());
document.getElementById('zoomOut').addEventListener('click', () => bigMap.map.zoomOut());
document.getElementById('zoomReset').addEventListener('click', () => bigMap.set({...FULL}));
window.addEventListener('resize', () => bigMap.map.invalidateSize());
document.getElementById('newTripBtn').addEventListener('click', () => openTripDialog(state.sel, null));
document.getElementById('filterChips').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; state.filter = b.dataset.f; document.querySelectorAll('#filterChips button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderTripCards(); });
document.addEventListener('click', e => { const m = document.getElementById('addMenu'); if (m && !m.contains(e.target)) { m.classList.remove('open'); m.querySelector('#addDayBtn')?.setAttribute('aria-expanded','false'); } });

// ---------- map picker: choose a start / finish point anywhere on the route ----------
const pickDlg = document.getElementById('pickDialog');
let pick = null;   // { t, d, which, sec, pt, map, layers }
function openPicker(t, d, which){
  const sec = SEC[t.sectionId];
  pick = { t, d, which, sec, pt: null };
  const ends = dayEnds(d);
  document.getElementById('pickTitle').textContent = `Choose the ${which} of day ${(t.days||[]).indexOf(d)+1}`;
  document.getElementById('pickHint').textContent = `Click anywhere on the ${sec.short} route. The point snaps to the path; distances and the profile update when you confirm.`;
  document.getElementById('pickName').value = ''; document.getElementById('pickInfo').textContent = ''; document.getElementById('pickOk').disabled = true;
  pickDlg.showModal();
  const host = document.getElementById('pickMap'); host.innerHTML = '';
  const mm = makeLeafMap(host, { layers: true, box: FULL }); const map = mm.map; pick.map = mm;
  const cov = coverage();
  sec.stages.forEach((st, i) => { L.polyline(st.ll || (st.ll = llPts(st.pts)), { color: 'var(--todo)', weight: 5, dashArray: '7 7', interactive: false }).addTo(map); for (const c of cov[sec.id][i]) L.polyline(llPts(slicePts(st.pts, c.f0, c.f1)), { color: c.kind === 'walked' ? 'var(--ink)' : 'var(--accent)', weight: c.tripId === t.id ? 6 : 4, opacity: c.tripId === t.id ? 1 : 0.4, interactive: false }).addTo(map); });
  for (const [n, p] of Object.entries(TOWNS)) L.circleMarker(toLL(p[0], p[1]), { radius: 3, color: '#1B2628', weight: 1.5, fillColor: '#fff', fillOpacity: 1, interactive: false }).bindTooltip(n, { permanent: true, direction: 'right', className: 'townlbl', offset: [4, 0] }).addTo(map);
  if (ends) { const a = segPoint(sec, ends.start.i, ends.start.f), b = segPoint(sec, ends.end.i, ends.end.f); L.circleMarker(toLL(a[0], a[1]), { radius: 6, color: 'var(--accent)', weight: 2, fillColor: '#fff', fillOpacity: 1, interactive: false }).addTo(map); L.circleMarker(toLL(b[0], b[1]), { radius: 6, color: '#fff', weight: 2, fillColor: 'var(--accent)', fillOpacity: 1, interactive: false }).addTo(map); }
  const chosen = L.layerGroup().addTo(map);
  map.on('click', e => {
    const [ux, uy] = toXY(e.latlng); let best = { d: Infinity };
    sec.stages.forEach((st, i) => { const p = projectOn(st.pts, ux, uy); if (p.d < best.d) best = { ...p, i }; });
    const tol = 40 * mm.scale(); if (best.d > Math.max(400, tol)) { document.getElementById('pickInfo').textContent = 'Click closer to the route.'; return; }
    pick.pt = { i: best.i, f: best.f };
    chosen.clearLayers(); L.circleMarker(toLL(best.x, best.y), { radius: 9, color: 'var(--warm)', weight: 0, fillColor: 'var(--warm)', fillOpacity: 0.35, interactive: false }).addTo(chosen); L.circleMarker(toLL(best.x, best.y), { radius: 5, color: '#fff', weight: 2, fillColor: 'var(--warm)', fillOpacity: 1, interactive: false }).addTo(chosen);
    const town = nearestTown(best.x, best.y);
    const dflt = defaultName(sec, best.i, best.f) || (town.km < 1.2 ? town.name : '');
    document.getElementById('pickName').value = dflt; document.getElementById('pickName').placeholder = dflt ? '' : 'Name this point (e.g. Farmhouse B&B)';
    const along0 = segMiles(sec, best.i, best.f); const along = south() ? sec.miles - along0 : along0; const stg = sec.stages[best.i];
    document.getElementById('pickInfo').textContent = `${fd(along)} ${ud()} from ${secEnds(sec)[0]} · on the ${stg.frm} → ${stg.to} stage, ${Math.round(best.f*100)}% along · grid ref ${gridRef(best.x, -best.y, 6)}`;
    document.getElementById('pickOk').disabled = false;
  });
  mm.fit(bboxOf(ends ? segPtsList(sec, dseg(d)) : secPts(sec)), 0.35);
  setTimeout(() => map.invalidateSize(), 50);
}
function closePicker(){ if (pick && pick.map) { try { pick.map.map.remove(); } catch {} } pickDlg.close(); pick = null; }
document.getElementById('pickCancel').addEventListener('click', closePicker);
document.getElementById('pickOk').addEventListener('click', () => {
  if (!pick || !pick.pt) return;
  const { t, d, which, sec, pt } = pick; const name = document.getElementById('pickName').value.trim() || defaultName(sec, pt.i, pt.f) || 'Point on the path';
  const ds = t.days || [], idx = ds.indexOf(d); const ends = dayEnds(d) || { start: pt, end: pt };
  const old = which === 'start' ? ends.start : ends.end;
  if (which === 'start') setDayEnds(sec, d, pt, ends.end, { from: name, to: d.to }); else setDayEnds(sec, d, ends.start, pt, { from: d.from, to: name });
  const nb = which === 'start' ? ds[idx-1] : ds[idx+1];
  if (nb && !nb.rest) { const ne = dayEnds(nb); if (ne && ptEq(which === 'start' ? ne.end : ne.start, old)) { if (which === 'start') setDayEnds(sec, nb, ne.start, pt, { from: nb.from, to: name }); else setDayEnds(sec, nb, pt, ne.end, { from: name, to: nb.to }); } }
  persistTrip(t); closePicker(); renderAll();
});
document.getElementById('pickSplit').addEventListener('click', () => {
  if (!pick || !pick.pt) return;
  const { t, d, sec, pt } = pick; const name = document.getElementById('pickName').value.trim() || 'Point on the path';
  const ds = t.days || [], idx = ds.indexOf(d); const ends = dayEnds(d); if (!ends) return;
  const second = { ...makeDay(sec, null, false), id: uid() };
  setDayEnds(sec, second, pt, ends.end, { from: name, to: d.to });
  setDayEnds(sec, d, ends.start, pt, { from: d.from, to: name });
  second.bed = d.bed; d.bed = '';
  ds.splice(idx+1, 0, second); t.days = ds; persistTrip(t); closePicker(); renderAll();
});

// ---------- hover card for suggested stops ----------
const hover = document.getElementById('hovercard'); let hoverTimer = null;
function attachHover(elm, p){
  if (!p) return;
  const show = () => { clearTimeout(hoverTimer); const L = linksFor(p.x, p.y, p.n); const r = elm.getBoundingClientRect();
    hover.innerHTML = `<div class="hc-head"><span class="pi ${p.t}">${POI_ICON[p.t]}</span><div><b>${esc(p.n)}</b><div class="small muted">${esc(POI_LABEL[p.t])}${p.off >= 0.5 ? ` · ${p.off} km off the path` : ''} · grid ref ${L.gr}</div></div></div><div class="wikithumb"></div><p>${esc(p.note)}</p><div class="hc-links"><a href="${L.wiki}" target="_blank" rel="noopener">Wikipedia</a><a href="${L.images}" target="_blank" rel="noopener">Images</a><a href="${L.geograph}" target="_blank" rel="noopener">Geograph photos</a><a href="${L.gmaps}" target="_blank" rel="noopener">Google Maps</a><a href="${L.osmaps}" target="_blank" rel="noopener">OS Maps</a></div>`;
    hover.hidden = false; loadWikiThumb(p, hover); const hw = 300; let x = Math.min(window.innerWidth - hw - 12, r.left), y = r.bottom + 8; if (y + 180 > window.innerHeight) y = r.top - 8 - hover.offsetHeight; hover.style.left = x + 'px'; hover.style.top = Math.max(8, y) + 'px'; };
  const hide = () => { hoverTimer = setTimeout(() => { hover.hidden = true; }, 250); };
  elm.addEventListener('mouseenter', show); elm.addEventListener('focus', show); elm.addEventListener('mouseleave', hide); elm.addEventListener('blur', hide);
  elm.addEventListener('click', e => { if (e.target.closest('button')) return; if (hover.hidden) show(); else hover.hidden = true; });
}
hover.addEventListener('mouseenter', () => clearTimeout(hoverTimer)); hover.addEventListener('mouseleave', () => { hover.hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') hover.hidden = true; });

// ---------- "open this area in…" ----------
document.getElementById('openInBtn').addEventListener('click', e => { e.stopPropagation(); const m = document.getElementById('openIn'); const open = m.classList.toggle('open'); if (open) { const r = bigMap.svg.getBoundingClientRect(); m.querySelector('.pop').innerHTML = `<div class="hd">This view, in other apps</div>` + areaLinks(bigMap.box, r.width).map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(n)}</a>`).join('') + `<div class="hd">Tip: zoom the map to the stretch you care about first</div>`; } });
document.addEventListener('click', e => { const m = document.getElementById('openIn'); if (m && !m.contains(e.target)) m.classList.remove('open'); });

// ---------- units ----------
document.getElementById('seedBtn').addEventListener('click', async () => { const n = await importSeed(); document.getElementById('seedBar').hidden = true; });
document.getElementById('seedSkip').addEventListener('click', () => { document.getElementById('seedBar').hidden = true; });
document.getElementById('unitBtn').addEventListener('click', () => { state.unit = isKm() ? 'mi' : 'km'; try { localStorage.setItem('coastpath.unit', state.unit); } catch {} renderAll(); });

(function init(){
  let v = 'map'; try { v = localStorage.getItem('coastpath.view') || 'map'; const dd = localStorage.getItem('coastpath.direction'); if (dd === 'north' || dd === 'south') state.direction = dd; const uu = localStorage.getItem('coastpath.unit'); if (uu === 'km' || uu === 'mi') state.unit = uu; } catch {}
  setView(v);
  connect();
})();
