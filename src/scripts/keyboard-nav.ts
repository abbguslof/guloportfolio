// src/scripts/keyboard-nav.ts - Global cockpit keyboard navigation
// Supports Tab, Shift+Tab, Enter, Space, Escape, and Arrow keys across all pages and browsers

export function initKeyboardNav(): void {
  if ((window as any).__keyboard_nav_initialized) return;
  (window as any).__keyboard_nav_initialized = true;

  // Track element blurred via Escape so subsequent Tab resumes from its position
  let lastBlurredElement: HTMLElement | null = null;

  document.addEventListener('pointerdown', () => {
    lastBlurredElement = null;
    (window as any).__lastBlurredElement = null;
  });

  // Helper to query all currently visible, interactive elements on the page in DOM order
  function getVisibleFocusables(): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex="0"]',
      '.file-card-header',
      '.cat-toggle-card',
      '.proj-filter-btn',
      '.file-cat-btn',
      '.tag-filter-btn'
    ].join(', ');

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));

    return nodes.filter((el) => {
      // Exclude hidden elements or elements marked tabindex="-1"
      if (el.getAttribute('tabindex') === '-1') return false;
      if (el.closest('.hidden')) return false;
      if (el.classList.contains('sr-only') && el.id !== 'skip-link') return false;
      if (el.offsetParent === null && el.tagName !== 'BODY') return false;

      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return false;
      }
      return true;
    });
  }

  // Find the first meaningful content element below the header/terminal
  function getFirstContentElement(): HTMLElement | null {
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
    if (isHomePage) {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const candidate = projectsSection.querySelector<HTMLElement>(
          'a[href], button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])'
        );
        if (candidate) return candidate;
      }
    }

    const main = document.getElementById('main-content');
    if (main) {
      const candidates = Array.from(main.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"], .cat-toggle-card, .proj-filter-btn, .file-cat-btn, .file-card-header'
      )).filter((el) => {
        if (el.getAttribute('tabindex') === '-1') return false;
        if (el.closest('#terminal-window')) return false;
        if (el.closest('.hidden')) return false;
        if (el.classList.contains('sr-only')) return false;
        if (el.offsetParent === null) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        return true;
      });

      if (candidates.length > 0) return candidates[0];
    }

    return null;
  }

  // Setup Skip to content link to jump directly to first interactive content
  function setupSkipLink(): void {
    const skipLink = document.getElementById('skip-link') || document.querySelector<HTMLAnchorElement>('a[href="#main-content"]');
    if (!skipLink) return;

    function handleSkipActivation(e: Event) {
      e.preventDefault();
      const firstContent = getFirstContentElement();
      if (firstContent) {
        firstContent.focus();
        firstContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const main = document.getElementById('main-content');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
          main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    skipLink.addEventListener('click', handleSkipActivation);
    skipLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleSkipActivation(e);
      }
    });
  }

  setupSkipLink();

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const active = document.activeElement as HTMLElement | null;

    // ------------------------------------------------------------------------
    // 1. ESCAPE KEY HANDLING
    // ------------------------------------------------------------------------
    if (e.key === 'Escape') {
      if (active) {
        // Deselect / blur active terminal input or search inputs
        if (
          active.id === 'terminal-input' ||
          active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA'
        ) {
          e.preventDefault();
          lastBlurredElement = active;
          (window as any).__lastBlurredElement = active;
          active.blur();
          return;
        }
      }
    }

    // ------------------------------------------------------------------------
    // 2. TERMINAL INPUT SPECIAL BEHAVIOR
    // ------------------------------------------------------------------------
    // Inside the terminal input:
    // Tab MUST trigger terminal command auto-completion without interference
    if (active && active.id === 'terminal-input') {
      if (e.key === 'Tab') {
        // Let the terminal's own keydown listener handle auto-completion
        return;
      }
      // ArrowUp and ArrowDown are handled by terminal for history
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        return;
      }
    }

    // ------------------------------------------------------------------------
    // 3. SEARCH INPUTS: Tab and ArrowDown navigation out of search bar
    // ------------------------------------------------------------------------
    const isSearchInput =
      active &&
      active.tagName === 'INPUT' &&
      active.id !== 'terminal-input' &&
      (active.id.includes('search') || active.getAttribute('type') === 'text');

    if (isSearchInput && active) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const focusables = getVisibleFocusables();
        const idx = focusables.indexOf(active);
        if (idx !== -1 && idx < focusables.length - 1) {
          focusables[idx + 1].focus();
          return;
        }
      }
      // Allow regular typing, text selection and cursor movement in search input.
      // Tab, Shift+Tab, and Escape fall through to global navigation.
      if (e.key !== 'Tab' && e.key !== 'Escape' && e.key !== 'Enter') {
        return;
      }
    }

    // ------------------------------------------------------------------------
    // 4. ENTER & SPACE ON CUSTOM BUTTONS / ACCORDIONS
    // ------------------------------------------------------------------------
    if (
      active &&
      (e.key === 'Enter' || e.key === ' ') &&
      !['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(active.tagName)
    ) {
      if (active.getAttribute('role') === 'button' || active.getAttribute('tabindex') === '0' || active.classList.contains('file-card-header')) {
        e.preventDefault();
        active.click();
        return;
      }
    }

    // ------------------------------------------------------------------------
    // 5. GLOBAL TAB & SHIFT+TAB ROVING NAVIGATION
    // ------------------------------------------------------------------------
    if (e.key === 'Tab') {
      const focusables = getVisibleFocusables();
      if (focusables.length === 0) return;

      let referenceElement = active;
      if (!referenceElement || referenceElement === document.body) {
        const candidate = lastBlurredElement || (window as any).__lastBlurredElement;
        if (candidate && document.contains(candidate)) {
          referenceElement = candidate;
        }
      }
      lastBlurredElement = null;
      (window as any).__lastBlurredElement = null;

      const currentIndex = referenceElement ? focusables.indexOf(referenceElement) : -1;

      e.preventDefault();

      if (e.shiftKey) {
        // Shift+Tab: Move backward
        const targetIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
        focusables[targetIndex].focus();
      } else {
        // Tab: Move forward
        const targetIndex = currentIndex === -1 || currentIndex >= focusables.length - 1 ? 0 : currentIndex + 1;
        focusables[targetIndex].focus();
      }
      return;
    }

    // ------------------------------------------------------------------------
    // 6. ARROW KEYS NAVIGATION
    // ------------------------------------------------------------------------
    const isArrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
    if (!isArrow || !active) return;

    // A. Header navigation bar items
    const headerNav = active.closest('#header-nav');
    if (headerNav) {
      const items = Array.from(headerNav.querySelectorAll<HTMLElement>('a, button')).filter(
        (el) => el.offsetParent !== null && !el.hasAttribute('disabled')
      );
      const currentIndex = items.indexOf(active);
      if (currentIndex !== -1 && items.length > 1) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = items[(currentIndex + 1) % items.length];
          next.focus();
          return;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = items[(currentIndex - 1 + items.length) % items.length];
          prev.focus();
          return;
        }
      }
    }

    // B. Projects filter buttons (.proj-filter-btn)
    if (active.classList.contains('proj-filter-btn')) {
      const filterGroup = Array.from(document.querySelectorAll<HTMLButtonElement>('.proj-filter-btn')).filter(
        (btn) => btn.offsetParent !== null
      );
      const idx = filterGroup.indexOf(active as HTMLButtonElement);
      if (idx !== -1 && filterGroup.length > 1) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const targetIndex = (idx + 1) % filterGroup.length;
          filterGroup[targetIndex].focus();
          filterGroup[targetIndex].click();
          return;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const targetIndex = (idx - 1 + filterGroup.length) % filterGroup.length;
          filterGroup[targetIndex].focus();
          filterGroup[targetIndex].click();
          return;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const searchInput = document.getElementById('project-search-input');
          if (searchInput) searchInput.focus();
          return;
        }
      }
    }

    // C. Files category buttons (.file-cat-btn)
    if (active.classList.contains('file-cat-btn')) {
      const catGroup = Array.from(document.querySelectorAll<HTMLButtonElement>('.file-cat-btn')).filter(
        (btn) => btn.offsetParent !== null
      );
      const idx = catGroup.indexOf(active as HTMLButtonElement);
      if (idx !== -1 && catGroup.length > 1) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const targetIndex = (idx + 1) % catGroup.length;
          catGroup[targetIndex].focus();
          catGroup[targetIndex].click();
          return;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const targetIndex = (idx - 1 + catGroup.length) % catGroup.length;
          catGroup[targetIndex].focus();
          catGroup[targetIndex].click();
          return;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const searchInput = document.getElementById('file-search-input');
          if (searchInput) searchInput.focus();
          return;
        }
      }
    }

    // D. Thoughts category cards (.cat-toggle-card)
    if (active.classList.contains('cat-toggle-card')) {
      const cards = Array.from(document.querySelectorAll<HTMLButtonElement>('.cat-toggle-card')).filter(
        (c) => c.offsetParent !== null
      );
      const idx = cards.indexOf(active as HTMLButtonElement);
      if (idx !== -1 && cards.length > 1) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const targetIndex = (idx + 1) % cards.length;
          cards[targetIndex].focus();
          return;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const targetIndex = (idx - 1 + cards.length) % cards.length;
          cards[targetIndex].focus();
          return;
        }
      }
    }

    // E. Files cards (.file-card-header)
    if (active.classList.contains('file-card-header')) {
      const headers = Array.from(document.querySelectorAll<HTMLElement>('.file-card:not(.hidden) .file-card-header')).filter(
        (h) => h.offsetParent !== null
      );
      const idx = headers.indexOf(active);
      if (idx !== -1 && headers.length > 1) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = headers[(idx + 1) % headers.length];
          next.focus();
          return;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = headers[(idx - 1 + headers.length) % headers.length];
          prev.focus();
          return;
        }
      }
    }

    // F. Thoughts list items / cards (.thought-card or .thought-item)
    const thoughtLink = active.closest<HTMLAnchorElement>('.thought-card h2 a, a.thought-item');
    if (thoughtLink && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const allThoughtLinks = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('.thought-card:not(.hidden) h2 a, a.thought-item:not(.hidden)')
      ).filter((a) => a.offsetParent !== null);
      const idx = allThoughtLinks.indexOf(thoughtLink);
      if (idx !== -1 && allThoughtLinks.length > 1) {
        e.preventDefault();
        const targetIndex = e.key === 'ArrowDown'
          ? (idx + 1) % allThoughtLinks.length
          : (idx - 1 + allThoughtLinks.length) % allThoughtLinks.length;
        allThoughtLinks[targetIndex].focus();
        return;
      }
    }

    // G. Project cards links (.project-card h3 a)
    const projectLink = active.closest<HTMLAnchorElement>('.project-card h3 a');
    if (projectLink) {
      const allProjLinks = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('.project-card:not(.hidden) h3 a')
      ).filter((a) => a.offsetParent !== null);
      const idx = allProjLinks.indexOf(projectLink);
      if (idx !== -1 && allProjLinks.length > 1) {
        e.preventDefault();
        const isNext = e.key === 'ArrowDown' || e.key === 'ArrowRight';
        const targetIndex = isNext
          ? (idx + 1) % allProjLinks.length
          : (idx - 1 + allProjLinks.length) % allProjLinks.length;
        allProjLinks[targetIndex].focus();
        return;
      }
    }
  });
}
