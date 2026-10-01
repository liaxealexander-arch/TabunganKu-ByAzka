/* =========================================================
   TABUNGANKU
   Sistem akun + penyimpanan localStorage
========================================================= */


/* ================= ACCOUNT ================= */

const ACCOUNTS_KEY = "tabunganku_accounts";
const SESSION_KEY = "tabunganku_session";


const defaultAccount = {
    username: "Azka",
    password: "123"
};


function getAccounts() {

    let accounts =
        JSON.parse(
            localStorage.getItem(ACCOUNTS_KEY)
        );

    if (!accounts) {

        accounts = {
            Azka: {
                username: "Azka",
                password: "123",
                goals: [],
                transactions: [],
                darkMode: false
            }
        };

        localStorage.setItem(
            ACCOUNTS_KEY,
            JSON.stringify(accounts)
        );
    }

    return accounts;
}


function saveAccounts(accounts) {

    localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify(accounts)
    );
}


function getCurrentUser() {

    return localStorage.getItem(SESSION_KEY);
}


function setCurrentUser(username) {

    localStorage.setItem(
        SESSION_KEY,
        username
    );
}


function logout() {

    localStorage.removeItem(SESSION_KEY);

    location.reload();
}


/* ================= DATA ================= */

function getUserData() {

    const accounts = getAccounts();

    const username = getCurrentUser();

    if (!username || !accounts[username]) {
        return null;
    }

    return accounts[username];
}


function saveUserData(data) {

    const accounts = getAccounts();

    const username = getCurrentUser();

    if (!username) return;

    accounts[username] = data;

    saveAccounts(accounts);
}


/* ================= FORMAT ================= */

function rupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number || 0);
}


function dateFormat(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function generateId() {

    return Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2);
}


/* ================= DOM ================= */

const loginPage =
    document.getElementById("loginPage");

const app =
    document.getElementById("app");

const loginBtn =
    document.getElementById("loginBtn");

const usernameInput =
    document.getElementById("usernameInput");

const passwordInput =
    document.getElementById("passwordInput");

const loginError =
    document.getElementById("loginError");


/* ================= LOGIN ================= */

loginBtn.addEventListener(
    "click",
    login
);


passwordInput.addEventListener(
    "keydown",
    function(e) {

        if (e.key === "Enter") {
            login();
        }

    }
);


function login() {

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;

    const accounts = getAccounts();

    if (
        !accounts[username] ||
        accounts[username].password !== password
    ) {

        loginError.textContent =
            "Username atau password salah.";

        return;
    }

    setCurrentUser(username);

    loginError.textContent = "";

    initializeApp();
}


/* ================= PASSWORD ================= */

document
    .getElementById("showPasswordBtn")
    .addEventListener(
        "click",
        function() {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                this.textContent = "🙈";

            } else {

                passwordInput.type =
                    "password";

                this.textContent = "👁️";
            }

        }
    );


/* ================= INITIALIZE ================= */

function initializeApp() {

    loginPage.classList.add("hidden");

    app.classList.remove("hidden");

    const username =
        getCurrentUser();

    document
        .getElementById("sidebarUsername")
        .textContent = username;

    document
        .getElementById("profileUsername")
        .textContent = username;

    document
        .getElementById("welcomeUsername")
        .textContent = username;

    updateDate();

    applySavedTheme();

    updateDashboard();

    renderGoals();

    renderHistory();

    renderStatistics();
}


/* ================= CHECK SESSION ================= */

if (getCurrentUser()) {

    initializeApp();

}


/* ================= DATE ================= */

function updateDate() {

    const now = new Date();

    document
        .getElementById("dateText")
        .textContent =
        now.toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}


/* ================= NAVIGATION ================= */

const navButtons =
    document.querySelectorAll(".nav-btn");


navButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;

                changePage(page);

            }
        );

    }
);


function changePage(page) {

    document
        .querySelectorAll(".page")
        .forEach(
            p => p.classList.remove(
                "active-page"
            )
        );

    const target =
        document.getElementById(
            page + "Page"
        );

    if (target) {
        target.classList.add(
            "active-page"
        );
    }


    navButtons.forEach(
        btn => {

            btn.classList.toggle(
                "active",
                btn.dataset.page === page
            );

        }
    );


    const titles = {

        dashboard: "Dashboard",

        savings: "Tabungan",

        history: "Riwayat",

        statistics: "Statistik",

        settings: "Pengaturan"

    };


    document
        .getElementById("pageTitle")
        .textContent =
        titles[page] || "Dashboard";


    updateDashboard();

    renderGoals();

    renderHistory();

    renderStatistics();
}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    const data =
        getUserData();

    if (!data) return;


    const goals =
        data.goals || [];


    const totalSaved =
        goals.reduce(
            (sum, goal) =>
                sum + Number(goal.saved),
            0
        );


    const active =
        goals.filter(
            goal =>
                goal.saved < goal.target
        );


    const completed =
        goals.filter(
            goal =>
                goal.saved >= goal.target
        );


    const totalTarget =
        goals.reduce(
            (sum, goal) =>
                sum + Number(goal.target),
            0
        );


    const overall =
        totalTarget > 0
            ? Math.min(
                100,
                Math.round(
                    (totalSaved /
                        totalTarget) *
                    100
                )
            )
            : 0;


    document
        .getElementById("totalSaved")
        .textContent =
        rupiah(totalSaved);


    document
        .getElementById("activeGoals")
        .textContent =
        active.length;


    document
        .getElementById("completedGoals")
        .textContent =
        completed.length;


    document
        .getElementById("overallProgress")
        .textContent =
        overall + "%";


    renderDashboardGoals();
}


/* ================= DASHBOARD GOALS ================= */

function renderDashboardGoals() {

    const data =
        getUserData();

    if (!data) return;


    const container =
        document.getElementById(
            "dashboardGoals"
        );

    const empty =
        document.getElementById(
            "dashboardEmpty"
        );


    let goals =
        [...data.goals];


    goals.sort(
        (a, b) =>
            Number(b.pinned) -
            Number(a.pinned)
    );


    goals =
        goals.slice(0, 6);


    if (goals.length === 0) {

        container.innerHTML = "";

        empty.classList.remove(
            "hidden"
        );

        return;
    }


    empty.classList.add(
        "hidden"
    );


    container.innerHTML =
        goals.map(
            goalCardHTML
        ).join("");
}


/* ================= GOAL CARD ================= */

function goalCardHTML(goal) {

    const percent =
        Math.min(
            100,
            Math.round(
                (goal.saved /
                    goal.target) *
                100
            )
        );


    const completed =
        goal.saved >= goal.target;


    return `

        <div class="goal-card">

            <div class="goal-top">

                <div class="goal-icon">
                    ${goal.emoji}
                </div>

                <button
                    class="pin-btn ${goal.pinned ? "pinned" : ""}"
                    onclick="togglePin('${goal.id}')"
                    title="Pin"
                >
                    ${goal.pinned ? "📌" : "📍"}
                </button>

            </div>


            <h3>
                ${escapeHTML(goal.name)}
            </h3>


            <div class="goal-date">
                ${
                    goal.date
                    ? "Target: " +
                      dateFormat(goal.date)
                    : "Tanpa tanggal target"
                }
            </div>


            <div class="goal-money">

                <strong>
                    ${rupiah(goal.saved)}
                </strong>

                <span>
                    dari ${rupiah(goal.target)}
                </span>

            </div>


            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${percent}%"
                ></div>

            </div>


            <div class="progress-info">

                <span>
                    ${percent}% tercapai
                </span>

                <span>
                    ${rupiah(
                        Math.max(
                            0,
                            goal.target -
                            goal.saved
                        )
                    )}
                    lagi
                </span>

            </div>


            ${
                completed
                ? `
                    <div class="complete-badge">
                        ✓ TARGET TERCAPAI
                    </div>
                `
                : ""
            }


            <div class="goal-actions">

                <button
                    class="add-money-btn"
                    onclick="openTransaction(
                        '${goal.id}',
                        'add'
                    )"
                >
                    + Tambah
                </button>


                <button
                    class="subtract-money-btn"
                    onclick="openTransaction(
                        '${goal.id}',
                        'subtract'
                    )"
                >
                    − Kurangi
                </button>


                <button
                    class="edit-btn"
                    onclick="editGoal(
                        '${goal.id}'
                    )"
                >
                    ✏️ Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteGoal(
                        '${goal.id}'
                    )"
                >
                    🗑️ Hapus
                </button>

            </div>

        </div>

    `;
}


/* ================= ALL GOALS ================= */

function renderGoals() {

    const data =
        getUserData();

    if (!data) return;


    const container =
        document.getElementById(
            "allGoals"
        );

    if (!container) return;


    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase();


    const filter =
        document
            .getElementById(
                "filterSelect"
            )
            .value;


    let goals =
        [...data.goals];


    if (search) {

        goals =
            goals.filter(
                goal =>
                    goal.name
                        .toLowerCase()
                        .includes(search)
            );

    }


    if (filter === "active") {

        goals =
            goals.filter(
                goal =>
                    goal.saved <
                    goal.target
            );

    }


    if (filter === "completed") {

        goals =
            goals.filter(
                goal =>
                    goal.saved >=
                    goal.target
            );

    }


    if (filter === "pinned") {

        goals =
            goals.filter(
                goal => goal.pinned
            );

    }


    goals.sort(
        (a, b) =>
            Number(b.pinned) -
            Number(a.pinned)
    );


    if (goals.length === 0) {

        container.innerHTML = `

            <div class="empty-state"
                 style="grid-column:1/-1">

                <div>🔎</div>

                <h3>
                    Tidak ada tabungan
                </h3>

                <p>
                    Coba ubah pencarian atau filter.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        goals
            .map(goalCardHTML)
            .join("");
}


/* ================= SEARCH ================= */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        renderGoals
    );


document
    .getElementById("filterSelect")
    .addEventListener(
        "change",
        renderGoals
    );


/* ================= GOAL MODAL ================= */

const goalModal =
    document.getElementById(
        "goalModal"
    );


function openGoalModal(goal = null) {

    goalModal.classList.remove(
        "hidden"
    );


    if (goal) {

        document
            .getElementById(
                "modalTitle"
            )
            .textContent =
            "Edit Tabungan";


        document
            .getElementById(
                "editGoalId"
            )
            .value =
            goal.id;


        document
            .getElementById(
                "goalName"
            )
            .value =
            goal.name;


        document
            .getElementById(
                "goalTarget"
            )
            .value =
            goal.target;


        document
            .getElementById(
                "goalInitial"
            )
            .value =
            goal.saved;


        document
            .getElementById(
                "goalDate"
            )
            .value =
            goal.date || "";


        document
            .getElementById(
                "goalEmoji"
            )
            .value =
            goal.emoji;


        selectEmoji(
            goal.emoji
        );

    } else {

        document
            .getElementById(
                "modalTitle"
            )
            .textContent =
            "Tambah Tabungan";


        document
            .getElementById(
                "goalForm"
            )
            .reset();


        document
            .getElementById(
                "editGoalId"
            )
            .value = "";


        document
            .getElementById(
                "goalInitial"
            )
            .value = 0;


        document
            .getElementById(
                "goalEmoji"
            )
            .value = "🎯";


        selectEmoji("🎯");
    }

}


document
    .getElementById(
        "closeModalBtn"
    )
    .addEventListener(
        "click",
        () =>
            goalModal.classList.add(
                "hidden"
            )
    );


document
    .getElementById(
        "addGoalBtn"
    )
    .addEventListener(
        "click",
        () =>
            openGoalModal()
    );


document
    .getElementById(
        "dashboardAddBtn"
    )
    .addEventListener(
        "click",
        () =>
            openGoalModal()
    );


document
    .getElementById(
        "emptyAddBtn"
    )
    .addEventListener(
        "click",
        () =>
            openGoalModal()
    );


document
    .getElementById(
        "viewAllBtn"
    )
    .addEventListener(
        "click",
        () =>
            changePage("savings")
    );


/* ================= SAVE GOAL ================= */

document
    .getElementById(
        "goalForm"
    )
    .addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const data =
                getUserData();


            const id =
                document
                    .getElementById(
                        "editGoalId"
                    )
                    .value;


            const name =
                document
                    .getElementById(
                        "goalName"
                    )
                    .value
                    .trim();


            const target =
                Number(
                    document
                        .getElementById(
                            "goalTarget"
                        )
                        .value
                );


            const initial =
                Number(
                    document
                        .getElementById(
                            "goalInitial"
                        )
                        .value
                ) || 0;


            const date =
                document
                    .getElementById(
                        "goalDate"
                    )
                    .value;


            const emoji =
                document
                    .getElementById(
                        "goalEmoji"
                    )
                    .value;


            if (!name || target <= 0) {

                showToast(
                    "Isi data dengan benar",
                    "⚠️"
                );

                return;
            }


            if (id) {

                const goal =
                    data.goals.find(
                        g =>
                            g.id === id
                    );


                if (!goal) return;


                goal.name = name;

                goal.target = target;

                goal.date = date;

                goal.emoji = emoji;


                if (
                    initial !==
                    goal.saved
                ) {

                    const difference =
                        initial -
                        goal.saved;


                    goal.saved =
                        Math.max(
                            0,
                            initial
                        );


                    data.transactions.push({

                        id:
                            generateId(),

                        goalId:
                            goal.id,

                        type:
                            difference >=
                            0
                                ? "add"
                                : "subtract",

                        amount:
                            Math.abs(
                                difference
                            ),

                        note:
                            "Penyesuaian saldo",

                        date:
                            new Date()
                                .toISOString()

                    });

                }


                showToast(
                    "Tabungan diperbarui"
                );

            } else {

                const goal = {

                    id:
                        generateId(),

                    name,

                    target,

                    saved:
                        Math.max(
                            0,
                            initial
                        ),

                    date,

                    emoji,

                    pinned:
                        false,

                    createdAt:
                        new Date()
                            .toISOString()

                };


                data.goals.push(goal);


                if (initial > 0) {

                    data.transactions.push({

                        id:
                            generateId(),

                        goalId:
                            goal.id,

                        type:
                            "add",

                        amount:
                            initial,

                        note:
                            "Saldo awal",

                        date:
                            new Date()
                                .toISOString()

                    });

                }


                showToast(
                    "Target tabungan dibuat 🎉"
                );
            }


            saveUserData(data);


            goalModal.classList.add(
                "hidden"
            );


            updateDashboard();

            renderGoals();

            renderHistory();

            renderStatistics();

        }
    );


/* ================= EMOJI ================= */

document
    .querySelectorAll(
        ".emoji-option"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectEmoji(
                        button.textContent
                    );

                }
            );

        }
    );


function selectEmoji(emoji) {

    document
        .getElementById(
            "goalEmoji"
        )
        .value =
        emoji;


    document
        .querySelectorAll(
            ".emoji-option"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "selected",
                    button.textContent ===
                    emoji
                );

            }
        );
}


/* ================= EDIT ================= */

function editGoal(id) {

    const data =
        getUserData();


    const goal =
        data.goals.find(
            g => g.id === id
        );


    if (!goal) return;


    openGoalModal(goal);
}


/* ================= DELETE ================= */

function deleteGoal(id) {

    const data =
        getUserData();


    const goal =
        data.goals.find(
            g => g.id === id
        );


    if (!goal) return;


    const confirmDelete =
        confirm(
            `Hapus tabungan "${goal.name}"?`
        );


    if (!confirmDelete) return;


    data.goals =
        data.goals.filter(
            g => g.id !== id
        );


    data.transactions =
        data.transactions.filter(
            t => t.goalId !== id
        );


    saveUserData(data);


    showToast(
        "Tabungan dihapus",
        "🗑️"
    );


    updateDashboard();

    renderGoals();

    renderHistory();

    renderStatistics();
}


/* ================= PIN ================= */

function togglePin(id) {

    const data =
        getUserData();


    const goal =
        data.goals.find(
            g => g.id === id
        );


    if (!goal) return;


    goal.pinned =
        !goal.pinned;


    saveUserData(data);


    renderGoals();

    updateDashboard();


    showToast(
        goal.pinned
            ? "Ditambahkan ke favorit 📌"
            : "Dihapus dari favorit"
    );
}


/* ================= TRANSACTION ================= */

const transactionModal =
    document.getElementById(
        "transactionModal"
    );


function openTransaction(
    goalId,
    type
) {

    const data =
        getUserData();


    const goal =
        data.goals.find(
            g => g.id === goalId
        );


    if (!goal) return;


    document
        .getElementById(
            "transactionGoalId"
        )
        .value =
        goalId;


    document
        .getElementById(
            "transactionType"
        )
        .value =
        type;


    document
        .getElementById(
            "transactionGoalName"
        )
        .textContent =
        goal.name;


    document
        .getElementById(
            "transactionTitle"
        )
        .textContent =
        type === "add"
            ? "Tambah Uang"
            : "Kurangi Uang";


    document
        .getElementById(
            "transactionForm"
        )
        .reset();


    transactionModal.classList.remove(
        "hidden"
    );
}


document
    .getElementById(
        "closeTransactionBtn"
    )
    .addEventListener(
        "click",
        () =>
            transactionModal.classList.add(
                "hidden"
            )
    );


document
    .getElementById(
        "transactionForm"
    )
    .addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const data =
                getUserData();


            const goalId =
                document
                    .getElementById(
                        "transactionGoalId"
                    )
                    .value;


            const type =
                document
                    .getElementById(
                        "transactionType"
                    )
                    .value;


            const amount =
                Number(
                    document
                        .getElementById(
                            "transactionAmount"
                        )
                        .value
                );


            const note =
                document
                    .getElementById(
                        "transactionNote"
                    )
                    .value
                    .trim();


            const goal =
                data.goals.find(
                    g =>
                        g.id === goalId
                );


            if (
                !goal ||
                amount <= 0
            ) {

                showToast(
                    "Nominal tidak valid",
                    "⚠️"
                );

                return;
            }


            if (
                type === "subtract" &&
                amount > goal.saved
            ) {

                showToast(
                    "Saldo tidak cukup",
                    "⚠️"
                );

                return;
            }


            if (type === "add") {

                goal.saved += amount;

            } else {

                goal.saved =
                    Math.max(
                        0,
                        goal.saved -
                        amount
                    );
            }


            data.transactions.push({

                id:
                    generateId(),

                goalId,

                type,

                amount,

                note:
                    note ||
                    (
                        type === "add"
                            ? "Menabung"
                            : "Penarikan"
                    ),

                date:
                    new Date()
                        .toISOString()

            });


            saveUserData(data);


            transactionModal.classList.add(
                "hidden"
            );


            showToast(
                type === "add"
                    ? "Berhasil menambah tabungan 💰"
                    : "Saldo berhasil dikurangi"
            );


            updateDashboard();

            renderGoals();

            renderHistory();

            renderStatistics();

        }
    );


/* ================= HISTORY ================= */

function renderHistory() {

    const data =
        getUserData();

    if (!data) return;


    const container =
        document.getElementById(
            "historyList"
        );


    const transactions =
        [...data.transactions]
            .reverse();


    if (
        transactions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div>📜</div>

                <h3>
                    Belum ada transaksi
                </h3>

                <p>
                    Riwayat menabungmu akan muncul di sini.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        transactions
            .map(
                transaction => {

                    const goal =
                        data.goals.find(
                            g =>
                                g.id ===
                                transaction.goalId
                        );


                    const goalName =
                        goal
                            ? goal.name
                            : "Tabungan dihapus";


                   
