# thenable
## promise that can be resolved multiple times
### Start to learn Rx series, hence write something to feel more of that
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
