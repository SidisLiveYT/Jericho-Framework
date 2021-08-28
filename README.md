<div align="center">
  <br />
  <br />
  <p>
<h1>Jericho Framework</h1>
  </p>
</div>

## About

Jericho-Framework is a Framework Build for Jericho Discord Bot Requirements and Other begineer Developers [Jericho Discord Bot](www.jerichobot.xyz) and is stable working with discord.js v13
[discord.js v13](https://www.npmjs.com/package/discord.js).

- Object-oriented
- Customisable Handlers
- Performant
- 100% coverage of the discord.js v13

## Installation

**Node.js 15 or newer is required.**  

```
npm install jericho-framework
```

### Optional packages

- [discord.js v13](https://www.npmjs.com/package/discord.js) for major Library Support for Discord API 
```
npm install discord.js@latest
```

## Example usage

Register a Thread Handler for Discord API:
```js
import { ThreadHandler } from 'jericho-framework';
const ChannelInstance = new ThreadHandler(Client, { 
     guild : <GuildResolve>,
     channel: <ChannelResolve>,
     metdata: <Saved-Data> || null,
});
const ThreadInstance = ChannelInstance.CreateThread({
     metdata: <Saved-Data> || null,
     Name : <Thread-Name> || <Thread-Title>,
     AutoArchiveDuration : <Time-in-Seconds>,
     Type: <'private-thread'> || <'public-thread'>,
     Reason: <Reason-to-Create> || null
})
```

Get and Destroy Handler:
```js
const ThreadInstances = ChannelInstance.GetThreadInstances(ThreadInstance.ThreadCode,<Amount of Instances>);

const DestroyThread = ChannelInstance.DestroyThread(ThreadInstance.ThreadCode,{
    Reason: <Reason-to-Create> || null,
    Delay: <Time-in-Seconds>,
});
```

Structure of Thread-Instance and Channel-Instance :
### Thread Instance
```
{
    guild,
    channel,
    ThreadCode,
    Client,
    metadata,
    thread,
}
```

### Channel Instance
```
{
    Client,
    ChannelCode
    guild,
    channel,
    Client,
    metadata,
}
```

## Links

- [Website](www.jerichobot.xyz) ([source](https://github.com/SidisLiveYT/Jericho-Framework.git))
- [Discord.js Discord server](https://discord.gg/djs)
- [Discord API Discord server](https://discord.gg/discord-api)
- [GitHub](https://github.com/SidisLiveYT/Jericho-Framework)
- [NPM](https://www.npmjs.com/package/jericho-framework)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the ReadMe.md

## Help

If you don't understand something in the ReadMe.md , you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Support Server](https://discord.gg/Vkmzffpjny).