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

var t1=Thenable.create(t=>{
  let counter=0;
  function tick(){
    setTimeout(()=>{
      t.resolve(counter);
      counter+=2;
      if(counter<10){
        tick();
      }
    },1000)
  }
  tick();
})
var t2=Thenable.create(t=>{
  let counter=1;
  function tick(){
    setTimeout(()=>{
      t.resolve(counter);
      counter+=2;
      if(counter<10){
        tick();
      }
    },1000)
  }
  tick();
})
Thenable.join([t1,t2])
  .if(n=>n%2===0)
    .then(n=>(console.log(`${n} is an even number`),n))
    .if(n=>n%3==0)
      .then(n=>(console.log(`${n} can also be devided by three!`),n))
    .endIf()
  .else()
    .then(n=>(console.log(`${n} is a odd number`),n))
    .then(n=>2*n)
  .endIf()
  .then(n=>console.log('received',n))
  .catch(err=>console.log(err))
