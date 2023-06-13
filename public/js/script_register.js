function updateLabel(input) {
        const label = input.nextElementSibling;
        if (input.value !== '') {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
}
