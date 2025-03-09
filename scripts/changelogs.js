async function loadChangelogs() {
    const response = await fetch('changelog-list.json');
    const changelogs = await response.json();
    const sidebar = document.getElementById('sidebar');
    const timelineLine = document.getElementById('timeline-line');
    const changelogList = document.getElementById('changelog-content-wrapper');

    for (const log of changelogs) {
        const entry = document.createElement('div');
        entry.classList.add('timeline-entry');

        const dot = document.createElement('div');
        dot.classList.add('timeline-dot');

        const btn = document.createElement('button');
        btn.textContent = log.build;
        btn.classList.add('timeline-button');
        btn.setAttribute('data-target', log.file.replace('.md', ''));
        btn.onclick = () => {
            const targetElement = document.getElementById(log.file.replace('.md', ''));
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const container = document.getElementById('changelog-container');
                const containerPadding = parseInt(window.getComputedStyle(container).paddingTop, 10);
                container.scrollTo({
                    top: targetElement.offsetTop - containerPadding - headerHeight,
                    behavior: 'smooth'
                });
            }
        };

        entry.appendChild(dot);
        entry.appendChild(btn);
        sidebar.appendChild(entry);

        const mdResponse = await fetch(`changelogs/${log.file}`);
        const mdText = await mdResponse.text();

        const changelogEntry = document.createElement('div');
        changelogEntry.classList.add('changelog-entry');
        changelogEntry.id = log.file.replace('.md', '');
        changelogEntry.innerHTML = `
            <h2>${log.title}</h2>
            <p><strong>Build:</strong> ${log.build} | <strong>Date:</strong> ${log.date}</p>
            <div>${marked.parse(mdText)}</div>
        `;
        changelogList.appendChild(changelogEntry);
    }

    // Adjust timeline line height
    const entries = document.querySelectorAll('.timeline-entry');
    if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        timelineLine.style.height = `${lastEntry.offsetTop + lastEntry.offsetHeight}px`;
    }

    // Scroll tracking for active button
    const container = document.getElementById('changelog-container');
    container.addEventListener('scroll', () => {
        const entries = document.querySelectorAll('.changelog-entry');
        let currentActiveButton = null;

        entries.forEach(entry => {
            const rect = entry.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                const id = entry.id;
                currentActiveButton = document.querySelector(`.timeline-button[data-target="${id}"]`);
            }
        });

        document.querySelectorAll('.timeline-button').forEach(button => {
            button.classList.remove('active');
        });

        if (currentActiveButton) {
            currentActiveButton.classList.add('active');
        }
    });
}

loadChangelogs();