/**
 * @exports ChannnelResolver Custom Resolvable for Channel
 * @param {Snowflake} Client Discord API Client from discord.js v13 [ new Client() ]
 * @param {Snowflake} ChannelResolve Raw Data to be Resolved
 * @param {Object} Extraif Extra Options for Resolver
 * @returns Channel Collection
 */

export function ChannnelResolver(Client, ChannelResolve, Extraif) {
  if (Extraif.ifmessage && ChannelResolve.channel) return ChannelFilterType(ChannelResolve.channel, Extraif);
  else if (ChannelResolve.id && ChannelResolve.type) return ChannelFilterType(ChannelResolve, Extraif);
  else if (typeof ChannelResolve !== 'string' || typeof ChannelResolve !== 'number') throw TypeError(`Invalid ChannelResolve is Detected!`);
  else if (!Number.isNaN(`${ChannelResolve}`)) {
    if (Client.channels.cache.get(`${ChannelResolve}`)) return ChannelFilterType(Client.channels.cache.get(`${ChannelResolve}`), Extraif);
    return Client.channels.fetch(`${ChannelResolve}`).then((Channel) => ChannelFilterType(Channel, Extraif)).catch((error) => {
      throw TypeError(`Invalid Channel.id : ${error}`);
    });
  }
  return ChannelFilterType(ChannelResolve, Extraif);

  /**
   * @function ChannelFilterType Returning the Channel Type After Getting Accurate Resolve form Source
   * @param {Snowflake} Channel Filtered Data in the Process to be checked Perfectly
   * @param {Object} Extraifconditions Extra Options for Checking Type if
   * @returns {Snowflake} Channel's Data to the Source
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
 * @param {Snowflake} Client Discord API Client from discord.js v13 [ new Client() ]
 * @param {Snowflake} GuildResolve Raw Guild Data to be Resolved
 * @returns {Snowflake} Guild Collection
 */

export function GuildResolver(Client, GuildResolve, Extraif) {
  if (Extraif.ifmessage && GuildResolve.guild) return GuildResolve.guild;
  else if (GuildResolve.id && GuildResolve.members && GuildResolve.channels) return GuildResolve;
  else if (typeof GuildResolve !== 'string' || typeof GuildResolve !== 'number') throw TypeError(`Invalid GuildResolve is Detected!`);
  else if (!Number.isNaN(`${GuildResolve}`)) {
    if (Client.guilds.cache.get(`${GuildResolve}`)) return Client.guilds.cache.get(`${GuildResolve}`);
    return Client.guilds.fetch(`${GuildResolve}`).then((Guild) => Guild).catch((error) => {
      throw TypeError(`Invalid Guild.id : ${error}`);
    });
  }
  return GuildResolve;
}