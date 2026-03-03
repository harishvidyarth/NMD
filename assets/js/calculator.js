document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quote-form');
    const quoteResult = document.getElementById('quote-result');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const insuranceType = document.getElementById('insurance-type').value;
            const age = parseInt(document.getElementById('age').value);
            const coverageAmount = parseInt(document.getElementById('coverage-amount').value);
            const duration = parseInt(document.getElementById('duration').value);
            const premium = calculatePremium(insuranceType, age, coverageAmount, duration);
            quoteResult.style.display = 'block';
            quoteResult.innerHTML = `
                <h3>Your Estimated Premium</h3>
                <div style="font-size: 2rem; margin: 1rem 0;">₹${premium.toLocaleString('en-IN')}</div>
                <p>per year for ${duration} years</p>
                <p style="font-size: 0.9rem; margin-top: 1rem; opacity: 0.9;">Coverage Amount: ₹${coverageAmount.toLocaleString('en-IN')}</p>
                <a href="contact.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Get Detailed Quote</a>
            `;
            quoteResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    function calculatePremium(type, age, coverage, duration) {
        let baseRate = 0;
        switch(type) {
            case 'life': baseRate = 500; break;
            case 'health': baseRate = 800; break;
            case 'accident': baseRate = 300; break;
            case 'senior': baseRate = 1200; break;
            case 'group': baseRate = 600; break;
            default: baseRate = 500;
        }
        let ageFactor = 1;
        if (age < 25) ageFactor = 0.8;
        else if (age < 35) ageFactor = 1;
        else if (age < 45) ageFactor = 1.3;
        else if (age < 55) ageFactor = 1.6;
        else if (age < 65) ageFactor = 2;
        else ageFactor = 2.5;

        let durationDiscount = 1;
        if (duration >= 5 && duration < 10) durationDiscount = 0.95;
        else if (duration >= 10 && duration < 15) durationDiscount = 0.9;
        else if (duration >= 15) durationDiscount = 0.85;

        const lakhs = coverage / 100000;
        let premium = (baseRate * lakhs * ageFactor * durationDiscount);
        return Math.round(premium / 100) * 100;
    }
});
