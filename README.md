# Thenable
## promise that can be resolved multiple times, with branch ability


```javascript
//TODO improve stability
```


* ```const t=new Thenable(function(resolve,reject){});```
* ```Thenable.create(function(thenable){})```
* ```Thenable.resolve(value)```
* ```Thenable.reject(reason)```
* ```Thenable.all([thenables])```
* ```Thenable.race([thenables])```
* ```Thenable.join([thenables])```

```javascript
import Thenable from 'j-thenable';

new Thenable(function(resolve,reject){
  resolve(5);
  resolve(6);
})
.then(v=>console.log(v))
.then(()=>{
  throw new Error('Error');
})
.catch(err=>{
  console.log('caught',err);
})
.then(()=>{
  console.log('invoked when new value passes');
});
```

```javascript
import Thenable from 'j-thenable';
const delay=n=>new Thenable(function(resolve,reject){
 setTimeout(
   ()=>resolve(n),
   n
 )
});

console.log(new Date());
Thenable.join([
 delay(1000),
 delay(1500),
 delay(1500).then(()=>Thenable.reject('error'))
]).then(result=>console.log(new Date(),result),reason=>console.log('reason',reason));
```
```javascript
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
```
