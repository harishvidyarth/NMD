document.addEventListener('DOMContentLoaded',function(){
    const forms=document.querySelectorAll('form');
    forms.forEach(form=>{
        form.addEventListener('submit',function(e){
            if(!validateForm(this)){
                e.preventDefault();
            }
        });
    });

    function validateForm(form){
        let isValid=true;
        const inputs=form.querySelectorAll('input[required],textarea[required],select[required]');
        
        inputs.forEach(input=>{
            const errorSpan=input.parentElement.querySelector('.error-message')||
                          document.createElement('span');
            errorSpan.className='error-message';
            
            if(!input.value.trim()){
                errorSpan.textContent='This field is required';
                isValid=false;
            }else if(input.type==='email'&&!validateEmail(input.value)){
                errorSpan.textContent='Please enter a valid email';
                isValid=false;
            }else if(input.type==='tel'&&!validatePhone(input.value)){
                errorSpan.textContent='Please enter a valid phone number';
                isValid=false;
            }else{
                errorSpan.textContent='';
            }
            
            if(!input.parentElement.querySelector('.error-message')){
                input.parentElement.appendChild(errorSpan);
            }
        });
        
        return isValid;
    }

    function validateEmail(email){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone){
        return /^[\d\s\-\+\(\)]{10,15}$/.test(phone);
    }

    function sanitizeInput(input){
        return input.replace(/[<>]/g,'');
    }

    const quoteForm=document.getElementById('quote-form');
    if(quoteForm){
        quoteForm.addEventListener('submit',function(e){
            e.preventDefault();
            const result=document.getElementById('quote-result');
            const type=document.querySelector('select').value;
            const amount=document.querySelector('input[type="number"]').value||100000;
            const quote=calculateQuote(type,amount);
            result.textContent=`Estimated Premium: ₹${quote}`;
            result.style.display='block';
        });
    }

    function calculateQuote(type,amount){
        const rates={
            'Life Insurance':0.03,
            'Health Insurance':0.05,
            'Car Insurance':0.02
        };
        const base=amount*(rates[type]||0.04);
        return Math.round(base/1000)*1000;
    }

    const currentPage=window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link=>{
        if(link.getAttribute('href')===currentPage){
            link.style.fontWeight='bold';
            link.style.color='#3498db';
        }
    });

    if('serviceWorker' in navigator){
        navigator.serviceWorker.register('/sw.js')
        .then(()=>console.log('Service Worker registered'))
        .catch(err=>console.log('Service Worker registration failed:',err));
    }
});
