/** Synthetic placement studies, not a reusable routing/diagram engine. */
export type DeviceKind = 'router' | 'switch' | 'server' | 'client' | 'ap';
export interface Node { id: string; name: string; kind: DeviceKind; x: number; y: number }
export interface Endpoint { owner: string; name: string; x: number; y: number; anchor?: 'start' | 'middle' | 'end' }
export interface Link { id: string; from: Endpoint; to: Endpoint; path: string; wireless?: boolean; label?: { text: string; x: number; y: number } }
export interface Composition { width: number; height: number; nodes: readonly Node[]; links: readonly Link[] }
export interface Topology { id: string; description: string; desktop: Composition; mobile: Composition }

export const simple: Topology = {
  id: 'simple', description: 'SW-EDGE-01 has separate links to CLIENT-A and CLIENT-B. Gi1/0/7 belongs to the switch endpoint facing CLIENT-A; eth0 belongs to the client endpoint. Gi1/0/8 is the switch endpoint facing CLIENT-B. No node numbers are assigned.',
  desktop: { width: 760, height: 340, nodes: [
    { id: 'sw1', name: 'SW-EDGE-01', kind: 'switch', x: 380, y: 70 },
    { id: 'a', name: 'CLIENT-A', kind: 'client', x: 155, y: 240 },
    { id: 'b', name: 'CLIENT-B', kind: 'client', x: 605, y: 240 },
  ], links: [
    { id: 'access-a', from: {owner:'sw1',name:'Gi1/0/7',x:284,y:116,anchor:'end'}, to:{owner:'a',name:'eth0',x:174,y:207}, path:'M345 70 H300 V158 H155 V221' },
    { id: 'access-b', from: {owner:'sw1',name:'Gi1/0/8',x:476,y:116}, to:{owner:'b',name:'eth0',x:585,y:207,anchor:'end'}, path:'M415 70 H460 V158 H605 V221' },
  ] },
  mobile: { width: 350, height: 430, nodes: [
    { id: 'sw1', name: 'SW-EDGE-01', kind: 'switch', x: 175, y: 65 },
    { id: 'a', name: 'CLIENT-A', kind: 'client', x: 82, y: 280 },
    { id: 'b', name: 'CLIENT-B', kind: 'client', x: 265, y: 280 },
  ], links: [
    { id: 'access-a', from: {owner:'sw1',name:'Gi1/0/7',x:104,y:153,anchor:'end'}, to:{owner:'a',name:'eth0',x:101,y:248}, path:'M140 65 H120 V200 H82 V261' },
    { id: 'access-b', from: {owner:'sw1',name:'Gi1/0/8',x:246,y:153}, to:{owner:'b',name:'eth0',x:247,y:248,anchor:'end'}, path:'M210 65 H230 V200 H265 V261' },
  ] },
};

export const complex: Topology = {
  id: 'complex', description: 'R-EDGE connects to two switches. SW-EDGE-01 connects to SRV-01 and CLIENT-A. SW-EDGE-02 connects to CLIENT-B and AP-01. AP-01 has wireless links to CLIENT-C and CLIENT-D. Every endpoint label belongs to a named device; Trunk is a link-level property. The user-controlled sequence follows R-EDGE, SW-EDGE-01 and CLIENT-A, in that order.',
  desktop: { width: 1000, height: 590, nodes: [
    {id:'r',name:'R-EDGE',kind:'router',x:480,y:70},
    {id:'sw1',name:'SW-EDGE-01',kind:'switch',x:220,y:220},
    {id:'sw2',name:'SW-EDGE-02',kind:'switch',x:710,y:220},
    {id:'srv',name:'SRV-01',kind:'server',x:90,y:405},
    {id:'a',name:'CLIENT-A',kind:'client',x:340,y:405},
    {id:'b',name:'CLIENT-B',kind:'client',x:570,y:405},
    {id:'ap',name:'AP-01',kind:'ap',x:830,y:390},
    {id:'c',name:'CLIENT-C',kind:'client',x:755,y:525},
    {id:'d',name:'CLIENT-D',kind:'client',x:900,y:525},
  ], links: [
    {id:'uplink-left',from:{owner:'r',name:'Gi0/0',x:414,y:132,anchor:'end'},to:{owner:'sw1',name:'Gi1/0/1',x:204,y:183,anchor:'end'},path:'M448 70 H430 V150 H220 V200',label:{text:'Trunk',x:340,y:140}},
    {id:'uplink-right',from:{owner:'r',name:'Gi0/1',x:546,y:132},to:{owner:'sw2',name:'Gi1/0/1',x:726,y:183},path:'M512 70 H530 V150 H710 V200'},
    {id:'server',from:{owner:'sw1',name:'Gi1/0/7',x:129,y:258,anchor:'end'},to:{owner:'srv',name:'eth0',x:106,y:361},path:'M185 220 H145 V315 H90 V380'},
    {id:'access-a',from:{owner:'sw1',name:'Gi1/0/8',x:311,y:258},to:{owner:'a',name:'eth0',x:356,y:367},path:'M255 220 H295 V325 H340 V386'},
    {id:'access-b',from:{owner:'sw2',name:'Gi1/0/7',x:619,y:258,anchor:'end'},to:{owner:'b',name:'eth0',x:550,y:367,anchor:'end'},path:'M675 220 H635 V320 H570 V386'},
    {id:'access-ap',from:{owner:'sw2',name:'Gi1/0/9',x:801,y:258},to:{owner:'ap',name:'eth0',x:846,y:352},path:'M745 220 H785 V325 H830 V365'},
    {id:'wireless-c',wireless:true,from:{owner:'ap',name:'radio0',x:775,y:437,anchor:'end'},to:{owner:'c',name:'wlan0',x:737,y:489,anchor:'end'},path:'M813 402 Q770 435 755 506'},
    {id:'wireless-d',wireless:true,from:{owner:'ap',name:'radio0',x:888,y:427},to:{owner:'d',name:'wlan0',x:918,y:489},path:'M847 402 Q890 435 900 506'},
  ] },
  mobile: { width: 350, height: 990, nodes: [
    {id:'r',name:'R-EDGE',kind:'router',x:175,y:62},
    {id:'sw1',name:'SW-EDGE-01',kind:'switch',x:80,y:280},
    {id:'sw2',name:'SW-EDGE-02',kind:'switch',x:270,y:280},
    {id:'srv',name:'SRV-01',kind:'server',x:65,y:492},
    {id:'a',name:'CLIENT-A',kind:'client',x:155,y:492},
    {id:'b',name:'CLIENT-B',kind:'client',x:65,y:690},
    {id:'ap',name:'AP-01',kind:'ap',x:255,y:685},
    {id:'c',name:'CLIENT-C',kind:'client',x:165,y:920},
    {id:'d',name:'CLIENT-D',kind:'client',x:295,y:920},
  ], links: [
    {id:'uplink-left',from:{owner:'r',name:'Gi0/0',x:114,y:145,anchor:'end'},to:{owner:'sw1',name:'Gi1/0/1',x:64,y:237,anchor:'end'},path:'M143 62 H130 V180 H80 V260',label:{text:'Trunk',x:105,y:171}},
    {id:'uplink-right',from:{owner:'r',name:'Gi0/1',x:236,y:145},to:{owner:'sw2',name:'Gi1/0/1',x:286,y:237},path:'M207 62 H220 V180 H270 V260'},
    {id:'server',from:{owner:'sw1',name:'Gi1/0/7',x:26,y:375},to:{owner:'srv',name:'eth0',x:81,y:450},path:'M62 300 H20 V415 H65 V467'},
    {id:'access-a',from:{owner:'sw1',name:'Gi1/0/8',x:151,y:375},to:{owner:'a',name:'eth0',x:171,y:450},path:'M98 300 H145 V415 H155 V473'},
    {id:'access-b',from:{owner:'sw2',name:'Gi1/0/7',x:204,y:345,anchor:'end'},to:{owner:'b',name:'eth0',x:81,y:643},path:'M252 300 H210 V580 H65 V671'},
    {id:'access-ap',from:{owner:'sw2',name:'Gi1/0/9',x:324,y:375,anchor:'end'},to:{owner:'ap',name:'eth0',x:271,y:638},path:'M288 300 H330 V580 H255 V660'},
    {id:'wireless-c',wireless:true,from:{owner:'ap',name:'radio0',x:185,y:730,anchor:'end'},to:{owner:'c',name:'wlan0',x:148,y:883,anchor:'end'},path:'M238 697 Q125 775 165 901'},
    {id:'wireless-d',wireless:true,from:{owner:'ap',name:'radio0',x:343,y:724,anchor:'end'},to:{owner:'d',name:'wlan0',x:282,y:877,anchor:'end'},path:'M272 697 Q328 785 295 901'},
  ] },
};
