# thenable
## promise that can be resolved multiple times


* ```const t=new Thenable(function(resolve,reject){});```
* ```Thenable.create(function(thenable){})```
* ```Thenable.resolve(value)```
* ```Thenable.reject(reason)```
* ```Thenable.all([thenables])```
* ```Thenable.race([thenables])```
* ```Thenable.join([thenables])```

```
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

```
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
