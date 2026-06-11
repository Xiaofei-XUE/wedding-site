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
  ensureStylesheet('internalHeroStyle', 'assets/internal-hero.css?v=ops-clean-hero-20260611-v3');
  const home = $('#home');
  if (!home || home.dataset.internalHeroReady === '1') return;

  home.className = 'section ops-hero';
  home.innerHTML = `
    <div class="ops-hero-bg" aria-hidden="true"><span>囍</span><span>良辰</span><span>佳期</span></div>

    <div class="ops-hero-copy">
      <p class="ops-eyebrow">Wedding Ops</p>
      <div class="ops-title-card">
        <span class="ops-title-seal">囍</span>
        <h1>晓飞 <span>&amp;</span> 艾琳</h1>
        <p>备婚总控台</p>
      </div>
      <p class="ops-lead">宾客、住宿、包间、婚车、流程和风险集中管理。</p>

      <div class="ops-status-row">
        <span><b>总控</b> 风险 / 桌位 / 婚车</span>
        <span><b>重点</b> 宾客 / 住宿 / 陪酒</span>
        <span><b>执行</b> 流程 / 分工 / 联系人</span>
      </div>

      <div class="ops-brief-grid">
        <article><b>2026年7月29日 11:58</b><small>婚礼午宴</small></article>
        <article><b>沂南天龙蓝海国际大饭店</b><small>大厅 / 包间 / 住宿</small></article>
        <article><b>当前优先</b><small>桌位 · 婚车 · 宾客 · 住宿</small></article>
        <article><b>内部入口</b><small>风险 · 人员 · 联系人</small></article>
      </div>

      <div class="ops-ribbon">
        <span><b>风险</b> 执行</span>
        <span><b>桌位</b> 大厅/包间</span>
        <span><b>婚车</b> 10辆</span>
        <span><b>宾客</b> 分组</span>
      </div>

      <div class="ops-actions">
        <a href="#risks" class="ops-btn ops-btn-primary">看风险</a>
        <a href="#visual-layout" class="ops-btn">看桌位</a>
        <a href="#cars" class="ops-btn">看婚车</a>
      </div>
    </div>

    <aside class="ops-hero-media" id="photos" aria-label="婚纱照轮播">
      <figure class="ops-photo-card" id="photoCarousel">
        <div class="ops-photo-badge">Wedding Photos</div>
        <div class="ops-photo-dots" id="photoDots"></div>
        <figcaption class="ops-photo-caption"><strong>Our Wedding Photos</strong><small>晓飞 &amp; 艾琳</small></figcaption>
        <div class="ops-countdown">
          <div><strong id="d">--</strong><span>Days</span></div>
          <div><strong id="h">--</strong><span>Hours</span></div>
          <div><strong id="m">--</strong><span>Minutes</span></div>
          <div><strong id="s">--</strong><span>Seconds</span></div>
        </div>
      </figure>
    </aside>
  `;

  const oldQuick = $('#internal-quick-entry');
  if (oldQuick) oldQuick.remove();
  const quick = document.createElement('section');
  quick.id = 'internal-quick-entry';
  quick.className = 'section ops-quick-entry';
  quick.innerHTML = `
    <div class="ops-module-grid">
      <a class="ops-module" href="#risks"><span>Risk</span><strong>风险</strong><small>当天执行风险</small></a>
      <a class="ops-module" href="#honored-guests"><span>Guest</span><strong>嘉宾</strong><small>证婚人与仪式嘉宾</small></a>
      <a class="ops-module" href="#visual-layout"><span>Layout</span><strong>桌位</strong><small>大厅与包间</small></a>
      <a class="ops-module" href="#cars"><span>Cars</span><strong>婚车</strong><small>车辆与乘坐</small></a>
      <a class="ops-module" href="#guests"><span>Guests</span><strong>宾客</strong><small>分组确认</small></a>
      <a class="ops-module" href="#rooms"><span>Hotel</span><strong>住宿</strong><small>房型与入住</small></a>
      <a class="ops-module" href="#meals"><span>Meals</span><strong>包间</strong><small>晚餐与午餐</small></a>
      <a class="ops-module" href="#todo"><span>Todo</span><strong>待办</strong><small>备婚清单</small></a>
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
  summary.innerHTML = `<span>宾客：${esc(summaryText)}。</span>`;
  policy.innerHTML = guests.policy ? `<strong>规则：</strong>${esc(guests.policy)}` : '';
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
      <summary class="stage-head"><h3>${esc(stage.stage)}</h3><span class="stage-meta">${(stage.records || []).length} 项</span></summary>
      <div class="stage-list">
        ${(stage.records || []).map((record) => `
          <article class="schedule-card">
            <div class="time-pill">${esc(record.time)}</div>
            <div><h3>${esc(record.title)}</h3><p class="meta">${esc(record.people)}</p>
              <div class="detail-grid">${detailBox('事项', record.task, true)}${detailBox('物品', record.items)}${detailBox('备注', record.note)}</div>
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
