

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
document.querySelector("#camera").onclick=()=>{
    window.location.href = "camera.html";
}
document.querySelector("#phone").onclick=()=>{
    window.location.href = "phone.html";
}
document.querySelector("#photos").onclick=()=>{
    window.location.href = "photos.html";
}

/* All App Opening URLs — Keep them in one place */
const appURLs = {
    google: "https://www.google.com/webhp?igu=1",
    playstore: "https://play.google.com/store",
    flipkart: "https://www.flipkart.com/",
    maps: "https://maps.google.com/maps?q=Amritsar &t=&z=12&output=embed",
    zomato: "https://www.zomato.com/",
    calendar: "https://cloomba.com/",
    about: "about",
    weather: "https://www.wunderground.com/",
    calculator: "https://onlineti84calc.com/ti84calc",
    clock: "https://nrtechstudio.com/tools/online-clock/",
    whatsapp: "whatsapp",
};

/* Find the point (inside the phone) where the tapped app icon is */
function getAppOrigin(appElement) {
    const phoneScreen = document.querySelector(".phone");
    const phoneRect = phoneScreen.getBoundingClientRect();

    /* Default origin is the bottom center of the phone */
    let originX = phoneRect.width / 2;
    let originY = phoneRect.height;

    if (appElement) {
        const appRect = appElement.getBoundingClientRect();

        originX = appRect.left - phoneRect.left - phoneScreen.clientLeft + appRect.width / 2;
        originY = appRect.top - phoneRect.top - phoneScreen.clientTop + appRect.height / 2;
    }

    return {
        x: originX,
        y: originY
    };
}

/* App opening animation: the app grows out of the icon */
function playAppOpenAnimation(appScreen, appOrigin) {
    appScreen.style.transformOrigin = appOrigin.x + "px " + appOrigin.y + "px";
    appScreen.classList.remove("app-opening");

    /* Force reflow so the animation can restart every time */
    void appScreen.offsetWidth;

    appScreen.classList.add("app-opening");
}

/* Common App Opening Function */
function openApp(appName, appElement) {
    const url = appURLs[appName];

    if (!url) {
        console.error("App URL not found:", appName);
        return;
    }else if(url === "https://play.google.com/store"){
        alert("THIS APP IS CLOSED FOR SOME PRIVATE ISSUES ");
        return;
    }else if(url === "https://www.flipkart.com/"){
        alert(" IF YOU ORDER ANYTHING FROM THIS APP AND ANYTHING MISSHAPPENS .IF THE ORDER DOES NOT ARRIVE OR ANYTHING ELSE THEN IT IS NOT THE RESPONSIBILITY OF THIS OS AND YOU ARE SOLELY RESPONSIBLE FOR THAT.");
    }else if(url === "https://www.youtube.com/embed/VIDEO_ID"){
        window.open("https://www.youtube.com","_blank");
    }else if(url === "amazon"){
        alert(" IF YOU ORDER ANYTHING FROM THIS APP AND ANYTHING MISSHAPPENS .IF THE ORDER DOES NOT ARRIVE OR ANYTHING ELSE THEN IT IS NOT THE RESPONSIBILITY OF THIS OS AND YOU ARE SOLELY RESPONSIBLE FOR THAT.");
        window.open("https://www.amazon.com","_blank");
    }else if(url === "https://calendar.google.com/"){
        window.open("https://calendar.google.com/","_blank");
    }else if(url === "about"){
        window.location.href="about.html";
    }else if(url === "whatsapp"){
        window.location.href="whatsapp.html";
    }else if(url === "gpt"){
        window.open("https://chatgpt.com/","_blank");
    }
    
    const home = document.getElementById("home");
    const appScreen = document.getElementById("google_frame");
    const iframe = document.getElementById("frame");

    if (!home || !appScreen || !iframe) {
        console.error("Required HTML elements not found.");
        return;
    }

    /* Remember the icon position before the home screen is hidden */
    const appOrigin = getAppOrigin(appElement);

    // Open the selected app inside the iframe
    iframe.src = url;

    // Hide home screen and show app screen
    home.style.display = "none";
    appScreen.style.display = "block";

    // Play the opening animation
    playAppOpenAnimation(appScreen, appOrigin);
}

/* Automatically connect all registered apps */
document.querySelectorAll(".apps[data-app]").forEach((app) => {
    app.addEventListener("click", () => {
        openApp(app.dataset.app, app);
    });
});

/* Press Escape to return to the home screen */
function goHome() {
    const home = document.getElementById("home");
    const appScreen = document.getElementById("google_frame");

    if (home && appScreen) {
        appScreen.style.display = "none";
        appScreen.classList.remove("app-opening");
        home.style.display = "block";
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        goHome();
    }
});
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
        setNetworkText(document.getElementById("time").textContent);
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