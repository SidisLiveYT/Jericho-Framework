import { ThreadHandler, SlashCommandHandler } from "../src/index";

//Creating Channel Instance for Particular Text Channel
const ChannelInstance = new ThreadHandler(Client, Options);

//Creating Thread Instance for Particular Thread-Main Channel
const ThreadInstance1 = ChannelInstance.CreateThread(Options);
//Thread Channel OR Value
const Thread1 = ThreadInstance1.Thread;

const ThreadInstance2 = ChannelInstance.CreateThread(Options);
const Thread2 = ThreadInstance2.Thread;

//Slash Command handler Usage
const SlashCommandInstance = new SlashCommandHandler(Client, {
  guild: message,
  global: false,
});
//Slash Command Handler to Set Commands
SlashCommandInstance.set(Commands);
//Slash Command Handler to Deploy Commands
SlashCommandInstance.deploy();

console.log(Thread1);
console.log(Thread2);
