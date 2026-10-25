export interface V456Frame {p:number;from:number;to:number;t:number;moving:boolean;active:number;read:number;travel:number;headingOut:number;headingIn:number;bodyOut:number;bodyIn:number;image:number;}
export const navTargets:number[];
export function clamp(x:number):number;
export function smoothstep(x:number):number;
export function journeyV456Frame(progress:number):V456Frame;
export function horizontalTargets(widths:number[],offsets:number[],viewport:number,scrollWidth:number):number[];
