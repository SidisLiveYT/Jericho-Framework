const {
  Channel, Client, Guild, GuildChannel,
} = require('discord.js');

/**
 * @function ChannnelResolver Custom Resolvable for Channel
 * @param {Client} Client Discord API Client from discord.js v13 [ new Client() ]
 * @param {GuildChannel} ChannelResolve Raw Data to be Resolved
 * @param {object} ExtraifOptions Extra Options for Resolver
 * @returns {Promise<Channel>} ChannelResolve - Channel Collection
 */

async function ChannnelResolver(
  Client,
  ChannelResolve,
  Extraif = { ifmessage: false, type: undefined },
) {
  if (Extraif.ifmessage && ChannelResolve.channel) {
    return ChannelFilterType(ChannelResolve.channel, Extraif);
  }
  if (ChannelResolve.id && ChannelResolve.type) {
    return ChannelFilterType(ChannelResolve, Extraif);
  }
  if (
    typeof ChannelResolve !== 'string'
    || typeof ChannelResolve !== 'number'
  ) {
    throw TypeError('Invalid ChannelResolve is Detected!');
  } else if (!Number.isNaN(`${ChannelResolve}`)) {
    if (Client.channels.cache.get(`${ChannelResolve}`)) {
      return ChannelFilterType(
        Client.channels.cache.get(`${ChannelResolve}`),
        Extraif,
      );
    }
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
   * @returns {Promise<Channel>} Channel - Channel Collection
   */

  async function ChannelFilterType(Channel, Extraifconditions) {
    if (
      Channel.type === 'GUILD_PUBLIC_THREAD'
      || Channel.type === 'GUILD_PRIVATE_THREAD'
      || Channel.type === 'GUILD_TEXT'
      || Channel.type === 'GUILD_VOICE'
      || Channel.type === 'GUILD_STAGE_VOICE'
    ) {
      if (
        Extraifconditions
        && Extraifconditions.type === 'publicthread'
        && Channel.type === 'GUILD_PUBLIC_THREAD'
      ) {
        return Channel;
      }
      if (
        Extraifconditions
        && Extraifconditions.type === 'privatethread'
        && Channel.type === 'GUILD_PRIVATE_THREAD'
      ) {
        return Channel;
      }
      if (
        Extraifconditions
        && Extraifconditions.type === 'thread'
        && Channel.isThread()
      ) {
        return Channel;
      }
      if (
        Extraifconditions
        && Extraifconditions.type === 'stage'
        && Channel.type === 'GUILD_STAGE_VOICE'
      ) {
        return Channel;
      }
      if (
        Extraifconditions
        && Extraifconditions.type === 'voice'
        && Channel.isVoice()
      ) {
        return Channel;
      }
      if (
        Extraifconditions
        && Extraifconditions.type === 'allvoice'
        && (Channel.isVoice() || Channel.type === 'GUILD_STAGE_VOICE')
      ) {
        return Channel;
      }
      if (
        Extraifconditions
        && Extraifconditions.type === 'text'
        && Channel.type === 'GUILD_TEXT'
      ) {
        return Channel;
      }
      return Channel;
    }
    throw SyntaxError(
      '[Wrong Channel Resolve] : Provide Channel.id or Channel Collection of discord.js v13',
    );
  }
}

/**
 * @function GuildResolver Custom Resolvable for Guild
 * @param {Client} Client Discord API Client from discord.js v13 [ new Client() ]
 * @param {Collection<Guild>} GuildResolve Raw Guild Data to be Resolved
 * @param {object} ExtraifOptions Extra Checking methods
 * @returns {Promise<Guild>} GuildResolve - Guild Collection
 */

async function GuildResolver(
  Client,
  GuildResolve,
  Extraif = { ifmessage: false },
) {
  if (Extraif.ifmessage && GuildResolve.guild) return GuildResolve.guild;
  if (GuildResolve.id && GuildResolve.members && GuildResolve.channels) {
    return GuildResolve;
  }
  if (typeof GuildResolve !== 'string' || typeof GuildResolve !== 'number') {
    throw TypeError('Invalid GuildResolve is Detected!');
  } else if (!Number.isNaN(`${GuildResolve}`)) {
    if (Client.guilds.cache.get(`${GuildResolve}`)) {
      return Client.guilds.cache.get(`${GuildResolve}`);
    }
    return Client.guilds
      .fetch(`${GuildResolve}`)
      .then((Guild) => Guild)
      .catch((error) => {
        throw TypeError(`Invalid Guild.id : ${error}`);
      });
  }
  return GuildResolve;
}

/**
 * @function BooleanResolver Custom Boolean Resolvable
 * @param {Boolean} FirstHand UpperHand Boolean Value or undefined
 * @param {Boolean} SecondHand Base Boolean Value or undefined
 * @returns {Promise<Boolean>} Boolean Value
 */

async function BooleanResolver(FirstHand, SecondHand) {
  if (![true, false].includes(FirstHand)) return SecondHand;
  if (![true, false].includes(SecondHand)) return FirstHand;
  if (FirstHand) return FirstHand;
  if (SecondHand) return SecondHand;
  return false;
}

module.exports = {
  ChannnelResolver,
  GuildResolver,
  BooleanResolver,
};
