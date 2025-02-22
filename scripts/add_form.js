document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form-container");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const fileInput = document.getElementById("file");
    const fileLabel = document.querySelector(".file-label span");
    const applicationsContainer = document.createElement("div");
    applicationsContainer.classList.add("applications-container");
    document.querySelector(".content-wrapper").appendChild(applicationsContainer);

    fileInput.addEventListener("change", function () {
        fileLabel.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : "ПРИКРЕПИ ФАЙЛ";
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        const file = fileInput.files[0];

        if (!isValidForm(name, email, message)) return;

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                handleApplicationSave({ name, email, message, fileData: e.target.result, fileName: file.name });
            };

            reader.onerror = function () {
                alert("Ошибка чтения файла. Возможно, он был удалён или повреждён.");
                resetFileInput();
            };

            try {
                reader.readAsDataURL(file);
            } catch (error) {
                alert("Ошибка при обработке файла. Попробуйте выбрать файл снова.");
                resetFileInput();
            }
        } else {
            handleApplicationSave({ name, email, message, fileData: null, fileName: null });
        }

        form.reset();
        fileLabel.textContent = "ПРИКРЕПИ ФАЙЛ";
    });

    function isValidForm(name, email, message) {
        if (!name || !email || !message) {
            alert("Пожалуйста, заполните все поля.");
            return false;
        }
        if (!isValidEmail(email)) {
            alert("Пожалуйста, введите корректный email.");
            return false;
        }
        if (!isValidMessage(message)) {
            alert("Сообщение должно быть не менее 5 символов.");
            return false;
        }
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }

    function isValidMessage(message) {
        return message.length >= 5;
    }

    function handleApplicationSave(application) {
        let applications = JSON.parse(localStorage.getItem("applications")) || [];
        application.id = Date.now();
        applications.push(application);
        localStorage.setItem("applications", JSON.stringify(applications));
        renderApplications();
    }

    function resetFileInput() {
        fileInput.value = "";
        fileLabel.textContent = "ПРИКРЕПИ ФАЙЛ";
    }

    function renderApplications() {
        applicationsContainer.innerHTML = "";
        const applications = JSON.parse(localStorage.getItem("applications")) || [];

        applications.forEach(app => {
            const appElement = document.createElement("div");
            appElement.classList.add("add-contact-form");
            appElement.innerHTML = `
                <h2 class="editable">${app.name}</h2>
                <p><strong>Email:</strong> <span class="editable">${app.email}</span></p>
                <p><strong>Сообщение:</strong> <span class="editable">${app.message}</span></p>
                ${app.fileData ? `<p><a href="${app.fileData}" download="${app.fileName}">Скачать файл: ${app.fileName}</a></p>` : ""}
                <input type="file" class="edit-file">
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
            fileInput.style.display = "block";
            button.textContent = "Сохранить";
    
            nameField.classList.add("editing");
            emailField.classList.add("editing");
            messageField.classList.add("editing");
        } else {
            let isChanged = false;
    
            const originalName = app.name;
            const originalEmail = app.email;
            const originalMessage = app.message;
    
            if (nameField.textContent !== originalName) {
                app.name = nameField.textContent;
                isChanged = true;
            }
    
            if (emailField.textContent !== originalEmail) {
                if (!isValidEmail(emailField.textContent)) {
                    alert("Пожалуйста, введите корректный email.");
                    return;
                }
                app.email = emailField.textContent;
                isChanged = true;
            }
    
            if (messageField.textContent !== originalMessage) {
                if (!isValidMessage(messageField.textContent)) {
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
                reader.onerror = function () {
                    alert("Ошибка загрузки файла. Попробуйте снова.");
                    fileInput.value = "";
                };
                reader.readAsDataURL(newFile);
            } else if (isChanged) {
                localStorage.setItem("applications", JSON.stringify(applications));
                renderApplications();
            }
    
            if (!isChanged) {
                renderApplications();
            }
    
            nameField.classList.remove("editing");
            emailField.classList.remove("editing");
            messageField.classList.remove("editing");
    
            button.textContent = "Редактировать";
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
