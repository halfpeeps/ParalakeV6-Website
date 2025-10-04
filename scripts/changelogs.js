(async function () {
    const idleCallback = window.requestIdleCallback ||
    function (cb) { setTimeout(cb, 0); };

    const sidebar      = document.getElementById("sidebar");
    const timelineLine = document.getElementById("timeline-line");
    const listWrapper  = document.getElementById("changelog-content-wrapper");
    const container    = document.getElementById("changelog-container");
    const loadingEl    = document.getElementById("loading");

    async function loadSingleChangelog(log) {
        try {
            const entry = document.createElement("div");
            entry.classList.add("timeline-entry");

            const dot  = document.createElement("div");
            dot.classList.add("timeline-dot");

            const btn  = document.createElement("button");
            btn.textContent = log.build;
            btn.classList.add("timeline-button");
            btn.dataset.target = log.file.replace(".md", "");

            btn.onclick = () => {
                const tgt = document.getElementById(btn.dataset.target);
                if (!tgt) return;
                const headerH        = document.getElementById("header").offsetHeight;
                const containerPad   = parseInt(getComputedStyle(container).paddingTop, 10);
                container.scrollTo({
                    top: tgt.offsetTop - containerPad - headerH,
                    behavior: "smooth"
                });
            };

            entry.append(dot, btn);
            sidebar.appendChild(entry);

            const mdRes = await fetch(`data/changelogs/${log.file}`);
            if (!mdRes.ok) {
                console.error(`Failed to fetch ${log.file}:`, mdRes.statusText);
                return;
            }
            const mdText = await mdRes.text();

            const wrap = document.createElement("div");
            wrap.classList.add("changelog-entry");
            wrap.id = btn.dataset.target;
            wrap.innerHTML = `
                <p><strong>Build:</strong> ${log.build} | <strong>Date:</strong> ${log.date}</p>
                <div class="markdown-body">${marked.parse(mdText)}</div>
            `;
            listWrapper.appendChild(wrap);

        } catch (err) {
            console.error("Error building changelog entry:", err);
        }
    }

    async function loadChangelogs() {
        const res = await fetch("data/changelog_list.json");
        if (!res.ok) { throw new Error("Unable to load data/changelog_list.json"); }
        const changelogs = await res.json();

        changelogs.reverse();

        for (const log of changelogs) {
            await new Promise(resolve => {
                idleCallback(async () => {
                    await loadSingleChangelog(log);
                    resolve();
                });
            });
        }

        const entries = sidebar.querySelectorAll(".timeline-entry");
        if (entries.length) {
            const last = entries[entries.length - 1];
            timelineLine.style.height = `${last.offsetTop + last.offsetHeight}px`;
        }

        loadingEl.style.display = "none";

        container.addEventListener("scroll", () => {
            let activeBtn = null;
            listWrapper.querySelectorAll(".changelog-entry").forEach(entry => {
                const r = entry.getBoundingClientRect();
                if (r.top <= window.innerHeight / 2 && r.bottom >= window.innerHeight / 2) {
                    activeBtn = sidebar.querySelector(`.timeline-button[data-target="${entry.id}"]`);
                }
            });
            sidebar.querySelectorAll(".timeline-button").forEach(b => b.classList.remove("active"));
            if (activeBtn) activeBtn.classList.add("active");
        });
    }

    try {
        await loadChangelogs();
    } catch (e) {
        loadingEl.textContent = "Failed to load changelogs.";
        console.error(e);
    }
})();
