gsap.from(".hero-section h1", {
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: "power3.out"
});

gsap.from(".hero-section p", {
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1.5,
    delay: 0.3,
    ease: "power3.out"
});

gsap.from(".hero-section .btn", {
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1.5,
    delay: 0.6,
    ease: "power3.out"
});

$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        items: 3,
        loop: true,
        margin: 20,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 5000,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });
});

document.getElementById('contactForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.target;
  
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    form.classList.remove('was-validated');
  
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
      .then(() => {
        showContactMessage('success', 'Thank you! Your message has been sent.');
        form.reset();
      }, (err) => {
        console.error('EmailJS error:', err);
        showContactMessage('error', 'Sorry, something went wrong. Please try again later.');
      });
  });

  function showContactMessage(status, text) {
    const message = document.createElement('div');
    message.className = `alert ${status === 'success' ? 'alert-success' : 'alert-danger'} rounded-pill text-center`;
    message.textContent = text;
    document.getElementById('formMessage')?.replaceChildren(message);
  }
  

document.getElementById('mortgageForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
  
    const loanAmount    = parseFloat(document.getElementById('loanAmount').value);
    const annualRatePct = parseFloat(document.getElementById('interestRate').value);
    const monthlyRate   = annualRatePct / 100 / 12;
    const tenureYears   = parseInt(document.getElementById('loanTenure').value, 10);
    const monthsTotal   = tenureYears * 12;
    const downPayment   = parseFloat(document.getElementById('downPayment').value) || 0;
  
    if (isNaN(loanAmount) || isNaN(annualRatePct) || isNaN(tenureYears)) {
      return alert('Please fill out all fields correctly.');
    }
    if (downPayment >= loanAmount) {
      return alert('Down payment must be less than the loan amount.');
    }
  
    const principal      = loanAmount - downPayment;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, monthsTotal)) /
                           (Math.pow(1 + monthlyRate, monthsTotal) - 1);
    const totalPayment   = monthlyPayment * monthsTotal;
    const totalInterest  = totalPayment - principal;
  
    const fmt = amt => 
      amt.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
  
    const resultCard = document.createElement('div');
    resultCard.className = 'card';
    resultCard.dataset.aos = 'fade-up';
    const resultBody = document.createElement('div');
    resultBody.className = 'card-body';
    const heading = document.createElement('h5');
    heading.className = 'card-title';
    heading.textContent = 'Your Financial Plan';
    resultBody.appendChild(heading);

    const addResultLine = (label, value) => {
      const line = document.createElement('p');
      const labelElement = document.createElement('strong');
      labelElement.textContent = `${label}: `;
      line.append(labelElement, document.createTextNode(value));
      resultBody.appendChild(line);
    };
    addResultLine('Loan Amount', fmt(loanAmount));
    addResultLine('Down Payment', fmt(downPayment));
    addResultLine('Principal', fmt(principal));
    addResultLine('Interest Rate', `${annualRatePct.toFixed(2)}%`);
    addResultLine('Tenure', `${tenureYears} years (${monthsTotal} months)`);
    resultBody.appendChild(document.createElement('hr'));
    addResultLine('Monthly Payment', fmt(monthlyPayment));
    addResultLine('Total Payment', fmt(totalPayment));
    addResultLine('Total Interest', fmt(totalInterest));
    const note = document.createElement('p');
    note.className = 'text-muted small';
    note.textContent = '*This is an estimate. Contact us for a detailed schedule.';
    resultBody.appendChild(note);
    resultCard.appendChild(resultBody);
    document.getElementById('result').replaceChildren(resultCard);
  });

document.getElementById('loanTenure')?.addEventListener('input', function () {
    document.getElementById('tenureValue').textContent = `${this.value} Years`;
});

document.addEventListener("DOMContentLoaded", () => {
    const modalEl   = document.getElementById("floorPlanModal");
    if (!modalEl) return;
    const wrapper   = modalEl.querySelector("#modalWrapper");
    const floorModal = new bootstrap.Modal(modalEl);
  
    modalEl.addEventListener("hidden.bs.modal", () => {
      wrapper.replaceChildren();
      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
    });
  
    document.querySelectorAll(".floor-plans-section .card").forEach(card => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        wrapper.replaceChildren();
  
        const style = getComputedStyle(card);
        wrapper.style.backgroundColor = style.backgroundColor;
        wrapper.style.borderRadius     = style.borderRadius;
  
        const src     = card.querySelector(".card-img-top").src;
        const altText = card.querySelector(".card-img-top").alt || "";
        const img     = document.createElement("img");
        img.src       = src;
        img.alt       = altText;
        img.className = "img-fluid d-block";
        wrapper.appendChild(img);
  
        floorModal.show();
      });
    });
  });

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.filter-btn');

    const cols = document.querySelectorAll('.floor-plans-section .row > [class*="col-"]');
  
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {

        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
  
        const filter = btn.getAttribute('data-filter');
        cols.forEach(col => {
          const card = col.querySelector('.card');
          const bhk  = card.getAttribute('data-bhk');

          if (filter === 'all' || bhk === filter) {
            col.style.display = '';
          } else {
            col.style.display = 'none';
          }
        });
      });
    });
  });
