// assets/js/chronicle.js
// 探索編年史 — 渲染垂直時間軸與學習洞察

(function () {
  'use strict';

  const FILTER_STORAGE_KEY = 'chronicle-filter';
  const TYPE_LABELS = { commit: 'commit', session: 'session', launch: '上線', note: '筆記', milestone: '里程碑' };
  const TYPE_SERIF = { launch: true, session: true }; // render in serif display font

  if (typeof chronicleData !== 'undefined') {
    const events = chronicleData.events;

    const learnings = computeLearnings(events);
    renderLearnings(learnings);

    renderTimeline(events);
    setupFilters(events);
    populateYearJumps(events);
    restoreFilterState(events);
  } else {
    const tl = document.getElementById('timeline');
    if (tl) tl.innerHTML = '<div class="empty-state">無法載入編年史資料</div>';
  }

  // ===================================================================
  //  Learnings — compute data insights
  // ===================================================================

  function computeLearnings(events) {
    if (!events || events.length === 0) return null;

    const total = events.length;

    // By type
    const byType = {};
    events.forEach(function (e) {
      byType[e.type] = (byType[e.type] || 0) + 1;
    });

    // Date range
    var dates = events.map(function (e) { return e.date; }).sort();
    var firstDate = dates[0];
    var lastDate = dates[dates.length - 1];

    // Total months spanned
    var first = new Date(firstDate);
    var last = new Date(lastDate);
    var totalMonths = (last.getFullYear() - first.getFullYear()) * 12 +
                      (last.getMonth() - first.getMonth()) + 1;

    // Monthly activity
    var byMonth = {};
    events.forEach(function (e) {
      var mk = e.date.slice(0, 7);
      byMonth[mk] = (byMonth[mk] || 0) + 1;
    });

    var monthEntries = Object.keys(byMonth)
      .sort()
      .map(function (m) { return { month: m, count: byMonth[m] }; });

    var maxCount = 1;
    var mostActiveMonth = '';
    Object.keys(byMonth).forEach(function (m) {
      if (byMonth[m] > maxCount) {
        maxCount = byMonth[m];
        mostActiveMonth = m;
      }
    });

    // Top tags
    var tagCounts = {};
    events.forEach(function (e) {
      (e.tags || []).forEach(function (t) {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });
    var topTags = Object.keys(tagCounts)
      .sort(function (a, b) { return tagCounts[b] - tagCounts[a]; })
      .slice(0, 5)
      .map(function (t) { return { tag: t, count: tagCounts[t] }; });

    return {
      total: total,
      byType: byType,
      firstDate: firstDate,
      lastDate: lastDate,
      totalMonths: totalMonths,
      mostActiveMonth: mostActiveMonth,
      maxCount: maxCount,
      monthActivity: monthEntries,
      topTags: topTags,
    };
  }

  // ===================================================================
  //  Render Learnings
  // ===================================================================

  function renderLearnings(l) {
    var container = document.getElementById('learnings');
    if (!container || !l) return;

    // Stats row: always show total + meaningful breakdowns
    var html = '';

    html += '<div class="learnings-header">';
    html += '<h2 class="learnings-title">探索足跡</h2>';
    html += '<span class="learnings-subtitle">'
          + l.firstDate.slice(0, 4) + '年' + parseInt(l.firstDate.slice(5, 7), 10) + '月'
          + ' — '
          + l.lastDate.slice(0, 4) + '年' + parseInt(l.lastDate.slice(5, 7), 10) + '月'
          + '</span>';
    html += '</div>';

    // Stat cards row
    html += '<div class="stat-row">';
    html += statCard(l.total, '探索事件');
    if (l.byType.commit) html += statCard(l.byType.commit, '次開發提交');
    if (l.byType.launch) html += statCard(l.byType.launch, '次新頁面');
    if (l.byType.session) html += statCard(l.byType.session, '次探索');
    html += '</div>';

    // Monthly activity mini-chart
    if (l.monthActivity && l.monthActivity.length > 1) {
      html += '<div class="chart-section">';
      html += '<span class="chart-label">活動節奏</span>';
      html += '<div class="mini-chart">';
      l.monthActivity.forEach(function (m) {
        var px = Math.max(4, Math.round((m.count / l.maxCount) * 48));
        var label = m.month.slice(5, 7) + '月';
        html += '<div class="mini-bar-wrap" title="' + m.month + ' · ' + m.count + ' 次">';
        html += '<div class="mini-bar" style="height:' + px + 'px"></div>';
        html += '<span class="mini-bar-label">' + label + '</span>';
        html += '</div>';
      });
      html += '</div>';

      // highlight most active
      if (l.mostActiveMonth) {
        var maY = l.mostActiveMonth.slice(0, 4);
        var maM = parseInt(l.mostActiveMonth.slice(5, 7), 10);
        html += '<span class="chart-note">最活躍 · '
              + maY + '年' + maM + '月（' + l.maxCount + ' 次事件）</span>';
      }
      html += '</div>';
    }

    // Top tags
    if (l.topTags && l.topTags.length > 0) {
      html += '<div class="tag-row">';
      l.topTags.forEach(function (t) {
        html += '<span class="tag-pill">' + escapeHtml(t.tag) + ' <span class="tag-count">' + t.count + '</span></span>';
      });
      html += '</div>';
    }

    container.innerHTML = html;
  }

  function statCard(num, label) {
    return '<div class="stat-card">'
         + '<span class="stat-number">' + num + '</span>'
         + '<span class="stat-label">' + label + '</span>'
         + '</div>';
  }

  // ===================================================================
  //  Timeline rendering
  // ===================================================================

  function renderTimeline(events) {
    var byYear = groupBy(events, function (e) { return e.date.slice(0, 4); });
    var sortedYears = Object.keys(byYear).sort(function (a, b) { return b.localeCompare(a); });

    var container = document.getElementById('timeline');
    var html = '';

    sortedYears.forEach(function (year) {
      var yearEvents = byYear[year];
      var byMonth = groupBy(yearEvents, function (e) { return e.date.slice(5, 7); });
      var sortedMonths = Object.keys(byMonth).sort(function (a, b) { return b.localeCompare(a); });

      // Year heading with event count
      html += '<section class="year-section" data-year="' + year + '">';
      html += '<h2 class="year-heading">'
            + year
            + ' <span class="year-count">' + yearEvents.length + ' 件事</span>'
            + '</h2>';

      sortedMonths.forEach(function (month) {
        var monthEvents = byMonth[month];
        var monthName = getMonthName(month);
        var openAttr = ' open';

        html += '<details class="month-section" data-year="' + year + '" data-month="' + month + '"' + openAttr + '>';
        html += '<summary class="month-summary">'
              + monthName
              + ' <span class="month-badge">' + monthEvents.length + '</span>'
              + '</summary>';

        // Sort events descending within month
        monthEvents.sort(function (a, b) { return b.date.localeCompare(a.date); });

        monthEvents.forEach(function (evt) {
          html += renderEvent(evt);
        });

        html += '</details>';
      });

      html += '</section>';
    });

    container.innerHTML = html;
  }

  // ===================================================================
  //  Single event card
  // ===================================================================

  function renderEvent(evt) {
    var type = evt.type || 'note';

    if (type === 'milestone') {
      return renderMilestone(evt);
    }

    var displayDate = evt.date.slice(5);
    var hasLink = evt.link || evt.sessionId;

    var linkUrl = '';
    if (evt.link) linkUrl = evt.link;
    else if (evt.sessionId) linkUrl = 'https://opencode.ai/session/' + evt.sessionId;

    var tagsHtml = (evt.tags || [])
      .map(function (t) { return '<span class="event-tag">' + escapeHtml(t) + '</span>'; })
      .join('');

    var titleClass = TYPE_SERIF[type] ? 'event-title event-title-serif' : 'event-title';
    var typeLabel = TYPE_LABELS[type] || type;

    var imageHtml = '';
    if (evt.imageUrl) {
      imageHtml = '<div class="event-image-group">';
      imageHtml += '<div class="event-image event-image-desktop">'
        + '<img src="' + escapeHtml(evt.imageUrl) + '" alt="' + escapeHtml(evt.title) + ' 桌面版" loading="lazy">'
        + '<span class="event-image-label">桌面版</span>'
        + '</div>';
      if (evt.imageUrlMobile) {
        imageHtml += '<div class="event-image event-image-mobile">'
          + '<img src="' + escapeHtml(evt.imageUrlMobile) + '" alt="' + escapeHtml(evt.title) + ' 手機版" loading="lazy">'
          + '<span class="event-image-label">手機版</span>'
          + '</div>';
      }
      imageHtml += '</div>';
    }

    return '<div class="event-card type-' + type + '" data-type="' + type + '" data-date="' + evt.date + '">'
         + '<div class="event-marker"></div>'
         + '<div class="event-body">'
         +   '<div class="event-head">'
         +     '<time class="event-date">' + displayDate + '</time>'
         +     '<span class="event-type-pill">' + typeLabel + '</span>'
         +   '</div>'
         +   '<div class="' + titleClass + '">'
         +     (hasLink
         ? '<a href="' + linkUrl + '" target="_blank" rel="noopener">' + escapeHtml(evt.title) + '</a>'
         : escapeHtml(evt.title))
         +   '</div>'
         +   (evt.description ? '<div class="event-desc">' + escapeHtml(evt.description) + '</div>' : '')
         +   imageHtml
         +   (tagsHtml ? '<div class="event-tags">' + tagsHtml + '</div>' : '')
         + '</div>'
         + '</div>';
  }

  // ===================================================================
  //  Milestone card — full-width annotation for learning summary
  // ===================================================================

  function renderMilestone(evt) {
    var tagsHtml = (evt.tags || [])
      .map(function (t) { return '<span class="event-tag">' + escapeHtml(t) + '</span>'; })
      .join('');

    return '<div class="milestone-card">'
         + '<div class="milestone-icon">✦</div>'
         + '<div class="milestone-body">'
         +   '<time class="milestone-date">' + evt.date + '</time>'
         +   '<h3 class="milestone-title">' + escapeHtml(evt.title) + '</h3>'
         +   '<p class="milestone-desc">' + escapeHtml(evt.description) + '</p>'
         +   (tagsHtml ? '<div class="milestone-tags">' + tagsHtml + '</div>' : '')
         + '</div>'
         + '</div>';
  }

  // ===================================================================
  //  Filter
  // ===================================================================

  function setupFilters(events) {
    var buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.dataset.filter;
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        try { localStorage.setItem(FILTER_STORAGE_KEY, filter); } catch (_) {}
        applyFilter(filter, events);
      });
    });
  }

  function applyFilter(filter, events) {
    var cards = document.querySelectorAll('.event-card');
    var sections = document.querySelectorAll('.month-section');
    var years = document.querySelectorAll('.year-section');

    cards.forEach(function (card) {
      if (filter === 'all') {
        card.classList.remove('event-hidden');
      } else if (filter === 'milestones') {
        if (card.dataset.type === 'launch') {
          card.classList.remove('event-hidden');
        } else {
          card.classList.add('event-hidden');
        }
      } else if (card.dataset.type === filter) {
        card.classList.remove('event-hidden');
      } else {
        card.classList.add('event-hidden');
      }
    });

    sections.forEach(function (section) {
      var visible = section.querySelectorAll('.event-card:not(.event-hidden)');
      var hasMilestone = section.querySelector('.milestone-card');
      if (visible.length === 0 && !hasMilestone) {
        section.classList.add('event-hidden');
      } else {
        section.classList.remove('event-hidden');
      }
    });

    years.forEach(function (yr) {
      var visible = yr.querySelectorAll('.month-section:not(.event-hidden)');
      if (visible.length === 0) {
        yr.classList.add('event-hidden');
      } else {
        yr.classList.remove('event-hidden');
      }
    });
  }

  function restoreFilterState(events) {
    try {
      var saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        var btn = document.querySelector('.filter-btn[data-filter="' + saved + '"]');
        if (btn) btn.click();
      }
    } catch (_) {}
  }

  // ===================================================================
  //  Year jumps
  // ===================================================================

  function populateYearJumps(events) {
    var byYear = groupBy(events, function (e) { return e.date.slice(0, 4); });
    var years = Object.keys(byYear).sort(function (a, b) { return b.localeCompare(a); });
    var container = document.getElementById('year-jumps');

    var html = years.map(function (y) {
      return '<a href="#" class="year-jump" data-year="' + y + '">' + y + '</a>';
    }).join('<span class="jump-sep">·</span>');

    container.innerHTML = html;

    container.addEventListener('click', function (e) {
      var target = e.target.closest('.year-jump');
      if (!target) return;
      e.preventDefault();
      var year = target.dataset.year;
      var section = document.querySelector('.year-section[data-year="' + year + '"]');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ===================================================================
  //  Utilities
  // ===================================================================

  function groupBy(arr, fn) {
    var map = {};
    for (var i = 0; i < arr.length; i++) {
      var key = fn(arr[i]);
      if (!map[key]) map[key] = [];
      map[key].push(arr[i]);
    }
    return map;
  }

  function getMonthName(m) {
    var names = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
    return names[parseInt(m, 10) - 1] || m;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
