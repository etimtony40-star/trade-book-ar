const $ = (i) => document.getElementById(i),
  E = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const K = "tbl.v2",
  TH = "tbl.theme";
let S = {
  u: "Admin",
  base: "NGN",
  fx: { NGN: 1, USD: 1500, GBP: 1900, EUR: 1650 },
  prov: [1, 5, 20, 50],
  cust: [],
  ent: [],
  gl: [],
  aud: [],
  n: { CUS: 0, INV: 0, PAY: 0, CR: 0, DR: 0, id: 0 },
};
try {
  const r = localStorage.getItem(K);
  if (r) S = Object.assign(S, JSON.parse(r));
} catch (e) {}
const save = () => {
  try {
    localStorage.setItem(K, JSON.stringify(S));
  } catch (e) {}
};
const pad = (p, n) => p + "-" + String(n).padStart(4, "0");
const iso = (d) =>
  new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const T = () => iso(new Date());
const D = (a, b) =>
  Math.round((new Date(a + "T00:00") - new Date(b + "T00:00")) / 864e5);
const AD = (s, n) => {
  const d = new Date(s + "T00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
};
const M = (n, c) => {
  c = c || S.base;
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: c,
    }).format(n || 0);
  } catch (e) {
    return c + " " + (+n || 0).toFixed(2);
  }
};
const hs = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0");
};
const lg = (a, r, d) => {
  r = String(r);
  d = String(d);
  const p = S.aud.length ? S.aud[S.aud.length - 1].h : "0",
    t = new Date().toISOString(),
    x = { t, u: S.u, a, r, d, p };
  x.h = hs(p + t + S.u + a + r + d);
  S.aud.push(x);
};
const toast = (m) => {
  const t = $("t");
  t.textContent = m;
  t.className = "on";
  clearTimeout(toast.i);
  toast.i = setTimeout(() => (t.className = ""), 3800);
};
const GLC = {
  4000: "Product sales",
  4100: "Services",
  4200: "Subscriptions",
  4900: "Other income",
  6900: "Bad debt write-off",
};
const SL = {
  active: ["Active", "ok"],
  hold: ["On hold (overdue)", "warn"],
  collections: ["In collections", "bad"],
  writtenoff: ["Written off", "bad"],
};
const ST = [
  [-3, "Friendly reminder"],
  [1, "Payment overdue"],
  [15, "Second notice"],
  [30, "Final notice"],
  [60, "Collections warning"],
];
const BK = ["0–30", "31–60", "61–90", "90+"];
const AN = (k) =>
  k.startsWith("REV")
    ? "Revenue " + k.slice(3) + " " + (GLC[k.slice(3)] || "")
    : {
        AR: "Accounts receivable (control)",
        CASH: "Cash and bank",
        RET: "Sales returns",
        BAD: "Bad debt expense",
        ALW: "Allowance for doubtful debts",
        FX: "Realised FX variance",
      }[k] || k;
const ch = (e) => e.t === "INV" || e.t === "DR",
  cu = (id) => S.cust.find((c) => c.id === id),
  ent = (id) => S.ent.find((e) => String(e.id) === String(id));
const L = (e) => `<a data-a="doc" data-id="${e.id}">${E(e.no)}</a>`;
const bal = (id) =>
    S.ent.reduce((a, e) => (e.c === id ? a + (ch(e) ? e.amt : -e.amt) : a), 0),
  balB = (id) => S.ent.reduce((a, e) => (e.c === id ? a + e.ar : a), 0);
function ctx() {
  const al = {},
    last = {};
  S.ent.forEach((e) =>
    (e.al || []).forEach((a) => {
      al[a.id] = (al[a.id] || 0) + a.a;
      if (!last[a.id] || e.tx > last[a.id]) last[a.id] = e.tx;
    }),
  );
  const open = [],
    paid = [];
  S.ent.filter(ch).forEach((e) => {
    const o = +(e.amt - (al[e.id] || 0)).toFixed(2);
    if (o > 0.004) open.push({ e, o });
    else if (last[e.id])
      paid.push({
        e,
        d: D(last[e.id], e.tx),
        late: D(last[e.id], e.due),
      });
  });
  return { al, open, paid };
}
const est = (c, X) =>
  c.st !== "active"
    ? c.st
    : X.open.some((x) => x.e.c === c.id && !x.e.dis && D(T(), x.e.due) > 30)
      ? "hold"
      : "active";
const bk = (e) => {
  const a = D(T(), e.tx);
  return a <= 30 ? 0 : a <= 60 ? 1 : a <= 90 ? 2 : 3;
};
function aging(X) {
  const r = {};
  S.cust.forEach((c) => (r[c.id] = [0, 0, 0, 0, 0]));
  X.open.forEach((x) => {
    if (r[x.e.c]) r[x.e.c][bk(x.e)] += x.o * x.e.rate;
  });
  S.ent.forEach((e) => {
    if (!ch(e) && r[e.c]) {
      const u = e.amt - (e.al || []).reduce((a, b) => a + b.a, 0);
      if (u > 0.004) r[e.c][4] -= u * e.rate;
    }
  });
  return r;
}
const sum = (a) => a.reduce((x, y) => x + y, 0);
const dso = () => {
  const ar = sum(S.cust.map((c) => balB(c.id))),
    d0 = AD(T(), -90),
    cs = sum(
      S.ent.filter((e) => ch(e) && e.tx >= d0).map((e) => e.amt * e.rate),
    );
  return cs ? (ar / cs) * 90 : 0;
};
const recon = () => {
  const s = sum(S.cust.map((c) => balB(c.id))),
    g = sum(S.gl.filter((l) => l.a === "AR").map((l) => l.d - l.c));
  return { s, g, d: Math.abs(s - g), ok: Math.abs(s - g) < 0.01 };
};
function fc(X) {
  const g = X.paid.length ? sum(X.paid.map((p) => p.late)) / X.paid.length : 0,
    cm = {};
  S.cust.forEach((c) => {
    const p = X.paid.filter((p) => p.e.c === c.id);
    cm[c.id] = [p.length ? sum(p.map((x) => x.late)) / p.length : g, p.length];
  });
  return X.open
    .filter((x) => !x.e.dis)
    .map((x) => {
      const [dl, n] = cm[x.e.c] || [g, 0];
      let d = AD(x.e.due, Math.round(dl));
      if (d < T()) d = T();
      return { x, d, n, dl };
    })
    .sort((a, b) => (a.d < b.d ? -1 : 1));
}
function dun(X) {
  const q = [];
  X.open.forEach((x) => {
    const e = x.e,
      c = cu(e.c);
    if (e.dis || !c || c.st === "writtenoff") return;
    const d = D(T(), e.due);
    let s = -1;
    ST.forEach((z, i) => {
      if (d >= z[0]) s = i;
    });
    if (s < 0 || (e.dun || []).includes(s)) return;
    q.push({ x, s, d });
  });
  return q;
}
const mail = (q) => {
  const e = q.x.e,
    c = cu(e.c);
  return (
    "mailto:" +
    (c.em || "") +
    "?subject=" +
    encodeURIComponent(ST[q.s][1] + ": " + e.no) +
    "&body=" +
    encodeURIComponent(
      "Dear " +
        c.name +
        ",\n\n" +
        (q.d < 0
          ? "This is a friendly reminder that"
          : "Our records show that") +
        " invoice " +
        e.no +
        " for " +
        M(q.x.o, e.cur) +
        " is " +
        (q.d < 0
          ? "due on " + e.due
          : q.d + " day(s) past due (due " + e.due + ")") +
        ".\nPlease arrange payment" +
        (q.s >= 3 ? " immediately to avoid further action" : "") +
        ". If you have paid, or wish to dispute this invoice, please reply.\n\nRegards,\n" +
        S.u,
    )
  );
};

function post(x) {
  const c = cu(x.c),
    e = {
      id: ++S.n.id,
      t: x.t,
      c: x.c,
      tx: x.tx,
      pd: T(),
      glc: x.glc,
      desc: x.desc || "",
      amt: +x.amt,
      cur: c.cur,
      rate: +x.rate,
      due: x.due || "",
      al: x.al || [],
      u: S.u,
      wo: !!x.wo,
    };
  S.n[x.t]++;
  e.no = pad(x.t, S.n[x.t]);
  const B = e.amt * e.rate,
    j = [];
  if (ch(e)) {
    e.ar = B;
    j.push(["AR", B, 0], ["REV" + e.glc, 0, B]);
  } else {
    const m = {};
    S.ent.forEach((i) => (m[i.id] = i.rate));
    let ac = 0,
      s = 0;
    e.al.forEach((a) => {
      ac += a.a * m[a.id];
      s += a.a;
    });
    ac += (e.amt - s) * e.rate;
    e.ar = -ac;
    e.fx = B - ac;
    j.push(
      [e.t === "PAY" ? "CASH" : e.wo ? "BAD" : "RET", B, 0],
      ["AR", 0, ac],
    );
    if (Math.abs(e.fx) > 0.004)
      j.push(["FX", e.fx < 0 ? -e.fx : 0, e.fx > 0 ? e.fx : 0]);
  }
  S.ent.push(e);
  j.forEach((l) => S.gl.push({ r: e.no, a: l[0], d: l[1], c: l[2] }));
  lg(
    "POST " + e.t,
    e.no,
    M(e.amt, e.cur) + " @ " + e.rate + (e.fx ? " FX " + M(e.fx) : ""),
  );
  save();
  return e;
}

const V = {},
  A = {},
  F = {};
let cv = "dash",
  LF = { c: "", t: "" };
const NAV = [
  ["dash", "Dashboard"],
  ["cust", "Customers"],
  ["led", "Ledger"],
  ["post", "Post entry"],
  ["age", "Aging"],
  ["col", "Collections"],
  ["gl", "GL"],
  ["aud", "Audit"],
  ["set", "Settings"],
];
function render() {
  $("nv").innerHTML = NAV.map(
    (n) =>
      `<button class="${n[0] === cv ? "p" : ""}" data-a="go" data-v="${n[0]}">${n[1]}</button>`,
  ).join("");
  $("who").textContent = "User: " + S.u;
  $("v").innerHTML = V[cv]();
  if (cv === "post") updAl();
}

V.dash = () => {
  const X = ctx(),
    ag = aging(X),
    tot = [0, 0, 0, 0, 0];
  Object.values(ag).forEach((r) => r.forEach((v, i) => (tot[i] += v)));
  const ar = sum(S.cust.map((c) => balB(c.id))),
    ov = sum(
      X.open.filter((x) => D(T(), x.e.due) > 0).map((x) => x.o * x.e.rate),
    ),
    dp = sum(X.open.filter((x) => x.e.dis).map((x) => x.o * x.e.rate)),
    pr = sum(tot.slice(0, 4).map((v, i) => (v * S.prov[i]) / 100)),
    ap = X.paid.length ? sum(X.paid.map((p) => p.d)) / X.paid.length : 0,
    rc = recon(),
    over = S.cust.filter((c) => c.lim > 0 && bal(c.id) > c.lim);
  if (!S.cust.length)
    return `<div class="c"><b>Welcome.</b> Add a client under Customers, then post an invoice. Or <button class="p s" data-a="demo">load demo data</button> to explore every feature.</div>`;
  return `<div class="g">${[
    ["Total receivable", M(ar)],
    ["Overdue", M(ov)],
    ["In dispute", M(dp)],
    ["DSO (90 days)", dso().toFixed(1) + " days"],
    ["Average days to pay", ap.toFixed(1) + " days"],
    ["Provision needed", M(pr)],
  ]
    .map((k) => `<div class="c k"><small>${k[0]}</small><b>${k[1]}</b></div>`)
    .join("")}</div>
 <div class="c">Reconciliation: <span class="tg ${rc.ok ? "ok" : "bad"}">${rc.ok ? "Balanced" : "Out by " + M(rc.d)}</span> <small>Sub-ledgers ${M(rc.s)} vs control account ${M(rc.g)}</small></div>
 ${over.length ? `<div class="c bad">Over credit limit: ${over.map((c) => E(c.name) + " (" + M(bal(c.id), c.cur) + " of " + M(c.lim, c.cur) + ")").join(", ")}</div>` : ""}
 <div class="c w"><b>Top debtors</b><table><tr><th>Client<th class="r">Balance (${S.base})<th>Status${S.cust
   .slice()
   .sort((a, b) => balB(b.id) - balB(a.id))
   .slice(0, 5)
   .map((c) => {
     const s = SL[est(c, X)];
     return `<tr><td>${E(c.name)} <small>${c.id}</small><td class="r">${M(balB(c.id))}<td><span class="tg ${s[1]}">${s[0]}</span>`;
   })
   .join("")}</table></div>`;
};

V.cust = () => {
  const X = ctx();
  return `<form id="fc" class="c f"><label>Client name<input name="n" required></label><label>Billing currency<select name="cur">${Object.keys(
    S.fx,
  )
    .map((k) => `<option>${k}</option>`)
    .join(
      "",
    )}</select></label><label>Credit limit (0 = none)<input name="lim" type="number" min="0" step="any" value="0"></label><label>Limit type<select name="mode"><option value="soft">Soft (warn)</option><option value="hard">Hard (block)</option></select></label><label>Email<input name="em" type="email"></label><button class="p">Add client</button></form>
 <div class="c w"><table><tr><th>ID<th>Client<th>Cur<th class="r">Balance<th class="r">Limit<th>Status<th>Set status<th>${
   S.cust
     .map((c) => {
       const s = SL[est(c, X)],
         ov = c.lim > 0 && bal(c.id) > c.lim;
       return `<tr><td>${c.id}<td>${E(c.name)}<td>${c.cur}<td class="r">${M(bal(c.id), c.cur)}<td class="r">${c.lim ? M(c.lim, c.cur) + " " + c.mode : "None"}<td><span class="tg ${s[1]}">${s[0]}</span>${ov ? ' <span class="tg bad">Over limit</span>' : ""}<td><select data-s="${c.id}">${Object.keys(
         SL,
       )
         .map(
           (k) =>
             `<option value="${k}"${k === c.st ? " selected" : ""}>${SL[k][0]}</option>`,
         )
         .join(
           "",
         )}</select><td><button class="s" data-a="stmt" data-id="${c.id}">Statement</button> <button class="s" data-a="lim" data-id="${c.id}">Limit</button> <button class="s" data-a="wo" data-id="${c.id}">Write off</button>`;
     })
     .join("") || '<tr><td colspan="8">No clients yet.'
 }</table></div>`;
};
F.fc = (f) => {
  const d = new FormData(f),
    c = {
      id: pad("CUS", ++S.n.CUS),
      name: d.get("n").trim(),
      cur: d.get("cur"),
      lim: +d.get("lim") || 0,
      mode: d.get("mode"),
      em: d.get("em"),
      st: "active",
    };
  if (S.cust.some((x) => x.name.toLowerCase() === c.name.toLowerCase()))
    toast(
      "Another client has this name. The new Customer ID keeps their accounts separate.",
    );
  S.cust.push(c);
  lg("CREATE CUSTOMER", c.id, c.name);
  save();
  render();
};
A.stmt = (d) => {
  LF.c = d.id;
  cv = "led";
  render();
};
A.lim = (d) => {
  const c = cu(d.id),
    v = prompt("Credit limit in " + c.cur + " (0 = none)", c.lim);
  if (v === null) return;
  const h = confirm(
    "OK = hard limit (blocks invoices). Cancel = soft limit (warns).",
  );
  lg(
    "LIMIT CHANGE",
    c.id,
    c.lim + " to " + (+v || 0) + (h ? " hard" : " soft"),
  );
  c.lim = +v || 0;
  c.mode = h ? "hard" : "soft";
  save();
  render();
};
A.wo = (d) => {
  const c = cu(d.id),
    o = ctx().open.filter((x) => x.e.c === c.id),
    t = sum(o.map((x) => x.o));
  if (t <= 0) return toast("Nothing outstanding to write off");
  if (
    !confirm(
      "Write off " +
        M(t, c.cur) +
        " for " +
        c.name +
        "? This is logged as approved by " +
        S.u +
        ".",
    )
  )
    return;
  post({
    t: "CR",
    c: c.id,
    tx: T(),
    glc: "6900",
    desc: "Bad debt write-off",
    amt: t,
    rate: S.fx[c.cur] || 1,
    al: o.map((x) => ({ id: x.e.id, a: x.o })),
    wo: 1,
  });
  c.st = "writtenoff";
  lg("WRITE-OFF", c.id, M(t, c.cur) + " approved by " + S.u);
  save();
  render();
};
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.s) {
    const c = cu(t.dataset.s);
    lg("STATUS CHANGE", c.id, c.st + " to " + t.value);
    c.st = t.value;
    save();
    render();
  }
  if (t.id === "pt" || t.id === "pc") updAl();
  if (t.id === "lc" || t.id === "lt") {
    LF.c = $("lc").value;
    LF.t = $("lt").value;
    render();
  }
});

V.led = () => {
  let rb = {},
    g = 0;
  const rows = S.ent
    .map((e) => {
      rb[e.c] = (rb[e.c] || 0) + (ch(e) ? e.amt : -e.amt);
      g += e.ar;
      return { e, r: LF.c ? rb[e.c] : g };
    })
    .filter((x) => (!LF.c || x.e.c === LF.c) && (!LF.t || x.e.t === LF.t))
    .reverse();
  return `<div class="c f"><label>Client<select id="lc"><option value="">All clients${S.cust.map((c) => `<option value="${c.id}"${c.id === LF.c ? " selected" : ""}>${E(c.name)} (${c.id})`).join("")}</select></label><label>Type<select id="lt">${["", "INV", "PAY", "CR", "DR"].map((t) => `<option value="${t}"${t === LF.t ? " selected" : ""}>${t || "All types"}`).join("")}</select></label><button data-a="csv">Export CSV</button></div>
 <div class="c w"><small>Running balance is in billing currency for one client, or ${S.base} for all clients.</small><table><tr><th>Date<th>Posted<th>Ref<th>Client<th>GL<th>Description<th class="r">Debit<th class="r">Credit<th class="r">Running${rows.map(({ e, r }) => `<tr><td>${e.tx}<td>${e.pd}<td>${L(e)}${e.dis ? ' <span class="tg bad">Dispute</span>' : ""}<td>${E(cu(e.c).name)}<td>${e.glc}<td>${E(e.desc)}<td class="r">${ch(e) ? M(e.amt, e.cur) : ""}<td class="r">${ch(e) ? "" : M(e.amt, e.cur)}<td class="r"><b>${M(r, LF.c ? cu(LF.c).cur : S.base)}</b>`).join("") || '<tr><td colspan="9">No entries.'}</table></div>`;
};
A.csv = () => {
  const r = [
    [
      "Ref",
      "Type",
      "Client ID",
      "Tx date",
      "Posted",
      "GL",
      "Description",
      "Amount",
      "Currency",
      "Rate",
      "Base amount",
      "FX variance",
    ],
  ].concat(
    S.ent.map((e) => [
      e.no,
      e.t,
      e.c,
      e.tx,
      e.pd,
      e.glc,
      e.desc,
      e.amt,
      e.cur,
      e.rate,
      (e.amt * e.rate).toFixed(2),
      (e.fx || 0).toFixed(2),
    ]),
  );
  dl(
    "ledger.csv",
    "text/csv",
    r
      .map((x) =>
        x.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(","),
      )
      .join("\n"),
  );
};
const dl = (n, t, s) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([s], { type: t }));
  a.download = n;
  a.click();
};

V.post = () =>
  `<form id="fp" class="c f"><label>Type<select id="pt" name="t"><option value="INV">Invoice (INV)<option value="PAY">Receipt or payment (PAY)<option value="CR">Credit note (CR)<option value="DR">Debit note (DR)</select></label><label>Client<select id="pc" name="c" required><option value="">Select a client${S.cust.map((c) => `<option value="${c.id}">${E(c.name)} (${c.id})`).join("")}</select></label><label>Transaction date<input type="date" name="tx" value="${T()}" required></label><label id="pdw">Due date<input type="date" name="due" value="${AD(T(), 30)}"></label><label>GL code<select name="glc">${Object.entries(
    GLC,
  )
    .map((g) => `<option value="${g[0]}">${g[0]} ${g[1]}`)
    .join(
      "",
    )}</select></label><label>Description<input name="desc"></label><label>Amount<input name="amt" type="number" step="any" min="0.01" required></label><label>Currency<input id="pcur" disabled></label><label>Exchange rate to ${S.base} (locked when posted)<input id="prate" name="rate" type="number" step="any" min="0" required></label><div id="pal" hidden style="grid-column:1/-1"></div><button class="p">Post entry</button></form><small>The posting date is set to today automatically. Entries cannot be edited; correct mistakes with a credit or debit note.</small>`;
function updAl() {
  const t = $("pt").value,
    c = $("pc").value,
    isC = t === "INV" || t === "DR",
    k = cu(c);
  $("pdw").hidden = !isC;
  $("pal").hidden = isC;
  if (k) {
    $("pcur").value = k.cur;
    $("prate").value = S.fx[k.cur] || 1;
  }
  if (!isC && c) {
    $("pal").innerHTML =
      '<b>Allocate to invoices</b> <button type="button" class="s" data-a="auto">Auto, oldest first</button><div class="w"><table><tr><th>Invoice<th>Due<th class="r">Outstanding<th>Apply' +
      ctx()
        .open.filter((x) => x.e.c === c)
        .sort((a, b) => (a.e.tx < b.e.tx ? -1 : 1))
        .map(
          (x) =>
            `<tr><td>${E(x.e.no)}<td>${x.e.due}<td class="r">${M(x.o, x.e.cur)}<td><input class="al" data-id="${x.e.id}" data-o="${x.o}" type="number" step="any" min="0" max="${x.o}" style="width:110px">`,
        )
        .join("") +
      "</table></div><small>Anything not allocated stays on account.</small>";
  }
}
A.auto = () => {
  let r = +document.querySelector("[name=amt]").value || 0;
  document.querySelectorAll(".al").forEach((i) => {
    const a = Math.min(r, +i.dataset.o);
    i.value = a > 0 ? a : "";
    r -= Math.max(a, 0);
  });
};
F.fp = (f) => {
  const d = new FormData(f),
    t = d.get("t"),
    c = cu(d.get("c")),
    amt = +d.get("amt"),
    isC = t === "INV" || t === "DR";
  if (!c) return toast("Choose a client first");
  const al = [...document.querySelectorAll(".al")]
    .map((i) => ({
      id: +i.dataset.id,
      a: +i.value || 0,
      o: +i.dataset.o,
    }))
    .filter((x) => x.a > 0 && !isC);
  if (
    sum(al.map((x) => x.a)) > amt + 0.004 ||
    al.some((x) => x.a > x.o + 0.004)
  )
    return toast(
      "Allocations cannot exceed the amount or an invoice’s outstanding balance",
    );
  if (isC) {
    if (c.st === "collections" || c.st === "writtenoff")
      return toast("Blocked: this client is " + SL[c.st][0].toLowerCase());
    const nb = bal(c.id) + amt;
    if (c.lim > 0 && nb > c.lim) {
      if (c.mode === "hard")
        return toast(
          "Blocked: hard credit limit of " +
            M(c.lim, c.cur) +
            " would be exceeded",
        );
      if (
        !confirm(
          "Soft limit exceeded: balance would be " +
            M(nb, c.cur) +
            " against " +
            M(c.lim, c.cur) +
            ". Post anyway?",
        )
      )
        return;
      lg("LIMIT OVERRIDE", c.id, M(nb, c.cur) + " vs " + M(c.lim, c.cur));
    }
  }
  const e = post({
    t,
    c: c.id,
    tx: d.get("tx"),
    due: d.get("due") || AD(d.get("tx"), 30),
    glc: d.get("glc"),
    desc: d.get("desc"),
    amt,
    rate: d.get("rate"),
    al: al.map((x) => ({ id: x.id, a: x.a })),
  });
  toast("Posted " + e.no);
  render();
};

V.age = () => {
  const X = ctx(),
    ag = aging(X),
    tot = [0, 0, 0, 0, 0];
  S.cust.forEach((c) => ag[c.id].forEach((v, i) => (tot[i] += v)));
  const al = sum(S.gl.filter((l) => l.a === "ALW").map((l) => l.c - l.d)),
    pr = tot.slice(0, 4).map((v, i) => (v * S.prov[i]) / 100),
    P = sum(pr);
  return `<div class="c w"><b>Aged receivables (${S.base}, age counted from invoice date)</b><table><tr><th>Client${BK.map((b) => `<th class="r">${b} days`).join("")}<th class="r">Unapplied<th class="r">Net${S.cust
    .map((c) => {
      const r = ag[c.id];
      return `<tr><td>${E(c.name)}${r.map((v) => `<td class="r">${M(v)}`).join("")}<td class="r"><b>${M(sum(r))}</b>`;
    })
    .join(
      "",
    )}<tr><th>Total${tot.map((v) => `<th class="r">${M(v)}`).join("")}<th class="r">${M(sum(tot))}</table></div>
 <div class="c w"><b>Bad debt provision</b><table><tr><th>Age<th class="r">Outstanding<th class="r">Rate %<th class="r">Reserve${BK.map((b, i) => `<tr><td>${b} days<td class="r">${M(tot[i])}<td class="r">${S.prov[i]}<td class="r">${M(pr[i])}`).join("")}<tr><th>Required<th><th><th class="r">${M(P)}</table><p>Allowance on the books: ${M(al)}. Adjustment needed: ${M(P - al)} <button class="s p" data-a="prov">Post provision journal</button></p></div>`;
};
A.prov = () => {
  const X = ctx(),
    ag = aging(X);
  let p = 0;
  Object.values(ag).forEach((r) =>
    r.slice(0, 4).forEach((v, i) => (p += (v * S.prov[i]) / 100)),
  );
  const al = sum(S.gl.filter((l) => l.a === "ALW").map((l) => l.c - l.d)),
    a = +(p - al).toFixed(2);
  if (Math.abs(a) < 0.01) return toast("The allowance already matches");
  if (a > 0)
    S.gl.push(
      { r: "PROV", a: "BAD", d: a, c: 0 },
      { r: "PROV", a: "ALW", d: 0, c: a },
    );
  else
    S.gl.push(
      { r: "PROV", a: "ALW", d: -a, c: 0 },
      { r: "PROV", a: "BAD", d: 0, c: -a },
    );
  lg("PROVISION", "PROV", M(a));
  save();
  toast("Provision journal posted");
  render();
};

V.col = () => {
  const X = ctx(),
    q = dun(X),
    f = fc(X),
    wk = Array(8).fill(0);
  f.forEach((z) => {
    const w = Math.floor(D(z.d, T()) / 7);
    if (w < 8) wk[w] += z.x.o * z.x.e.rate;
  });
  const mx = Math.max(...wk, 1);
  return `<div class="c w"><b>Dunning queue</b> <small>Progressive notices; disputed invoices are paused.</small><table><tr><th>Invoice<th>Client<th>Stage<th class="r">Outstanding<th>${q.map((z) => `<tr><td>${L(z.x.e)}<td>${E(cu(z.x.e.c).name)}<td>${ST[z.s][1]} (${z.d >= 0 ? z.d + " days late" : -z.d + " days to due"})<td class="r">${M(z.x.o, z.x.e.cur)}<td><button class="s" data-a="send" data-id="${z.x.e.id}" data-z="${z.s}">Send and log</button>`).join("") || '<tr><td colspan="5">No notices due.'}</table></div>
 <div class="c"><b>Expected cash by week (${S.base})</b>${wk.map((v, i) => `<div style="display:flex;gap:8px;align-items:center;margin-top:4px"><small style="width:48px">Wk ${i + 1}</small><div class="bar" style="width:${(v / mx) * 60}%"></div><small>${M(v)}</small></div>`).join("")}</div>
 <div class="c w"><b>Expected payment dates</b> <small>Due date plus the client’s historical average delay.</small><table><tr><th>Invoice<th>Client<th>Due<th>Expected<th class="r">Avg delay<th>Confidence${f.map((z) => `<tr><td>${L(z.x.e)}<td>${E(cu(z.x.e.c).name)}<td>${z.x.e.due}<td>${z.d}<td class="r">${z.dl.toFixed(1)} d<td>${z.n >= 3 ? "High" : z.n > 0 ? "Medium" : "Low"}`).join("") || '<tr><td colspan="6">Nothing outstanding.'}</table></div>`;
};
A.send = (d) => {
  const x = ctx().open.find((o) => String(o.e.id) === d.id),
    q = { x, s: +d.z, d: D(T(), x.e.due) };
  x.e.dun = (x.e.dun || []).concat(q.s);
  lg("DUNNING SENT", x.e.no, ST[q.s][1]);
  save();
  render();
  location.href = mail(q);
};

V.gl = () => {
  const a = {};
  S.gl.forEach((l) => {
    a[l.a] = a[l.a] || [0, 0];
    a[l.a][0] += l.d;
    a[l.a][1] += l.c;
  });
  const r = recon(),
    dd = sum(S.gl.map((l) => l.d)),
    cc = sum(S.gl.map((l) => l.c)),
    bal2 = Math.abs(dd - cc) < 0.01;
  return `<div class="c">Control account: sub-ledgers ${M(r.s)} vs AR control ${M(r.g)} <span class="tg ${r.ok ? "ok" : "bad"}">${r.ok ? "Reconciled" : "Difference " + M(r.d)}</span><br>Journals: debits ${M(dd)} and credits ${M(cc)} <span class="tg ${bal2 ? "ok" : "bad"}">${bal2 ? "Balanced" : "Unbalanced"}</span></div>
 <div class="c w"><b>Trial balance</b><table><tr><th>Account<th class="r">Debit<th class="r">Credit<th class="r">Balance${
   Object.keys(a)
     .sort()
     .map(
       (k) =>
         `<tr><td>${E(AN(k))}<td class="r">${M(a[k][0])}<td class="r">${M(a[k][1])}<td class="r">${M(a[k][0] - a[k][1])}`,
     )
     .join("") || '<tr><td colspan="4">No journals yet.'
 }</table></div>
 <div class="c w"><b>Recent journal lines</b><table><tr><th>Ref<th>Account<th class="r">Debit<th class="r">Credit${S.gl
   .slice(-30)
   .reverse()
   .map(
     (l) =>
       `<tr><td>${E(l.r)}<td>${E(AN(l.a))}<td class="r">${l.d ? M(l.d) : ""}<td class="r">${l.c ? M(l.c) : ""}`,
   )
   .join("")}</table></div>`;
};

V.aud = () =>
  `<div class="c w"><b>Audit trail</b> <small>Append-only and hash-chained. Nothing here can be edited in the app.</small> <button class="s" data-a="ver">Verify integrity</button> <b id="vr"></b><table><tr><th>Time<th>User<th>Action<th>Ref<th>Detail<th>Hash${S.aud
    .slice()
    .reverse()
    .slice(0, 200)
    .map(
      (x) =>
        `<tr><td>${x.t.replace("T", " ").slice(0, 19)}<td>${E(x.u)}<td>${E(x.a)}<td>${E(x.r)}<td>${E(x.d)}<td>${x.h}`,
    )
    .join("")}</table></div>`;
A.ver = () => {
  let p = "0",
    b = -1;
  S.aud.forEach((x, i) => {
    if (b < 0 && (x.p !== p || x.h !== hs(p + x.t + x.u + x.a + x.r + x.d)))
      b = i;
    p = x.h;
  });
  $("vr").textContent =
    b < 0
      ? "Intact: " + S.aud.length + " records verified"
      : "Tampering detected at record " + (b + 1);
};

V.set =
  () => `<form id="fs" class="c f"><label>Your name (recorded in the audit trail)<input name="u" value="${E(S.u)}"></label><label>Base currency<input name="base" maxlength="3" value="${S.base}"${S.cust.length ? " disabled" : ""}></label>${Object.keys(
    S.fx,
  )
    .filter((k) => k !== S.base)
    .map(
      (k) =>
        `<label>${k} rate to ${S.base}<input name="r_${k}" type="number" step="any" value="${S.fx[k]}"></label>`,
    )
    .join(
      "",
    )}${BK.map((b, i) => `<label>Provision % for ${b} days<input name="p${i}" type="number" step="any" min="0" value="${S.prov[i]}"></label>`).join("")}<label>Add currency code<input name="nc" maxlength="3"></label><label>Rate to ${S.base}<input name="nr" type="number" step="any"></label><button class="p">Save settings</button></form>
 <div class="c"><button data-a="bk">Download backup</button> <button data-a="demo">Load demo data</button><p><small>Data stays in this browser. Rates are applied to new entries and locked when posted.</small></p></div>`;
F.fs = (f) => {
  const d = new FormData(f);
  S.u = d.get("u").trim() || "Admin";
  if (!S.cust.length && d.get("base")) {
    const b = d.get("base").toUpperCase();
    S.base = b;
    S.fx[b] = 1;
  }
  Object.keys(S.fx).forEach((k) => {
    if (k !== S.base && +d.get("r_" + k) > 0) S.fx[k] = +d.get("r_" + k);
  });
  S.prov = [0, 1, 2, 3].map((i) => +d.get("p" + i) || 0);
  const nc = (d.get("nc") || "").toUpperCase();
  if (nc.length === 3 && +d.get("nr") > 0) S.fx[nc] = +d.get("nr");
  lg("SETTINGS", "", "updated by " + S.u);
  save();
  toast("Settings saved");
  render();
};
A.bk = () =>
  dl(
    "tradebook-backup-" + T() + ".json",
    "application/json",
    JSON.stringify(S),
  );

A.doc = (d) => {
  const e = ent(d.id),
    c = cu(e.c),
    X = ctx(),
    ap = S.ent.filter((p) => (p.al || []).some((a) => a.id === e.id));
  $("mb").innerHTML =
    `<b style="font-size:18px">${E(e.no)}</b> <span class="tg">${{ INV: "Invoice", PAY: "Receipt", CR: "Credit note", DR: "Debit note" }[e.t]}</span>${e.dis ? ` <span class="tg bad">In dispute</span>` : ""}
 <p>${E(c.name)} <small>${c.id}</small><br>Transaction date ${e.tx}, posted ${e.pd}${e.due ? ", due " + e.due : ""}<br>GL ${e.glc} ${GLC[e.glc] || ""} · ${E(e.desc)}<br>Amount <b>${M(e.amt, e.cur)}</b> at rate ${e.rate} = ${M(e.amt * e.rate)}${e.fx ? "<br>Realised FX variance " + M(e.fx) : ""}<br>Created by ${E(e.u)}${e.dis ? "<br>Dispute: " + E(e.dis.r) + " (" + e.dis.d + ")" : ""}</p>
 ${!ch(e) && (e.al || []).length ? `<b>Applied to</b><br>${e.al.map((a) => L(ent(a.id)) + " " + M(a.a, e.cur)).join("<br>")}<br>` : ""}${ch(e) ? `<b>Applied by</b><br>${ap.map((p) => L(p) + " " + M(p.al.find((a) => a.id === e.id).a, e.cur)).join("<br>") || "No payments yet"}<br>Outstanding: <b>${M((X.open.find((o) => o.e.id === e.id) || { o: 0 }).o, e.cur)}</b><br>` : ""}
 <p><b>Journal</b><br>${S.gl
   .filter((l) => l.r === e.no)
   .map((l) => E(AN(l.a)) + ": " + (l.d ? "Dr " + M(l.d) : "Cr " + M(l.c)))
   .join("<br>")}</p>
 ${ch(e) ? `<button data-a="dis" data-id="${e.id}">${e.dis ? "Resolve dispute" : "Flag dispute"}</button> ` : ""}<button onclick="print()">Print</button> <button data-a="x">Close</button>`;
  $("m").className = "on";
};
A.dis = (d) => {
  const e = ent(d.id);
  if (e.dis) {
    delete e.dis;
    lg("DISPUTE RESOLVED", e.no, "");
  } else {
    const r = prompt("Reason for the dispute?");
    if (!r) return;
    e.dis = { r, d: T() };
    lg("DISPUTE", e.no, r);
  }
  save();
  A.doc(d);
  render();
};
A.x = () => {
  $("m").className = "";
};
A.go = (d) => {
  cv = d.v;
  render();
  scrollTo(0, 0);
};
const th = (t) => {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(TH, t);
  } catch (e) {}
};
try {
  const t = localStorage.getItem(TH);
  if (t) th(t);
} catch (e) {}
A.theme = () => {
  const d =
    document.documentElement.dataset.theme ||
    (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
  th(d === "dark" ? "light" : "dark");
};
A.demo = () => {
  const mk = (n, cur, lim, mode) => {
    const c = {
      id: pad("CUS", ++S.n.CUS),
      name: n,
      cur,
      lim,
      mode,
      st: "active",
      em: n.split(" ")[0].toLowerCase() + "@example.com",
    };
    S.cust.push(c);
    lg("CREATE CUSTOMER", c.id, n);
    return c.id;
  };
  const a = mk("Chinedu Stores", "NGN", 2000000, "soft"),
    b = mk("Northwind Ltd", "USD", 5000, "hard"),
    c = mk("Okafor Trading", "NGN", 500000, "hard");
  const I = (c, days, glc, desc, amt) =>
    post({
      t: "INV",
      c,
      tx: AD(T(), -days),
      due: AD(T(), 30 - days),
      glc,
      desc,
      amt,
      rate: S.fx[cu(c).cur] || 1,
    });
  const i1 = I(a, 75, "4000", "Rice and oil supply", 900000);
  I(a, 40, "4000", "Provisions", 650000);
  const i3 = I(b, 50, "4100", "Consulting", 2400),
    i4 = I(c, 100, "4000", "Fabrics", 300000);
  I(b, 10, "4200", "Subscription", 1200);
  post({
    t: "PAY",
    c: a,
    tx: AD(T(), -20),
    glc: "4000",
    desc: "Part payment",
    amt: 500000,
    rate: 1,
    al: [{ id: i1.id, a: 500000 }],
  });
  post({
    t: "PAY",
    c: b,
    tx: AD(T(), -15),
    glc: "4100",
    desc: "Wire transfer",
    amt: 1000,
    rate: 1560,
    al: [{ id: i3.id, a: 1000 }],
  });
  i4.dis = { r: "Goods arrived damaged", d: T() };
  lg("DISPUTE", i4.no, i4.dis.r);
  save();
  toast("Demo data loaded");
  render();
};
document.addEventListener("click", (e) => {
  if (e.target.id === "m") return A.x();
  const b = e.target.closest("[data-a]");
  if (b) {
    const f = A[b.dataset.a];
    f && f(b.dataset);
  }
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = F[e.target.id];
  f && f(e.target);
});
render();
