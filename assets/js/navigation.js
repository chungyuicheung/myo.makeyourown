/* navigation.js - Shared dropdown navigation rendering (Hallmark-clean) */
(function(root) {
  'use strict';

  function renderDesktopLinks(items, currentPage) {
    var container = document.getElementById('desktop-links');
    if (!container) return;
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var isAnchor = item.anchor;

      if (item.children) {
        html += '<div class="relative group">';
        html += '<a href="' + item.href + '" class="text-sm transition-colors px-3 py-1.5 rounded-full text-gray-700 bg-gray-100/80 flex items-center gap-1 cursor-pointer nav-hover">' + (item.emoji ? '<span class="mr-1">' + item.emoji + '</span>' : '') + item.name + ' <span class="text-xs">▼</span></a>';
        html += '<div class="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-2 min-w-[160px] hidden group-hover:block z-50" style="border-color: var(--color-rule, #e5e7eb);">';
        for (var j = 0; j < item.children.length; j++) {
          var child = item.children[j];
          var childActive = child.href.indexOf(currentPage) === child.href.length - currentPage.length;
          var childStyle = childActive
            ? 'display: block; padding: 0.5rem 1rem; font-size: 0.875rem; background-color: var(--color-accent-light, #f5f3ff); color: var(--color-accent, #4338ca);'
            : 'display: block; padding: 0.5rem 1rem; font-size: 0.875rem; color: var(--color-ink-2, #4a5568);';
          html += '<a href="' + child.href + '" style="' + childStyle + '">' + (child.emoji ? '<span class="mr-1">' + child.emoji + '</span>' : '') + child.name + '</a>';
        }
        html += '</div></div>';
      } else {
        var isActive = !isAnchor && (item.href.indexOf(currentPage) === currentPage.length - currentPage.length);
        var style;
        if (isAnchor) {
          style = 'font-size: 0.875rem; transition: color 0.2s; padding: 0.375rem 0.75rem; border-radius: 9999px; color: var(--color-gray-300, #d1d5db);';
        } else if (isActive) {
          style = 'font-size: 0.875rem; transition: color 0.2s; padding: 0.375rem 0.75rem; border-radius: 9999px; background-color: var(--color-accent-light, #f5f3ff); color: var(--color-accent, #4338ca);';
        } else {
          style = 'font-size: 0.875rem; transition: color 0.2s; padding: 0.375rem 0.75rem; border-radius: 9999px; color: var(--color-ink-2, #4a5568);';
        }
        var emoji = item.emoji ? '<span class="mr-1">' + item.emoji + '</span>' : '';
        html += '<a href="' + item.href + '" style="' + style + '">' + emoji + item.name + '</a>';
      }
    }
    container.innerHTML = html;
  }

  function renderMobileLinks(items, currentPage) {
    var container = document.querySelector('#mobile-menu #mobile-links');
    if (!container) return;
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var isAnchor = item.anchor;
      var isActive = !isAnchor && (item.href.indexOf(currentPage) === currentPage.length - currentPage.length);
      var baseStyle = 'display: block; padding: 0.5rem 0; border-bottom: 1px solid var(--color-rule, #e5e7eb);';
      var style;
      if (isAnchor) {
        style = baseStyle + ' color: var(--color-gray-300, #d1d5db);';
      } else if (isActive) {
        style = baseStyle + ' color: var(--color-accent, #4338ca); font-weight: 600;';
      } else {
        style = baseStyle + ' color: var(--color-ink-2, #4a5568);';
      }
      var emoji = item.emoji ? item.emoji + ' ' : '';

      if (item.children) {
        html += '<div style="border-bottom: 1px solid var(--color-rule, #e5e7eb); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">';
        html += '<a href="' + item.href + '" style="' + style + '">' + emoji + item.name + '</a>';
        html += '<div style="padding-left: 1rem; margin-top: 0.25rem;">';
        for (var j = 0; j < item.children.length; j++) {
          var child = item.children[j];
          var childActive = child.href.indexOf(currentPage) === child.href.length - currentPage.length;
          var childStyle = childActive
            ? 'display: block; padding: 0.25rem 0; color: var(--color-accent, #4338ca); font-weight: 600;'
            : 'display: block; padding: 0.25rem 0; color: var(--color-ink-2, #4a5568);';
          html += '<a href="' + child.href + '" style="' + childStyle + '">' + (child.emoji ? child.emoji + ' ' : '') + child.name + '</a>';
        }
        html += '</div></div>';
      } else {
        html += '<a href="' + item.href + '" style="' + style + '">' + emoji + item.name + '</a>';
      }
    }
    container.innerHTML = html;
  }

  root.NavigationRenderer = {
    renderDesktopLinks: renderDesktopLinks,
    renderMobileLinks: renderMobileLinks
  };

})(typeof window !== 'undefined' ? window : this);