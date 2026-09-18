"use strict";

/* Progressive enhancement: the complete wordmark is always in the HTML. */
(() => {
    const panel = document.querySelector("[data-identity]");
    const desktopMotion = window.matchMedia?.(
        "(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    if (panel && desktopMotion?.matches && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                panel.classList.add("identity-in-view");
                observer.unobserve(panel);
                observer.disconnect();
            });
        }, { threshold: 0.28 });
        observer.observe(panel);
    }

    /* Preserve native keyboard/touch toggling, whitespace, links and text order.
       No duplicate accessible labels and no interception of the summary click. */
    document.querySelectorAll(".faq-item").forEach((item) => {
        let wordIndex = 0;
        item.querySelectorAll(":scope > p").forEach((paragraph) => {
            const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
            const textNodes = [];
            while (walker.nextNode()) textNodes.push(walker.currentNode);
            textNodes.forEach((node) => {
                const fragment = document.createDocumentFragment();
                node.textContent.split(/(\s+)/u).forEach((token) => {
                    if (!token) return;
                    if (/^\s+$/u.test(token)) {
                        fragment.append(document.createTextNode(token));
                        return;
                    }
                    const word = document.createElement("span");
                    word.className = "faq-word";
                    word.textContent = token;
                    word.style.setProperty("--faq-delay", `${Math.min(wordIndex * 17, 230)}ms`);
                    wordIndex += 1;
                    fragment.append(word);
                });
                node.replaceWith(fragment);
            });
        });
        if (wordIndex > 0) item.classList.add("faq-enhanced");
    });
})();
