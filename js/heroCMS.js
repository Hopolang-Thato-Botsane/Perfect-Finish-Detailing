document.addEventListener('DOMContentLoaded', () => {
  const SPREADSHEET_ID = '1pIvyrhjkGEvs8PUMS-BIho4sPoJGgAGPzoIKTpgzAlE';
  const SHEET_NAME = 'hero';
  const CMS_ENDPOINT = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_NAME}`;

  async function initializeHeroCMS() {
    try {
      const response = await fetch(CMS_ENDPOINT);
      if (!response.ok) throw new Error(`Hero CMS Fetch Error: ${response.status}`);

      const heroData = await response.json();

      if (!heroData || heroData.length === 0) {
        throw new Error('Hero sheet tab is empty or malformed.');
      }

      const data = heroData[0];

      if (data.heroTagline) document.getElementById('heroTagline').textContent = data.heroTagline;
      if (data.heroTitle)   document.getElementById('heroTitle').innerHTML   = data.heroTitle;
      if (data.heroDesc)    document.getElementById('heroDesc').textContent    = data.heroDesc;
      if (data.heroCta)     document.getElementById('heroCta').textContent     = data.heroCta;

      if (data.heroBgImage) {
        document.getElementById('heroSectionContainer').style.backgroundImage = `url('${data.heroBgImage}')`;
      }

    } catch (error) {
      console.error('⚠️ Hero Section CMS Bridge Failure:', error);
      document.getElementById('heroTagline').textContent = "SOWETO / GAUTENG";
      document.getElementById('heroTitle').innerHTML     = "SURFACE PERFECTION.<br>NO SHORTCUTS.";
      document.getElementById('heroDesc').textContent    = "Three transparent tiers of meticulous detailing.";
      document.getElementById('heroCta').textContent     = "VIEW TIERS";
    }
  }

  initializeHeroCMS();
});