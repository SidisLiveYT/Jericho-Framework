import {
    ThreadHandler
} from '../src/index';

//Creating Channel Instance for Particular Text Channel
const ChannelInstance = new ThreadHandler(Client, Options);

//Creating Thread Instance for Particular Thread-Main Channel
const ThreadInstance1 = ChannelInstance.CreateThread(Options);
//Thread Channel OR Value
const Thread1 = ThreadInstance1.Thread;

const ThreadInstance2 = ChannelInstance.CreateThread(Options);
const Thread2 = ThreadInstance2.Thread;

console.log(Thread1);
console.log(Thread2);