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

function setupMusicPlayer() {
  const musicSrc = './莫文蔚 - 这世界那么多人.mp3';
  const style = document.createElement('style');
  style.textContent = `
    .music-control{position:fixed;right:18px;bottom:18px;z-index:80;display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:10px 14px;border:1px solid rgba(189,146,80,.32);border-radius:999px;background:rgba(255,252,247,.88);color:#8d2f3f;box-shadow:0 16px 36px rgba(73,43,38,.14);backdrop-filter:blur(18px);font:700 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif;cursor:pointer;transition:transform .16s ease,box-shadow .16s ease,background .16s ease}
    .music-control:hover{transform:translateY(-1px);box-shadow:0 20px 42px rgba(73,43,38,.18);background:rgba(255,252,247,.96)}
    .music-control .music-icon{width:22px;height:22px;display:grid;place-items:center;border-radius:50%;color:#fff;background:linear-gradient(135deg,#a94152,#6a202d);font-size:12px;box-shadow:0 8px 18px rgba(141,47,63,.20)}
    .music-control.playing .music-icon{animation:musicSpin 2.8s linear infinite}
    @keyframes musicSpin{to{transform:rotate(360deg)}}
    @media(max-width:560px){.music-control{right:14px;bottom:14px;min-height:40px;padding:9px 12px}.music-control .music-label{display:none}}
  `;
  document.head.appendChild(style);

  const audio = document.createElement('audio');
  audio.src = musicSrc;
  audio.loop = true;
  audio.preload = 'metadata';
  audio.volume = 0.58;
  document.body.appendChild(audio);

  const button = document.createElement('button');
  button.className = 'music-control';
  button.type = 'button';
  button.setAttribute('aria-label', '播放或暂停背景音乐');
  button.innerHTML = '<span class="music-icon">♪</span><span class="music-label">开启音乐</span>';
  document.body.appendChild(button);

  const label = button.querySelector('.music-label');
  let hasTriedAutoPlay = false;

  function setState(isPlaying) {
    button.classList.toggle('playing', isPlaying);
    label.textContent = isPlaying ? '音乐播放中' : '开启音乐';
  }

  async function playMusic() {
    try {
      await audio.play();
      setState(true);
      return true;
    } catch (error) {
      setState(false);
      return false;
    }
  }

  button.addEventListener('click', async (event) => {
    event.stopPropagation();
    if (audio.paused) {
      await playMusic();
    } else {
      audio.pause();
      setState(false);
    }
  });

  const startOnFirstInteraction = async () => {
    if (hasTriedAutoPlay || !audio.paused) return;
    hasTriedAutoPlay = true;
    await playMusic();
  };

  document.addEventListener('click', startOnFirstInteraction, { once: true });
  document.addEventListener('touchstart', startOnFirstInteraction, { once: true, passive: true });
}

async function init() {
  bindMenu();
  applyGuestView();
  setupMusicPlayer();

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
