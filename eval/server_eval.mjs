// Request validation can be checked without calling the external reader.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../functions/api/gemini.js',import.meta.url),'utf8');
const context=vm.createContext({Response,Request,AbortSignal,fetch:async()=>new Response('{}')});
vm.runInContext(source.replace(/export /g,'')+';globalThis.handler=onRequestPost;globalThis.other=onRequest;',context);
const settings=Object.fromEntries([['GEMINI_API_KEY','unit-test-value'],['GEMINI_MODEL','unit-test-model']]);
async function call(body,env=settings){return context.handler({request:new Request('http://localhost/api/gemini',{method:'POST',body:JSON.stringify(body)}),env});}
assert.equal((await call({},{})).status,500);
for(const body of [null,[],{}, {user:' '},{user:'x'.repeat(4001)},{user:'ok',system:'x'.repeat(8001)}])assert.equal((await call(body)).status,400);
assert.equal((await context.other()).status,405);
assert.equal((await call({user:'Hello'})).status,502);
context.fetch=async()=>new Response(JSON.stringify({candidates:[{content:{parts:[{text:'{"age":34}'}]}}]}));
const result=await call({user:'I am 34'});assert.equal(result.status,200);assert.equal((await result.json()).json.age,34);assert.equal(result.headers.get('Cache-Control'),'no-store');
console.log('Server request/response tests: all passed');
