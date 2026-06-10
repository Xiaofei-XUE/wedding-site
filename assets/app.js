const $ = (selector) => document.querySelector(selector);

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
    img.src = photo.src;
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
  const html = `<div class="data-error">${esc(message)}。请检查 data 目录中的 JSON 文件。</div>`;
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

async function init() {
  bindMenu();
  applyGuestView();

  try {
    const [site, schedule, guests] = await Promise.all([
      loadJson('data/site.json'),
      loadJson('data/schedule.json'),
      loadJson('data/guests.json')
    ]);

    renderPhotos(site);
    renderCountdown(site);
    renderSchedule(schedule);
    renderGuests(guests);
  } catch (error) {
    console.error(error);
    renderError(error.message || '数据读取失败');
  }
}

init();
