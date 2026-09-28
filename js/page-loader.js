"use strict";

(() => {
    const root = document.documentElement;
    const loader = document.getElementById("page-loader");
    if (!loader || !root.classList.contains("pb-loading")) return;

    const started = performance.now();
    const settleWithin = (promise, timeout) => Promise.race([
        promise.catch(() => undefined),
        new Promise(resolve => setTimeout(resolve, timeout))
    ]);

    window.addEventListener("load", async () => {
        const heroImage = document.querySelector(".hero-image img");
        const imageReady = heroImage?.decode ? heroImage.decode() : Promise.resolve();
        const fontsReady = document.fonts?.ready || Promise.resolve();
        await Promise.all([
            settleWithin(imageReady, 2200),
            settleWithin(fontsReady, 2200)
        ]);

        const remaining = Math.max(0, 480 - (performance.now() - started));
        setTimeout(() => {
            loader.classList.add("is-leaving");
            setTimeout(() => {
                root.classList.remove("pb-loading");
                document.body.removeAttribute("aria-busy");
                loader.remove();
            }, 240);
        }, remaining);
    }, { once: true });
})();
