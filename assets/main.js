/* ============================================================
   交互脚本：滚动进度、导航、滚动显现、灯箱、回到顶部
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 滚动进度条 & header 状态 & 回到顶部 ---------- */
  const progressBar = document.getElementById("progressBar");
  const header = document.getElementById("siteHeader");
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = pct + "%";
    header.classList.toggle("scrolled", window.scrollY > 30);
    toTop.classList.toggle("show", window.scrollY > 700);
    spy();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- 移动端菜单 ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => mainNav.classList.remove("open"))
  );

  /* ---------- 滚动显现 ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* ---------- 导航 scrollspy ---------- */
  const spyLinks = Array.from(document.querySelectorAll(".main-nav a[data-spy]"));
  const spySections = spyLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function spy() {
    const pos = window.scrollY + 120;
    let current = null;
    spySections.forEach(sec => { if (sec.offsetTop <= pos) current = sec; });
    spyLinks.forEach(a =>
      a.classList.toggle("active", current && a.getAttribute("href") === "#" + current.id)
    );
  }

  /* ---------- 灯箱 ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbImgs = Array.from(document.querySelectorAll("img[data-lb]"));
  let lbIndex = 0;

  function openLb(i) {
    lbIndex = (i + lbImgs.length) % lbImgs.length;
    lbImg.src = lbImgs[lbIndex].src;
    lbImg.alt = lbImgs[lbIndex].alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  lbImgs.forEach(img => {
    img.closest("figure, .inline-fig")?.addEventListener("click", () =>
      openLb(lbImgs.indexOf(img))
    );
  });

  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", e => { e.stopPropagation(); openLb(lbIndex - 1); });
  document.getElementById("lbNext").addEventListener("click", e => { e.stopPropagation(); openLb(lbIndex + 1); });
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(lbIndex - 1);
    if (e.key === "ArrowRight") openLb(lbIndex + 1);
  });

  onScroll();
})();
