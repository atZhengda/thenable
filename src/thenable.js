//multi resovable promises
//reference from es6-promise polyfill package

import {isNull,notNull,isFunc} from './types';
import {Queue} from './queue';
// const PENDING='PENDING';
const RESOLVED='RESOLVED';
const REJECTED='REJECTED';
//previous resolved
const PRE_RESOLVED='PRE_RESOLVED';
const PRE_REJECTED='PRE_REJECTED';

const asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;

const asyncFunc=f=>asyncSetTimer(f,0);

const invokeCallback=(context,preValue)=>{
  let result=preValue;
  if(preValue.state===PRE_RESOLVED ){
    if(isFunc(context._onFulfillment)){
      try{
        result={
          value: context._onFulfillment(preValue.value),
          state: RESOLVED
        };
      }catch(err){
        result={
          reason: err,
          state: REJECTED
        }
      }
    }else{
      result.state=RESOLVED;
    }

  }else if(preValue.state===PRE_REJECTED ){
    if(isFunc(context._onRejection)){
      try{
        result={
          value: context._onRejection(preValue.reason),
          state: RESOLVED
        };
      }catch(err){
        result={
          reason: err,
          state: REJECTED
        }
      }
    }else{
      result.state=REJECTED;
    }
  }

  return result;
}
export default class Thenable{

  constructor(onFulfillment,onRejection){
    if(onRejection===void 0 && isFunc(onFulfillment)){
      /*compatible syntax for
        new Promise(function resolver(resolve,reject))
      */
      asyncFunc(()=>{
        onFulfillment(this.resolve.bind(this),this.reject.bind(this));
      })
    }else{
      /*thenable syntax
        new Thenable(onFulfillment,onRejection)
      */
      if(notNull(onFulfillment)&&!isFunc(onFulfillment)){
        throw new Error('on fulfillment argument has to be function')
      }
      if(notNull(onRejection)&&!isFunc(onRejection)){
        throw new Error('on rejection argument has to be function')
      }
      this._onFulfillment=onFulfillment;
      this._onRejection=onRejection;
    }

    this._next=[];
    this._pool=Queue();

    //catch is a keyword
    this['catch']=function(onReject){
      return this.then(null,onReject);
    };
  }

  publish(value){
    const isResolve=value.state===RESOLVED;

    if(isResolve){
      this._next.forEach(subscriber=>{
        return subscriber.resolve(value.value);
      });
    }else{
      if(this._next.length===0){
        //uncaught rejection
        throw new Error(value.reason);
      }
      this._next.forEach(subscriber=>{
        subscriber.reject(value.reason)
      });
    }
  }
  _publish(){
    while(!this._pool.isEmpty()){
      this.publish(this._pool.pop());
    }
  }
  subscribe(f){
    f(this);
    return this;
  }
  resolve(val){
    if(notNull(val)&&isFunc(val.then)){
      val.then(this.resolve.bind(this),this.reject.bind(this));
    }else{
      //invoke callback for current thenable
      asyncFunc(()=>{
        const value={
          value: val,
          state: PRE_RESOLVED
        }
        this._pool.push(invokeCallback(this,value));
        this._publish();
      });
    }
    return this;
  }

  reject(reason){
    asyncFunc(()=>{
      const value={
        reason,
        state: PRE_REJECTED
      }
      this._pool.push(invokeCallback(this,value));
      this._publish();
    });
    return this;
  }
  then(onFulfillment,onRejection){
    let _onRejection=onRejection;
    if(isNull(onRejection)){
      _onRejection=null;
    }
    const nextThenable=new Thenable(onFulfillment,_onRejection);
    this._next.push(nextThenable);
    return nextThenable;
  }
  static create(func){
    return (new Thenable()).subscribe(func);
  }
  static resolve(val){
    return (new Thenable()).resolve(val);
  }
  static reject(reason){
    return (new Thenable()).reject(reason);
  }
  static all(thenables){
    const batches=thenables.map(t=>Queue());
    return new Thenable(function(resolve,reject){
      const checkAndDispatch=()=>{
          const dispatchable=batches.reduce((mem,cur)=>{
            return mem&&!cur.isEmpty();
          },true);
          if(dispatchable){
            const batch=batches.map(b=>b.pop());
            try{
              resolve(batch);
            }catch(err){
              reject(err);
            }
          }
      };
      thenables
        .map(t=>Thenable.resolve(t))
        .forEach((t,index)=>{
          t.then(value=>{
            batches[index].push(value);
            checkAndDispatch();
          },reason=>{
            batches.filter((b,i)=>i!==index).forEach(b=>b.pop());
            reject(reason);
          })
        })
    });
  }
  static race(thenables){
    const batches=thenables.map(t=>Queue());
    return new Thenable(function(resolve,reject){
      thenables
        .map(t=>Thenable.resolve(t))
        .forEach((t,index)=>{
          t.then(value=>{
            batches[index].push(void 0);
            if(!batches[index].isEmpty()){
              resolve(value);
            }
            batches.forEach(b=>b.pop());
          },reason=>{
            batches[index].push(void 0);
            if(!batches[index].isEmpty()){
              reject(reason);
            }
            batches.forEach(b=>b.pop());
          })
        })
    });
  }
  static join(thenables){
    return new Thenable(function(resolve,reject){
      thenables
        .map(t=>Thenable.resolve(t))
        .forEach(t=>t.then(resolve,reject));
    });
  }
}
export {Thenable};
