(() => {
  if (!location.hash.includes('figmamobile=1')) return;
  document.documentElement.classList.add('figma-mobile');

  const applyMobileRules = () => {
    const output = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch (_) { continue; }
      for (const rule of rules) {
        if (!(rule instanceof CSSMediaRule)) continue;
        const widths = [...rule.conditionText.matchAll(/max-width\s*:\s*(\d+)px/g)].map((match) => Number(match[1]));
        if (!widths.length || Math.max(...widths) < 390) continue;
        for (const inner of rule.cssRules) {
          if (!(inner instanceof CSSStyleRule)) continue;
          const selectors = inner.selectorText
            .split(',')
            .map((selector) => `html.figma-mobile ${selector.trim()}`)
            .join(',');
          output.push(`${selectors}{${inner.style.cssText}}`);
        }
      }
    }
    const style = document.createElement('style');
    style.dataset.figmaMobile = '';
    style.textContent = `html.figma-mobile,html.figma-mobile body{width:390px!important;max-width:390px!important;overflow-x:hidden!important}${output.join('')}`;
    document.head.appendChild(style);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyMobileRules, { once: true });
  else applyMobileRules();
})();
