chrome.runtime.onStartup.addListener(async() => {
    await addBetaBadge();
});

chrome.runtime.onInstalled.addListener(async() => {
    await addBetaBadge();
});

async function addBetaBadge() {
    var installation = await chrome.management.getSelf();

    if (installation.installType === "development") {
        chrome.action.setBadgeText({ text: "B" });
        chrome.action.setBadgeBackgroundColor({ color: "#304db6" });
    }
}
