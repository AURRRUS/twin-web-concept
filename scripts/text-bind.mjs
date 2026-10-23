const short=/(?<![\p{L}\p{N}_])((?:через|для|без|при|во|ко|со|об|на|по|из|от|до|за|и|а|в|к|с|о))([ \t\r\n]+)(?=[\p{L}\p{N}«„])/giu;
export const bindShortWords=s=>s.replace(short,(_,word)=>word+'\u00a0');
