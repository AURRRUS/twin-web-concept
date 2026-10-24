import content from './journeyStates.json';
import {bindShortWords} from './text';
export {sceneTargets} from './journeyFrameV3.mjs';
export const comparisonScenes=content.states.map(s=>({...s,eyebrow:bindShortWords(s.eyebrow),title:s.title.map(bindShortWords),description:s.description.map(bindShortWords),navigation:s.navigation.map(bindShortWords),media:({project:'r2JourneyProject',corpus:'r2JourneyCorpus',floor:'r2JourneyFloor',lot:'r2JourneyLot'} as const)[s.id as 'project'|'corpus'|'floor'|'lot']}));
export {comparisonFrame} from './journeyComparisonFrame.mjs';
