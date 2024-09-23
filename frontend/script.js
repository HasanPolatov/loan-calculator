const loanAmountSlider = document.getElementById('loanAmount');
const loanTermSlider = document.getElementById('loanTerm');
const interestRateSlider = document.getElementById('interestRate');
const loanAmountValue = document.getElementById('loanAmountValue');
const loanTermValue = document.getElementById('loanTermValue');
const interestRateValue = document.getElementById('interestRateValue');
const interestRateResult = document.getElementById('interestRateResult');
const monthlyPayment = document.getElementById('monthlyPayment');
const paymentTypeInputs = document.querySelectorAll('input[name="paymentType"]');

function updateValues() {
    loanAmountValue.value = formatNumberWithSpaces(loanAmountSlider.value) + ' so\'m';
    loanTermValue.value = loanTermSlider.value + ' oy';
    interestRateValue.value = interestRateSlider.value + ' %';
    interestRateResult.textContent = interestRateSlider.value + '%';

    const principal = parseFloat(loanAmountSlider.value);
    const term = parseFloat(loanTermSlider.value);
    const rate = parseFloat(interestRateSlider.value) / 100 / 12;

    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;

    if (paymentType === 'annuity') {
        const payment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        monthlyPayment.textContent = formatNumberWithSpaces(Math.round(payment)) + ' so\'m';
    } else {
        const basePayment = principal / term;
        const firstPayment = basePayment + principal * rate;
        const lastPayment = basePayment + (principal / term) * rate;

        monthlyPayment.textContent = formatNumberWithSpaces(Math.round((firstPayment + lastPayment) / 2)) + ' so\'m';
    }
}

loanAmountSlider.addEventListener('input', updateValues);
loanTermSlider.addEventListener('input', updateValues);
interestRateSlider.addEventListener('input', updateValues);
paymentTypeInputs.forEach(input => input.addEventListener('change', updateValues));

loanAmountValue.addEventListener("focus", function () {
    const formattedValue = this.value.replace(/\s|so'm/g, '');
    this.value = formattedValue;
    this.type = "number";
    this.removeAttribute("readonly");
});

loanAmountValue.addEventListener("blur", function () {
    this.type="text";
    let numberValue = parseInt(this.value.replace(/\s/g, ''), 10);
    const min = parseInt(this.min, 10);
    const max = parseInt(this.max, 10);
    
    if (isNaN(numberValue) || numberValue < min) {
        this.value = formatNumberWithSpaces(min) + " so'm";
    } else if (numberValue > max) {
        this.value = formatNumberWithSpaces(max) + " so'm";
    } else {
        this.value = formatNumberWithSpaces(numberValue) + " so'm";
    }

    loanAmountSlider.value = numberValue;

    this.setAttribute("readonly", true);
});

loanTermValue.addEventListener("focus", function () {
    const formattedValue = this.value.replace(/\s|oy/g, '');
    this.value = formattedValue;
    this.type = "number";
    this.removeAttribute("readonly");
});

loanTermValue.addEventListener("blur", function () {

    this.type="text";
    let numberValue = parseInt(this.value.replace(/\s/g, ''), 10);
    const min = parseInt(this.min, 10);
    const max = parseInt(this.max, 10);

    if (isNaN(numberValue) || numberValue < min) {
        this.value = min + " oy";
    } else if (numberValue > max) {
        this.value = max + " oy";
    } else {
        this.value = numberValue + " oy";
    }

    loanTermSlider.value = numberValue;

    this.setAttribute("readonly", true);
});

interestRateValue.addEventListener("focus", function () {
    const formattedValue = this.value.replace(/\s|%|/g, '');
    this.value = formattedValue;
    this.type = "number";
    this.removeAttribute("readonly");
});

interestRateValue.addEventListener("blur", function () {
    this.type="text";
    let numberValue = parseInt(this.value.replace(/\s/g, ''), 10);
    const min = parseInt(this.min, 10);
    const max = parseInt(this.max, 10);

    if (isNaN(numberValue) || numberValue < min) {
        this.value = min + " %";
    } else if (numberValue > max) {
        this.value = max + " %";
    } else {
        this.value = numberValue + " %";
    }

    interestRateSlider.value = numberValue;

    this.setAttribute("readonly", true);
});

function formatNumberWithSpaces(number) {
    return new Intl.NumberFormat('en-US', { 
        useGrouping: true 
    }).format(number).replace(/,/g, ' ');
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('myModal');
    const openModalBtn = document.getElementById('repaymentScheduleBtn');
    const closeBtn = document.querySelector('.close');
    const modalData = document.getElementById('modalData');
    const modalContent = modal.querySelector('.modal-content');
    const tbody = document.querySelector('#repaymentSchedule tbody');

    let urlQueries = "?";
    let loanAmount = loanAmountSlider.value;
    let loanTerm = loanTermSlider.value;
    let interestRate = interestRateSlider.value;
    let paymentTypeInt = document.querySelector('input[name="paymentType"]:checked').value;
    let paymentType = (paymentTypeInt === 'annuity' ? 'ANNUITY' : 'DIFFERENTIAL');

    urlQueries += "loanAmount=" + loanAmount + "&term=" + loanTerm + "&interestRate=" + interestRate + "&repaymentType=" + paymentType;
  
    openModalBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      setTimeout(() => {
        modal.classList.add('show');
        modalContent.classList.add('show-content');
      }, 10);
      fetchData();
    });
  
    closeBtn.addEventListener('click', () => {
      closeModal();
    });
  
    window.addEventListener('click', (event) => {
      if (event.target == modal) {
        closeModal();
      }
    });
  
    function closeModal() {
      modalContent.classList.remove('show-content');
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 500);
    }
  
    function fetchData() {
      fetch('http://localhost:8777/api/v1/credit/repayment-schedule' + urlQueries)
        .then(response => response.json())
        .then(data => {
            modalData.textContent = '';
            tbody.innerHTML = '';
            data.forEach((item, index) => {
                const tr = document.createElement('tr');

                if (item.date === null) {
                    tr.innerHTML = `
                <td></td>
                <td></td>
                <td>Jami</td>
                <td>${formatNumberWithSpaces(item.loanRepaymentAmount)}</td>
                <td>${formatNumberWithSpaces(item.loanInterestsAmount)}</td>
                <td>${formatNumberWithSpaces(item.totalForRepayment)}</td>
                `;
                } else {

                tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.date}</td>
                <td>${formatNumberWithSpaces(item.loanBalance)}</td>
                <td>${formatNumberWithSpaces(item.loanRepaymentAmount)}</td>
                <td>${formatNumberWithSpaces(item.loanInterestsAmount)}</td>
                <td>${formatNumberWithSpaces(item.totalForRepayment)}</td>
                `;
                }
                tbody.appendChild(tr);
            });

        })
        .catch(error => {
          modalData.textContent = 'Error fetching data.';
          console.error('Error:', error);
        });
    }
  });  

updateValues();