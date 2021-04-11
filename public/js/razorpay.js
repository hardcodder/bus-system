
function loadRazorPay()
{
    return new Promise((resolve) => {
      const script = document.createElement('script') ;
      script.src = "https://checkout.razorpay.com/v1/checkout.js" ;
      script.onload = ()=> {
        resolve(true) ;
      }
      script.onerror = () => {
        resolve(false) ;
      }
      document.body.appendChild(script) ;
    })
    
}

async function displayRazorpay(num , cost)
  {
    const res = await loadRazorPay() ;
    if(!res)
    {
      alert('offline') ;
    }
    else
    {
        console.log("in razorpay");
        let url = window.location.href ;

        url = url.split("//") ;
        console.log(url) ;
        let fetchUrl = '' + url[0] + '//' ;
        url = url[1].split('/') ;
        fetchUrl = fetchUrl + url[0] + '/';
        let data = await fetch(`${fetchUrl}razorpay`, 
        {
          method : 'POST' ,
          body : JSON.stringify({
            number : num ,
            cost : cost
          }) ,
          headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        }) ;
        if(data.status == 200)
        {
          data = await data.json() ;
          console.log(data);

          const options = {
            "key": 'rzp_test_lTU3DVbvidGbPW', // Enter the Key ID generated from the Dashboard
            "amount": data.amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": data.currency,
            "name": "myBus",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response){
                alert("Your seat is booked");
            },
            "prefill": {
                "name": data.name,
                "email": data.email,
                "contact": "9999999999"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
      else
      {
        data = await data.json() ;
        alert(data.error) ;
      }
    }
  }

const ul = document.querySelector('.bus-cards') ;

if(ul)
{
    ul.addEventListener('click' , (event) => {
        if(event.target.closest('.btn'))
        {
            let btn = event.target.closest('.btn') ;
            let par = btn.parentElement ;
            let cost = par.querySelector('.input-cost').value ;
            let number = par.querySelector('.input-number').value ;
            displayRazorpay(number , cost) ;
        }
    })
}