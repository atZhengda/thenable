 const {Thenable} =require('./lib');
const delay=n=>new Thenable(function(resolve,reject){
  setTimeout(
    ()=>resolve(n),
    n
  )
});
// delay(1000).then(n=>console.log(n)).then(()=>delay(1500)).then(n=>console.log(n));
console.log(new Date());
Thenable.join([
  delay(1000),
  delay(1500),
  delay(1500).then(()=>Thenable.reject('error'))
]).then(result=>console.log(new Date(),result),reason=>console.log('reason',reason));
