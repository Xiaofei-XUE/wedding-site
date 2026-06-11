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
  if (!$('#internalHomeStyle')) {
    const link = document.createElement('link');
    link.id = 'internalHomeStyle';
    link.rel = 'stylesheet';
    link.href = 'assets/internal-home.css?v=internal-photo-v3';
    document.head.appendChild(link);
  }
  const home = $('#home');
  const inner = home?.querySelector(':scope > div');
  if (!home || !inner || inner.dataset.internalHeroReady === '1') return;

  const kicker = inner.querySelector(':scope > .kicker');
  const title = inner.querySelector(':scope > h1');
  const lead = inner.querySelector(':scope > .lead');
  const kpi = inner.querySelector(':scope > .ops-kpi');
  const navPills = inner.querySelector(':scope > .nav-pills');
  const countdown = inner.querySelector(':scope > .countdown');

  inner.classList.add('internal-home-inner');
  const heroGrid = document.createElement('div');
  heroGrid.className = 'internal-hero-grid';

  const copy = document.createElement('div');
  copy.className = 'internal-hero-copy';
  [kicker, title, lead].filter(Boolean).forEach((item) => copy.appendChild(item));

  const photoPanel = document.createElement('aside');
  photoPanel.className = 'internal-hero-photo';
  photoPanel.innerHTML = `
    <article class="photo-carousel internal-photo-carousel" id="photoCarousel">
      <div class="photo-dots" id="photoDots"></div>
      <div class="photo-caption"><strong>Wedding Photos</strong><small>晓飞 & 艾琳</small></div>
    </article>
  `;
  if (countdown) {
    countdown.removeAttribute('style');
    countdown.classList.add('internal-mini-countdown');
    photoPanel.appendChild(countdown);
  }

  heroGrid.append(copy, photoPanel);
  inner.insertBefore(heroGrid, kpi || navPills || inner.firstChild);
  if (kpi) kpi.classList.add('internal-kpi-strip');
  if (navPills) navPills.classList.add('internal-nav-grid');
  inner.dataset.internalHeroReady = '1';
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
  const pills = $('.nav-pills');
  if (pills) {
    const visualLink = pills.querySelector('a[href="#visual-layout"]');
    const guestsLink = pills.querySelector('a[href="#guests"]');
    if (visualLink && guestsLink) pills.insertBefore(visualLink, guestsLink);
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

  const pills = $('.nav-pills');
  if (pills && !pills.querySelector('a[href="#cars"]')) {
    const link = document.createElement('a');
    link.href = '#cars';
    link.textContent = '婚车座位安排';
    const guestsLink = pills.querySelector('a[href="#guests"]');
    pills.insertBefore(link, guestsLink || null);
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
