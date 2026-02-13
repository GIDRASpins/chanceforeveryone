let isRegistered = false;
let isLoginMode = false;
let currentUser = null;
let currentLang = localStorage.getItem('cfe_lang') || 'ua';
let userChoice = localStorage.getItem('userChoice') || "";

const dictionary = {
    ua: {
        nav_home: "Панель", nav_interview: "AI Інтерв'ю", nav_edu: "Освіта & Гранти", nav_jobs: "Пошук роботи",
        status_guest: "Гість", status_user: "Користувач: ", auth_title: "Реєстрація",
        auth_login_title: "Вхід", auth_btn: "Створити акаунт", auth_login_btn: "Увійти",
        prof_resume: "Резюме", prof_courses: "Мої курси", prof_completed: "Пройдено",
        prof_ongoing: "У процесі", logout_btn: "Вийти з акаунта", nav_resume: "AI конструктор резюме"
    },
    en: {
        nav_home: "Dashboard", nav_interview: "AI Interview", nav_edu: "Education", nav_jobs: "Jobs",
        status_guest: "Guest", status_user: "User: ", auth_title: "Registration",
        auth_login_title: "Login", auth_btn: "Sign Up", auth_login_btn: "Sign In",
        prof_resume: "Resume", prof_courses: "My Courses", prof_completed: "Completed",
        prof_ongoing: "Ongoing", logout_btn: "Log Out", nav_resume: "AI resume builder"
    }
};

window.onload = () => {
    checkAuth();
    changeLang(currentLang);
    if (userChoice) updateResults();
};

function checkAuth() {
    const saved = localStorage.getItem('cfe_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        isRegistered = true;
        updateUI();
    }
}

// Перемикання Вхід/Реєстрація
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const nameField = document.getElementById('user-name');
    const title = document.getElementById('auth-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleLink = document.getElementById('toggle-link');

    if (isLoginMode) {
        title.innerText = dictionary[currentLang].auth_login_title;
        submitBtn.innerText = dictionary[currentLang].auth_login_btn;
        nameField.classList.add('hidden');
        toggleLink.innerText = currentLang === 'ua' ? "Зареєструватися" : "Register";
    } else {
        title.innerText = dictionary[currentLang].auth_title;
        submitBtn.innerText = dictionary[currentLang].auth_btn;
        nameField.classList.remove('hidden');
        toggleLink.innerText = currentLang === 'ua' ? "Увійти" : "Login";
    }
}

function handleAuth() {
    const nameInput = document.getElementById('user-name').value;
    const emailInput = document.getElementById('user-email').value;
    const passInput = document.getElementById('user-pass').value;

    if (isLoginMode) {
        const savedUser = localStorage.getItem('cfe_user');
        const savedPass = localStorage.getItem('cfe_pass');
        if (savedUser && savedPass === passInput) {
            currentUser = JSON.parse(savedUser);
            isRegistered = true;
            updateUI();
            showPage('dashboard');
        } else {
            alert(currentLang === 'ua' ? "Невірні дані!" : "Wrong credentials!");
        }
    } else {
        if (nameInput && emailInput && passInput) {
            currentUser = { name: nameInput, email: emailInput };
            localStorage.setItem('cfe_user', JSON.stringify(currentUser));
            localStorage.setItem('cfe_pass', passInput);
            isRegistered = true;
            updateUI();
            showPage('dashboard');
        }
    }
}

function logout() {
    localStorage.removeItem('cfe_user');
    localStorage.removeItem('userChoice');
    location.reload();
}

function updateUI() {
    const status = document.getElementById('auth-status');
    if (isRegistered && currentUser) {
        status.innerHTML = `<div style="display:flex; align-items:center; gap:8px;">
            <img src="${localStorage.getItem('userAvatar') || 'https://via.placeholder.com/30'}" style="width:25px;height:25px;border-radius:50%;object-fit:cover;">
            <span>${currentUser.name}</span>
        </div>`;
        
        if(document.getElementById('profile-name-display')) {
            document.getElementById('profile-name-display').innerText = currentUser.name;
            document.getElementById('profile-email-display').innerText = currentUser.email;
            document.getElementById('resume-text').value = localStorage.getItem('userResume') || "";
            document.getElementById('profile-img').src = localStorage.getItem('userAvatar') || 'https://via.placeholder.com/150';
            updateProfileStats();
        }
    }
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const navItem = document.querySelector(`[onclick*="${id}"]`);
    if (navItem) navItem.classList.add('active');
}

function handleProtectedAction(id) {
    if (!isRegistered) showPage('auth');
    else showPage(id);
}

function changeLang(lang) {
    currentLang = lang;
    localStorage.setItem('cfe_lang', lang);
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (dictionary[lang][key]) el.innerText = dictionary[lang][key];
    });
}

// Профіль: Аватар та Резюме
document.getElementById('image-input')?.addEventListener('change', function() {
    const reader = new FileReader();
    reader.onload = () => {
        localStorage.setItem('userAvatar', reader.result);
        updateUI();
    };
    reader.readAsDataURL(this.files[0]);
});

function saveResume() {
    localStorage.setItem('userResume', document.getElementById('resume-text').value);
    alert("Збережено!");
}

function updateProfileStats() {
    const comp = document.getElementById('completed-count');
    if (comp) comp.innerText = userChoice ? "1" : "0";
}