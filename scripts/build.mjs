import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const data = JSON.parse(read('_content/catalog.json'));
const legacy = JSON.parse(read('_content/legacy.json')).sort((a,b) => b.date.localeCompare(a.date));
const explorations = JSON.parse(read('_content/explorations/projects.json'));
const aliases = JSON.parse(read('_content/legacy-aliases.json'));
const e = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const site = 'https://ykdsir.github.io';
const publicFiles = new Set(['assets/site.css','assets/site.js','assets/favicon.svg','.nojekyll',
  'images/leetcode_124_contest_fig1.png','images/leetcode_124_contest_fig2.png']);
const write = (p, value) => { fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true}); fs.writeFileSync(path.join(root,p),value); publicFiles.add(p); };
const posts = data.posts.filter(p => p.visibility === 'public' && p.privacy_reviewed === true);
for (const post of posts) {
  if (!/^[-a-z0-9]+$/.test(post.slug) || !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) throw new Error('Invalid article metadata');
  if (!post.source.startsWith('_content/posts/') || post.source.includes('..')) throw new Error('Invalid article source');
}
function layout(title, description, url, content, active='', extra='') {
  const nav=[['项目','/projects/'],['思考','/notes/'],['探索','/explore/'],['关于','/about/']];
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f7f5ee"><meta name="referrer" content="no-referrer"><title>${e(title)} · ykdsir</title><meta name="description" content="${e(description)}"><meta property="og:type" content="website"><meta property="og:title" content="${e(title)} · ykdsir"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(site+url)}"><link rel="canonical" href="${e(site+url)}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="alternate" type="application/atom+xml" title="ykdsir 的笔记" href="/atom.xml"><link rel="stylesheet" href="/assets/site.css"><script src="/assets/site.js" defer></script>${extra}</head><body><a class="skip" href="#main">跳到正文</a><header class="site-header"><a class="brand" href="/" aria-label="ykdsir 首页"><span class="brand-mark">y<span>.</span></span><span>ykdsir<span class="brand-sub">一方精神乐园</span></span></a><nav aria-label="主导航">${nav.map(([t,u])=>`<a href="${u}" ${active===t?'aria-current="page"':''}>${t}</a>`).join('')}<button class="theme-toggle" type="button" aria-label="切换深色模式" title="切换深色模式">◐</button></nav></header><main id="main">${content}</main><footer class="site-footer"><div><a class="footer-wordmark" href="/">ykdsir<span>.</span></a><p>慢慢积累，自由生长。</p></div><div class="footer-links"><a href="/archives/">旧时笔记</a><a href="/atom.xml">RSS 订阅 ↗</a><a href="https://github.com/ykdsir/ykdsir.github.io" rel="noopener noreferrer">GitHub ↗</a></div><p class="footer-small">2019—${data.updated.slice(0,4)} · 一个持续生长的个人网站</p></footer></body></html>`;
}
const heading = (label,title,desc) => `<div class="page-heading"><p class="eyebrow">${label}</p><h1>${title}</h1><p class="intro">${desc}</p></div>`;
const postRows = items => items.map(p=>`<article class="note-row" data-search="${e(p.title+' '+p.summary+' '+p.tag)}"><div class="note-date"><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time><span>${e(p.category)}</span></div><div><h3><a href="/notes/${p.slug}/">${e(p.title)}</a></h3><p>${e(p.summary)}</p></div><span class="row-arrow" aria-hidden="true">↗</span></article>`).join('');
const projectCards = () => data.projects.map(p=>`<article class="project-card ${p.style}"><div class="card-top"><span class="mono">PROJECT / ${p.number}</span><span class="status">${e(p.status)}</span></div><div class="project-symbol symbol-${p.number}" aria-hidden="true">${p.number==='01'?'<span>?</span><i>→</i><span>!</span>':p.number==='02'?'<span>{</span><i>…</i><span>}</span>':'<span>y</span><i>↗</i><span>.</span>'}</div><h2><a href="${e(p.url)}">${e(p.title)} <span>↗</span></a></h2><p>${e(p.description)}</p><div class="tags">${p.tags.map(t=>`<span>${e(t)}</span>`).join('')}</div></article>`).join('');

write('index.html',layout('在技术与生活之间，保持好奇','项目、思考与兴趣探索。一方持续生长的精神乐园。','/',`
<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="live-dot"></span> A PERSONAL FIELD NOTE</p><h1>在技术与生活之间，<br><em>保持好奇。</em></h1><p class="hero-intro">你好，我是 ykdsir。<br>在这里做一点东西，写一点想法，<br class="mobile-only">也探索那些暂时没有用的兴趣。</p><div class="hero-links"><a class="button dark" href="/projects/">看看在做什么 <span>↗</span></a><a class="text-link" href="/notes/">读一篇笔记 <span>→</span></a></div><p class="hero-footnote">始于 2019 · 重新出发，慢慢生长</p></div><div class="field-card" aria-hidden="true"><div class="field-header"><span>FIELD NOTES</span><span>NO. 001</span></div><div class="orbit"><span class="orbit-word">好奇心</span><span class="orbit-dot dot-a"></span><span class="orbit-dot dot-b"></span><span class="orbit-dot dot-c"></span><span class="orbit-label label-a">构建 / BUILD</span><span class="orbit-label label-b">思考 / THINK</span><span class="orbit-label label-c">探索 / EXPLORE</span></div><div class="field-bottom"><span>小小的尝试，也值得留下。</span><span>↗</span></div><div class="paper-tab">KEEP WANDERING</div></div></section>
<section class="section"><div class="section-heading"><div><p class="eyebrow">01 / THINGS TO MAKE</p><h2>把想法，做成一点东西。</h2></div><a class="text-link" href="/projects/">全部项目 <span>↗</span></a></div><div class="project-grid">${projectCards()}</div></section>
<section class="section notes-section"><div class="section-heading"><div><p class="eyebrow">02 / THINGS TO THINK ABOUT</p><h2>一些正在成形的想法。</h2></div><a class="text-link" href="/notes/">全部笔记 <span>↗</span></a></div><div class="note-list">${postRows(posts)}</div></section>
<section class="explore-banner"><div><p class="eyebrow">03 / FOLLOW YOUR CURIOSITY</p><h2>留一天，<br>给一个陌生的问题。</h2><p>科技、社会、人文、生活。<br>12 张探索卡，不必精通，也可以开始。</p><a class="button dark" href="/explore/">抽一个探索题目 <span>↗</span></a></div><div class="banner-art" aria-hidden="true"><span class="art-one">观察</span><span class="art-two">尝试</span><span class="art-three">理解</span><span class="art-caption">ONE DAY. ONE QUESTION.</span></div></section>
<aside class="small-note"><span class="asterisk">✳</span><p>这里不急着给出所有答案。<br>有作品，有笔记，也允许有未完成的问题。</p><a class="text-link" href="/about/">关于这片小天地 ↗</a></aside>`));

write('projects/index.html',layout('项目','一些可以打开、尝试和继续改进的小项目。','/projects/',`${heading('PROJECTS / 工作台','让想法有一个形状。','小工具、学习记录与设计实践。可运行的作品留在这里，新的想法慢慢生长。')}<div class="project-grid full-projects">${projectCards()}</div><p class="section-note">这里只展示有实际页面或内容的项目。尚未实现的想法，先保留为问题。</p>`,'项目'));
write('notes/index.html',layout('思考与笔记','关于技术、学习与日常观察的笔记。','/notes/',`${heading('NOTES / 随手记','留下一点，想明白的事。','不急着把每个问题写成结论。先记录观察，再留下可以继续追问的地方。')}<div class="search-bar"><label for="note-search">搜索笔记</label><input type="search" id="note-search" placeholder="试试「好奇心」或「学习」" autocomplete="off"><p id="search-count" role="status" aria-live="polite">${posts.length} 篇笔记</p></div><div class="note-list">${postRows(posts)}</div><p id="no-results" hidden>暂时没有匹配的笔记。换个词试试？</p><div class="archive-callout"><span class="mono">2019—2020</span><div><h2>从前的算法笔记</h2><p>13 篇旧文章，保留着学习时的思路。</p></div><a class="text-link" href="/archives/">翻一翻旧时笔记 ↗</a></div>`,'思考'));

for (const p of posts) {
  const body=read(p.source);
  if (/<script|<iframe|\son\w+\s*=|javascript:/i.test(body)) throw new Error('Unsafe article HTML: '+p.source);
  write(`notes/${p.slug}/index.html`,layout(p.title,p.summary,`/notes/${p.slug}/`,`<article class="article"><a class="back-link" href="/notes/">← 所有笔记</a><header class="article-header"><p class="eyebrow">${e(p.category)} / ${e(p.tag)}</p><h1>${e(p.title)}</h1><p class="article-meta"><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time> · ykdsir${p.provenance==='editorial'?' · AI 协助整理':''}</p></header><div class="prose">${body}</div><div class="article-end"><span>— 写到这里，留一点余地。</span><a href="/notes/">继续阅读 →</a></div></article>`,'思考'));
}

const filters=['全部','科技','社会','人文','生活'];
write('explore/index.html',layout('一天探索实验室','12 个一天可以尝试的小项目，给科技、社会、人文与生活一点好奇心。','/explore/',`${heading('EXPLORATIONS / 一天实验室','今天，好奇什么？','给一个问题半天到一天，留下一个小小的成果。也可以只做卡片里的八分钟起步。')}<div class="explore-toolbar"><div class="filters" role="group" aria-label="探索主题">${filters.map((f,i)=>`<button type="button" data-filter="${f}" aria-pressed="${i===0}">${f}</button>`).join('')}</div><button class="button outline" id="random-explore" type="button">帮我选一个 ↗</button></div><p class="result-count" id="explore-count" aria-live="polite">12 个可探索的题目</p><div class="exploration-grid">${explorations.map((x,i)=>`<article class="exploration-card" data-category="${x.category}" data-id="${x.id}"><div class="card-top"><span class="eyebrow">${x.category}</span><span class="mono">${String(i+1).padStart(2,'0')}</span></div><h2>${e(x.title)}</h2><p>${e(x.question)}</p><div class="explore-meta"><span>${e(x.duration)}</span><span>一天小项目</span></div><details><summary>展开探索步骤 <span aria-hidden="true">＋</span></summary><div class="exploration-detail"><p class="output"><strong>带走一个成果</strong><br>${e(x.output)}</p><ol>${x.steps.map(s=>`<li>${e(s)}</li>`).join('')}</ol><div class="tiny-start"><strong>只想试 8 分钟？</strong><p>${e(x.small)}</p></div><p class="explore-note">${e(x.note)}</p></div></details></article>`).join('')}</div><p class="section-note">这些是供选择的练习题目，不是已经完成的个人经历。不需要打卡，也不需要全部做完。</p>`,'探索'));

write('about/index.html',layout('关于','ykdsir 的个人网站：构建、思考与探索。','/about/',`${heading('ABOUT / 关于这里','一方精神乐园。','写代码，也读书、看电影。对技术和日常生活保持好奇。')}<div class="about-layout"><div class="prose"><h2>你好，我是 ykdsir。</h2><p>这个网站从算法题解开始，现在想给更多东西留出空间：能用的小工具，值得留住的思考，以及跨出熟悉领域的一点探索。</p><p>关注搜索、推荐、AI 与交互设计，也愿意把目光移向书籍、电影、城市和游戏。在理解一个系统怎么运转之外，也想看看它怎样改变人的体验。</p><h2>这里会有什么</h2><p><strong>项目</strong>里放可打开的作品与记录；<strong>思考</strong>里留下问题、方法和观察；<strong>探索</strong>提供可以动手开始的小练习。旧的算法文章仍然在<a href="/archives/">档案</a>里。</p><h2>关于表达与边界</h2><p>本站只分享适合公开的内容。借助 AI 整理的文章会标注；构想、练习与实际完成的项目会分开说明。这里不展示私人聊天记录或他人的私人信息。</p><p>本站页面不主动设置统计追踪、广告或评论插件。主题偏好只保存在当前浏览器；托管服务仍可能记录常规访问日志。</p></div><aside class="about-aside"><span class="big-y">y.</span><p class="eyebrow">BUILD · THINK · EXPLORE</p><p>做一点东西。<br>把一个问题想清楚。<br>再去看看别的风景。</p><a class="text-link" href="https://github.com/ykdsir" rel="noopener noreferrer">GitHub ↗</a><a class="text-link" href="/atom.xml">通过 RSS 慢慢读 ↗</a></aside></div>`,'关于'));

const archiveRows=legacy.map(x=>`<li><time datetime="${x.date}">${x.date}</time><a href="${e(x.path)}">${e(x.title)}</a><span aria-hidden="true">↗</span></li>`).join('');
const archives=layout('旧时笔记','2019—2020 年的 13 篇历史文章。','/archives/',`${heading('ARCHIVE / 2019—2020','来时的路，也留着。','保留原始日期与文章链接。旧代码和外部题目链接可能需要按今天的环境重新验证。')}<ul class="archive-list">${archiveRows}</ul>`,'思考');
write('archives/index.html',archives);
for (const alias of aliases) {
  if(alias==='archives/index.html')continue;
  write(alias,layout('旧时笔记','旧分类已汇总到文章档案。','/archives/',`${heading('ARCHIVE','这页搬到档案里了。','旧文章仍然保留。')}<p><a class="button dark" href="/archives/">打开文章档案 →</a></p>`,'思考','<meta http-equiv="refresh" content="0;url=/archives/">'));
}
for(const post of legacy){
  let body=post.body.replace(/<h1\b/g,'<h2').replace(/<\/h1>/g,'</h2>');
  body=body.replace(/<img\b[^>]*src="(https?:[^\"]+)"[^>]*>/gi,(_,url)=>`<p><a href="${e(url)}" rel="noopener noreferrer">查看原始题目配图（外部链接）↗</a></p>`);
  write(post.path.slice(1)+'index.html',layout(post.title,'历史算法笔记 · '+post.date,post.path,`<article class="article legacy"><a class="back-link" href="/archives/">← 旧时笔记</a><header class="article-header"><p class="eyebrow">ARCHIVE / 历史文章</p><h1>${e(post.title)}</h1><p class="article-meta">${post.date} · ykdsir</p><p class="archive-notice">历史存档，保留原文与代码；题目链接和运行环境可能已经变化。</p></header><div class="prose">${body}</div></article>`,'思考'));
}
write('404.html',layout('没有找到这一页','回到首页，继续探索。','/404.html',`${heading('404 / 走到了小路尽头','这一页，还没有长出来。','你可以回到首页，或者从旧时笔记里找找。')}<div class="hero-links"><a class="button dark" href="/">回到首页 →</a><a class="text-link" href="/archives/">打开旧时笔记 ↗</a></div>`,'','<meta name="robots" content="noindex">'));
const feed=[...posts.map(p=>({title:p.title,date:p.date,path:`/notes/${p.slug}/`,summary:p.summary})),...legacy.map(p=>({...p,summary:'历史文章 · '+p.title}))].sort((a,b)=>b.date.localeCompare(a.date));
write('atom.xml',`<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>ykdsir · 一方精神乐园</title><id>${site}/</id><link href="${site}/"/><link href="${site}/atom.xml" rel="self"/><updated>${data.updated}T00:00:00+08:00</updated><author><name>ykdsir</name></author>${feed.map(p=>`<entry><title>${e(p.title)}</title><id>${e(site+p.path)}</id><link href="${e(site+p.path)}"/><updated>${p.date}T00:00:00+08:00</updated><summary>${e(p.summary)}</summary></entry>`).join('')}</feed>`);
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/projects/','/notes/','/explore/','/about/','/archives/',...posts.map(p=>`/notes/${p.slug}/`),...legacy.map(p=>p.path)].map(u=>`<url><loc>${e(site+u)}</loc></url>`).join('')}</urlset>`);
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
// Keep committed root output compatible with the existing Pages publishing branch.
// dist is a disposable, allowlisted preview; never copy the whole repository.
fs.rmSync(path.join(root,'dist'),{recursive:true,force:true});
for(const f of publicFiles){const out=path.join(root,'dist',f);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(root,f),out);}
fs.writeFileSync(path.join(root,'_content/generated-files.json'),JSON.stringify([...publicFiles].sort(),null,2)+'\n');
console.log(`Built ${posts.length} new notes, ${legacy.length} historical articles and ${explorations.length} exploration cards.`);
