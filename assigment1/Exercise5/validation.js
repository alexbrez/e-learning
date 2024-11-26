document.getElementById('registration-form').addEventListener('submit', function (e) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const birthDate = new Date(document.getElementById('birth-date').value);
    const today = new Date();

   
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
        e.preventDefault();
        alert('You must be at least 18 years old to register.');
        return;
    }

    
    if (password !== confirmPassword) {
        e.preventDefault();
        alert('Passwords do not match.');
    }
});
