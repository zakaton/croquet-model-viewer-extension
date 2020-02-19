// Script Injections
const croquetScript = document.createElement('script');
    croquetScript.type = "text/javascript";
    croquetScript.src = chrome.extension.getURL("/croquet.js");
    croquetScript.addEventListener("load", event => {
        const injectionScript = document.createElement('script');
            injectionScript.type = "text/javascript";
            injectionScript.src = chrome.extension.getURL("/injection.js");
        document.body.appendChild(injectionScript);
    });
document.body.appendChild(croquetScript);