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
        document.getElementById('formMessage').innerHTML =
          '<div class="alert alert-success rounded-pill text-center">Thank you! Your message has been sent.</div>';
        form.reset();
      }, (err) => {
        console.error('EmailJS error:', err);
        document.getElementById('formMessage').innerHTML =
          '<div class="alert alert-danger rounded-pill text-center">Sorry, something went wrong. Please try again later.</div>';
      });
  });
  

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
  
    document.getElementById('result').innerHTML = `
      <div class="card" data-aos="fade-up">
        <div class="card-body">
          <h5 class="card-title">Your Financial Plan</h5>
          <p><strong>Loan Amount:</strong> ${fmt(loanAmount)}</p>
          <p><strong>Down Payment:</strong> ${fmt(downPayment)}</p>
          <p><strong>Principal:</strong> ${fmt(principal)}</p>
          <p><strong>Interest Rate:</strong> ${annualRatePct.toFixed(2)}%</p>
          <p><strong>Tenure:</strong> ${tenureYears} years (${monthsTotal} months)</p>
          <hr>
          <p><strong>Monthly Payment:</strong> ${fmt(monthlyPayment)}</p>
          <p><strong>Total Payment:</strong> ${fmt(totalPayment)}</p>
          <p><strong>Total Interest:</strong> ${fmt(totalInterest)}</p>
          <p class="text-muted small">*This is an estimate. Contact us for a detailed schedule.</p>
        </div>
      </div>
    `;
  });
  

document.getElementById('loanTenure')?.addEventListener('input', function () {
    document.getElementById('tenureValue').textContent = `${this.value} Years`;
});

const floorModal = document.getElementById('floorPlanModal');
floorModal.addEventListener('show.bs.modal', e => {
  const card = e.relatedTarget;
  const imgSrc  = card.getAttribute('data-img');
  const title   = card.getAttribute('data-title');
  const desc    = card.getAttribute('data-desc');

  floorModal.querySelector('.modal-title').textContent       = title;
  floorModal.querySelector('#modalFloorImage').src           = imgSrc;
  floorModal.querySelector('#modalFloorImage').alt           = title;
  floorModal.querySelector('#modalFloorDescription').innerHTML = `<p>${desc}</p>`;
});

document.addEventListener("DOMContentLoaded", () => {
    const modalEl   = document.getElementById("floorPlanModal");
    const wrapper   = modalEl.querySelector("#modalWrapper");
    const floorModal = new bootstrap.Modal(modalEl);
  
    modalEl.addEventListener("hidden.bs.modal", () => {
      wrapper.innerHTML = "";
      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
    });
  
    document.querySelectorAll(".floor-plans-section .card").forEach(card => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        wrapper.innerHTML = "";
  
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
  