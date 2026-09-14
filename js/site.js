/**
 * Jeevan Rohith Antony Manohar - Portfolio Site Interactions
 * Clean, lightweight, dependency-free JavaScript with Theme Switching
 */

(function () {
  "use strict";

  // --- Theme Management ---
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  
  function getPreferredTheme() {
    var stored = localStorage.getItem("portfolio-theme");
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    // Default to deep blue / dark theme
    return "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);

    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "dark" ? "#070f1e" : "#f8fafc");
    }

    var toggleBtns = document.querySelectorAll(".btn-theme-toggle");
    toggleBtns.forEach(function (btn) {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
      btn.setAttribute(
        "title",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    });
  }

  // Initialize theme immediately
  var currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // Set up click listener on all theme toggle buttons
  document.addEventListener("DOMContentLoaded", function () {
    var toggleBtns = document.querySelectorAll(".btn-theme-toggle");
    toggleBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var active = document.documentElement.getAttribute("data-theme") || "dark";
        var nextTheme = active === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
      });
    });
  });

  // --- Navigation & Header Logic ---
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var mobile = document.getElementById("mobile-nav");
  var iconMenu = toggle ? toggle.querySelector(".icon-menu") : null;
  var iconClose = toggle ? toggle.querySelector(".icon-close") : null;
  var navLinks = document.querySelectorAll(".nav-link[data-scroll]");
  var sections = document.querySelectorAll("section[id]");

  // --- Mobile Drawer Toggle ---
  function setMobileOpen(open) {
    if (!toggle || !mobile) return;
    mobile.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (iconMenu) iconMenu.hidden = open;
    if (iconClose) iconClose.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && mobile) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setMobileOpen(!mobile.classList.contains("is-open"));
    });

    // Close when clicking outside of mobile nav
    document.addEventListener("click", function (e) {
      if (mobile.classList.contains("is-open") && !mobile.contains(e.target) && !toggle.contains(e.target)) {
        setMobileOpen(false);
      }
    });
  }

  // --- Smooth Scrolling for Navigation ---
  document.querySelectorAll("[data-scroll]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var href = el.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = header ? header.offsetHeight : 72;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: "smooth" });
        setMobileOpen(false);
      }
    });
  });

  // --- Keyboard Accessibility ---
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobile && mobile.classList.contains("is-open")) {
      setMobileOpen(false);
    }
  });

  // --- Header Elevation on Scroll ---
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // --- Active Nav Link Spy ---
  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      var id = sec.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
})();
