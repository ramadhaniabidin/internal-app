// =========================
// Helpers & Global State
// =========================
const $a = (sel, parent = document) => parent.querySelector(sel);

const state = {
    kpis: { revenue: 0, orders: 0, conversion: 0, aov: 0 },
    series: {
        sales: [],
        orders: [],
        traffic: { labels: ['Direct', 'Organic', 'Paid', 'Referral'], values: [] },
        products: { labels: [], values: [] }
    }
};

const currency = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const numberFmt = new Intl.NumberFormat('id-ID');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================
// Collapsible groups (sidebar)
// =========================
function initNavGroups() {
    document.querySelectorAll('.nav-group').forEach(group => {
        setGroupOpen(group, false, false);
    });

    document.querySelectorAll('.nav-group .nav-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.nav-group');
            const willOpen = !group.classList.contains('open');
            setGroupOpen(group, willOpen, true);
        });
    });
}
function setGroupOpen(group, open, persist) {
    const btn = group.querySelector('.nav-toggle');
    const submenu = group.querySelector('.submenu');
    group.classList.toggle('open', open);
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (submenu) submenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (persist && group.dataset.group) {
        localStorage.setItem('nav-open-' + group.dataset.group, open ? '1' : '0');
    }
}

// =========================
// Colors from CSS vars
// =========================
function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// =========================
// Data Generation (Mock)
// =========================
function randomSeries(n, base = 100, volatility = 0.2) {
    let v = base, out = [];
    for (let i = 0; i < n; i++) {
        v = Math.max(0, v + (Math.random() - 0.5) * base * volatility);
        out.push(Math.round(v));
    }
    return out;
}
function sampleTraffic() {
    const a = Math.random() * 30 + 25;
    const b = Math.random() * 30 + 20;
    const c = Math.random() * 20 + 10;
    const d = Math.max(100 - (a + b + c), 5);
    const sum = a + b + c + d;
    return [a, b, c, d].map(x => Math.round(x / sum * 100));
}
function sampleProducts(k = 6) {
    const labels = Array.from({ length: k }, (_, i) => `SKU‑$a{100 + i}`);
    const values = Array.from({ length: k }, () => Math.round(Math.random() * 500 + 60));
    return { labels, values };
}
function generateAll() {
    const n = 30;
    state.series.sales = randomSeries(n, 3_000_000, .35).map(x => x * 10);
    state.series.orders = randomSeries(n, 300, .28);
    state.series.traffic.values = sampleTraffic();
    state.series.products = sampleProducts(7);

    const rev = state.series.sales.reduce((a, b) => a + b, 0);
    const ord = state.series.orders.reduce((a, b) => a + b, 0);
    const con = (Math.random() * 4 + 1.2);
    const aov = rev / Math.max(1, ord);

    state.kpis = {
        revenue: rev,
        orders: Math.round(ord / n),
        conversion: con,
        aov: aov
    };
}

// =========================
// KPI Counters & Trend
// =========================
function animateNumber(el, from, to, fmt = (v) => v, duration = 800) {
    if (reducedMotion || !el) { if (el) el.textContent = fmt(to); return; }
    const start = performance.now();
    function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const v = from + (to - from) * eased;
        el.textContent = fmt(v);
        if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
function updateKPIs() {
    const { revenue, orders, conversion, aov } = state.kpis;
    animateNumber($a('#revValue'), 0, revenue, v => currency.format(Math.round(v)));
    animateNumber($a('#ordValue'), 0, orders, v => numberFmt.format(Math.round(v)));
    animateNumber($a('#conValue'), 0, conversion, v => `$a{v.toFixed(2)}%`);
    animateNumber($a('#aovValue'), 0, aov, v => currency.format(Math.round(v)));

    const trend = (id) => {
        const node = $a(id); if (!node) return;
        const up = Math.random() > .35;
        const delta = (Math.random() * 4).toFixed(1);
        node.classList.toggle('text-success', up);
        node.classList.toggle('text-danger', !up);
        node.innerHTML = (up ? '▲ ' : '▼ ') + `<span>$a{up ? '+' : '-'}$a{delta}%</span>`;
    };
    trend('#revTrend'); trend('#ordTrend'); trend('#conTrend'); trend('#aovTrend');
}

// =========================
// Canvas Utils & Charts (unchanged)
// =========================
function setupCanvas(canvas) {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
}
function clearCanvas(ctx, canvas) {
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
}
function hexToRgba(c, a) {
    c = c.trim();
    if (c.startsWith('rgb')) return c.replace(')', `, $a{a})`).replace('rgb(', 'rgba(');
    const m = c.replace('#', '');
    const bigint = parseInt(m.length === 3 ? m.split('').map(x => x + x).join('') : m, 16);
    const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
    return `rgba($a{r}, $a{g}, $a{b}, $a{a})`;
}
function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
}
function drawSpark(canvas, data, color) {
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    const { width, height } = canvas.getBoundingClientRect();
    clearCanvas(ctx, canvas);
    const p = 6, w = width - p * 2, h = height - p * 2;
    const min = Math.min(...data), max = Math.max(...data);
    const scaleX = (i) => p + (i / (data.length - 1)) * w;
    const scaleY = (v) => p + h - ((v - min) / Math.max(1, (max - min))) * h;
    const g = ctx.createLinearGradient(0, p, 0, h + p);
    g.addColorStop(0, hexToRgba(color, .45));
    g.addColorStop(1, hexToRgba(color, 0));
    ctx.beginPath();
    data.forEach((v, i) => { const x = scaleX(i), y = scaleY(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.stroke();
    ctx.lineTo(scaleX(data.length - 1), h + p);
    ctx.lineTo(scaleX(0), h + p);
    ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    const x = scaleX(data.length - 1), y = scaleY(data[data.length - 1]);
    ctx.beginPath(); ctx.arc(x, y, 2.8, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
}
function drawLineArea(canvas, series1, series2) {
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    const { width, height } = canvas.getBoundingClientRect();
    clearCanvas(ctx, canvas);
    const pad = 20, w = width - pad * 2, h = height - pad * 2;
    const n = Math.max(series1.length, series2.length);
    const min = 0;
    const max = Math.max(Math.max(...series1), Math.max(...series2)) * 1.15;
    const accent = cssVar('--accent');
    const ring = cssVar('--ring');
    const muted = '#6c757d';
    ctx.strokeStyle = hexToRgba(muted, .25);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    for (let i = 0; i <= 4; i++) { const y = pad + (i / 4) * h; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + w, y); ctx.stroke(); }
    ctx.setLineDash([]);
    const scaleX = (i) => pad + (i / (n - 1)) * w;
    const scaleY = (v) => pad + h - ((v - min) / (max - min)) * h;
    const grad = ctx.createLinearGradient(0, pad, 0, pad + h);
    grad.addColorStop(0, hexToRgba(accent, .35));
    grad.addColorStop(1, hexToRgba(accent, 0));
    ctx.beginPath();
    series1.forEach((v, i) => { const x = scaleX(i), y = scaleY(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.lineTo(scaleX(n - 1), pad + h);
    ctx.lineTo(scaleX(0), pad + h);
    ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath();
    series1.forEach((v, i) => { const x = scaleX(i), y = scaleY(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.lineWidth = 2.2; ctx.strokeStyle = accent; ctx.stroke();
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    series2.forEach((v, i) => { const x = scaleX(i), y = scaleY(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.lineWidth = 2; ctx.strokeStyle = ring; ctx.stroke();
    ctx.setLineDash([]);
}
function drawDonut(canvas, values, colors) {
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    const { width, height } = canvas.getBoundingClientRect();
    clearCanvas(ctx, canvas);
    const cx = width / 2, cy = height / 2;
    const rOuter = Math.min(width, height) / 2 - 14;
    const rInner = rOuter * 0.62;
    const sum = values.reduce((a, b) => a + b, 0);
    let start = -Math.PI / 2;
    values.forEach((v, i) => {
        const angle = (v / sum) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, rOuter, start, start + angle);
        ctx.arc(cx, cy, rInner, start + angle, start, true);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        start += angle;
    });
    ctx.fillStyle = '#212529';
    ctx.font = '700 16px ui-sans-serif, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Traffic', cx, cy - 2);
    ctx.fillStyle = '#6c757d';
    ctx.font = '400 12px ui-sans-serif, system-ui';
    ctx.fillText(values.map(v => v + '%').join(' / '), cx, cy + 16);
}
function drawBars(canvas, labels, values, color) {
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    const { width, height } = canvas.getBoundingClientRect();
    clearCanvas(ctx, canvas);
    const pad = 24, w = width - pad * 2, h = height - pad * 2;
    const max = Math.max(...values) * 1.15;
    const barW = w / values.length * 0.6;
    ctx.strokeStyle = hexToRgba('#6c757d', .25);
    ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) { const y = pad + (i / 3) * h; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + w, y); ctx.stroke(); }
    ctx.setLineDash([]);
    values.forEach((v, i) => {
        const x = pad + (i + 0.5) * (w / values.length) - barW / 2;
        const y = pad + h - (v / max) * h;
        const bh = (v / max) * h;
        const g = ctx.createLinearGradient(0, y, 0, y + bh);
        g.addColorStop(0, hexToRgba(color, .9));
        g.addColorStop(1, hexToRgba(color, .35));
        roundRect(ctx, x, y, barW, bh, 8);
        ctx.fillStyle = g; ctx.fill();
        ctx.fillStyle = '#6c757d';
        ctx.font = '12px ui-sans-serif, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barW / 2, pad + h + 16);
    });
}

// =========================
// Orders Table (Mock)
// =========================
function fillOrders() {
    const tbody = $a('#ordersBody'); if (!tbody) return;
    tbody.innerHTML = '';
    const statuses = [
        { name: 'Paid', cls: 'text-bg-success' },
        { name: 'Pending', cls: 'text-bg-warning' },
        { name: 'Refund', cls: 'text-bg-danger' },
    ];
    for (let i = 0; i < 7; i++) {
        const id = 10000 + Math.floor(Math.random() * 90000);
        const cust = ['Adi', 'Budi', 'Citra', 'Dewi', 'Eka', 'Farah', 'Gilang'][Math.floor(Math.random() * 7)];
        const total = currency.format(Math.round(Math.random() * 5_000_000 + 150_000));
        const st = statuses[Math.floor(Math.random() * statuses.length)];
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>#$a{id}</td>
      <td>$a{cust}</td>
      <td>$a{total}</td>
      <td><span class="badge $a{st.cls}">$a{st.name}</span></td>
    `;
        tbody.appendChild(tr);
    }
}

// =========================
// Draw All
// =========================
function drawAll() {
    updateKPIs();
    const s1 = randomSeries(24, 100, .45);
    const s2 = randomSeries(24, 80, .45);
    const s3 = randomSeries(24, 60, .45);
    const s4 = randomSeries(24, 90, .45);
    drawSpark($a('#spark1'), s1, cssVar('--accent'));
    drawSpark($a('#spark2'), s2, cssVar('--ring'));
    drawSpark($a('#spark3'), s3, cssVar('--accent-2'));
    drawSpark($a('#spark4'), s4, cssVar('--accent-3'));
    drawLineArea($a('#salesChart'), state.series.sales, state.series.orders.map(v => v * 10_000));
    drawDonut($a('#trafficChart'), state.series.traffic.values, [cssVar('--accent'), cssVar('--ring'), cssVar('--accent-2'), cssVar('--accent-3')]);
    drawBars($a('#productsChart'), state.series.products.labels, state.series.products.values, cssVar('--ring'));
    fillOrders();
}

// =========================
// Current user helpers
// =========================
async function getCurrentUser() {
    try {
        const response = await fetch('/Account/GetCurrentUser');
        const data = await response.json();
        if (data.isAuthenticated) {
            return {
                name: data.fullName,
                email: data.email,
                role: data.role,
                /*avatarUrl: 'avatar.webp',*/
                avatarUrl: "/images/avatar.webp",
                presence: 'online'
            };
        } else {
            console.log("User is not logged in.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

function initialsFromName(name = 'User') {
    return name.split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();
}
function renderCurrentUser(user) {
    const elName = $a('#userName');
    const elSub = $a('#userSub');
    const elAv = $a('#userAvatar');
    const presence = document.querySelector('.user-card .presence');

    if (elName) elName.textContent = user.name || 'Signed in';
    if (elSub) elSub.textContent = user.role ? user.role : (user.email || '');

    if (elAv) {
        elAv.dataset.initials = initialsFromName(user.name);
        if (user.avatarUrl) {
            elAv.src = user.avatarUrl;
            elAv.alt = user.name || 'User';
            elAv.onerror = () => { elAv.removeAttribute('src'); };
        } else {
            elAv.removeAttribute('src'); elAv.alt = user.name || 'User';
        }
    }
    if (presence) {
        const map = { online: '#22c55e', away: '#f59e0b', busy: '#ef4444' };
        presence.style.background = map[user.presence] || '#22c55e';
        presence.title = user.presence || 'online';
    }
}
function wireUserActions() {
    const btnProfile = $a('#btnProfile');
    const btnLogout = $a('#btnLogout');
    if (btnProfile) btnProfile.addEventListener('click', () => alert('Open profile (stub). Hook to your profile route.'));
    // if (btnLogout) btnLogout.addEventListener('click', () => alert('Logging out (stub). Replace with your real logout route.'));
};


// =========================
// Thousand separators
// =========================
function toNumber(val) {
    if (!val) return 0;
    return parseFloat(val.toString().replace(/,/g, '')) || 0;
};

function addCommas(nStr) {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};

function toFormatted(val) {
    return addCommas(toNumber(val));
};

function OnlyNumbers(evt) {
    let charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31
    && (charCode < 45 || charCode > 57)) {
        evt.preventDefault();
        return false;
    }
    return true;
};



// =========================
// Init
// =========================
window.addEventListener('resize', drawAll);

document.addEventListener('DOMContentLoaded', () => {
    initNavGroups();
    getCurrentUser().then(user => {
        renderCurrentUser(user);
        wireUserActions();

        // Tooltips for collapsed rail (optional)
        document.querySelectorAll('.nav .item, .nav .subitem').forEach(el => {
            if (!el.dataset.tip) {
                const label = el.querySelector('.label');
                if (label) el.dataset.tip = label.textContent.trim();
            }
        });

        generateAll();
        drawAll();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === '/') { e.preventDefault(); const s = $a('#search'); if (s) s.focus(); }
        });

        // Active highlight
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.addEventListener('click', (e) => {
                const a = e.target.closest('a.item');
                if (!a) return;
                nav.querySelectorAll('a.item').forEach(el => { el.classList.remove('active'); el.removeAttribute('aria-current'); });
                a.classList.add('active'); a.setAttribute('aria-current', 'page');
                //e.preventDefault();
            });
        }
    });
});