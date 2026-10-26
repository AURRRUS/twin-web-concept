import test from 'node:test';
import assert from 'node:assert/strict';
import {modeOf,route,contrast,validateTask,inspectAdded,generated,root} from './twin-system.mjs';
import fs from 'node:fs';
test('ordinary task modes and explicit preparation precedence',()=>{assert.equal(modeOf('Сайт Twin: исправь карточку'),'execute');assert.equal(modeOf('подготовь ТЗ: исправь карточку'),'prepare');assert.equal(modeOf('сделай ревью'),'review');assert.equal(modeOf('сайт Twin'),'prepare');});
test('routing is selective',()=>{assert.deepEqual(route('исправь опечатку'),['frontend-engineer']);assert.ok(route('анимация раскрытия').includes('code-motion'));});
test('publication and motion contracts are required',()=>{const t=JSON.parse(fs.readFileSync(root+'/.twin/tasks/JRN-001/task.json'));assert.deepEqual(validateTask(t),[]);delete t.publication;assert.ok(validateTask(t).length);t.motionContract='';assert.ok(validateTask(t).includes('Motion contract required'));});
test('ready rejects unresolved fields',()=>{const t=JSON.parse(fs.readFileSync(root+'/.twin/tasks/JRN-001/task.json'));t.outcome='TODO';assert.ok(validateTask(t).length);});
test('guard catches literal styles and requires documented exception',()=>{const lines=[{file:'src/Card.astro',text:'font-size: 9px; color: #eee;'}];assert.equal(inspectAdded(lines).length,2);assert.equal(inspectAdded(lines,[{path:'src/Card.astro',property:'font-size',value:'9px',reason:'test',decision:'D-test'}]).length,1);assert.deepEqual(inspectAdded([{file:'x',text:'font-size:var(--ts-body); color:inherit;'}]),[]);});
test('contrast correctly distinguishes equal and contrasting colors',()=>{assert.equal(contrast('#ffffff','#ffffff'),1);assert.ok(contrast('#000000','#ffffff')>20);});
test('token generation is deterministic and read only',()=>{const before=fs.statSync(root+'/.twin/tokens.json').mtimeMs;assert.deepEqual(generated(),generated());assert.equal(fs.statSync(root+'/.twin/tokens.json').mtimeMs,before);});

test('review-only wording cannot turn into execution',()=>{assert.equal(modeOf('Проверь, не исправляй сайт'),'review');assert.equal(modeOf('исправь систему переключения'),'execute');});
