const {
  ThreadHandler,
  SlashCommandHandler,
  VoiceHandler,
} = require('../src/index.js')

//Creating Channel Instance for Particular Text Channel
const ChannelInstance = new ThreadHandler(Client, {
  guild: message,
  channel: message,
})

//Creating Thread Instance for Particular Thread-Main Channel
const ThreadInstance1 = ChannelInstance.CreateThread(Options)
//Thread Channel OR Value
const Thread1 = ThreadInstance1.Thread

const ThreadInstance2 = ChannelInstance.CreateThread(Options)
const Thread2 = ThreadInstance2.Thread

console.log(Thread1)
console.log(Thread2)

//Slash Command handler Usage
const SlashCommandInstance = new SlashCommandHandler(Client, {
  guild: message,
})
//Slash Command Handler to Set Commands
SlashCommandInstance.set(Commands)
//Slash Command Handler to Deploy Commands
SlashCommandInstance.deploy()

const Voice_Handler = new VoiceHandler(Client, {
  LeaveOnEmpty: true,
})
const VoiceConnection = Voice_Handler.join(channel)
Voice_Handler.destroy()
Voice_Handler.disconnect()
