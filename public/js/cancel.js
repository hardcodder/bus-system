const ul = document.querySelector('.bus-cards') ;

async function cancel(number){
    let url = window.location.href ;

        url = url.split("//") ;
        console.log(url) ;
        let fetchUrl = '' + url[0] + '//' ;
        url = url[1].split('/') ;
        fetchUrl = fetchUrl + url[0] + '/';
        let data = await fetch(`${fetchUrl}cancel-reservation`, 
        {
            method : 'POST' ,
            body : JSON.stringify({
              number : number
            }) ,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
          }
        )
        data = await data.json() ;
        alert(data.message) ;
        location.reload() ;
}

if(ul)
{
    ul.addEventListener('click' , (event) => {
        if(event.target.closest('.btn'))
        {
            let btn = event.target.closest('.btn') ;
            let par = btn.parentElement ;
            let number = par.querySelector('.input-number').value ;
            cancel(number) ;
        }
    })
}