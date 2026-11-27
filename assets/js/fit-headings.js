const headings = document.querySelectorAll(':is(h1, h2, h3, h4, h5, h6):not([data-allow-heading-wrap])');
const headingWidths = new WeakMap();

function fitHeading(heading) {
    heading.classList.add('heading-fit');
    heading.style.removeProperty('font-size');

    const availableWidth = heading.clientWidth;
    headingWidths.set(heading, availableWidth);
    if (availableWidth === 0) return;

    const text = document.createRange();
    text.selectNodeContents(heading);
    const textWidth = text.getBoundingClientRect().width;
    if (textWidth > availableWidth) {
        const fontSize = parseFloat(getComputedStyle(heading).fontSize);
        heading.style.fontSize = `${fontSize * (availableWidth - 1) / textWidth}px`;
    }
}

const headingObserver = new ResizeObserver(entries => {
    for (const { target } of entries) {
        if (target.clientWidth !== headingWidths.get(target)) fitHeading(target);
    }
});

for (const heading of headings) {
    fitHeading(heading);
    headingObserver.observe(heading);
}

document.fonts.ready.then(() => headings.forEach(fitHeading));
