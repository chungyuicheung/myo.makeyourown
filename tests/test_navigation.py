#!/usr/bin/env python3
"""
TDD Test Suite for ALL Navigation Links
Tests every page that has NAVIGATION_CONFIG
"""

from playwright.sync_api import sync_playwright
import sys

BASE_URL = "http://localhost:4444"

class TestResult:
    def __init__(self, name):
        self.name = name
        self.passed = False
        self.error = None

def get_all_pages_to_test():
    """All pages that should have header navigation with Okinawa/Hong Kong links."""
    return [
        # Main pages (root level)
        ("index.html", "Homepage"),
        ("trip.html", "Trip Index"),
        ("tv.html", "TV Page"),
        ("food.html", "Food Page"),
        ("heic-converter.html", "HEIC Converter"),

        # Archive pages
        ("archive/index2.html", "Archive Index 2"),
        ("archive/index_0.html", "Archive Index 0"),
        ("archive/index_system.html", "Archive System"),

        # Blog pages
        ("blog/article-template.html", "Blog Template"),
        ("blog/best-certificate-cover-hk-2026.html", "Blog: Certificate Cover"),
        ("blog/best-wedding-gifts-hk.html", "Blog: Wedding Gifts"),
        ("blog/hk-marriage-certificate-size-guide.html", "Blog: Certificate Size"),
        ("blog/hk-marriage-registration-checklist.html", "Blog: Registration Checklist"),
        ("blog/hk-marriage-registry-guide.html", "Blog: Registry Guide"),
        ("blog/how-to-preserve-marriage-certificate.html", "Blog: Preserve Certificate"),

        # Trip sub-pages
        ("trip/okinawa-trip.html", "Okinawa Trip Page"),
        ("trip/okinawa-food-craft-5days.html", "Okinawa Food Craft"),
        ("trip/okinawa-presentation.html", "Okinawa Presentation"),
        ("trip/hongkong/2025-07-09-red-incense-burner-peak.html", "Hong Kong Hike"),
    ]

def run_tests():
    results = []
    all_pages = get_all_pages_to_test()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for path, page_name in all_pages:
            url = BASE_URL + "/" + path

            # Test Okinawa link
            result = TestResult(f"{page_name} - Okinawa link exists")
            try:
                page = browser.new_page()
                page.goto(url)
                page.wait_for_load_state('domcontentloaded')
                page.wait_for_timeout(500)

                okinawa_links = page.locator("a[href*='okinawa-trip']").all()

                if len(okinawa_links) > 0:
                    result.passed = True
                else:
                    desktop_content = page.locator("#desktop-links").inner_html() if page.locator("#desktop-links").count() else ""
                    if "<!--" in desktop_content or not desktop_content.strip():
                        result.error = "Header nav not rendered"
                    else:
                        result.error = "Okinawa link not found"
                page.close()
            except Exception as e:
                result.error = str(e)[:100]
            results.append(result)

            # Test Hong Kong link
            result = TestResult(f"{page_name} - Hong Kong link exists")
            try:
                page = browser.new_page()
                page.goto(url)
                page.wait_for_load_state('domcontentloaded')
                page.wait_for_timeout(500)

                hk_links = page.locator("a[href*='hongkong']").all()

                if len(hk_links) > 0:
                    result.passed = True
                else:
                    desktop_content = page.locator("#desktop-links").inner_html() if page.locator("#desktop-links").count() else ""
                    if "<!--" in desktop_content or not desktop_content.strip():
                        result.error = "Header nav not rendered"
                    else:
                        result.error = "Hong Kong link not found"
                page.close()
            except Exception as e:
                result.error = str(e)[:100]
            results.append(result)

        browser.close()

    print("=" * 70)
    print("TDD TEST RESULTS - ALL Pages Navigation Links")
    print("=" * 70)

    passed = failed = 0
    current_page = None

    for result in results:
        page_name = result.name.split(" - ")[0]
        test_type = result.name.split(" - ")[-1] if " - " in result.name else result.name

        if page_name != current_page:
            print(f"\n{page_name}:")
            current_page = page_name

        status = "PASS" if result.passed else "FAIL"
        print(f"  [{status}] {test_type}")
        if result.error:
            print(f"         -> {result.error}")

        passed += 1 if result.passed else 0
        failed += 1 if not result.passed else 0

    print("\n" + "=" * 70)
    print(f"RESULTS: {passed}/{len(results)} passed ({failed} failed)")
    print("=" * 70)

    return failed == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
