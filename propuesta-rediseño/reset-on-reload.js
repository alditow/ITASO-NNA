(function resetItasoOnReload() {
  const navigation = performance.getEntriesByType?.('navigation')?.[0];
  const wasReloaded = navigation?.type === 'reload'
    || performance.navigation?.type === performance.navigation?.TYPE_RELOAD;

  if (!wasReloaded) return;

  try {
    localStorage.removeItem('itasoRedesignCharacterV2');
    localStorage.removeItem('itaso-nna-points-v1');
  } catch (_) {
    // La página puede continuar aunque el navegador bloquee el almacenamiento.
  }
}());
