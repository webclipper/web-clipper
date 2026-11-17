// 生成浏览器集成验证脚本，在已登录 Notion 页面执行输出的函数。
// 会在指定父页面创建临时子页面，验证正文落库后清理；不保存登录凭据。
const fs=require('fs');
const ts=require('typescript');
let source=fs.readFileSync(require('path').join(__dirname, '../src/common/backend/services/notion/service.ts'),'utf8').replace(/^import .*;\n/gm,'').replace('export default class','class');
if (!process.argv[2]) throw Error('用法：node script/notion-integration.cjs <测试父页面 UUID> [输出文件]');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None}}).outputText;
fs.writeFileSync(process.argv[3] || '/tmp/notion-integration-browser.js',`async () => {
if(location.hostname!=='app.notion.com')throw Error('错误站点');
const log=[];
const normalize=n=>{if(!n||typeof n!=='object')return n;if(Array.isArray(n))return n.map(normalize);if(n.value?.value&&typeof n.value.role==='string')return normalize(n.value);return Object.fromEntries(Object.entries(n).map(([k,v])=>[k,normalize(v)]));};
const post=async(url,body)=>{const r=await fetch('/'+url.replace(/^\\//,''),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const text=await r.text();let data;try{data=normalize(JSON.parse(text))}catch{data=text};log.push({url,status:r.status,...(!r.ok?{error:data}:{})});if(!r.ok)throw Error(url+' '+r.status);return {data};};
const axios={put:async(url,body,config)=>{const r=await fetch(url,{method:'PUT',headers:config.headers,body});log.push({url:'上传 Markdown',status:r.status});if(!r.ok)throw Error(await r.text());}};
const generateUuid=()=>crypto.randomUUID();
${js}

// 字段方法由构造器初始化；使用轻量请求适配器保留实际保存逻辑。
axios.create=()=>({interceptors:{response:{use(){}}}});
const ICookieService='cookie',IWebRequestService='web';
const Container={get:()=>({})};
const instance=new NotionDocumentService();
Object.defineProperty(instance,'requestWithCookie',{get:()=>({post})});
try {
instance.userContent={recordMap:(await post('api/v3/getSpacesInitial',{})).data.users};
const users=instance.userContent.recordMap;
instance.userContent={recordMap:Object.values(users)[0]};
const spaceId=instance.userContent.recordMap.user_root[Object.keys(users)[0]].value.space_view_pointers[0].spaceId;
instance.repositories=[{id:'${process.argv[2]}',groupId:spaceId,pageType:'page',name:'22'}];
const result=await instance.createDocument({repositoryId:instance.repositories[0].id,title:'Web Clipper 集成验证',content:'# 集成验证\\n\\nNotion 保存链路验证。'});
const id=result.href.split('/').pop().replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/,'$1-$2-$3-$4-$5');
try {
const deadline=Date.now()+60000;
let verified=false;
while(Date.now()<deadline){
const response=await post('api/v3/loadPageChunk',{pageId:id,limit:100,cursor:{stack:[]},chunkNumber:0,verticalColumns:false});
const blocks=Object.values(response.data.recordMap?.block||{}).map(record=>record.value);
if(blocks.some(block=>block.type==='text'&&JSON.stringify(block.properties?.title).includes('Notion 保存链路验证。'))){verified=true;break;}
await new Promise(resolve=>setTimeout(resolve,1000));
}
if(!verified)throw Error('导入正文验证超时');
return {verified,result,log};
} finally {
await post('api/v3/saveTransactionsFanout',{requestId:generateUuid(),transactions:[{id:generateUuid(),spaceId,operations:[{id,table:'block',path:[],command:'update',args:{alive:false}},{id:instance.repositories[0].id,table:'block',path:['content'],command:'listRemove',args:{id}}]}]});
}
}catch(e){return {error:String(e),log}}
}`);
