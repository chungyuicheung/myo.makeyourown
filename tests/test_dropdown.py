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

    passed = sum(1 for r in all_results if r.passed)
    failed = sum(1 for r in all_results if not r.passed)

    print("\n" + "=" * 70)
    print(f"RESULTS: {passed}/{len(all_results)} passed ({failed} failed)")
    print("=" * 70)

    return failed == 0

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
