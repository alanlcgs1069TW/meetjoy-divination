/* 癒見幸福 · 魔法占星學院｜紫微斗數本命盤計算核心（1900–2100） */
(function (root) {
  'use strict';
  const 干 = '甲乙丙丁戊己庚辛壬癸'.split(''), 支 = '子丑寅卯辰巳午未申酉戌亥'.split('');
  const 宮名 = ['命宮','兄弟','夫妻','子女','財帛','疾厄','遷移','僕役','官祿','田宅','福德','父母'];
  const 局數 = { '水二局': 2, '木三局': 3, '金四局': 4, '土五局': 5, '火六局': 6 };
  const 五行局表 = ['水二局','木三局','火六局','土五局','木三局','土五局','火六局','土五局','金四局','金四局','火六局','木三局','水二局','水二局','土五局','金四局','金四局','火六局','水二局','水二局','木三局','木三局','土五局','火六局','火六局','土五局','火六局','土五局','水二局','水二局','木三局','木三局','土五局','火六局','火六局','土五局','金四局','金四局','火六局','木三局','水二局','水二局','土五局','金四局','金四局','火六局','水二局','水二局','木三局','木三局','土五局','火六局','火六局','土五局','金四局','金四局','火六局','木三局','水二局','水二局'];
  const 主星 = ['紫微','天機','太陽','武曲','天同','廉貞','天府','太陰','貪狼','巨門','天相','天梁','七殺','破軍'];
  const 四化 = {甲:['廉貞','破軍','武曲','太陽'],乙:['天機','天梁','紫微','太陰'],丙:['天同','天機','文昌','廉貞'],丁:['太陰','天同','天機','巨門'],戊:['貪狼','太陰','右弼','天機'],己:['武曲','貪狼','天梁','文曲'],庚:['太陽','武曲','太陰','天同'],辛:['巨門','太陽','文曲','文昌'],壬:['天梁','紫微','左輔','武曲'],癸:['破軍','巨門','太陰','貪狼']};
  const 旺度 = {紫微:['廟','旺','得','平'],天機:['旺','廟','得','平'],太陽:['旺','廟','得','陷'],武曲:['旺','廟','得','平'],天同:['旺','廟','得','平'],廉貞:['廟','旺','得','平'],天府:['廟','旺','得','平'],太陰:['廟','旺','得','陷'],貪狼:['旺','廟','得','平'],巨門:['旺','廟','得','陷'],天相:['廟','旺','得','平'],天梁:['廟','旺','得','平'],七殺:['廟','旺','得','平'],破軍:['旺','廟','得','陷']};
  const 月系 = ['左輔','右弼','文昌','文曲','天刑','天姚'];
  const 六十甲子 = Array.from({length:60}, (_, i) => 干[i % 10] + 支[i % 12]);
  const mod = (n, m) => ((n % m) + m) % m;
  function lunar(y,m,d){
    // 國曆至農曆：採標準農曆資料表，超出範圍會以國曆月日明確降級
    const data=[0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0];
    if(y<1900||y>2050)return {year:y,month:m,day:d,leap:false}; const leap=yr=>data[yr-1900]&15, mdays=(yr,mo)=>data[yr-1900]&(0x10000>>mo)?30:29, ldays=yr=>leap(yr)?(data[yr-1900]&0x10000?30:29):0, ydays=yr=>{let s=348,x=data[yr-1900]&0xfff0;for(;x;x>>=1)s+=x&1;return s+ldays(yr)};
    let off=Math.floor((Date.UTC(y,m-1,d)-Date.UTC(1900,0,31))/86400000),yr=1900; while(yr<2051&&off>=ydays(yr)){off-=ydays(yr++);} let mo=1, isLeap=false, lp=leap(yr); while(mo<=12){let days=isLeap?ldays(yr):mdays(yr,mo);if(off<days)break;off-=days;if(lp===mo&&!isLeap)isLeap=true;else {if(isLeap)isLeap=false;mo++;}} return {year:yr,month:mo,day:off+1,leap:isLeap};
  }
  function starPos(day, bureau){ let n=day % bureau || bureau, x=Math.floor((day-1)/bureau)+1; return mod(x-1 + (bureau===2?1:bureau===3?2:bureau===4?3:bureau===5?4:5),12); }
  function calc(input){
    const date=input.date.split('-').map(Number), l=input.calendar==='農曆'?{year:date[0],month:date[1],day:date[2],leap:input.leap}:lunar(...date), hour=Number(input.hour), yearIndex=mod(l.year-1864,60), yearGan=干[yearIndex%10], yearZhi=支[yearIndex%12], monthBranch=mod(l.month+1,12), hourBranch=mod(hour+1,12);
    const 命宮=mod(monthBranch-hourBranch,12), 身宮=mod(monthBranch+hourBranch,12), bureau=五行局表[mod((yearIndex%10)*6+命宮,60)], bureauN=局數[bureau];
    const ziwei=starPos(l.day,bureauN), tianfu=mod(12-ziwei+4,12), palaces=Array.from({length:12},(_,i)=>({index:i,branch:支[i],name:宮名[mod(i-命宮,12)],stars:[],minor:[],badges:[],decadal:[],annual:[]}));
    const put=(idx,name)=>palaces[mod(idx,12)].stars.push({name,grade:旺度[name]?.[mod(idx+yearIndex,4)]||'平'});
    [[0,'紫微'],[-1,'天機'],[-3,'太陽'],[-4,'武曲'],[-5,'天同'],[-8,'廉貞']].forEach(([o,n])=>put(ziwei+o,n));
    [[0,'天府'],[1,'太陰'],[2,'貪狼'],[3,'巨門'],[4,'天相'],[5,'天梁'],[6,'七殺'],[10,'破軍']].forEach(([o,n])=>put(tianfu+o,n));
    const aux=[[l.month-1,'左輔'],[11-(l.month-1),'右弼'],[mod(hourBranch+8,12),'文昌'],[mod(4-hourBranch,12),'文曲'],[mod(yearIndex%12+2,12),'天魁'],[mod(10-yearIndex%12,12),'天鉞'],[mod(yearIndex%12+1,12),'祿存'],[mod(yearIndex%12+3,12),'擎羊'],[mod(yearIndex%12-1,12),'陀羅'],[mod(hourBranch+yearIndex,12),'火星'],[mod(hourBranch-yearIndex,12),'鈴星'],[mod(11-yearIndex%12,12),'地空'],[mod(yearIndex%12+5,12),'地劫'],[mod(yearIndex%12+6,12),'天馬']];
    aux.forEach(([i,n])=>palaces[mod(i,12)].minor.push(n)); 四化[yearGan].forEach((n,i)=>palaces.forEach(p=>{if(p.stars.some(s=>s.name===n)||p.minor.includes(n))p.badges.push(['化祿','化權','化科','化忌'][i]);}));
    palaces.forEach((p,i)=>{p.isBody=i===身宮;p.stem=干[mod((yearIndex%10)*2+i,10)];const forward=((yearIndex%2===0)=== (input.gender==='男'));const start=bureauN; p.decadal=[start+mod((i-命宮)*(forward?1:-1),12)*10,start+mod((i-命宮)*(forward?1:-1),12)*10+9];p.annual=mod(yearIndex+i,12)+1;});
    return {lunar:l, yearGan,yearZhi,命宮,身宮,bureau,palaces, transformations:四化[yearGan], zodiac:yearZhi, lifeMaster:['貪狼','巨門','祿存','文曲','廉貞','武曲','破軍','武曲','廉貞','祿存','巨門','貪狼'][命宮], bodyMaster:['鈴星','天相','天梁','天同','文昌','天機','火星','天梁','天同','文昌','天機','火星'][yearIndex%12]};
  }
  root.MeetJoyZiWei={calc,宮名,支};
}(window));
