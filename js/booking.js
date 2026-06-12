document.addEventListener("DOMContentLoaded", () => {
  const serviceStepper = document.getElementById("serviceStepper");
  const vehicleStepper = document.getElementById("vehicleStepper");
  const totalDisplay = document.querySelector(".config-total-display");
  const configForm = document.getElementById("studioConfigForm");

  let services = [];
  let vehicles = [];

  async function initConfigurator() {
    try {
      const response = await fetch("./configurator-data.json");
      
      if (!response.ok) {
        throw new Error(`HTTP network error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      services = data.services;
      vehicles = data.vehicles;

      renderCalculationState();
      bindStepperInteractions();
      bindFormSubmission();

    } catch (error) {
      console.error("Configurator failed to initialize data streams:", error);
      if (totalDisplay) totalDisplay.textContent = "R --";
    }
  }

  function renderCalculationState() {
    if (!serviceStepper || !vehicleStepper || !totalDisplay) return;
    if (!services.length || !vehicles.length) return;

    const currentServiceIdx = parseInt(serviceStepper.dataset.index) || 0;
    const currentVehicleIdx = parseInt(vehicleStepper.dataset.index) || 0;

    serviceStepper.querySelector(".stepper-text").textContent = services[currentServiceIdx].name;
    vehicleStepper.querySelector(".stepper-text").textContent = vehicles[currentVehicleIdx].name;

    const calculatedRawTotal = services[currentServiceIdx].basePrice + vehicles[currentVehicleIdx].premium;
    const localizedPriceString = "R " + Math.round(calculatedRawTotal)
      .toLocaleString("en-ZA")
      .replace(/,/g, " ");
    totalDisplay.textContent = localizedPriceString;
  }

  function executeStepSequence(clickEvent, targetStepperContainer, sourceDataArray) {
    let activeIndex = parseInt(targetStepperContainer.dataset.index) || 0;
    const triggerBtn = clickEvent.target;

    if (triggerBtn.classList.contains("next")) {
      activeIndex = (activeIndex + 1) % sourceDataArray.length;
    } else if (triggerBtn.classList.contains("prev")) {
      activeIndex = (activeIndex - 1 + sourceDataArray.length) % sourceDataArray.length;
    } else {
      return; 
    }

    targetStepperContainer.dataset.index = activeIndex;
    renderCalculationState();
  }

  function bindStepperInteractions() {
    if (serviceStepper) {
      serviceStepper.addEventListener("click", (e) => {
        executeStepSequence(e, serviceStepper, services);
      });
    }

    if (vehicleStepper) {
      vehicleStepper.addEventListener("click", (e) => {
        executeStepSequence(e, vehicleStepper, vehicles);
      });
    }
  }

  function bindFormSubmission() {
    if (!configForm) return;

    configForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

      const currentServiceIdx = parseInt(serviceStepper.dataset.index) || 0;
      const currentVehicleIdx = parseInt(vehicleStepper.dataset.index) || 0;
      const clientName = document.getElementById("clientName")?.value || "Not Provided";
      const clientPhone = document.getElementById("clientPhone")?.value || "Not Provided";
      const detailDate = document.getElementById("detailDate")?.value || "Not Provided";
      const detailTime = document.getElementById("detailTime")?.value || "Not Provided";
      const selectedPackage = services[currentServiceIdx]?.name || "Not Selected";
      const selectedVehicleTier = vehicles[currentVehicleIdx]?.name || "Not Selected";
      const finalPrice = totalDisplay.textContent;

      const messageText = 
        `*NEW SLOT RESERVATION*\n` +
        `----------------------------\n\n` +
        `*Client:* ${clientName}\n` +
        `*Contact:* ${clientPhone}\n\n` +
        `*Service:* ${selectedPackage}\n` +
        `*Vehicle:* ${selectedVehicleTier}\n\n` +
        `*Date:* ${detailDate}\n` +
        `*Time:* ${detailTime}\n\n` +
        `----------------------------\n` +
        `*Total Price:* ${finalPrice}\n\n` +
        `_Please confirm availability to lock in this booking._`;

      const whatsappNumber = configForm.dataset.phone;

      if (!whatsappNumber || whatsappNumber.includes("X")) {
        console.error("WhatsApp routing failed: Please provide a valid cell number target on the form element attribute.");
        alert("Configuration Error: Booking system phone destination target missing.");
        return;
      }

      const encodedMessage = encodeURIComponent(messageText);
      const whatsappGatewayUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

      window.open(whatsappGatewayUrl, "_blank");
    });
  }

  initConfigurator();
});