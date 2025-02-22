document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form-container");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const fileInput = document.getElementById("file");
    const fileLabel = document.querySelector(".file-label span");
    const submitButton = document.querySelector(".btn");
    const applicationsContainer = document.createElement("div");
    applicationsContainer.classList.add("applications-container");
    document.querySelector(".content-wrapper").appendChild(applicationsContainer);

    let fileExists = false;

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            fileExists = true;
            fileLabel.textContent = fileInput.files[0].name;
        } else {
            fileExists = false;
            fileLabel.textContent = "ПРИКРЕПИ ФАЙЛ";
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        const file = fileInput.files[0];

        if (!name || !email || !message) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            alert("Пожалуйста, введите корректный email.");
            return;
        }

        if (message.length < 5) {
            alert("Сообщение должно быть не менее 5 символов.");
            return;
        }

        if (file && !fileExists) {
            alert("Файл не существует. Пожалуйста, выберите файл снова.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const fileData = file ? e.target.result : null;
            const fileName = file ? file.name : null;
            
            const application = {
                id: Date.now(),
                name,
                email,
                message,
                fileData,
                fileName,
            };

            saveApplication(application);
            renderApplications();
            form.reset();
            fileLabel.textContent = "ПРИКРЕПИ ФАЙЛ";
            fileExists = false;
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            const application = {
                id: Date.now(),
                name,
                email,
                message,
                fileData: null,
                fileName: null,
            };
            saveApplication(application);
            renderApplications();
            form.reset();
            fileLabel.textContent = "ПРИКРЕПИ ФАЙЛ";
        }
    });

    function saveApplication(application) {
        let applications = JSON.parse(localStorage.getItem("applications")) || [];
        applications.push(application);
        localStorage.setItem("applications", JSON.stringify(applications));
    }

    function renderApplications() {
        applicationsContainer.innerHTML = "";
        const applications = JSON.parse(localStorage.getItem("applications")) || [];

        applications.forEach(app => {
            const appElement = document.createElement("div");
            appElement.classList.add("add-contact-form");
            appElement.innerHTML = `
                <h2 contenteditable="false">${app.name}</h2>
                <p><strong>Email:</strong> <span contenteditable="false">${app.email}</span></p>
                <p><strong>Сообщение:</strong> <span contenteditable="false">${app.message}</span></p>
                ${app.fileData ? `<p><a href="${app.fileData}" download="${app.fileName}">Скачать файл: ${app.fileName}</a></p>` : ""}
                <input type="file" class="edit-file" style="display: none;">
                <button onclick="editApplication(${app.id}, this)">Редактировать</button>
                <button onclick="deleteApplication(${app.id})">Удалить</button>
            `;
            applicationsContainer.appendChild(appElement);
        });
    }

    window.editApplication = function (id, button) {
        let applications = JSON.parse(localStorage.getItem("applications")) || [];
        let app = applications.find(app => app.id === id);
        if (!app) return;

        const appElement = button.parentElement;
        const nameField = appElement.querySelector("h2");
        const emailField = appElement.querySelector("p span");
        const messageField = appElement.querySelectorAll("p span")[1];
        const fileInput = appElement.querySelector(".edit-file");

        if (button.textContent === "Редактировать") {
            nameField.contentEditable = "true";
            emailField.contentEditable = "true";
            messageField.contentEditable = "true";
            appElement.classList.add("editing");
            fileInput.style.display = "block";
            button.textContent = "Сохранить";
        } else {
            let isChanged = false;

            if (nameField.textContent !== app.name) {
                app.name = nameField.textContent;
                isChanged = true;
            }

            if (emailField.textContent !== app.email) {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (!emailRegex.test(emailField.textContent)) {
                    alert("Пожалуйста, введите корректный email.");
                    return;
                }
                app.email = emailField.textContent;
                isChanged = true;
            }

            if (messageField.textContent !== app.message) {
                if (messageField.textContent.length < 5) {
                    alert("Сообщение должно быть не менее 5 символов.");
                    return;
                }
                app.message = messageField.textContent;
                isChanged = true;
            }

            if (fileInput.files.length > 0) {
                const newFile = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function (e) {
                    app.fileData = e.target.result;
                    app.fileName = newFile.name;
                    isChanged = true;
                    if (isChanged) {
                        localStorage.setItem("applications", JSON.stringify(applications));
                        renderApplications();
                    }
                };
                reader.readAsDataURL(newFile);
            } else if (isChanged) {
                localStorage.setItem("applications", JSON.stringify(applications));
                renderApplications();
            }
        }
    };

    window.deleteApplication = function (id) {
        let applications = JSON.parse(localStorage.getItem("applications")) || [];
        applications = applications.filter(app => app.id !== id);
        localStorage.setItem("applications", JSON.stringify(applications));
        renderApplications();
    };

    renderApplications();
});
