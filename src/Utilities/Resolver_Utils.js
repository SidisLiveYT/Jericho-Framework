/**
 * @exports ChannnelResolver Custom Resolvable for Channel
 * @param {*} Client Discord API Client from discord.js v13 [ new Client() ]
 * @param {*} ChannelResolve Raw Data to be Resolved
 * @param {*} Extraif Extra Options for Resolver
 * @returns Channel Collection
 */

export function ChannnelResolver(Client, ChannelResolve, Extraif) {
  if (Extraif.ifmessage && ChannelResolve.channel) return ChannelFilterType(ChannelResolve.channel, Extraif);
  else if (!Number.isNaN(`${ChannelResolve}`)) {
    var ChannelID = ChannelResolve.id;
    if (!ChannelID) ChannelID = ChannelResolve;
    if (Client.channels.cache.get(`${ChannelID}`)) return ChannelFilterType(Client.channels.cache.get(`${ChannelID}`), Extraif);
    return Client.channels.fetch(`${ChannelID}`).then((Channel) => ChannelFilterType(Channel, Extraif)).catch((error) => {
      throw TypeError(`Invalid Channel.id : ${error}`);
    });
  }
  return ChannelFilterType(ChannelResolve, Extraif);

  /**
   * @function ChannelFilterType Returning the Channel Type After Getting Accurate Resolve form Source
   * @param {*} Channel Filtered Data in the Process to be checked Perfectly
   * @param {*} Extraifconditions Extra Options for Checking Type if
   * @returns {*} Channel's Data to the Source
   */

  function ChannelFilterType(Channel, Extraifconditions) {
    if (Channel.type === 'GUILD_PUBLIC_THREAD' || Channel.type === 'GUILD_PRIVATE_THREAD' || Channel.type === 'GUILD_TEXT' || Channel.type === 'GUILD_VOICE' || Channel.type === 'GUILD_STAGE_VOICE') {
      if (Extraifconditions && Extraifconditions.type === 'publicthread' && Channel.type === 'GUILD_PUBLIC_THREAD') return Channel;
      if (Extraifconditions && Extraifconditions.type === 'privatethread' && Channel.type === 'GUILD_PRIVATE_THREAD') return Channel;
      if (Extraifconditions && Extraifconditions.type === 'thread' && Channel.isThread()) return Channel;
      if (Extraifconditions && Extraifconditions.type === 'stage' && Channel.type === 'GUILD_STAGE_VOICE') return Channel;
      if (Extraifconditions && Extraifconditions.type === 'voice' && Channel.isVoice()) return Channel;
      if (Extraifconditions && Extraifconditions.type === 'text' && Channel.type === 'GUILD_TEXT') return Channel;
      return Channel;
    }
    throw SyntaxError('[Wrong Channel Resolve] : Provide Channel.id or Channel Collection of discord.js v13');
  }
}

/**
 * @function GuildResolver Custom Resolvable for Guild
 * @param {*} Client Discord API Client from discord.js v13 [ new Client() ]
 * @param {*} GuildResolve Raw Guild Data to be Resolved
 * @returns Guild Collection
 */

export function GuildResolver(Client, GuildResolve, Extraif) {
  if (Extraif.ifmessage && GuildResolve.guild) return GuildResolve.guild;
  if (!Number.isNaN(`${GuildResolve}`)) {
    var GuildID = GuildResolve.id;
    if (!GuildID) GuildID = GuildResolve;
    if (Client.guilds.cache.get(`${GuildID}`)) return Client.guilds.cache.get(`${GuildID}`);
    return Client.guilds.fetch(`${GuildID}`).then((Guild) => Guild).catch((error) => {
      throw TypeError(`Invalid Guild.id : ${error}`);
    });
  }
  return GuildResolve;
}