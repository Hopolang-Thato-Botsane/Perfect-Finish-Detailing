document.addEventListener('DOMContentLoaded', () => {

    const yearElement = document.getElementById('current-year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  const SPREADSHEET_ID = '1pIvyrhjkGEvs8PUMS-BIho4sPoJGgAGPzoIKTpgzAlE';

  const GOOGLE_API_ENDPOINT = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

  async function buildFullSectionCMS() {
    try {
      console.log("🔗 Connecting directly to official Google Sheets API stream...");
      const response = await fetch(GOOGLE_API_ENDPOINT);
      
      if (!response.ok) throw new Error(`Google Sheet Stream Rejected: ${response.status}`);
      const textData = await response.text();
      
      const jsonString = textData.substring(textData.indexOf('{'), textData.lastIndexOf('}') + 1);
      const jsonParsed = JSON.parse(jsonString);
      
      const columns = jsonParsed.table.cols;
      const rows = jsonParsed.table.rows;
      if (!rows || rows.length === 0) throw new Error("No data rows discovered.");

      const headerMap = {};
      columns.forEach((col, index) => {
        const label = col.label ? col.label.trim() : (col.id ? col.id.trim() : '');
        if (label) headerMap[label] = index;
      });

      console.log("🗺️ Dynamic Column Index Headers Map:", headerMap);

      const dataCells = rows[0].c;

      function getCellValue(headerName, defaultText = '') {
        const index = headerMap[headerName];
        if (index !== undefined && dataCells && dataCells[index]) {
          return dataCells[index].v !== null && dataCells[index].v !== undefined ? dataCells[index].v.toString().trim() : defaultText;
        }
        return defaultText;
      }

      const imagePath      = getCellValue('footerBGImage');
      const companyName    = getCellValue('companyName', "Perfect Finish Detailing");
      const geoTag         = getCellValue('geoTag', "Protea Glen ext 11, Soweto");
      const timeTagWeekday = getCellValue('timeTagWeekday', "Mon–Fri: 08:00 - 15:00");
      const timeTagWeekend = getCellValue('timeTagWeekend', "Sat–Sun: 08:00 - 16:00");
      const contactEmail   = getCellValue('companyContactEmail', "info@perfectfinish.co.za");
      const contactMobile  = getCellValue('companyContactMobile', "08X XXX XXXX");

      const nameEl = document.getElementById('companyName');
      if (nameEl) nameEl.textContent = companyName;

      const geoEl = document.getElementById('geoTag');
      if (geoEl) geoEl.textContent = geoTag;

      const weekdayEl = document.getElementById('timeTagWeekday');
      if (weekdayEl) weekdayEl.textContent = timeTagWeekday;

      const weekendEl = document.getElementById('timeTagWeekend');
      if (weekendEl) weekendEl.textContent = timeTagWeekend;
      
      const emailAnchor = document.getElementById('companyContactEmail');
      if (emailAnchor) {
        emailAnchor.textContent = contactEmail;
        emailAnchor.href = `mailto:${contactEmail}`;
      }
      
      const mobileAnchor = document.getElementById('companyContactMobile');
      if (mobileAnchor) {
        mobileAnchor.textContent = contactMobile;
        mobileAnchor.href = `tel:${mobileAnchor.textContent.replace(/\s+/g, '')}`;
      }

      const whatsappAnchor = document.getElementById('whatsappAnchor');
      if (whatsappAnchor && contactMobile) {
         whatsappAnchor.href = `https://wa.me/${contactMobile.replace(/[^0-9]/g, '')}`;
      }

      const footerElement = document.getElementById('footerBGImage');
      if (footerElement) {
        let cleanImgPath = imagePath;
        
        if (!cleanImgPath || cleanImgPath === 'footerBGImage') {
          cleanImgPath = '/public/footerBanner.jpg';
        }

        if (cleanImgPath.startsWith('public/') && !cleanImgPath.startsWith('/')) {
          cleanImgPath = '/' + cleanImgPath;
        }
        
        console.log(`🚀 Injecting layout image background path: ${cleanImgPath}`);
        footerElement.style.backgroundImage = `url('${cleanImgPath}')`;
      }

      console.log("✅ Full Footer Section CMS Sync Operational!");

    } catch (error) {
      console.error("❌ CMS dynamic integration failure:", error);
      
      const footerElement = document.getElementById('footerBGImage');
      if (footerElement) {
        footerElement.style.backgroundImage = "url('/public/footerBanner.jpg')";
      }
    }
  }

  buildFullSectionCMS();
});