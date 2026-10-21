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
let buttons = document.querySelectorAll(".nums");
let phone_no = document.querySelector("#phone_no");

const phonePage = document.querySelector("#phone_page");
const numPad = document.querySelector("#num_pad");
const callScreen = document.querySelector("#call");
const callNumber = document.querySelector("#call-number");
const callStatus = document.querySelector("#call-status");
const muteBtn = document.querySelector("#mute-btn");
const speakerBtn = document.querySelector("#speaker-btn");
const endCallBtn = document.querySelector("#end-call");

let callTimers = [];
let ringInterval = null;
let audioContext = null;
let ringOscillators = [];
let ringGain = null;
let muted = false;
let speakerOn = false;
let callActive = false;

function stopRing() {
if (ringInterval !== null) {
clearInterval(ringInterval);
ringInterval = null;
}

ringOscillators.forEach(osc => {
    try {
        osc.stop();
    } catch (error) {}
});

ringOscillators = [];

if (ringGain && audioContext) {
    try {
        ringGain.gain.cancelScheduledValues(audioContext.currentTime);
        ringGain.gain.setValueAtTime(0, audioContext.currentTime);
    } catch (error) {}
}

}

function startRing() {
try {
const AudioCtx = window.AudioContext || window.webkitAudioContext;

    if (!AudioCtx) return;

    audioContext = audioContext || new AudioCtx();

    audioContext.resume().then(() => {
        if (!callActive) return;

        stopRing();

        ringGain = audioContext.createGain();
        ringGain.gain.value = 0;
        ringGain.connect(audioContext.destination);

        ringOscillators = [440, 480].map(frequency => {
            const osc = audioContext.createOscillator();
            osc.frequency.value = frequency;
            osc.connect(ringGain);
            osc.start();
            return osc;
        });

        function ringCycle() {
            if (!callActive || !ringGain) return;

            const now = audioContext.currentTime;
            ringGain.gain.cancelScheduledValues(now);
            ringGain.gain.setValueAtTime(0, now);
            ringGain.gain.setValueAtTime(0.04, now + 0.05);
            ringGain.gain.setValueAtTime(0.04, now + 1.8);
            ringGain.gain.setValueAtTime(0, now + 2);
        }

        ringCycle();
        ringInterval = setInterval(ringCycle, 6000);
    }).catch(() => {});
} catch (error) {
    console.log("Ring tone unavailable:", error);
}

}

function startCall() {
const number = phone_no.textContent.trim();

if (!number || callActive) return;

callActive = true;
muted = false;
speakerOn = false;

muteBtn.classList.remove("active");
speakerBtn.classList.remove("active");

callNumber.textContent = number;
callStatus.textContent = "Calling...";
callScreen.classList.remove("ended", "ringing");

numPad.style.display = "none";
phonePage.style.display = "block";

callTimers.push(setTimeout(() => {
    if (!callActive) return;

    callStatus.textContent = "Ringing...";
    callScreen.classList.add("ringing");
    startRing();
}, 1800));

callTimers.push(setTimeout(() => {
    endCall();
}, 16000));

}

function endCall() {
if (!callActive) return;

callActive = false;

callTimers.forEach(timer => clearTimeout(timer));
callTimers = [];

stopRing();

callScreen.classList.remove("ringing");
callScreen.classList.add("ended");
callStatus.textContent = "Call Ended";

phonePage.style.display = "none";
numPad.style.display = "";

muteBtn.classList.remove("active");
speakerBtn.classList.remove("active");

muted = false;
speakerOn = false;

}

buttons.forEach(button => {
button.onclick = () => {
const buttonId = button.id;

    if (buttonId >= "0" && buttonId <= "9") {
        phone_no.textContent += buttonId;
    } else if (buttonId === "back") {
        phone_no.textContent = phone_no.textContent.slice(0, -1);
    } else if (buttonId === "ok") {
        startCall();
    }
};

});

endCallBtn.onclick = endCall;

muteBtn.onclick = () => {
if (!callActive) return;

muted = !muted;
muteBtn.classList.toggle("active", muted);

};

speakerBtn.onclick = () => {
if (!callActive) return;

speakerOn = !speakerOn;
speakerBtn.classList.toggle("active", speakerOn);

};
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