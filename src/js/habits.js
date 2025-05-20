function initializeHabits(habitNameInput, addHabitButton, habitListUl) {
    let habits = JSON.parse(localStorage.getItem('habits_v1')) || [];

    function saveHabitsToLocalStorage() {
        localStorage.setItem('habits_v1', JSON.stringify(habits));
    }

    function renderHabits() {
        if (!habitListUl) return;
        habitListUl.innerHTML = '';
        if (habits.length === 0) {
            const li = document.createElement('li');
            li.textContent = "No habits yet. Add one above!";
            li.style.textAlign = "center";
            li.style.color = "#888";
            habitListUl.appendChild(li);
            return;
        }
        habits.forEach(habit => {
            const li = document.createElement('li');
            li.textContent = habit.name; 
            habitListUl.appendChild(li);
        });
    }

    if (addHabitButton && habitNameInput) {
        addHabitButton.onclick = () => {
            const name = habitNameInput.value.trim();
            if (name) {
                habits.push({ name: name, progress: {} }); 
                habitNameInput.value = '';
                saveHabitsToLocalStorage();
                renderHabits();
            } else {
                alert('Please enter a habit name.');
            }
        };
    }
    renderHabits();
}