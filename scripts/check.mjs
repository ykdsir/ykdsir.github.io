import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const files=JSON.parse(read('_content/generated-files.json'));
const catalog=JSON.parse(read('_content/catalog.json'));
const legacy=JSON.parse(read('_content/legacy.json'));
const errors=[];
const fail=(file,message)=>errors.push(`${file}: ${message}`);
for(const p of catalog.posts){
  if(p.visibility!=='public'||p.privacy_reviewed!==true) fail(p.source,'unreviewed content must never be committed to this public repository');
}
const contentFiles=['_content/catalog.json','_content/legacy.json','_content/explorations/projects.json',...catalog.posts.map(p=>p.source)];
for(const file of [...files,...contentFiles]){
  if(!fs.existsSync(path.join(root,file))){fail(file,'missing');continue;}
  if(file.endsWith('.png')) continue;
  const text=read(file);
  for(const [label,re] of [['email address',/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],['phone-like number',/\b1[3-9]\d{9}\b/],['credential-like value',/\b(?:ghp_|github_pat_|sk-proj-)[A-Za-z0-9_-]{15,}/],['embedded tracker',/google-analytics|googletagmanager|leancloud|disqus|hm\.baidu/]]){
    if(re.test(text)) fail(file,`potential ${label}; review privately (matched value is intentionally not logged)`);
  }
  if(!file.endsWith('.html'))continue;
  if(/<script[^>]+src=["']https?:|<iframe|\son\w+\s*=|javascript:/i.test(text)) fail(file,'unapproved executable embed');
  if(/<img[^>]+src=["']https?:/i.test(text)) fail(file,'external image request');
  if(files.includes(file)&&(text.match(/<h1\b/g)||[]).length!==1)fail(file,'expected one page heading');
  for(const match of text.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
    const url=match[1].replaceAll('&amp;','&');
    if(!url.startsWith('/'))continue;
    let target=decodeURIComponent(url.split('?')[0]);
    if(target.endsWith('/'))target+='index.html';
    const absolute=path.resolve(root,'.'+target);
    if(!absolute.startsWith(root+path.sep)||!fs.existsSync(absolute))fail(file,`broken local reference ${url}`);
  }
}
for(const post of legacy){
  if(!files.includes(post.path.slice(1)+'index.html'))fail(post.path,'legacy URL not preserved');
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Checked ${files.length} public files, local links, ${legacy.length} historical URLs and baseline content/privacy rules. Human contextual review is still required.`);
