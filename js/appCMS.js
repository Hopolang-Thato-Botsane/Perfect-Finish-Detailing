document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Core Sanity Configuration Parameters
  const PROJECT_ID = 'updvtxpq'; 
  const DATASET = 'production';
  const API_VERSION = 'v2026-06-13'; 

  // FIXED QUERY: Now explicitly requests all your custom layout variables and resolves the image asset URL path
  const QUERY = encodeURIComponent(`*[_type == "hero"][0]{
    branding,
    locationMarker,
    mainHeading,
    "bgUrl": backgroundImage.asset->url
  }`);
  
  const URL = `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/query/${DATASET}?query=${QUERY}`;

  async function runSanityDiagnostics() {
    console.log("🚀 STARTING SANITY NETWORK DIAGNOSTICS...");
    console.log(`🔗 Target Endpoint: ${URL}`);

    try {
      const response = await fetch(URL);

      if (!response.ok) {
        console.error(`❌ SERVER ERROR RETURNED: Status Code ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("✅ PIPELINE CLEAR! Sanity responded successfully.");
      console.log("📦 Data Payload Returned:", data.result);

      // FIXED EXECUTION PASS: Pass the verified server payload straight into your UI renderer!
      if (data.result) {
        renderHeroSection(data.result);
      } else {
        console.warn("⚠️ Query succeeded but returned no document matching _type: 'hero'");
      }

    } catch (networkError) {
      console.error("❌ CRITICAL NETWORK FAULT:", networkError);
    }
  }

  // 2. Structural Rendering Pipeline Function
  function renderHeroSection(heroData) {
    const heroAssetContainer = document.getElementById('heroAssetContainer');
    const brandingNode = document.getElementById('heroBrandingNode');
    const locationNode = document.getElementById('heroLocationNode');
    const titleNode = document.getElementById('heroTitleNode');

    // Paint Background Image Asset
    if (heroAssetContainer && heroData.bgUrl) {
      heroAssetContainer.style.backgroundImage = `url('${heroData.bgUrl}')`;
    }
    
    // Inject Branding Copy with formatting line breaks
    if (brandingNode && heroData.branding) {
      brandingNode.innerHTML = heroData.branding.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    }
    
    // Inject Sub-header Marker
    if (locationNode) {
      locationNode.textContent = heroData.locationMarker || '';
    }
    
    // Paint Main Statement Heading Display
    if (titleNode && heroData.mainHeading) {
      titleNode.innerHTML = heroData.mainHeading.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    }
  }

  // Kickstart system execution instantly
  runSanityDiagnostics();
});