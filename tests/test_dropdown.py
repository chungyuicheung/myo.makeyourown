#!/usr/bin/env python3
"""
TDD Tests for Option C - Dropdown Navigation Menus
"""

from playwright.sync_api import sync_playwright
import sys

BASE_URL = "http://localhost:4444"

class TestResult:
    def __init__(self, name):
        self.name = name
        self.passed = False
        self.error = None

def test_dropdown_structure():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(BASE_URL + "/index.html")
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(1000)

        result = TestResult("Homepage - has dropdown containers")
        try:
            dropdowns = page.locator(".relative.group").all()
            if len(dropdowns) >= 2:
                result.passed = True
            else:
                result.error = f"Found {len(dropdowns)}, expected 2"
        except Exception as e:
            result.error = str(e)[:100]
        results.append(result)

        result = TestResult("Homepage - has 旅程 dropdown with sub-items")
        try:
            dropdown = page.locator(".relative.group a[href='trip.html'] + div").first
            html = dropdown.inner_html() if dropdown.count() else ""
            if "okinawa-food-craft-5days" in html and "okinawa-presentation" in html:
                result.passed = True
            else:
                result.error = "Missing expected sub-pages"
        except Exception as e:
            result.error = str(e)[:100]
        results.append(result)

        browser.close()
    return results

def test_dropdown_functionality():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.goto(BASE_URL + "/index.html")
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(1000)

        result = TestResult("Homepage - dropdown opens on hover")
        try:
            trigger = page.locator(".relative.group a[href='trip.html']").first
            if trigger.count() > 0:
                trigger.hover()
                page.wait_for_timeout(500)
                is_visible = page.locator(".relative.group a[href='trip.html'] + div").first.is_visible()
                result.passed = is_visible
                if not is_visible:
                    result.error = "Dropdown not visible after hover"
            else:
                result.error = "旅程 trigger not found"
        except Exception as e:
            result.error = str(e)[:100]
        results.append(result)

        browser.close()
    return results

def test_all_dropdown_links_accessible():
    results = []
    dropdown_pages = [
        ("okinawa-food-craft-5days", "Okinawa Food Craft", "trip.html"),
        ("okinawa-presentation", "Okinawa Presentation", "trip.html"),
        ("best-wedding-gifts-hk", "Blog Wedding Gifts", "blog/best-wedding-gifts-hk.html"),
        ("hk-marriage-registry-guide", "Blog Registry Guide", "blog/best-wedding-gifts-hk.html"),
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        for url_part, test_name, parent in dropdown_pages:
            result = TestResult(f"{test_name} - via dropdown")
            try:
                page.goto(BASE_URL + "/index.html")
                page.wait_for_load_state('domcontentloaded')

                trigger = page.locator(f".relative.group a[href='{parent}']").first
                if trigger.count() > 0:
                    trigger.hover()
                    page.wait_for_timeout(500)

                    dropdown = page.locator(f".relative.group a[href='{parent}'] + div")
                    link = dropdown.locator(f"a[href*='{url_part}']").first

                    if link.count() > 0:
                        link.click()
                        page.wait_for_load_state('domcontentloaded')
                        # Check if URL contains the target path (with or without .html)
                        if url_part in page.url.replace(".html", ""):
                            result.passed = True
                        else:
                            result.error = f"Landed on {page.url}"
                    else:
                        result.error = f"Link not found: {url_part}"
                else:
                    result.error = f"Trigger not found: {parent}"
            except Exception as e:
                result.error = str(e)[:100]
            results.append(result)

        browser.close()
    return results

def test_navigation_module_exists():
    """Test that navigation.js module exists as external file"""
    results = []
    import os

    # Test that navigation.js exists
    result = TestResult("navigation.js module exists")
    nav_path = "/Users/baba/Documents/Github/myo.makeyourown/assets/js/navigation.js"
    if os.path.exists(nav_path):
        result.passed = True
    else:
        result.error = f"navigation.js not found at {nav_path}"
    results.append(result)

    # Test that component file uses the module
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(BASE_URL + "/index.html")
        page.wait_for_load_state('domcontentloaded')

        result = TestResult("navigation.js is loaded by index.html")
        try:
            scripts = page.evaluate("""() => {
                return Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
            }""")
            has_nav_module = any('navigation.js' in s for s in scripts)
            if has_nav_module:
                result.passed = True
            else:
                result.error = f"No navigation.js script found. Scripts: {scripts}"
        except Exception as e:
            result.error = str(e)[:100]
        results.append(result)

        browser.close()

    return results


def test_mobile_viewport():
    """Test dropdown behavior at mobile viewport (375px)"""
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 375, "height": 667})
        page.goto(BASE_URL + "/index.html")
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(500)

        # Test mobile menu opens
        result = TestResult("Mobile - menu toggle works at 375px")
        try:
            menu_btn = page.locator("#mobile-menu-btn")
            if menu_btn.count() > 0:
                menu = page.locator("#mobile-menu")
                menu_btn.click()
                page.wait_for_timeout(300)
                is_visible = menu.locator("#mobile-links").is_visible()
                result.passed = is_visible
                if not is_visible:
                    result.error = "Mobile menu not visible after toggle"
            else:
                result.error = "Mobile menu button not found"
        except Exception as e:
            result.error = str(e)[:100]
        results.append(result)

        # Test dropdown children visible on mobile
        result = TestResult("Mobile - dropdown children visible at 375px")
        try:
            # Menu should already be open from previous test
            mobile_links = page.locator("#mobile-links")
            html = mobile_links.inner_html() if mobile_links.count() > 0 else ""
            # Check for 旅程 and 文章 as dropdown parents
            has_journey = "旅程" in html or "trip.html" in html
            has_article = "文章" in html or "best-wedding-gifts-hk.html" in html
            if has_journey and has_article:
                result.passed = True
            else:
                result.error = f"Missing dropdowns. Has journey: {has_journey}, has article: {has_article}"
        except Exception as e:
            result.error = str(e)[:100]
        results.append(result)

        browser.close()

    return results


def test_other_pages_dropdowns():
    """Test that dropdowns work on other pages besides index.html"""
    results = []

    pages_to_test = [
        ("/trip.html", "Trip page"),
        ("/trip/okinawa-trip.html", "Okinawa trip detail"),
        ("/blog/best-wedding-gifts-hk.html", "Blog article"),
        ("/tv.html", "TV page"),
        ("/food.html", "Food page"),
        ("/heic-converter.html", "HEIC converter"),
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for path, name in pages_to_test:
            result = TestResult(f"{name} - has 2+ dropdowns")
            try:
                page = browser.new_page(viewport={"width": 1280, "height": 800})
                page.goto(BASE_URL + path, timeout=10000)
                page.wait_for_load_state('domcontentloaded', timeout=10000)
                page.wait_for_timeout(500)

                dropdowns = page.locator(".relative.group").all()
                if len(dropdowns) >= 2:
                    result.passed = True
                else:
                    result.error = f"Found {len(dropdowns)} dropdowns, expected 2+"
                page.close()
            except Exception as e:
                result.error = str(e)[:100]
                try:
                    page.close()
                except:
                    pass
            results.append(result)

        browser.close()

    return results


def run_all_tests():
    all_results = []

    print("=" * 70)
    print("TDD OPTION C - DROPDOWN MENU TESTS")
    print("=" * 70)

    print("\n[1] Structure tests")
    for r in test_dropdown_structure():
        all_results.append(r)
        status = "PASS" if r.passed else "FAIL"
        print(f"  [{status}] {r.name}")
        if r.error:
            print(f"         -> {r.error}")

    print("\n[2] Functionality tests")
    for r in test_dropdown_functionality():
        all_results.append(r)
        status = "PASS" if r.passed else "FAIL"
        print(f"  [{status}] {r.name}")
        if r.error:
            print(f"         -> {r.error}")

    print("\n[3] Link access tests")
    for r in test_all_dropdown_links_accessible():
        all_results.append(r)
        status = "PASS" if r.passed else "FAIL"
        print(f"  [{status}] {r.name}")
        if r.error:
            print(f"         -> {r.error}")

    print("\n[4] Navigation module tests")
    for r in test_navigation_module_exists():
        all_results.append(r)
        status = "PASS" if r.passed else "FAIL"
        print(f"  [{status}] {r.name}")
        if r.error:
            print(f"         -> {r.error}")

    print("\n[5] Mobile viewport tests (375px)")
    for r in test_mobile_viewport():
        all_results.append(r)
        status = "PASS" if r.passed else "FAIL"
        print(f"  [{status}] {r.name}")
        if r.error:
            print(f"         -> {r.error}")

    print("\n[6] Other pages dropdown tests")
    for r in test_other_pages_dropdowns():
        all_results.append(r)
        status = "PASS" if r.passed else "FAIL"
        print(f"  [{status}] {r.name}")
        if r.error:
            print(f"         -> {r.error}")

    passed = sum(1 for r in all_results if r.passed)
    failed = sum(1 for r in all_results if not r.passed)

    print("\n" + "=" * 70)
    print(f"RESULTS: {passed}/{len(all_results)} passed ({failed} failed)")
    print("=" * 70)

    return failed == 0

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
