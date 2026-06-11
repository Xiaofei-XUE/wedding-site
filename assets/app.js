const $ = (selector) => document.querySelector(selector);

const assetAlias = {
  'bundle/p/a.jpg': ['baa94651', 'afbd3894', 'e79118f4', '55ee889d', '.jpg'].join(''),
  'bundle/p/b.jpg': ['ec3ebafb', 'f64a4d4e', '0a4c9fff', 'b2809eba', '.jpg'].join('')
};

function resolveAssetPath(path) {
  return assetAlias[path] || path;
}

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, (match) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[match]));
}

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`读取失败：${path}`);
  return response.json();
}

function detailBox(label, value, full = false) {
  if (!value || value === '—') return '';
  return `<div class="detail-box ${full ? 'full' : ''}"><b>${esc(label)}</b>${esc(value)}</div>`;
}

function ensureStylesheet(id, href) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function bindMenu() {
  const menu = $('#menu');
  const nav = $('#nav');
  if (!menu || !nav) return;
  menu.onclick = () => nav.classList.toggle('open');
  document.querySelectorAll('.nav a').forEach((link) => {
    link.onclick = () => nav.classList.remove('open');
  });
}

function setupInternalHero() {
  if (!document.body.classList.contains('ops-page')) return;
  ensureStylesheet('internalHeroStyle', 'assets/internal-hero.css?v=isolated-internal-hero-20260611-v2');
  const home = $('#home');
  if (!home || home.dataset.internalHeroReady === '1') return;

  home.className = 'section internal-copied-hero';
  home.innerHTML = `
    <div class="hero-ornaments" aria-hidden="true"><span>囍</span><span>良辰</span><span>佳期</span></div>
    <div>
      <p class="kicker">Internal Wedding Operations</p>
      <div class="hero-title-card">
        <span class="title-seal">囍</span>
        <h1>晓飞 <span class="amp">&amp;</span> 艾琳</h1>
        <p class="hero-subline">备婚总控台 · 内部筹备看板</p>
      </div>
      <p class="lead">这里作为我们俩的内部备婚小站：集中记录宾客、住宿、包间、婚车、待办、人员分工和当天执行风险。先看关键事项，再进入各模块细节。</p>
      <div class="wedding-status-row">
        <span><b>总控</b> 风险 / 桌位 / 包间 / 婚车</span>
        <span><b>重点</b> 宾客确认 / 住宿房型 / 陪酒人员</span>
        <span><b>入口</b> 内部筹备模块集中管理</span>
      </div>
      <div class="event-brief">
        <div class="brief-item"><b>2026年7月29日 11:58</b><span>婚礼当天 · 午宴开席</span></div>
        <div class="brief-item"><b>沂南天龙蓝海国际大饭店</b><span>婚礼大厅、包间、住宿和婚车集合均围绕酒店安排</span></div>
        <div class="brief-item"><b>当前优先处理</b><span>桌位包间图、婚车座位、宾客确认、住宿房型</span></div>
        <div class="brief-item"><b>内部管理入口</b><span>风险、重要嘉宾、桌位、婚车、宾客、住宿、待办</span></div>
      </div>
      <div class="hero-ribbon">
        <span><b>风险</b> 当天执行</span>
        <span><b>桌位</b> 大厅 / 包间</span>
        <span><b>婚车</b> 10辆车队</span>
        <span><b>宾客</b> 按组确认</span>
      </div>
      <div class="actions">
        <a href="#risks" class="btn primary">查看待处理风险</a>
        <a href="#visual-layout" class="btn ghost">查看桌位包间图</a>
        <a href="#cars" class="btn ghost">查看婚车安排</a>
      </div>
    </div>
    <div class="hero-panel wedding-photo-frame" id="photos">
      <article class="photo-carousel" id="photoCarousel">
        <div class="photo-dots" id="photoDots"></div>
        <div class="photo-caption"><strong>Our Wedding Photos</strong><small>晓飞 &amp; 艾琳</small></div>
      </article>
      <div class="countdown">
        <div><strong id="d">--</strong><span>Days</span></div>
        <div><strong id="h">--</strong><span>Hours</span></div>
        <div><strong id="m">--</strong><span>Minutes</span></div>
        <div><strong id="s">--</strong><span>Seconds</span></div>
      </div>
    </div>
  `;

  const oldQuick = $('#internal-quick-entry');
  if (oldQuick) oldQuick.remove();
  const quick = document.createElement('section');
  quick.id = 'internal-quick-entry';
  quick.className = 'section internal-quick-entry';
  quick.innerHTML = `
    <div class="module-map">
      <a class="module-tile" href="#risks"><span>Priority</span><strong>待处理风险</strong><small>优先处理影响当天执行的事项。</small></a>
      <a class="module-tile" href="#honored-guests"><span>Guest</span><strong>重要嘉宾</strong><small>证婚人、仪式嘉宾和重点沟通事项。</small></a>
      <a class="module-tile" href="#visual-layout"><span>Layout</span><strong>桌位包间图</strong><small>大厅桌位、7月28日晚餐和7月29日午餐包间。</small></a>
      <a class="module-tile" href="#cars"><span>Cars</span><strong>婚车安排</strong><small>车辆、乘坐人员、司机车牌、路线与携带物品。</small></a>
      <a class="module-tile" href="#guests"><span>Guests</span><strong>宾客确认</strong><small>按新郎同学、新娘同学、亲友等分组管理。</small></a>
      <a class="module-tile" href="#rooms"><span>Hotel</span><strong>住宿安排</strong><small>入住人员、房型、拼房和到店时间。</small></a>
      <a class="module-tile" href="#meals"><span>Meals</span><strong>晚餐午餐</strong><small>7月28日晚餐、7月29日午餐及包间陪酒安排。</small></a>
      <a class="module-tile" href="#todo"><span>Todo</span><strong>备婚待办</strong><small>按未完成、进行中、已完成持续更新。</small></a>
    </div>
  `;
  home.insertAdjacentElement('afterend', quick);
  home.dataset.internalHeroReady = '1';
}

function renderPhotos(site) {
  const carousel = $('#photoCarousel');
  const dots = $('#photoDots');
  if (!carousel || !dots) return;
  const photos = site.photos || [];
  let photoIndex = 0;

  photos.forEach((photo, index) => {
    const img = document.createElement('img');
    img.src = resolveAssetPath(photo.src);
    img.alt = photo.alt || `婚纱照 ${index + 1}`;
    if (index === 0) img.className = 'active';
    carousel.appendChild(img);

    const button = document.createElement('button');
    if (index === 0) button.className = 'active';
    button.onclick = () => showPhoto(index);
    dots.appendChild(button);
  });

  function showPhoto(index) {
    if (!photos.length) return;
    photoIndex = index;
    carousel.querySelectorAll('img').forEach((img, i) => img.classList.toggle('active', i === index));
    dots.querySelectorAll('button').forEach((button, i) => button.classList.toggle('active', i === index));
  }

  if (photos.length > 1) setInterval(() => showPhoto((photoIndex + 1) % photos.length), 4200);
}

function renderCountdown(site) {
  const target = new Date(site.weddingDateTime || '2026-07-29T11:58:00').getTime();
  const day = $('#d');
  const hour = $('#h');
  const minute = $('#m');
  const second = $('#s');
  if (!day || !hour || !minute || !second) return;

  function tick() {
    const diff = Math.max(0, target - Date.now());
    day.textContent = Math.floor(diff / 86400000);
    hour.textContent = String(Math.floor(diff / 3600000) % 24).padStart(2, '0');
    minute.textContent = String(Math.floor(diff / 60000) % 60).padStart(2, '0');
    second.textContent = String(Math.floor(diff / 1000) % 60).padStart(2, '0');
  }
  setInterval(tick, 1000);
  tick();
}

function reserveWangTeacherTable() {
  const table11 = Array.from(document.querySelectorAll('#visual-layout .table-node')).find((node) => node.querySelector('strong')?.textContent.trim() === '11桌');
  if (table11) {
    table11.classList.remove('warn');
    table11.classList.add('confirmed');
    const note = table11.querySelector('small');
    if (note) note.innerHTML = '王老师<br>硕博同学';
  }
}

function renderGuests(guests) {
  const summary = $('#guestSummary');
  const policy = $('#guestPolicy');
  const groups = $('#guestGroups');
  if (!summary || !policy || !groups) return;

  const guestGroups = guests.groups || [];
  const summaryText = guestGroups.map((group) => `${group.name}${group.countLabel && !group.countLabel.includes('待') ? group.countLabel : ''}`).join('；');
  summary.innerHTML = `<span>当前记录：${esc(summaryText)}。</span><span>${esc(guests.summaryNote || '')}</span>`;
  policy.innerHTML = `<strong>宾客安排规则：</strong>${esc(guests.policy || '')}`;
  groups.innerHTML = guestGroups.map((group) => `
    <details class="guest-group" ${group.open ? 'open' : ''}>
      <summary>
        <div class="guest-group-title"><strong>${esc(group.name)}</strong><span>${esc(group.summary)}</span></div>
        <div class="guest-group-count">${esc(group.countLabel)}</div>
      </summary>
      <div class="guest-cards">
        ${(group.cards || []).map((card) => `
          <article class="guest-card">
            <div class="guest-card-head"><div class="guest-card-name">${esc(card.name)}</div><span class="badge">${esc(card.status)}</span></div>
            <div class="guest-card-meta">${(card.meta || []).map(esc).join('<br>')}</div>
          </article>
        `).join('')}
      </div>
    </details>
  `).join('');
}

function renderSchedule(schedule) {
  const container = $('#scheduleStages');
  if (!container) return;
  container.innerHTML = (schedule.stages || []).map((stage) => `
    <details class="schedule-stage">
      <summary class="stage-head"><h3>${esc(stage.stage)}</h3><span class="stage-meta">${(stage.records || []).length} 项流程</span></summary>
      <div class="stage-list">
        ${(stage.records || []).map((record) => `
          <article class="schedule-card">
            <div class="time-pill">${esc(record.time)}</div>
            <div><h3>${esc(record.title)}</h3><p class="meta">人员：${esc(record.people)}</p>
              <div class="detail-grid">${detailBox('具体事项', record.task, true)}${detailBox('所需物品', record.items)}${detailBox('注意事项', record.note)}</div>
            </div>
          </article>
        `).join('')}
      </div>
    </details>
  `).join('');
}

function setupOpsCollapsibles() {
  if (!document.body.classList.contains('ops-page')) return;
  document.querySelectorAll('.ops-section').forEach((section) => {
    const head = section.querySelector(':scope > .section-split-head');
    if (!head || section.dataset.collapsibleReady === '1') return;
    const body = document.createElement('div');
    body.className = 'ops-collapsible-body';
    const move = [];
    let node = head.nextElementSibling;
    while (node) { move.push(node); node = node.nextElementSibling; }
    move.forEach((item) => body.appendChild(item));
    section.appendChild(body);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ops-toggle';
    button.setAttribute('aria-expanded', 'true');
    button.textContent = '收起';
    head.appendChild(button);
    section.dataset.collapsibleReady = '1';
    button.addEventListener('click', () => {
      const collapsed = section.classList.toggle('is-collapsed');
      button.textContent = collapsed ? '展开' : '收起';
      button.setAttribute('aria-expanded', String(!collapsed));
    });
  });
}

function renderError(message) {
  const html = `<div class="data-error">${esc(message)}。请检查数据文件。</div>`;
  if ($('#scheduleStages')) $('#scheduleStages').innerHTML = html;
  if ($('#guestGroups')) $('#guestGroups').innerHTML = html;
}

function applyGuestView() {
  if (new URLSearchParams(location.search).get('view') === 'guest') {
    document.querySelectorAll('.internal-only').forEach((element) => element.classList.add('hidden'));
  }
}

async function init() {
  bindMenu();
  applyGuestView();
  setupInternalHero();
  setupOpsCollapsibles();
  reserveWangTeacherTable();

  try {
    const site = await loadJson('bundle/a.json');
    renderPhotos(site);
    renderCountdown(site);
    if ($('#scheduleStages')) renderSchedule(await loadJson('bundle/b.json'));
    if ($('#guestGroups')) renderGuests(await loadJson('data/guests.json'));
  } catch (error) {
    console.error(error);
    renderError(error.message || '数据读取失败');
  }
}

init();
