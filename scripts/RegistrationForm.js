const { useState } = React;

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const validate = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Имя обязательно";
        if (!formData.email.includes("@")) newErrors.email = "Некорректный email";
        if (formData.password.length < 6) newErrors.password = "Пароль должен быть не менее 6 символов";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setSuccessMessage("Регистрация успешна!");
            setFormData({ name: "", email: "", password: "" });
            setErrors({});
        }
    };

    return (
        <div className="contact-form registration-form">
            <h2>Регистрация</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Имя"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
                <button type="submit" className="btn">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default RegistrationForm;
