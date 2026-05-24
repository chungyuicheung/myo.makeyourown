/* navigation.js - Shared dropdown navigation rendering */
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
        html += '<a href="' + item.href + '" class="text-sm transition-colors px-3 py-1.5 rounded-full text-gray-700 hover:text-indigo-600 bg-gray-100/80 flex items-center gap-1 cursor-pointer">';
        html += (item.emoji ? '<span class="mr-1">' + item.emoji + '</span>' : '');
        html += item.name + ' <span class="text-xs">▼</span></a>';
        html += '<div class="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[160px] hidden group-hover:block z-50">';
        for (var j = 0; j < item.children.length; j++) {
          var child = item.children[j];
          var childActive = child.href.indexOf(currentPage) === child.href.length - currentPage.length;
          var childCls = childActive ? 'block px-4 py-2 text-sm bg-indigo-50 text-indigo-700' : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600';
          html += '<a href="' + child.href + '" class="' + childCls + '">' + (child.emoji ? '<span class="mr-1">' + child.emoji + '</span>' : '') + child.name + '</a>';
        }
        html += '</div></div>';
      } else {
        var isActive = !isAnchor && (item.href.indexOf(currentPage) === item.href.length - currentPage.length);
        var cls = 'text-sm transition-colors px-3 py-1.5 rounded-full';
        if (isAnchor) {
          cls += ' text-gray-300 hover:text-indigo-400';
        } else {
          cls += isActive ? ' bg-indigo-100/80 text-indigo-800' : ' text-gray-700 hover:text-indigo-600 bg-gray-100/80';
        }
        var emoji = item.emoji ? '<span class="mr-1">' + item.emoji + '</span>' : '';
        html += '<a href="' + item.href + '" class="' + cls + '">' + emoji + item.name + '</a>';
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
      var isActive = !isAnchor && (item.href.indexOf(currentPage) === item.href.length - currentPage.length);
      var cls = 'text-base py-2 border-b border-gray-100';
      if (isAnchor) {
        cls += ' text-gray-300 hover:text-indigo-400';
      } else {
        cls += isActive ? ' text-indigo-600 font-semibold' : ' text-gray-700 hover:text-indigo-600';
      }
      var emoji = item.emoji ? item.emoji + ' ' : '';

      if (item.children) {
        html += '<div class="border-b border-gray-100 py-2">';
        html += '<a href="' + item.href + '" class="' + cls + '">' + emoji + item.name + '</a>';
        html += '<div class="pl-4 mt-1 space-y-1">';
        for (var j = 0; j < item.children.length; j++) {
          var child = item.children[j];
          var childActive = child.href.indexOf(currentPage) === child.href.length - currentPage.length;
          var childCls = childActive ? 'block py-1 text-indigo-600 font-semibold' : 'block py-1 text-gray-600 hover:text-indigo-600';
          html += '<a href="' + child.href + '" class="' + childCls + '">' + (child.emoji ? child.emoji + ' ' : '') + child.name + '</a>';
        }
        html += '</div></div>';
      } else {
        html += '<a href="' + item.href + '" class="' + cls + '">' + emoji + item.name + '</a>';
      }
    }
    container.innerHTML = html;
  }

  root.NavigationRenderer = {
    renderDesktopLinks: renderDesktopLinks,
    renderMobileLinks: renderMobileLinks
  };

})(typeof window !== 'undefined' ? window : this);