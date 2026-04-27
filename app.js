const strings = {
  brand: "SkillAether",
  categories: {
    development: "Разработка",
    marketing: "Маркетинг",
    content: "Контент",
    automation: "Автоматизация",
    research: "Исследования",
    business: "Бизнес",
    design: "Дизайн",
    gamedev: "Геймдев",
    "vibe-coding": "Вайб-кодинг",
    "product-management": "Продакт-менеджмент",
    writing: "Тексты",
    "ai-tools": "ИИ-Инструменты",
    "no-code": "No-Code",
  },
  heroStaticPrefix: "Сделай своего ",
  heroSubtitle: "Проверенные, совместимые системы навыков для ИИ-агентов. Скачай и используй.",
  heroPhrases: [
    { tool: "Claude", role: "дизайнером" },
    { tool: "Gemini", role: "SaaS-разработчиком" },
    { tool: "Cursor", role: "аудитором безопасности" },
    { tool: "Copilot", role: "исследовательским ассистентом" },
    { tool: "ChatGPT", role: "контент-машиной" },
    { tool: "Claude Code", role: "экспертом по TDD" },
  ],
  searchPlaceholder: "Поиск навыков...",
  sortPopular: "Популярное",
  sortAZ: "А-Я",
  filterAll: "Все",
  skillSingular: "навык",
  skillPlural: "навыков",
  skillsIn: "в",
  skillsMatching: "по запросу",
  noResults: "Навыки не найдены. Попробуйте другой поиск или категорию.",
  loadMore: "Показать ещё",
  remaining: "осталось",
  badgeHot: "🔥 Хит",
  badgeFree: "Бесплатно",
  cardDownload: "Скачать",
  modalOutcome: "Результат:",
  modalPreviewShow: "▸ Показать SKILL.md",
  modalPreviewHide: "▾ Скрыть превью",
  modalDownloadFree: "Скачать бесплатно",
  modalTimeSaved: "Экономия времени:",
  footerTagline: "Профессиональные системы навыков для ИИ-агентов. Стандарт SKILL.md.",
  footerRights: "Все права защищены.",
  themeLight: "Светлая",
  themeDark: "Тёмная",
};

const state = {
  skills: [],
  categories: [],
  search: "",
  activeCategory: "all",
  sortBy: "popular",
  visibleCount: 24,
  selectedSkillSlug: null,
  skillPreviewOpen: false,
};

const els = {
  navbar: document.getElementById("navbar"),
  heroTool: document.getElementById("hero-tool"),
  heroRole: document.getElementById("hero-role"),
  searchInput: document.getElementById("search-input"),
  searchClearBtn: document.getElementById("search-clear-btn"),
  sortToggleBtn: document.getElementById("sort-toggle-btn"),
  sortLabel: document.getElementById("sort-label"),
  sortIcon: document.getElementById("sort-icon"),
  categoryPills: document.getElementById("category-pills"),
  skillsCount: document.getElementById("skills-count"),
  gridSkills: document.getElementById("grid-skills"),
  noResults: document.getElementById("no-results"),
  loadMoreRow: document.getElementById("load-more-row"),
  loadMoreBtn: document.getElementById("load-more-btn"),
  skillModal: document.getElementById("skill-modal"),
  skillModalClose: document.getElementById("skill-modal-close"),
  skillModalScroll: document.getElementById("skill-modal-scroll"),
  supportModal: document.getElementById("support-modal"),
  supportOpen: document.getElementById("support-open"),
  supportModalClose: document.getElementById("support-modal-close"),
  supportSkipBtn: document.getElementById("support-skip-btn"),
  themeToggle: document.getElementById("theme-toggle"),
  themeToggleIcon: document.getElementById("theme-toggle-icon"),
  themeToggleLabel: document.getElementById("theme-toggle-label"),
  footerRights: document.getElementById("footer-rights"),
  cardTemplate: document.getElementById("skill-card-template"),
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function updateThemeButton() {
  const theme = document.documentElement.getAttribute("data-theme") || "dark";
  els.themeToggleIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  els.themeToggleLabel.textContent = theme === "dark" ? strings.themeLight : strings.themeDark;
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeButton();
}

function setNavbarScrolled() {
  els.navbar.classList.toggle("navbar-scrolled", window.scrollY > 20);
}

function openOverlay(element) {
  element.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeOverlay(element) {
  element.hidden = true;
  if (els.skillModal.hidden && els.supportModal.hidden) {
    document.body.style.overflow = "";
  }
}

function openSupportModal() {
  openOverlay(els.supportModal);
}

function closeSupportModal() {
  closeOverlay(els.supportModal);
}

function matchesSearch(skill, query) {
  if (!query) {
    return true;
  }

  return [
    skill.name,
    skill.tagline,
    skill.description,
    skill.category,
    ...(skill.tags || []),
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function getFilteredSkills() {
  const query = state.search.trim().toLowerCase();
  let result = [...state.skills];

  if (state.activeCategory !== "all") {
    result = result.filter((skill) => {
      const categoryName = strings.categories[state.activeCategory] || state.activeCategory;
      return (
        skill.category === state.activeCategory ||
        skill.tags.includes(state.activeCategory) ||
        skill.tags.includes(categoryName) ||
        skill.tags.includes(categoryName.toLowerCase())
      );
    });
  }

  if (query) {
    result = result.filter((skill) => matchesSearch(skill, query));
  }

  if (state.sortBy === "popular") {
    result.sort((a, b) => {
      if (b.isHot !== a.isHot) {
        return b.isHot ? 1 : -1;
      }
      return (b.downloads || 0) - (a.downloads || 0);
    });
  } else {
    result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }

  return result;
}

function renderCategoryPills() {
  els.categoryPills.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.className = `pill ${state.activeCategory === "all" ? "active" : ""}`;
  allButton.dataset.category = "all";
  allButton.type = "button";
  allButton.textContent = strings.filterAll;
  els.categoryPills.append(allButton);

  state.categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `pill ${state.activeCategory === category.slug ? "active" : ""}`;
    button.dataset.category = category.slug;
    button.type = "button";
    button.textContent = `${category.emoji} ${strings.categories[category.slug] || category.name}`;
    els.categoryPills.append(button);
  });
}

function renderSkillsCount(filtered) {
  const count = filtered.length;
  const categoryLabel =
    state.activeCategory !== "all"
      ? ` ${strings.skillsIn} <strong>${escapeHtml(strings.categories[state.activeCategory] || state.activeCategory)}</strong>`
      : "";
  const searchLabel =
    state.search.trim()
      ? ` ${strings.skillsMatching} &ldquo;<strong>${escapeHtml(state.search.trim())}</strong>&rdquo;`
      : "";

  els.skillsCount.innerHTML = `${count} ${count !== 1 ? strings.skillPlural : strings.skillSingular}${categoryLabel}${searchLabel}`;
}

function buildDownloadName(skill) {
  return `SKILL_${skill.slug.toUpperCase()}_v1.md`;
}

function openSkillModal(skill) {
  state.selectedSkillSlug = skill.slug;
  state.skillPreviewOpen = false;
  renderSkillModal(skill);
  openOverlay(els.skillModal);
}

function closeSkillModal() {
  state.selectedSkillSlug = null;
  closeOverlay(els.skillModal);
}

function renderSkillModal(skill) {
  const previewSection = state.skillPreviewOpen
    ? `<div class="skill-preview">${escapeHtml(skill.preview)}</div>`
    : "";

  els.skillModalScroll.innerHTML = `
    <div class="detail-header">
      <div class="detail-meta-row">
        <span class="badge badge-category-color" data-category="${escapeHtml(skill.category)}">
          ${escapeHtml(strings.categories[skill.category] || skill.category)}
        </span>
        ${skill.isHot ? `<span class="badge badge-hot">${escapeHtml(strings.badgeHot)}</span>` : ""}
        <span class="badge badge-free">${escapeHtml(strings.badgeFree)}</span>
      </div>
      <h2 class="detail-title" id="detail-title">${escapeHtml(skill.name)}</h2>
      <p class="detail-tagline">${escapeHtml(skill.tagline)}</p>
    </div>

    <div class="detail-stats">
      <div class="detail-stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${escapeHtml(strings.modalTimeSaved)} ${escapeHtml(skill.timeSaved || "")}</span>
      </div>
    </div>

    <p class="detail-description">${escapeHtml(skill.description)}</p>

    ${
      skill.tags && skill.tags.length > 0
        ? `<div class="detail-tags">${skill.tags
            .map((tag) => `<span class="detail-tag">#${escapeHtml(tag)}</span>`)
            .join("")}</div>`
        : ""
    }

    <div class="detail-outcome">
      <strong>${escapeHtml(strings.modalOutcome)}</strong> ${escapeHtml(skill.outcome || "")}
    </div>

    <button class="detail-preview-toggle" id="detail-preview-toggle" type="button">
      ${state.skillPreviewOpen ? escapeHtml(strings.modalPreviewHide) : escapeHtml(strings.modalPreviewShow)}
    </button>

    ${previewSection}

    <div class="detail-download-section">
      <a
        class="btn btn-primary btn-lg detail-download-btn"
        href="${encodeURI(skill.downloadFile)}"
        download="${escapeHtml(buildDownloadName(skill))}"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
        </svg>
        ${escapeHtml(strings.modalDownloadFree)}
      </a>
    </div>
  `;

  const previewToggle = document.getElementById("detail-preview-toggle");
  previewToggle?.addEventListener("click", () => {
    state.skillPreviewOpen = !state.skillPreviewOpen;
    renderSkillModal(skill);
  });
}

function renderGrid() {
  const filtered = getFilteredSkills();
  const visible = filtered.slice(0, state.visibleCount);
  const hasMore = filtered.length > state.visibleCount;

  renderSkillsCount(filtered);
  els.gridSkills.innerHTML = "";

  if (filtered.length === 0) {
    els.noResults.hidden = false;
    els.loadMoreRow.hidden = true;
    return;
  }

  els.noResults.hidden = true;

  visible.forEach((skill) => {
    const card = els.cardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".skill-card-cat-icon").textContent = skill.categoryEmoji || "📦";
    card.querySelector(".skill-card-cat-name").textContent =
      strings.categories[skill.category] || skill.category;
    card.querySelector(".skill-card-title").textContent = skill.name;
    card.querySelector(".skill-card-tagline").textContent = skill.tagline;
    card.querySelector(".skill-hot-badge").hidden = !skill.isHot;

    const downloadLink = card.querySelector(".skill-download-link");
    downloadLink.href = skill.downloadFile;
    downloadLink.setAttribute("download", buildDownloadName(skill));
    downloadLink.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    const open = () => openSkillModal(skill);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });

    els.gridSkills.append(card);
  });

  els.loadMoreRow.hidden = !hasMore;
  if (hasMore) {
    els.loadMoreBtn.textContent = `${strings.loadMore} (${filtered.length - state.visibleCount} ${strings.remaining})`;
  }
}

function updateSortButton() {
  els.sortIcon.textContent = state.sortBy === "popular" ? "HOT" : "A-Z";
  els.sortLabel.textContent = state.sortBy === "popular" ? strings.sortPopular : strings.sortAZ;
}

function resetVisibleCount() {
  state.visibleCount = 24;
}

function wireTypewriter() {
  const phrases = strings.heroPhrases;
  let phraseIndex = 0;
  let displayTool = "";
  let displayRole = "";
  let phase = "typing-tool";

  function tick() {
    const current = phrases[phraseIndex];

    switch (phase) {
      case "typing-tool":
        if (displayTool.length < current.tool.length) {
          displayTool = current.tool.slice(0, displayTool.length + 1);
        } else {
          phase = "typing-role";
        }
        break;
      case "typing-role":
        if (displayRole.length < current.role.length) {
          displayRole = current.role.slice(0, displayRole.length + 1);
        } else {
          phase = "pause";
        }
        break;
      case "pause":
        phase = "deleting-role";
        setTimeout(tick, 2000);
        renderTypewriter(displayTool, displayRole);
        return;
      case "deleting-role":
        if (displayRole.length > 0) {
          displayRole = displayRole.slice(0, -1);
        } else {
          phase = "deleting-tool";
        }
        break;
      case "deleting-tool":
        if (displayTool.length > 0) {
          displayTool = displayTool.slice(0, -1);
        } else {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          phase = "typing-tool";
        }
        break;
    }

    renderTypewriter(displayTool, displayRole);
    const speed = phase === "typing-tool" || phase === "typing-role" ? 80 : 40;
    setTimeout(tick, speed);
  }

  function renderTypewriter(tool, role) {
    els.heroTool.textContent = tool;
    els.heroRole.textContent = role;
  }

  renderTypewriter(displayTool, displayRole);
  setTimeout(tick, 80);
}

async function init() {
  els.footerRights.textContent = `© ${new Date().getFullYear()} ${strings.brand}. ${strings.footerRights}`;
  updateThemeButton();
  updateSortButton();
  setNavbarScrolled();
  wireTypewriter();

  let payload = window.__SKILLAETHER_DATA__;
  if (!payload) {
    const response = await fetch("./data/skills.json", { cache: "no-store" });
    payload = await response.json();
  }
  state.skills = payload.skills;
  state.categories = payload.categories;

  renderCategoryPills();
  renderGrid();
}

window.addEventListener("scroll", setNavbarScrolled);

els.searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  els.searchClearBtn.hidden = !state.search;
  resetVisibleCount();
  renderGrid();
});

els.searchClearBtn.addEventListener("click", () => {
  state.search = "";
  els.searchInput.value = "";
  els.searchClearBtn.hidden = true;
  resetVisibleCount();
  renderGrid();
});

els.sortToggleBtn.addEventListener("click", () => {
  state.sortBy = state.sortBy === "popular" ? "name" : "popular";
  updateSortButton();
  resetVisibleCount();
  renderGrid();
});

els.categoryPills.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) {
    return;
  }
  state.activeCategory = button.dataset.category;
  resetVisibleCount();
  renderCategoryPills();
  renderGrid();
});

els.loadMoreBtn.addEventListener("click", () => {
  state.visibleCount += 24;
  renderGrid();
});

els.skillModalClose.addEventListener("click", closeSkillModal);
els.skillModal.addEventListener("click", (event) => {
  if (event.target === els.skillModal) {
    closeSkillModal();
  }
});

els.supportOpen.addEventListener("click", openSupportModal);
els.supportModalClose.addEventListener("click", closeSupportModal);
els.supportSkipBtn.addEventListener("click", closeSupportModal);
els.supportModal.addEventListener("click", (event) => {
  if (event.target === els.supportModal) {
    closeSupportModal();
  }
});

els.themeToggle.addEventListener("click", toggleTheme);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSkillModal();
    closeSupportModal();
  }
});

init().catch((error) => {
  console.error(error);
  els.skillsCount.textContent = "Не удалось загрузить навыки.";
});
