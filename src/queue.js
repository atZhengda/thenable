export const Queue = () => {
    //special queue structure for history undo redo purpose
  var array= [],
  head= 0,
  tail= -1;
  const queue = {
    push (value) {
      //TODO check for overdraft and ignore the values
      array[++tail] = value;
      array[tail+1]=undefined;
      return value;
    },
    pop () {
      //allow over draft
      const value = array[head];
      array[head] = undefined;
      head += 1;
      return value;
    },
    isEmpty () {
      return tail < head;
    },
    size(){
        return tail-head;
    },
  };
  return queue;
};
