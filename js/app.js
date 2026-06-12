const container = document.getElementById("artifacts");
const searchInput = document.getElementById("search");

let artifacts = [];
let artifactMap = {};
let currentView = "cards";

async function load() {
    const response = await fetch("./data/artifacts_with_effects_pl.json");

    artifacts = await response.json();

    artifacts.forEach(a => {
        artifactMap[a.id] = a;
    });

    filterArtifacts();
}

function renderComponents(ids = []) {

    return ids.map(id => {

        const artifact = artifactMap[id];

        if (!artifact) {
            return "";
        }

        return `
            <img
                class="component-icon"
                src="${artifact.icon}"
                alt="${artifact.name_pl}"
                title="${artifact.name_pl}"
            >
        `;

    }).join("");
}

function renderCards(items) {

    container.className = "cards";

    container.innerHTML = items.map(a => `

        <div class="artifact-card">

            <img
                class="main-icon"
                src="${a.icon}"
                alt="${a.name_pl}"
            >

            <h3>${a.name_pl}</h3>

            <div class="artifact-en">
                ${a.name_en}
            </div>

            <div class="meta">
                ${a.slot}
            </div>

            <p>
                ${a.effect}
            </p>

            ${
                a.components?.length
                ? `
                    <div class="components">
                        ${renderComponents(a.components)}
                    </div>
                `
                : ""
            }

        </div>

    `).join("");
}

function renderIcons(items) {

    container.className = "icons";

    container.innerHTML = items.map(a => `

        <div class="icon-tile">

            <img
                class="gallery-icon"
                src="${a.icon}"
                alt="${a.name_pl}"
            >

            <div class="tooltip">

                <strong>${a.name_pl}</strong>

                <div>
                    ${a.name_en}
                </div>

                <hr>

                <div>
                    ${a.slot}
                </div>

                <p>
                    ${a.effect}
                </p>

                ${
                    a.components?.length
                    ? `
                        <div class="tooltip-components">
                            ${renderComponents(a.components)}
                        </div>
                    `
                    : ""
                }

            </div>

        </div>

    `).join("");
}

function render(items) {

    if (currentView === "cards") {
        renderCards(items);
    } else {
        renderIcons(items);
    }
}

function filterArtifacts() {

    const phrase = searchInput.value
        .toLowerCase()
        .trim();

    const filtered = artifacts.filter(a =>

        a.name_pl.toLowerCase().includes(phrase)

        ||

        a.name_en.toLowerCase().includes(phrase)

        ||

        a.slot.toLowerCase().includes(phrase)

    );

    render(filtered);
}

searchInput.addEventListener("input", filterArtifacts);

document.getElementById("cardViewBtn")
    .addEventListener("click", () => {

        currentView = "cards";

        filterArtifacts();
    });

document.getElementById("iconViewBtn")
    .addEventListener("click", () => {

        currentView = "icons";

        filterArtifacts();
    });

document.addEventListener("mouseover", e => {

    const tile = e.target.closest(".icon-tile");

    if (!tile) return;

    const tooltip = tile.querySelector(".tooltip");

    if (!tooltip) return;

    tooltip.style.left = "70px";
    tooltip.style.right = "auto";

    const rect = tooltip.getBoundingClientRect();

    if (rect.right > window.innerWidth) {

        tooltip.style.left = "auto";
        tooltip.style.right = "70px";
    }
});

load();