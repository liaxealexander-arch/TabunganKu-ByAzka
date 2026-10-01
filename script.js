/* =====================================================
   TABUNGANKU - JAVASCRIPT
   Login: Azka
   Password: 123
===================================================== */


/* =====================================================
   DATA
===================================================== */

const DEMO_USERNAME = "Azka";
const DEMO_PASSWORD = "123";

let currentUser = null;

let goals = JSON.parse(
    localStorage.getItem("tabunganku_goals") || "[]"
);

let historyData = JSON.parse(
    localStorage.getItem("tabunganku_history") || "[]"
);

let darkMode =
    localStorage.getItem("tabunganku_dark") === "true";


/* =====================================================
   ELEMENT
===================================================== */

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const loginError = document.getElementById("loginError");

const showPassword = document.getElementById("showPassword");

const sideName = document.getElementById("sideName");
const profileName = document.getElementById("profileName");
const welcomeName = document.getElementById("welcomeName");

const pageTitle = document.getElementById("pageTitle");
const dateElement = document.getElementById("date");

const totalSaved = document.getElementById("totalSaved");
const activeGoals = document.getElementById("activeGoals");
const completedGoals = document.getElementById("completedGoals");
const overallProgress = document.getElementById("overallProgress");

const dashboardGoals =
    document.getElementById("dashboardGoals");

const allGoals =
    document.getElementById("allGoals");


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {
    localStorage.setItem(
        "tabunganku_goals",
        JSON.stringify(goals)
    );

    localStorage.setItem(
        "tabunganku_history",
        JSON.stringify(historyData)
    );
}


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number || 0);
}


/* =====================================================
   DATE
===================================================== */

function formatDate(date = new Date()) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

if (dateElement) {
    dateElement.textContent = formatDate();
}


/* =====================================================
   LOGIN
===================================================== */

if (loginButton) {

    loginButton.addEventListener("click", login);

}

if (passwordInput) {

    passwordInput.addEventListener("keydown", function(e) {

        if (e.key === "Enter") {
            login();
        }

    });

}

function login() {

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;

    if (
        username === DEMO_USERNAME &&
        password === DEMO_PASSWORD
    ) {

        currentUser = username;

        localStorage.setItem(
            "tabunganku_logged",
            "true"
        );

        showApp();

    } else {

        loginError.textContent =
            "Username atau password salah.";

        passwordInput.value = "";

    }
}


/* =====================================================
   SHOW APP
===================================================== */

function showApp() {

    loginScreen.classList.add("hidden");

    app.classList.remove("hidden");

    sideName.textContent = currentUser;
    profileName.textContent = currentUser;
    welcomeName.textContent = currentUser;

    updateDashboard();
    renderGoals();
    renderHistory();
    renderStatistics();

    applyTheme();
}


/* =====================================================
   LOGOUT
===================================================== */

const logoutButton =
    document.getElementById("logout");

if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        localStorage.removeItem(
            "tabunganku_logged"
        );

        currentUser = null;

        app.classList.add("hidden");

        loginScreen.classList.remove("hidden");

        usernameInput.value = "";
        passwordInput.value = "";

    });

}


/* =====================================================
   AUTO LOGIN
===================================================== */

if (
    localStorage.getItem("tabunganku_logged") === "true"
) {

    currentUser = DEMO_USERNAME;

    showApp();

}


/* =====================================================
   SHOW / HIDE PASSWORD
===================================================== */

if (showPassword) {

    showPassword.addEventListener("click", function() {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            showPassword.textContent = "🙈";

        } else {

            passwordInput.type = "password";

            showPassword.textContent = "👁️";

        }

    });

}


/* =====================================================
   NAVIGATION
===================================================== */

const navButtons =
    document.querySelectorAll(".nav");

const pages =
    document.querySelectorAll(".page");

navButtons.forEach(button => {

    button.addEventListener("click", function() {

        const page =
            button.dataset.page;

        openPage(page);

    });

});


function openPage(pageName) {

    pages.forEach(page => {

        page.classList.add("hidden");

    });

    const selected =
        document.getElementById(pageName);

    if (selected) {
        selected.classList.remove("hidden");
    }

    navButtons.forEach(button => {

        button.classList.remove("active");

        if (
            button.dataset.page === pageName
        ) {
            button.classList.add("active");
        }

    });

    const titles = {
        dashboard: "Dashboard",
        savings: "Tabungan",
        history: "Riwayat",
        statistics: "Statistik",
        settings: "Pengaturan"
    };

    pageTitle.textContent =
        titles[pageName] || "Tabunganku";

    if (pageName === "history") {
        renderHistory();
    }

    if (pageName === "statistics") {
        renderStatistics();
    }

}


/* =====================================================
   THEME
===================================================== */

const themeButton =
    document.getElementById("themeButton");

if (themeButton) {

    themeButton.addEventListener(
        "click",
        toggleTheme
    );

}

function toggleTheme() {

    darkMode = !darkMode;

    localStorage.setItem(
        "tabunganku_dark",
        darkMode
    );

    applyTheme();

}

function applyTheme() {

    if (darkMode) {

        document.body.classList.add("dark");

        if (themeButton) {
            themeButton.textContent = "☀️";
        }

    } else {

        document.body.classList.remove("dark");

        if (themeButton) {
            themeButton.textContent = "🌙";
        }

    }

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const total =
        goals.reduce(
            (sum, goal) =>
                sum + Number(goal.saved),
            0
        );

    const active =
        goals.filter(
            goal => goal.saved < goal.target
        ).length;

    const completed =
        goals.filter(
            goal => goal.saved >= goal.target
        ).length;

    let progress = 0;

    if (goals.length > 0) {

        progress =
            goals.reduce(
                (sum, goal) => {

                    const p =
                        Math.min(
                            goal.saved /
                            goal.target,
                            1
                        );

                    return sum + p;

                },
                0
            ) / goals.length;

    }

    if (totalSaved)
        totalSaved.textContent = rupiah(total);

    if (activeGoals)
        activeGoals.textContent = active;

    if (completedGoals)
        completedGoals.textContent = completed;

    if (overallProgress)
        overallProgress.textContent =
            Math.round(progress * 100) + "%";

}


/* =====================================================
   RENDER GOALS
===================================================== */

function renderGoals() {

    updateDashboard();

    renderDashboardGoals();

    renderAllGoals();

}


/* =====================================================
   DASHBOARD GOALS
===================================================== */

function renderDashboardGoals() {

    if (!dashboardGoals) return;

    dashboardGoals.innerHTML = "";

    if (goals.length === 0) {

        dashboardGoals.innerHTML = emptyState();

        return;

    }

    const latestGoals =
        [...goals]
        .sort((a, b) => b.created - a.created)
        .slice(0, 3);

    latestGoals.forEach(goal => {

        dashboardGoals.innerHTML +=
            goalCard(goal);

    });

    attachGoalEvents();

}


/* =====================================================
   ALL GOALS
===================================================== */

function renderAllGoals() {

    if (!allGoals) return;

    const searchInput =
        document.getElementById("search");

    const filterSelect =
        document.getElementById("filter");

    const search =
        searchInput ?
        searchInput.value.toLowerCase() :
        "";

    const filter =
        filterSelect ?
        filterSelect.value :
        "all";

    let filtered =
        goals.filter(goal => {

            const matchesSearch =
                goal.name
                    .toLowerCase()
                    .includes(search);

            let matchesFilter = true;

            if (filter === "active") {

                matchesFilter =
                    goal.saved < goal.target;

            }

            if (filter === "done") {

                matchesFilter =
                    goal.saved >= goal.target;

            }

            if (filter === "favorite") {

                matchesFilter =
                    goal.favorite === true;

            }

            return matchesSearch &&
                   matchesFilter;

        });

    allGoals.innerHTML = "";

    if (filtered.length === 0) {

        allGoals.innerHTML =
            emptyState();

        return;

    }

    filtered.forEach(goal => {

        allGoals.innerHTML +=
            goalCard(goal);

    });

    attachGoalEvents();

}


/* =====================================================
   GOAL CARD
===================================================== */

function goalCard(goal) {

    const percent =
        Math.min(
            Math.round(
                (goal.saved / goal.target) * 100
            ),
            100
        );

    const remaining =
        Math.max(
            goal.target - goal.saved,
            0
        );

    const completed =
        goal.saved >= goal.target;

    return `

        <div class="goal-card"
             data-id="${goal.id}">

            <div class="goal-header">

                <div class="goal-icon">
                    ${goal.icon}
                </div>

                <button
                    class="favorite ${goal.favorite ? "active" : ""}"
                    data-action="favorite"
                    data-id="${goal.id}">
                    ${goal.favorite ? "⭐" : "☆"}
                </button>

            </div>

            <h3>${escapeHTML(goal.name)}</h3>

            <div class="goal-date">
                Dibuat ${goal.date}
            </div>

            <div class="goal-money">

                <strong>
                    ${rupiah(goal.saved)}
                </strong>

                <span>
                    Target<br>
                    ${rupiah(goal.target)}
                </span>

            </div>

            <div class="progress">

                <div
                    class="progress-bar"
                    style="width:${percent}%">
                </div>

            </div>

            <div class="progress-info">

                <span>
                    ${percent}% tercapai
                </span>

                <span>
                    ${rupiah(remaining)} lagi
                </span>

            </div>

            ${
                completed
                ? `
                    <span class="complete">
                        ✓ TARGET TERCAPAI
                    </span>
                `
                : ""
            }

            <div class="goal-actions">

                <button
                    class="add-money"
                    data-action="add"
                    data-id="${goal.id}">
                    + Nabung
                </button>

                <button
                    class="remove-money"
                    data-action="remove"
                    data-id="${goal.id}">
                    − Ambil
                </button>

                <button
                    class="edit-goal"
                    data-action="edit"
                    data-id="${goal.id}">
                    ✏️ Edit
                </button>

                <button
                    class="delete-goal"
                    data-action="delete"
                    data-id="${goal.id}">
                    🗑️ Hapus
                </button>

            </div>

        </div>

    `;

}


/* =====================================================
   EMPTY STATE
===================================================== */

function emptyState() {

    return `

        <div class="empty">

            <div class="empty-icon">
                🎯
            </div>

            <h3>
                Belum ada tabungan
            </h3>

            <p>
                Buat target tabungan pertamamu.
            </p>

        </div>

    `;

}


/* =====================================================
   GOAL EVENTS
===================================================== */

function attachGoalEvents() {

    document
        .querySelectorAll("[data-action]")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const action =
                        button.dataset.action;

                    const id =
                        button.dataset.id;

                    const goal =
                        goals.find(
                            g => g.id === id
                        );

                    if (!goal) return;


                    if (action === "favorite") {

                        goal.favorite =
                            !goal.favorite;

                        saveData();

                        renderGoals();

                    }


                    if (action === "add") {

                        openMoneyModal(
                            goal,
                            "add"
                        );

                    }


                    if (action === "remove") {

                        openMoneyModal(
                            goal,
                            "remove"
                        );

                    }


                    if (action === "edit") {

                        openGoalModal(goal);

                    }


                    if (action === "delete") {

                        deleteGoal(goal);

                    }

                }
            );

        });

}


/* =====================================================
   ADD GOAL BUTTON
===================================================== */

const addGoalButton =
    document.getElementById("addGoal");

const addDashboardButton =
    document.getElementById(
        "addFromDashboard"
    );

if (addGoalButton) {

    addGoalButton.addEventListener(
        "click",
        () => openGoalModal()
    );

}

if (addDashboardButton) {

    addDashboardButton.addEventListener(
        "click",
        () => openGoalModal()
    );

}


/* =====================================================
   VIEW ALL
===================================================== */

const viewAll =
    document.getElementById("viewAll");

if (viewAll) {

    viewAll.addEventListener(
        "click",
        function() {

            openPage("savings");

        }
    );

}


/* =====================================================
   SEARCH
===================================================== */

const searchInput =
    document.getElementById("search");

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderAllGoals
    );

}


/* =====================================================
   FILTER
===================================================== */

const filterSelect =
    document.getElementById("filter");

if (filterSelect) {

    filterSelect.addEventListener(
        "change",
        renderAllGoals
    );

}


/* =====================================================
   MODAL - CREATE
===================================================== */

function createModal() {

    let modal =
        document.getElementById(
            "dynamicModal"
        );

    if (!modal) {

        modal =
            document.createElement("div");

        modal.id = "dynamicModal";

        modal.className = "modal hidden";

        document.body.appendChild(modal);

    }

    return modal;

}


/* =====================================================
   GOAL MODAL
===================================================== */

function openGoalModal(existingGoal = null) {

    const modal =
        createModal();

    const editing =
        existingGoal !== null;

    const icons = [
        "🎯",
        "🏠",
        "🚗",
        "📱",
        "💻",
        "🎮",
        "✈️",
        "🎓",
        "💍",
        "🐱",
        "👟",
        "🎁"
    ];

    modal.innerHTML = `

        <div class="modal-box">

            <div class="modal-header">

                <div>
                    <h2>
                        ${
                            editing
                            ? "Edit Tabungan"
                            : "Tambah Tabungan"
                        }
                    </h2>

                    <p>
                        ${
                            editing
                            ? "Ubah informasi targetmu."
                            : "Buat target tabungan baru."
                        }
                    </p>
                </div>

                <button
                    class="close"
                    id="closeModal">
                    ×
                </button>

            </div>

            <div class="form-group">

                <label>
                    Nama Tabungan
                </label>

                <input
                    id="goalName"
                    type="text"
                    placeholder="Contoh: Beli iPhone"
                    value="${
                        editing
                        ? escapeAttribute(existingGoal.name)
                        : ""
                    }">

            </div>


            <div class="form-group">

                <label>
                    Target Uang
                </label>

                <input
                    id="goalTarget"
                    type="number"
                    min="1"
                    placeholder="Contoh: 5000000"
                    value="${
                        editing
                        ? existingGoal.target
                        : ""
                    }">

            </div>


            ${
                !editing
                ? `
                    <div class="form-group">

                        <label>
                            Uang Awal
                        </label>

                        <input
                            id="goalInitial"
                            type="number"
                            min="0"
                            value="0">

                    </div>
                `
                : ""
            }


            <div class="form-group">

                <label>
                    Pilih Icon
                </label>

                <div class="emoji-picker">

                    ${
                        icons.map(
                            (icon, index) => `
                                <button
                                    type="button"
                                    class="emoji-option ${
                                        (
                                            editing
                                            ? existingGoal.icon === icon
                                            : index === 0
                                        )
                                        ? "active"
                                        : ""
                                    }"
                                    data-emoji="${icon}">
                                    ${icon}
                                </button>
                            `
                        ).join("")
                    }

                </div>

            </div>


            <button
                id="saveGoal"
                class="main-button full">

                ${
                    editing
                    ? "Simpan Perubahan"
                    : "Buat Tabungan"
                }

            </button>

        </div>

    `;

    modal.classList.remove("hidden");


    let selectedIcon =
        editing
        ? existingGoal.icon
        : icons[0];


    modal
        .querySelectorAll("[data-emoji]")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    modal
                        .querySelectorAll(
                            "[data-emoji]"
                        )
                        .forEach(b =>
                            b.classList.remove(
                                "active"
                            )
                        );

                    button.classList.add(
                        "active"
                    );

                    selectedIcon =
                        button.dataset.emoji;

                }
            );

        });


    document
        .getElementById("closeModal")
        .onclick = closeModal;


    document
        .getElementById("saveGoal")
        .onclick = function() {

            const name =
                document
                    .getElementById("goalName")
                    .value
                    .trim();

            const target =
                Number(
                    document
                        .getElementById("goalTarget")
                        .value
                );

            if (!name) {

                alert(
                    "Masukkan nama tabungan."
                );

                return;

            }

            if (!target || target <= 0) {

                alert(
                    "Masukkan target uang yang benar."
                );

                return;

            }


            if (editing) {

                existingGoal.name = name;

                existingGoal.target =
                    target;

                existingGoal.icon =
                    selectedIcon;

                showToast(
                    "Tabungan berhasil diperbarui!"
                );

            } else {

                const initial =
                    Number(
                        document
                            .getElementById(
                                "goalInitial"
                            )
                            .value
                    ) || 0;

                const newGoal = {

                    id:
                        Date.now().toString(),

                    name: name,

                    target: target,

                    saved:
                        Math.min(
                            initial,
                            target
                        ),

                    icon: selectedIcon,

                    favorite: false,

                    created: Date.now(),

                    date: formatDate()

                };

                goals.push(newGoal);


                if (initial > 0) {

                    addHistory(
                        newGoal,
                        initial,
                        "add"
                    );

                }

                showToast(
                    "Tabungan berhasil dibuat!"
                );

            }


            saveData();

            closeModal();

            renderGoals();

            renderHistory();

            renderStatistics();

        };

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeModal() {

    const modal =
        document.getElementById(
            "dynamicModal"
        );

    if (modal) {

        modal.classList.add("hidden");

    }

}


/* =====================================================
   MONEY MODAL
===================================================== */

function openMoneyModal(
    goal,
    type
) {

    const modal =
        createModal();

    const isAdd =
        type === "add";

    modal.innerHTML = `

        <div class="modal-box">

            <div class="modal-header">

                <div>

                    <h2>
                        ${
                            isAdd
                            ? "Tambah Tabungan"
                            : "Ambil Uang"
                        }
                    </h2>

                    <p>
                        ${escapeHTML(goal.name)}
                    </p>

                </div>

                <button
                    class="close"
                    id="closeMoney">
                    ×
                </button>

            </div>


            <div class="amount-input">

                <span>
                    Rp
                </span>

                <input
                    id="moneyAmount"
                    type="number"
                    min="1"
                    placeholder="0"
                    autofocus>

            </div>


            <button
                id="saveMoney"
                class="main-button full">

                ${
                    isAdd
                    ? "💰 Simpan Uang"
                    : "💸 Ambil Uang"
                }

            </button>

        </div>

    `;

    modal.classList.remove("hidden");


    document
        .getElementById("closeMoney")
        .onclick = closeModal;


    document
        .getElementById("saveMoney")
        .onclick = function() {

            const amount =
                Number(
                    document
                        .getElementById(
                            "moneyAmount"
                        )
                        .value
                );


            if (!amount || amount <= 0) {

                alert(
                    "Masukkan jumlah uang."
                );

                return;

            }


            if (isAdd) {

                const space =
                    goal.target -
                    goal.saved;

                const actualAmount =
                    Math.min(
                        amount,
                        space
                    );

                goal.saved +=
                    actualAmount;

                addHistory(
                    goal,
                    actualAmount,
                    "add"
                );


                if (
                    goal.saved >=
                    goal.target
                ) {

                    showToast(
                        "🎉 Target tabungan tercapai!"
                    );

                } else {

                    showToast(
                        "Uang berhasil ditambahkan!"
                    );

                }

            } else {

                if (
                    amount >
                    goal.saved
                ) {

                    alert(
                        "Uang tabungan tidak cukup."
                    );

                    return;

                }

                goal.saved -= amount;

                addHistory(
                    goal,
                    amount,
                    "remove"
                );

                showToast(
                    "Uang berhasil diambil."
                );

            }


            saveData();

            closeModal();

            renderGoals();

            renderHistory();

            renderStatistics();

        };

}


/* =====================================================
   DELETE GOAL
===================================================== */

function deleteGoal(goal) {

    const confirmed =
        confirm(
            `Hapus tabungan "${goal.name}"?`
        );

    if (!confirmed) return;

    goals =
        goals.filter(
            g => g.id !== goal.id
        );

    saveData();

    renderGoals();

    renderHistory();

    renderStatistics();

    showToast(
        "Tabungan berhasil dihapus."
    );

}


/* =====================================================
   HISTORY
===================================================== */

function addHistory(
    goal,
    amount,
    type
) {

    historyData.unshift({

        id: Date.now().toString(),

        goalId: goal.id,

        goalName: goal.name,

        amount: amount,

        type: type,

        date: new Date().toLocaleString(
            "id-ID"
        )

    });

    // Simpan maksimal 100 transaksi
    historyData =
        historyData.slice(0, 100);

}


/* =====================================================
   RENDER HISTORY
===================================================== */

function renderHistory() {

    const historyContainer =
        document.getElementById(
            "history"
        );

    if (!historyContainer) return;

    let list =
        historyContainer.querySelector(
            ".history-list"
        );

    if (!list) {

        list =
            document.createElement("div");

        list.className =
            "history-list";

        historyContainer.appendChild(list);

    }

    if (historyData.length === 0) {

        list.innerHTML =
            emptyState();

        return;

    }

    list.innerHTML =
        historyData.map(item => {

            const add =
                item.type === "add";

            return `

                <div class="history-item">

                    <div class="history-left">

                        <div class="history-icon">

                            ${
                                add
                                ? "💰"
                                : "💸"
                            }

                        </div>

                        <div>

                            <span class="history-name">
                                ${escapeHTML(
                                    item.goalName
                                )}
                            </span>

                            <span class="history-date">
                                ${item.date}
                            </span>

                        </div>

                    </div>

                    <strong
                        class="${
                            add
                            ? "history-add"
                            : "history-remove"
                        }">

                        ${
                            add
                            ? "+"
                            : "-"
                        }
                        ${rupiah(item.amount)}

                    </strong>

                </div>

            `;

        }).join("");

}


/* =====================================================
   STATISTICS
===================================================== */

function renderStatistics() {

    const page =
        document.getElementById(
            "statistics"
        );

    if (!page) return;


    let container =
        page.querySelector(
            ".statistics-content"
        );

    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "statistics-content";

        page.appendChild(container);

    }


    const total =
        goals.reduce(
            (sum, g) =>
                sum + g.saved,
            0
        );

    const target =
        goals.reduce(
            (sum, g) =>
                sum + g.target,
            0
        );

    const deposited =
        historyData
            .filter(
                h => h.type === "add"
            )
            .reduce(
                (sum, h) =>
                    sum + h.amount,
                0
            );

    const withdrawn =
        historyData
            .filter(
                h => h.type === "remove"
            )
            .reduce(
                (sum, h) =>
                    sum + h.amount,
                0
            );


    container.innerHTML = `

        <div class="statistics-grid">

            <div class="chart-card">

                <h3>
                    Ringkasan Keuangan
                </h3>

                <div class="summary">

                    <div class="summary-row">
                        <span>Total uang tersimpan</span>
                        <strong>
                            ${rupiah(total)}
                        </strong>
                    </div>

                    <div class="summary-row">
                        <span>Total target</span>
                        <strong>
                            ${rupiah(target)}
                        </strong>
                    </div>

                    <div class="summary-row">
                        <span>Total uang masuk</span>
                        <strong class="history-add">
                            +${rupiah(deposited)}
                        </strong>
                    </div>

                    <div class="summary-row">
                        <span>Total uang diambil</span>
                        <strong class="history-remove">
                            -${rupiah(withdrawn)}
                        </strong>
                    </div>

                </div>

            </div>


            <div class="chart-card">

                <h3>
                    Progress Semua Target
                </h3>

                <div class="chart-list">

                    ${
                        goals.length === 0
                        ?
                        `<p style="color:var(--muted);margin-top:20px;">
                            Belum ada data.
                        </p>`
                        :
                        goals.map(goal => {

                            const percent =
                                Math.min(
                                    Math.round(
                                        (
                                            goal.saved /
                                            goal.target
                                        ) * 100
                                    ),
                                    100
                                );

                            return `

                                <div class="chart-item">

                                    <div class="chart-label">

                                        <span>
                                            ${escapeHTML(
                                                goal.icon
                                            )}
                                            ${escapeHTML(
                                                goal.name
                                            )}
                                        </span>

                                        <strong>
                                            ${percent}%
                                        </strong>

                                    </div>

                                    <div class="progress">

                                        <div
                                            class="progress-bar"
                                            style="width:${percent}%">
                                        </div>

                                    </div>

                                </div>

                            `;

                        }).join("")
                    }

                </div>

            </div>

        </div>

    `;

}


/* =====================================================
   SETTINGS
===================================================== */

function createSettings() {

    const page =
        document.getElementById(
            "settings"
        );

    if (!page) return;

    if (
        page.querySelector(
            ".settings"
        )
    ) return;


    page.innerHTML = `

        <div class="section-title">

            <div>

                <h2>
                    Pengaturan
                </h2>

                <p>
                    Atur aplikasi Tabunganku.
                </p>

            </div>

        </div>


        <div class="settings">

            <div class="setting">

                <div>

                    <strong>
                        Mode Gelap
                    </strong>

                    <p>
                        Gunakan tampilan gelap.
                    </p>

                </div>

                <label class="switch">

                    <input
                        id="darkSwitch"
                        type="checkbox"
                        ${
                            darkMode
                            ? "checked"
                            : ""
                        }>

                    <span></span>

                </label>

            </div>


            <div class="setting">

                <div>

                    <strong>
                        Export Data
                    </strong>

                    <p>
                        Simpan data tabungan ke file JSON.
                    </p>

                </div>

                <button id="exportData">
                    Export
                </button>

            </div>


            <div class="setting">

                <div>

                    <strong>
                        Hapus Semua Data
                    </strong>

                    <p>
                        Semua target dan riwayat akan dihapus.
                    </p>

                </div>

                <button
                    id="clearData"
                    class="danger">
                    Hapus
                </button>

            </div>

        </div>

    `;


    document
        .getElementById("darkSwitch")
        .addEventListener(
            "change",
            toggleTheme
        );


    document
        .getElementById("exportData")
        .addEventListener(
            "click",
            exportData
        );


    document
        .getElementById("clearData")
        .addEventListener(
            "click",
            clearData
        );

}

createSettings();


/* =====================================================
   EXPORT
===================================================== */

function exportData() {

    const data = {

        goals: goals,

        history: historyData,

        exported:
            new Date().toISOString()

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "tabunganku-backup.json";

    a.click();

    URL.revokeObjectURL(url);

    showToast(
        "Data berhasil di-export."
    );

}


/* =====================================================
   CLEAR DATA
===================================================== */

function clearData() {

    const confirmed =
        confirm(
            "Yakin ingin menghapus SEMUA data tabungan?"
        );

    if (!confirmed) return;

    goals = [];

    historyData = [];

    saveData();

    renderGoals();

    renderHistory();

    renderStatistics();

    showToast(
        "Semua data telah dihapus."
    );

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    let toast =
        document.getElementById(
            "toast"
        );

    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "toast";

        toast.className =
            "toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =====================================================
   SECURITY / HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =====================================================
   INITIALIZATION
===================================================== */

applyTheme();

renderGoals();

renderHistory();

renderStatistics();
