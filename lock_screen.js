alert("WELCOME TO MY POCKET OS (operating system)");
/* Battery Status */
async function getCurrentBattery() {
    if (!navigator.getBattery) {
        return null;
    }

    try {
        const battery = await navigator.getBattery();

        return {
            percentage: Math.round(battery.level * 100),
            charging: battery.charging
        };
    } catch (error) {
        console.error("Battery status unavailable:", error);
        return null;
    }
}

async function updateBattery() {
    const battery = await getCurrentBattery();
    const batteryElement = document.getElementById("battery");

    if (!batteryElement) return;

    if (battery) {
        batteryElement.textContent =
            battery.percentage + "% 🔋";
    } else {
        batteryElement.textContent = "Unavailable";
    }
}

updateBattery();


/* Clock and Date */
function updateClock() {
    const now = new Date();

    const timeElement = document.getElementById("time");
    const dateElement = document.getElementById("date");

    if (timeElement) {
        timeElement.textContent =
            now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });
    }

    if (dateElement) {
        dateElement.textContent =
            now.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
            }).toUpperCase();
    }
}

updateClock();
setInterval(updateClock, 1000);


/* Toast Message */
let toastTimer;

function showToast(message) {
    const toastElement = document.getElementById("toast");

    if (!toastElement) return;

    toastElement.textContent = message;
    toastElement.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toastElement.classList.remove("show");
    }, 1600);
}


/* Flashlight Button: Toggle ON / OFF */
let flashlightOn = false;

const flashButton = document.getElementById("fl");

if (flashButton) {
    flashButton.addEventListener("click", function () {
        flashlightOn = !flashlightOn;

        flashButton.classList.toggle("on", flashlightOn);

        showToast(
            flashlightOn ? "FlashLight ON" : "FlashLight OFF"
        );
    });
}


/* Camera Button: Redirect to camera.html */
const cameraButton = document.getElementById("cm");

if (cameraButton) {
    cameraButton.addEventListener("click", function () {
        window.location.href = "camera.html";
    });
}
/* Swipe and Passcode Unlock */
const CORRECT_PASSCODE = "8286";

const lockPhone = document.querySelector(".phone");
const passOverlay = document.getElementById("unlockOverlay");
const passDots = document.querySelectorAll(".pass-dot");
const passError = document.getElementById("passcodeError");

let passEntry = "";
let swipeStart = 0;

function updatePassDots() {
    passDots.forEach((dot, i) => {
        dot.classList.toggle("filled", i < passEntry.length);
    });
}

function openPassPanel() {
    lockPhone.classList.add("is-passcode-open");
    passOverlay.classList.add("open");
    passOverlay.setAttribute("aria-hidden", "false");
    passEntry = "";
    passError.textContent = "";
    updatePassDots();
}

function closePassPanel() {
    passOverlay.classList.remove("open");
    lockPhone.classList.remove("is-passcode-open");
    passOverlay.setAttribute("aria-hidden", "true");
    passEntry = "";
    passError.textContent = "";
    updatePassDots();
}

document.querySelectorAll("[data-digit]").forEach(button => {
    button.addEventListener("click", () => {
        if (passEntry.length < 4) {
            passEntry += button.dataset.digit;
            passError.textContent = "";
            updatePassDots();
        }
    });
});

document.getElementById("backspace").addEventListener("click", () => {
    passEntry = passEntry.slice(0, -1);
    passError.textContent = "";
    updatePassDots();
});

document.getElementById("passcodeOK").addEventListener("click", () => {
    if (passEntry === CORRECT_PASSCODE) {
        window.location.href = "home.html";
    } else {
        passError.textContent = "Incorrect passcode";
        passEntry = "";
        updatePassDots();
    }
});

lockPhone.addEventListener("touchstart", event => {
    if (event.touches.length === 1) {
        swipeStart = event.touches[0].clientY;
    }
}, { passive: true });

lockPhone.addEventListener("touchend", event => {
    if (event.changedTouches.length !== 1) return;

    const distance = event.changedTouches[0].clientY - swipeStart;

    if (passOverlay.classList.contains("open")) {
        if (distance > 55) closePassPanel();
    } else if (distance < -55) {
        openPassPanel();
    }
}, { passive: true });
let isopen=false;
let toolbar = document.querySelector("#toolbar");
document.querySelector("#statusbar").onclick=()=>{
    if (isopen === false){
        toolbar.classList.add("open");
        isopen = true;
    }else{
        toolbar.classList.remove("open");
        isopen = false;
    }
};
let iconsBar = document.querySelector("#icons_bar")
let tools = document.querySelectorAll(".tools");
tools.forEach((tool)=>{
    tool.addEventListener("click",()=>{
        console.log("clicked");
        
        if(getComputedStyle(tool).backgroundColor==='rgb(128, 128, 128)'){
            tool.style.backgroundColor='blue';
        }else{
            tool.style.backgroundColor='gray';
        }
        let sourceIcon = tool.querySelector('i');
        if(!sourceIcon){
            return;
        }
        let iconId = sourceIcon.id;
        if(!iconId){
            return;
        }
        let existingIcon = iconsBar.querySelector(`#${iconId}-status`);
        if(existingIcon){
            existingIcon.remove();
        }else{
            let newIcon = document.createElement('i');
            newIcon.id=`${iconId}-status`;
            newIcon.className = sourceIcon.className;
            newIcon.style.fontSize='16px';
            newIcon.style.color='blue';
            iconsBar.appendChild(newIcon);
        }
    });

});


/* ---------- Screen Assistant Panel ---------- */
const phoneScreen = document.querySelector(".phone");
const assistantPanel = document.querySelector("#assistant_panel");
const assistantHandle = document.querySelector("#panel_handle");
const optionDnd = document.querySelector("#opt_dnd");
const optionEye = document.querySelector("#opt_eye");
const optionColor = document.querySelector("#opt_color");
const optionScreenshot = document.querySelector("#opt_screenshot");
const optionClose = document.querySelector("#opt_close");
const eyeFilter = document.querySelector("#eye_filter");
const colorFilter = document.querySelector("#color_filter");
const screenshotFlash = document.querySelector("#screenshot_flash");

let assistantPanelOpen = false;

/* Keep the panel and filters fixed on the phone screen */
function positionOverlays() {
    const phoneRect = phoneScreen.getBoundingClientRect();
    const phoneLeft = phoneRect.left + phoneScreen.clientLeft;
    const phoneTop = phoneRect.top + phoneScreen.clientTop;
    const phoneRight = phoneLeft + phoneScreen.clientWidth;

    phoneScreen.style.setProperty("--phone-left", phoneLeft + "px");
    phoneScreen.style.setProperty("--phone-top", phoneTop + "px");
    phoneScreen.style.setProperty("--phone-width", phoneScreen.clientWidth + "px");
    phoneScreen.style.setProperty("--phone-height", phoneScreen.clientHeight + "px");
    phoneScreen.style.setProperty("--panel-top", (phoneTop + phoneScreen.clientHeight / 2) + "px");
    phoneScreen.style.setProperty("--panel-right", (document.documentElement.clientWidth - phoneRight + 6) + "px");
}

positionOverlays();
window.addEventListener("resize", positionOverlays);
window.addEventListener("scroll", positionOverlays);

/* A feature is ON when its icon is showing in the status bar */
function isStatusOn(iconId) {
    return iconsBar.querySelector(`#${iconId}-status`) !== null;
}

/* Sync the panel, filters and handle with the status bar icons */
function refreshAssistantStates() {
    const assistantOn = isStatusOn("assisign");
    const dndOn = isStatusOn("disturbsign");
    const eyeOn = isStatusOn("eyesign");
    const colorOn = isStatusOn("colorsign");

    if (assistantOn === false) {
        assistantPanelOpen = false;
    }

    optionDnd.classList.toggle("active", dndOn);
    optionEye.classList.toggle("active", eyeOn);
    optionColor.classList.toggle("active", colorOn);

    eyeFilter.classList.toggle("on", eyeOn);
    colorFilter.classList.toggle("on", colorOn);

    assistantPanel.classList.toggle("open", assistantOn && assistantPanelOpen);
    assistantHandle.classList.toggle("show", assistantOn && !assistantPanelOpen);

    positionOverlays();
}

/* Any change in the status bar icons updates everything */
const statusObserver = new MutationObserver(refreshAssistantStates);
statusObserver.observe(iconsBar, { childList: true });
refreshAssistantStates();

/* Open and close the panel */
assistantHandle.addEventListener("click", () => {
    assistantPanelOpen = true;
    refreshAssistantStates();
});

optionClose.addEventListener("click", () => {
    assistantPanelOpen = false;
    refreshAssistantStates();
});

/* Do Not Disturb uses the same toggle as the toolbar */
optionDnd.addEventListener("click", () => {
    document.querySelector("#disturbsign").closest(".tools").click();
});

/* Eye Protection uses the same toggle as the toolbar */
optionEye.addEventListener("click", () => {
    document.querySelector("#eyesign").closest(".tools").click();
});

/* Color Protection shows its own icon in the status bar */
optionColor.addEventListener("click", () => {
    const existingIcon = iconsBar.querySelector("#colorsign-status");

    if (existingIcon) {
        existingIcon.remove();
    } else {
        const newIcon = document.createElement("i");
        newIcon.id = "colorsign-status";
        newIcon.className = "fa-solid fa-palette";
        newIcon.style.fontSize = "16px";
        newIcon.style.color = "blue";
        iconsBar.appendChild(newIcon);
    }
});

/* Screenshot of the phone screen */
function showScreenshotFlash() {
    screenshotFlash.classList.remove("flash");

    /* Force reflow so the flash can restart every time */
    void screenshotFlash.offsetWidth;

    screenshotFlash.classList.add("flash");
}

function restoreAfterScreenshot() {
    assistantPanel.style.visibility = "";
    assistantHandle.style.visibility = "";
}

optionScreenshot.addEventListener("click", () => {
    /* Hide the panel so it is not part of the screenshot */
    assistantPanel.style.visibility = "hidden";
    assistantHandle.style.visibility = "hidden";

    setTimeout(() => {
        if (typeof html2canvas === "undefined") {
            console.error("html2canvas is not loaded.");
            restoreAfterScreenshot();
            showScreenshotFlash();
            return;
        }

        html2canvas(phoneScreen, { useCORS: true }).then((canvas) => {
            restoreAfterScreenshot();
            showScreenshotFlash();

            try {
                const link = document.createElement("a");
                link.download = "screenshot.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            } catch (error) {
                console.error("Screenshot could not be saved:", error);
            }
        }).catch((error) => {
            console.error("Screenshot failed:", error);
            restoreAfterScreenshot();
        });
    }, 150);
});


/* ---------- Status bar: show the date when time and date scroll away ---------- */
const networkText = document.querySelector("#network_text");
const timeDateBlock = document.querySelector("#time_date");
const statusBarElement = document.querySelector("#statusbar");
const networkDefaultText = networkText.textContent;

let showingDate = false;
let networkSwapTimer = null;

/* Fade the old text out, change it, fade the new text in */
function setNetworkText(text) {
    clearTimeout(networkSwapTimer);
    networkText.classList.add("swap");

    networkSwapTimer = setTimeout(() => {
        networkText.textContent = text;
        networkText.classList.remove("swap");
    }, 200);
}

function updateStatusDate() {
    const timeDateRect = timeDateBlock.getBoundingClientRect();

    /* Home screen is hidden (an app is open) */
    if (timeDateRect.height === 0) return;

    const statusBarRect = statusBarElement.getBoundingClientRect();
    const timeDateHidden = timeDateRect.bottom <= statusBarRect.bottom;

    if (timeDateHidden === showingDate) return;

    showingDate = timeDateHidden;

    if (timeDateHidden) {
        setNetworkText(document.getElementById("date").textContent);
    } else {
        setNetworkText(networkDefaultText);
    }
}

phoneScreen.addEventListener("scroll", updateStatusDate);
/* ---------- Brightness, Volume, Night mode and Restart ---------- */
const brightnessSlider = document.querySelector("#brightness_slider");
const volumeSlider = document.querySelector("#volume_slider");
const volumeIcon = document.querySelector("#volume_icon");
const brightnessFilter = document.querySelector("#brightness_filter");
const nightFilter = document.querySelector("#night_filter");
const restartButton = document.querySelector("#restart_btn");

/* Fill the slider up to the thumb */
function updateSliderFill(slider) {
    const percent = (slider.value - slider.min) / (slider.max - slider.min) * 100;

    slider.style.setProperty("--value", percent + "%");
}

/* Brightness: a black layer gets lighter or darker */
brightnessSlider.addEventListener("input", () => {
    updateSliderFill(brightnessSlider);
    brightnessFilter.style.opacity = (100 - brightnessSlider.value) / 100 * 0.8;
});

/* Volume: changes the icon and the volume of audio and video on this page */
volumeSlider.addEventListener("input", () => {
    updateSliderFill(volumeSlider);

    if (volumeSlider.value == 0) {
        volumeIcon.className = "fa-solid fa-volume-xmark";
    } else if (volumeSlider.value < 50) {
        volumeIcon.className = "fa-solid fa-volume-low";
    } else {
        volumeIcon.className = "fa-solid fa-volume-high";
    }

    document.querySelectorAll("audio, video").forEach((media) => {
        media.volume = volumeSlider.value / 100;
    });
});

updateSliderFill(brightnessSlider);
updateSliderFill(volumeSlider);

/* Night mode: ON when its icon is showing in the status bar */
function refreshNightMode() {
    nightFilter.classList.toggle("on", isStatusOn("nightsign"));
}

const nightObserver = new MutationObserver(refreshNightMode);
nightObserver.observe(iconsBar, { childList: true });

/* Restart: the phone fades out, then goes to interface.html */
restartButton.addEventListener("click", () => {
    phoneScreen.style.transition = "opacity 0.6s ease";
    phoneScreen.style.opacity = "0";

    setTimeout(() => {
        window.location.href = "main_Interface.html";
    }, 700);
});