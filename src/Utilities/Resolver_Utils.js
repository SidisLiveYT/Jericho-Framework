import { Channel, Client, Guild, GuildChannel } from "discord.js";

/**
 * @function ChannnelResolver Custom Resolvable for Channel
 * @param {Client} Client Discord API Client from discord.js v13 [ new Client() ]
 * @param {GuildChannel} ChannelResolve Raw Data to be Resolved
 * @param {object} Extraif Extra Options for Resolver
 * @returns {Channel} ChannelResolve - Channel Collection
 */

export function ChannnelResolver(Client, ChannelResolve, Extraif) {
  if (Extraif.ifmessage && ChannelResolve.channel)
    return ChannelFilterType(ChannelResolve.channel, Extraif);
  if (ChannelResolve.id && ChannelResolve.type)
    return ChannelFilterType(ChannelResolve, Extraif);
  if (typeof ChannelResolve !== "string" || typeof ChannelResolve !== "number")
    throw TypeError("Invalid ChannelResolve is Detected!");
  else if (!Number.isNaN(`${ChannelResolve}`)) {
    if (Client.channels.cache.get(`${ChannelResolve}`))
      return ChannelFilterType(
        Client.channels.cache.get(`${ChannelResolve}`),
        Extraif
      );
    return Client.channels
      .fetch(`${ChannelResolve}`)
      .then((Channel) => ChannelFilterType(Channel, Extraif))
      .catch((error) => {
        throw TypeError(`Invalid Channel.id : ${error}`);
      });
  }
  return ChannelFilterType(ChannelResolve, Extraif);

  /**
   * @function ChannelFilterType Returning the Channel Type After Getting Accurate Resolve form Source
   * @param {Channel} Channel Filtered Data in the Process to be checked Perfectly
   * @param {object} Extraifconditions Extra Options for Checking Type if
   * @returns {Channel} Channel - Channel Collection
   */

  function ChannelFilterType(Channel, Extraifconditions) {
    if (
      Channel.type === "GUILD_PUBLIC_THREAD" ||
      Channel.type === "GUILD_PRIVATE_THREAD" ||
      Channel.type === "GUILD_TEXT" ||
      Channel.type === "GUILD_VOICE" ||
      Channel.type === "GUILD_STAGE_VOICE"
    ) {
      if (
        Extraifconditions &&
        Extraifconditions.type === "publicthread" &&
        Channel.type === "GUILD_PUBLIC_THREAD"
      )
        return Channel;
      if (
        Extraifconditions &&
        Extraifconditions.type === "privatethread" &&
        Channel.type === "GUILD_PRIVATE_THREAD"
      )
        return Channel;
      if (
        Extraifconditions &&
        Extraifconditions.type === "thread" &&
        Channel.isThread()
      )
        return Channel;
      if (
        Extraifconditions &&
        Extraifconditions.type === "stage" &&
        Channel.type === "GUILD_STAGE_VOICE"
      )
        return Channel;
      if (
        Extraifconditions &&
        Extraifconditions.type === "voice" &&
        Channel.isVoice()
      )
        return Channel;
      if (
        Extraifconditions &&
        Extraifconditions.type === "text" &&
        Channel.type === "GUILD_TEXT"
      )
        return Channel;
      return Channel;
    }
    throw SyntaxError(
      "[Wrong Channel Resolve] : Provide Channel.id or Channel Collection of discord.js v13"
    );
  }
}

/**
 * @function GuildResolver Custom Resolvable for Guild
 * @param {Client} Client Discord API Client from discord.js v13 [ new Client() ]
 * @param {Collection<Guild>} GuildResolve Raw Guild Data to be Resolved
 * @param {object} Extraif Extra Checking methods
 * @returns {Guild} GuildResolve - Guild Collection
 */

export function GuildResolver(Client, GuildResolve, Extraif) {
  if (Extraif.ifmessage && GuildResolve.guild) return GuildResolve.guild;
  if (GuildResolve.id && GuildResolve.members && GuildResolve.channels)
    return GuildResolve;
  if (typeof GuildResolve !== "string" || typeof GuildResolve !== "number")
    throw TypeError("Invalid GuildResolve is Detected!");
  else if (!Number.isNaN(`${GuildResolve}`)) {
    if (Client.guilds.cache.get(`${GuildResolve}`))
      return Client.guilds.cache.get(`${GuildResolve}`);
    return Client.guilds
      .fetch(`${GuildResolve}`)
      .then((Guild) => Guild)
      .catch((error) => {
        throw TypeError(`Invalid Guild.id : ${error}`);
      });
  }
  return GuildResolve;
}
