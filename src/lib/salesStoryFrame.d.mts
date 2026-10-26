export function clamp(v:number):number;
export function phase(p:number,a:number,b:number):number;
type Base={p:number;from:number;to:number;t:number;moving:boolean;active:number};
export function journeyStoryFrame(p:number):Base&{titleOut:number;titleIn:number;questionOut:number;questionIn:number;salesOut:number;salesIn:number;oldOpacity:number;newOpacity:number;imageTransform:number};
export function channelStoryFrame(p:number):Base&{textOut:number;titleIn:number;bodyIn:number;photo:number};
export function qualityStoryFrame(p:number):Record<string,number>;
export const journeyTargets:number[];
export const channelTargets:number[];
