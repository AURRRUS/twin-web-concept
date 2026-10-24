/** Bind short Russian words in authored copy only; user input is never processed. */
export const bindShortWords=(text:string)=>text.replace(/(?<![\p{L}\p{N}_])((?:через|для|без|при|во|ко|со|об|на|по|из|от|до|за|и|а|в|к|с|о))([ \t\r\n]+)(?=[\p{L}\p{N}«„])/giu,'$1\u00a0');
