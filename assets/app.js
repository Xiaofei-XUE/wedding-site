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
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[match]));
}

function detailBox(label, value, full = false) {
  if (!value || value === '—') return '';
  return `<div class="detail-box ${full ? 'full' : ''}"><b>${esc(label)}</b>${esc(value)}</div>`;
}

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`读取失败：${path}`);
  return response.json();
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

  if (photos.length > 1) {
    setInterval(() => showPhoto((photoIndex + 1) % photos.length), 4200);
  }
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

function addGroomFamilyKpi() {
  const grid = document.querySelector('.ops-kpi');
  if (!grid || document.querySelector('[data-kpi="groom-family"]')) return;

  const card = document.createElement('article');
  card.className = 'kpi-card';
  card.dataset.kpi = 'groom-family';
  card.innerHTML = '<span>男方亲友</span><strong>待补充</strong><small>婚礼大厅为主，可作为陪酒候选</small>';
  grid.insertBefore(card, grid.children[3] || null);
}

function addHonoredGuestsSection() {
  const risks = document.querySelector('#risks');
  if (!risks || document.querySelector('#honored-guests')) return;

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

  const nav = document.querySelector('.topbar .nav');
  if (nav && !nav.querySelector('a[href="#honored-guests"]')) {
    const link = document.createElement('a');
    link.href = '#honored-guests';
    link.textContent = '重要嘉宾';
    const guestsLink = nav.querySelector('a[href="#guests"]');
    nav.insertBefore(link, guestsLink || null);
  }

  const pills = document.querySelector('.nav-pills');
  if (pills && !pills.querySelector('a[href="#honored-guests"]')) {
    const link = document.createElement('a');
    link.href = '#honored-guests';
    link.textContent = '重要嘉宾/证婚人';
    const guestsLink = pills.querySelector('a[href="#guests"]');
    pills.insertBefore(link, guestsLink || null);
  }
}

function reserveWangTeacherTable() {
  if (!document.body.classList.contains('ops-page')) return;

  const hallNodes = Array.from(document.querySelectorAll('#visual-layout .table-node'));
  const table11 = hallNodes.find((node) => node.querySelector('strong')?.textContent.trim() === '11桌');
  if (table11) {
    table11.classList.remove('warn');
    table11.classList.add('confirmed');
    const note = table11.querySelector('small');
    if (note) note.innerHTML = '王老师<br>硕博同学';
  }

  const guestSummaryBody = document.querySelector('#guests .table-panel .work-table tbody');
  if (guestSummaryBody && !guestSummaryBody.querySelector('[data-group="wang-grad"]')) {
    const row = document.createElement('tr');
    row.dataset.group = 'wang-grad';
    row.innerHTML = '<td>王老师与硕博同学</td><td>待确认</td><td>待定</td><td>大厅11桌</td><td><span class="tag done">单独预留一桌</span></td>';
    const brideClassmateRow = Array.from(guestSummaryBody.children).find((tr) => tr.children[0]?.textContent.includes('新娘同学'));
    guestSummaryBody.insertBefore(row, brideClassmateRow || guestSummaryBody.firstElementChild);
  }
}

function renderSchedule(schedule) {
  const container = $('#scheduleStages');
  if (!container) return;

  const stages = schedule.stages || [];
  container.innerHTML = stages.map((stage) => `
    <details class="schedule-stage">
      <summary class="stage-head">
        <h3>${esc(stage.stage)}</h3>
        <span class="stage-meta">${(stage.records || []).length} 项流程</span>
      </summary>
      <div class="stage-list">
        ${(stage.records || []).map((record) => `
          <article class="schedule-card">
            <div class="time-pill">${esc(record.time)}</div>
            <div>
              <h3>${esc(record.title)}</h3>
              <p class="meta">人员：${esc(record.people)}</p>
              <div class="detail-grid">
                ${detailBox('具体事项', record.task, true)}
                ${detailBox('所需物品', record.items)}
                ${detailBox('注意事项', record.note)}
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </details>
  `).join('');
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
        <div class="guest-group-title">
          <strong>${esc(group.name)}</strong>
          <span>${esc(group.summary)}</span>
        </div>
        <div class="guest-group-count">${esc(group.countLabel)}</div>
      </summary>
      <div class="guest-cards">
        ${(group.cards || []).map((card) => `
          <article class="guest-card">
            <div class="guest-card-head">
              <div class="guest-card-name">${esc(card.name)}</div>
              <span class="badge">${esc(card.status)}</span>
            </div>
            <div class="guest-card-meta">${(card.meta || []).map(esc).join('<br>')}</div>
          </article>
        `).join('')}
      </div>
    </details>
  `).join('');
}

function renderError(message) {
  const schedule = $('#scheduleStages');
  const guests = $('#guestGroups');
  const html = `<div class="data-error">${esc(message)}。请检查数据文件。</div>`;
  if (schedule) schedule.innerHTML = html;
  if (guests) guests.innerHTML = html;
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

function applyGuestView() {
  if (new URLSearchParams(location.search).get('view') === 'guest') {
    document.querySelectorAll('.internal-only').forEach((element) => element.classList.add('hidden'));
  }
}

function setupOpsCollapsibles() {
  const page = document.body;
  if (!page || !page.classList.contains('ops-page')) return;

  const defaultOpenSections = new Set(['risks', 'honored-guests', 'guests', 'visual-layout']);

  document.querySelectorAll('.ops-section').forEach((section) => {
    const head = section.querySelector(':scope > .section-split-head');
    if (!head || section.dataset.collapsibleReady === '1') return;

    const body = document.createElement('div');
    body.className = 'ops-collapsible-body';
    const move = [];
    let node = head.nextElementSibling;
    while (node) {
      move.push(node);
      node = node.nextElementSibling;
    }
    move.forEach((item) => body.appendChild(item));
    section.appendChild(body);

    const shouldOpen = defaultOpenSections.has(section.id);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ops-toggle';
    button.setAttribute('aria-expanded', String(shouldOpen));
    button.textContent = shouldOpen ? '收起' : '展开';
    head.appendChild(button);

    if (!shouldOpen) section.classList.add('is-collapsed');
    section.dataset.collapsibleReady = '1';

    button.addEventListener('click', () => {
      const collapsed = section.classList.toggle('is-collapsed');
      button.textContent = collapsed ? '展开' : '收起';
      button.setAttribute('aria-expanded', String(!collapsed));
    });
  });
}

function setupShareButtons() {
  const buttons = [$('#shareBtn'), ...document.querySelectorAll('[data-share-button]')].filter(Boolean);
  if (!buttons.length) return;

  const shareData = {
    title: '薛晓飞 & 王艾琳 · Wedding Day',
    text: '诚邀您参加我们的婚礼：2026年7月29日 11:58，沂南天龙蓝海国际大饭店。',
    url: 'https://xiaofei-xue.github.io/wedding-site/'
  };

  const isWeChat = /MicroMessenger/i.test(navigator.userAgent || '');

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareData.url);
      return true;
    } catch (error) {
      const input = document.createElement('input');
      input.value = shareData.url;
      input.setAttribute('readonly', 'readonly');
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, input.value.length);
      const copied = document.execCommand('copy');
      input.remove();
      return copied;
    }
  }

  async function handleShare(event) {
    const button = event.currentTarget;
    const oldText = button.textContent;

    if (!isWeChat && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error && error.name === 'AbortError') return;
      }
    }

    const copied = await copyLink();
    button.textContent = copied ? '链接已复制' : '长按复制网址';
    window.setTimeout(() => {
      button.textContent = oldText;
    }, 1800);

    if (isWeChat) {
      window.alert(copied
        ? '链接已复制。微信里建议直接粘贴发给亲友；也可以点右上角“…”再选择发送给朋友。'
        : `请手动复制这个链接发送给亲友：${shareData.url}`
      );
      return;
    }

    if (copied) {
      window.alert('婚礼网站链接已复制，可以粘贴发送给亲友。');
    }
  }

  buttons.forEach((button) => button.addEventListener('click', handleShare));
}

async function init() {
  bindMenu();
  applyGuestView();
  setupShareButtons();
  addGroomFamilyKpi();
  addHonoredGuestsSection();
  reserveWangTeacherTable();
  setupOpsCollapsibles();

  try {
    const site = await loadJson('bundle/a.json');
    renderPhotos(site);
    renderCountdown(site);

    if ($('#scheduleStages')) {
      const schedule = await loadJson('bundle/b.json');
      renderSchedule(schedule);
    }

    if ($('#guestGroups')) {
      const guests = await loadJson('data/guests.json');
      renderGuests(guests);
    }
  } catch (error) {
    console.error(error);
    renderError(error.message || '数据读取失败');
  }
}

init();
