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
}

updateClock();
setInterval(updateClock, 1000);