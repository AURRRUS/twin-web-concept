import {sitePath} from './paths';
export const focusRegions=[
 {x:32,y:56,zoom:2.2,reason:'Корпуса и инфраструктура в центральной левой части панорамы'},
 {x:53,y:43,zoom:2,reason:'Выделенные апартаменты на фасаде центрального корпуса'},
 {x:40,y:48,zoom:1.9,reason:'План этажа и выделенный лот705, без правой карточки'},
 {x:85,y:34,zoom:2.4,reason:'Объёмная планировка в верхней части правой карточки лота'},
];
export function storyImage(kind:'journey'|'channels',id:string,width=1672){return sitePath(`/media/sales-story/${kind}/${id}-${width}.webp`)}
export function storyOriginal(id:string){return sitePath(`/media/final-r2/journey/${id}.png`)}
