 const {Thenable} =require('./lib');
const delay=n=>new Thenable(function(resolve,reject){
  setTimeout(
    ()=>resolve(n),
    n
  )
});
delay(1000).then(n=>console.log(n)).then(()=>delay(1500)).then(n=>console.log(n));
