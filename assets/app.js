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

function setupInternalHero() {
  if (!document.body.classList.contains('ops-page')) return;
  ensureStylesheet('weddingThemeStyle', 'assets/wedding-theme.css?v=copy-public-hero-20260611');
  ensureStylesheet('internalHomeStyle', 'assets/internal-home.css?v=copy-public-hero-20260611');

  const home = $('#home');
  if (!home || home.dataset.internalHeroReady === '1') return;
  home.className = 'section hero wedding-hero internal-copied-hero';
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
  quick.className = 'section overview-section internal-quick-entry';
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

function addHonoredGuestsSection() {
  const risks = $('#risks');
  if (!risks || $('#honored-guests')) return;

  const section = document.createElement('section');
  section.id = 'honored-guests';
  section.className = 'section ops-section';
  section.innerHTML = `
    <div class="section-split-head">
      <div class="heading"><p class="kicker">Honored Guests</p><h2>重要嘉宾与仪式角色</h2></div>
      <p class="section-note">证婚人属于婚礼仪式核心角色，单独管理，不放入普通人员分工表。</p>
    </div>
    <div class="table-panel">
      <div class="table-title"><h3>证婚人与仪式嘉宾</h3><span>证婚人单独预留大厅11桌，与硕博同学同桌</span></div>
      <table class="work-table">
        <thead><tr><th>角色</th><th>人员</th><th>仪式职责</th><th>桌位安排</th><th>当前状态</th><th>下一步</th></tr></thead>
        <tbody>
          <tr><td>证婚人</td><td>王老师</td><td>婚礼仪式证婚发言，见证新人婚礼仪式</td><td>大厅11桌 · 王老师/硕博同学桌</td><td><span class="tag wait">重点沟通</span></td><td>确认是否邀请、发言时长、主持人串词、上台时间及同桌硕博同学名单</td></tr>
        </tbody>
      </table>
    </div>
  `;
  risks.insertAdjacentElement('afterend', section);
}

function moveVisualLayoutForward() {
  const visual = $('#visual-layout');
  const honored = $('#honored-guests');
  const risks = $('#risks');
  if (!visual) return;
  if (honored) honored.insertAdjacentElement('afterend', visual);
  else if (risks) risks.insertAdjacentElement('afterend', visual);

  const nav = $('.topbar .nav');
  if (nav) {
    const visualLink = nav.querySelector('a[href="#visual-layout"]');
    const guestsLink = nav.querySelector('a[href="#guests"]');
    if (visualLink && guestsLink) nav.insertBefore(visualLink, guestsLink);
  }
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

function carSeatRow(vehicle, use, people, driver, items, route, status, tag = 'wait') {
  return `<tr><td>${vehicle}</td><td>${use}</td><td>${people}</td><td>${driver}</td><td>${items}</td><td>${route}</td><td><span class="tag ${tag}">${status}</span></td></tr>`;
}

function addCarSeatingSection() {
  if (!document.body.classList.contains('ops-page') || $('#cars')) return;
  const visual = $('#visual-layout');
  const guests = $('#guests');
  const anchor = visual || guests;
  if (!anchor) return;

  const fullRoute = '蓝海酒店 → 县城朝阳公园取景 → 绕一圈 → 回婚礼酒店过门';
  const followRoute = '跟随主婚车';
  const section = document.createElement('section');
  section.id = 'cars';
  section.className = 'section ops-section';
  section.innerHTML = `
    <div class="section-split-head">
      <div class="heading"><p class="kicker">Cars</p><h2>婚车座位安排表</h2></div>
      <p class="section-note">车队共10辆：劳斯莱斯古斯特1辆、奔驰E300婚车8辆、录像车1辆。每辆车一行，同时记录乘坐人员、司机车牌、携带物品和路线。</p>
    </div>
    <div class="table-panel">
      <div class="table-title"><h3>婚车安排合并表</h3><span>集合/发嫁/到达/婚礼酒店均为蓝海酒店；后续重点补司机、车牌和具体乘坐人员</span></div>
      <table class="work-table">
        <thead><tr><th>车辆</th><th>用途</th><th>乘坐人员</th><th>司机/车牌</th><th>携带物品</th><th>路线与时间</th><th>状态/备注</th></tr></thead>
        <tbody>
          ${carSeatRow('1号车 · 劳斯莱斯古斯特', '主婚车', '新郎、新娘', '待补充', '手捧花、戒指盒等需另确认', fullRoute, '主婚车已定；确认物品保管人', 'done')}
          ${carSeatRow('2号车 · 奔驰E300', '跟车', '伴郎/伴娘优先', '待补充', '堵门红包、婚鞋、急救包、补妆包', followRoute, '座位待排')}
          ${carSeatRow('3号车 · 奔驰E300', '跟车', '伴郎/伴娘/随行人员待排', '待补充', '随身物品', followRoute, '座位待排')}
          ${carSeatRow('4号车 · 奔驰E300', '跟车', '双方父母或重要亲友待排', '待补充', '胸花、红包、随身物品', followRoute, '人员待补充')}
          ${carSeatRow('5号车 · 奔驰E300', '跟车', '双方父母或重要亲友待排', '待补充', '随身物品', followRoute, '人员待补充')}
          ${carSeatRow('6号车 · 奔驰E300', '跟车', '男方亲友/工作人员待排', '待补充', '备用物料', followRoute, '人员待补充')}
          ${carSeatRow('7号车 · 奔驰E300', '跟车', '女方亲友/工作人员待排', '待补充', '备用物料', followRoute, '人员待补充')}
          ${carSeatRow('8号车 · 奔驰E300', '跟车', '机动亲友待排', '待补充', '备用物料', followRoute, '机动预留', 'progress')}
          ${carSeatRow('9号车 · 奔驰E300', '跟车/机动', '机动亲友、物料或工作人员', '待补充', '备用物料', followRoute, '机动预留', 'progress')}
          ${carSeatRow('10号车 · 录像车', '录像与拍摄保障', '录像团队', '待补充', '拍摄设备', '跟随/提前机位，按摄影摄像需求调整', '录像车已列入', 'done')}
        </tbody>
      </table>
    </div>
  `;
  anchor.insertAdjacentElement('afterend', section);

  const nav = $('.topbar .nav');
  if (nav && !nav.querySelector('a[href="#cars"]')) {
    const link = document.createElement('a');
    link.href = '#cars';
    link.textContent = '婚车';
    const guestsLink = nav.querySelector('a[href="#guests"]');
    nav.insertBefore(link, guestsLink || null);
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

function setupShareButtons() {
  const buttons = [$('#shareBtn'), ...document.querySelectorAll('[data-share-button]')].filter(Boolean);
  if (!buttons.length) return;
  const shareData = { title: '薛晓飞 & 王艾琳 · Wedding Day', text: '诚邀您参加我们的婚礼：2026年7月29日 11:58，沂南天龙蓝海国际大饭店。', url: 'https://xiaofei-xue.github.io/wedding-site/' };
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent || '');
  async function copyLink() {
    try { await navigator.clipboard.writeText(shareData.url); return true; }
    catch {
      const input = document.createElement('input');
      input.value = shareData.url; input.setAttribute('readonly', 'readonly'); input.style.position = 'fixed'; input.style.left = '-9999px';
      document.body.appendChild(input); input.select(); input.setSelectionRange(0, input.value.length);
      const copied = document.execCommand('copy'); input.remove(); return copied;
    }
  }
  buttons.forEach((button) => button.addEventListener('click', async () => {
    const oldText = button.textContent;
    if (!isWeChat && navigator.share) {
      try { await navigator.share(shareData); return; } catch (error) { if (error?.name === 'AbortError') return; }
    }
    const copied = await copyLink();
    button.textContent = copied ? '链接已复制' : '长按复制网址';
    window.setTimeout(() => { button.textContent = oldText; }, 1800);
    if (isWeChat) window.alert(copied ? '链接已复制。微信里建议直接粘贴发给亲友；也可以点右上角“…”再选择发送给朋友。' : `请手动复制这个链接发送给亲友：${shareData.url}`);
    else if (copied) window.alert('婚礼网站链接已复制，可以粘贴发送给亲友。');
  }));
}

async function init() {
  bindMenu();
  applyGuestView();
  setupShareButtons();
  addHonoredGuestsSection();
  moveVisualLayoutForward();
  addCarSeatingSection();
  reserveWangTeacherTable();
  setupOpsCollapsibles();
  try {
    const site = await loadJson('bundle/a.json');
    setupInternalHero();
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
