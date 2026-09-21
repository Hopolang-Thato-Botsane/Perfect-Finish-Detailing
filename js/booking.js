document.addEventListener("DOMContentLoaded", () => {
  const serviceStepper = document.getElementById("serviceStepper");
  const vehicleStepper = document.getElementById("vehicleStepper");
  const totalDisplay = document.querySelector(".config-total-display");
  const configForm = document.getElementById("studioConfigForm");


  const configuratorData = {
    "services": [
      { "name": "Enhancement + Interior", "basePrice": 6000 },
      { "name": "Paint Enhancement", "basePrice": 4500 },
      { "name": "Concours Elite", "basePrice": 8500 }
    ],
    "vehicles": [
      { "name": "Hatchback", "premium": 0 },
      { "name": "Sedan", "premium": 250 },
      { "name": "SUV / Large", "premium": 500 },
      { "name": "Bakkie / Truck", "premium": 600 }
    ]
  };

  const services = configuratorData.services;
  const vehicles = configuratorData.vehicles;

  function renderCalculationState() {
    if (!serviceStepper || !vehicleStepper || !totalDisplay) return;

    let currentServiceIdx = parseInt(serviceStepper.dataset.index, 10) || 0;
    let currentVehicleIdx = parseInt(vehicleStepper.dataset.index, 10) || 0;

    // Boundary checks
    if (currentServiceIdx >= services.length) currentServiceIdx = 0;
    if (currentVehicleIdx >= vehicles.length) currentVehicleIdx = 0;

    const selectedService = services[currentServiceIdx];
    const selectedVehicle = vehicles[currentVehicleIdx];

    const serviceTextNode = serviceStepper.querySelector(".stepper-text");
    const vehicleTextNode = vehicleStepper.querySelector(".stepper-text");

    if (serviceTextNode) serviceTextNode.textContent = selectedService.name;
    if (vehicleTextNode) vehicleTextNode.textContent = selectedVehicle.name;

    const calculatedRawTotal = selectedService.basePrice + selectedVehicle.premium;
    
    totalDisplay.textContent = "R " + Math.round(calculatedRawTotal)
      .toLocaleString("en-ZA")
      .replace(/,/g, " ");
  }

  function executeStepSequence(clickEvent, targetStepperContainer, sourceDataArray) {
    const triggerBtn = clickEvent.target.closest(".next, .prev");
    if (!triggerBtn) return;

    let activeIndex = parseInt(targetStepperContainer.dataset.index, 10) || 0;

    if (triggerBtn.classList.contains("next")) {
      activeIndex = (activeIndex + 1) % sourceDataArray.length;
    } else if (triggerBtn.classList.contains("prev")) {
      activeIndex = (activeIndex - 1 + sourceDataArray.length) % sourceDataArray.length;
    }

    targetStepperContainer.dataset.index = activeIndex.toString();
    renderCalculationState();
  }

  // Bind steppers once
  if (serviceStepper && !serviceStepper.dataset.bound) {
    serviceStepper.addEventListener("click", (e) => executeStepSequence(e, serviceStepper, services));
    serviceStepper.dataset.bound = "true";
  }

  if (vehicleStepper && !vehicleStepper.dataset.bound) {
    vehicleStepper.addEventListener("click", (e) => executeStepSequence(e, vehicleStepper, vehicles));
    vehicleStepper.dataset.bound = "true";
  }

  // Bind form submission once
  if (configForm && !configForm.dataset.bound) {
    configForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

      const currentServiceIdx = parseInt(serviceStepper.dataset.index, 10) || 0;
      const currentVehicleIdx = parseInt(vehicleStepper.dataset.index, 10) || 0;

      const clientName = document.getElementById("clientName")?.value.trim() || "Not Provided";
      const clientPhone = document.getElementById("clientPhone")?.value.trim() || "Not Provided";
      const detailDate = document.getElementById("detailDate")?.value || "Not Provided";
      const detailTime = document.getElementById("detailTime")?.value || "Not Provided";

      const selectedPackage = services[currentServiceIdx]?.name || "Not Selected";
      const selectedVehicleTier = vehicles[currentVehicleIdx]?.name || "Not Selected";
      const finalPrice = totalDisplay?.textContent || "TBD";

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

      const parentSection = configForm.closest("section");
      const whatsappNumber = configForm.dataset.phone || parentSection?.dataset.phone;

      if (!whatsappNumber || whatsappNumber.includes("X")) {
        alert("Configuration Error: WhatsApp destination phone number missing.");
        return;
      }

      window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(messageText)}`, "_blank");
    });

    configForm.dataset.bound = "true";
  }

  // Initial render pass
  renderCalculationState();
});