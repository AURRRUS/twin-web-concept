export interface JourneyFrame {
 titleOpacity:number[];titleY:number[];titleClip:number[];titleClipTop:number[];titleClipBottom:number[];
 bodyOpacity:number[];bodyY:number[];bodyClipTop:number[];bodyClipBottom:number[];mediaOpacity:number[];mediaScale:number[];mediaY:number[];mediaClipBottom:number[];
 active:number;title:number;explanation:number;
}
export const sceneTargets:number[];
export const journeyStops:number[][];
export const journeyTravel:number;
export function smoothstep(x:number):number;
export function clamp(x:number):number;
export function journeyFrame(progress:number):JourneyFrame;
export function createProgressDriver(read:()=>number,write:(frame:JourneyFrame,progress:number)=>void):{
 request:()=>void;snap:()=>void;destroy:()=>void;
};
