const { StageChannel, VoiceChannel, Client } = require('discord.js');
const {
  ChannnelResolver,
  BooleanResolver,
} = require('../Utilities/Resolver_Utils.js');
const { VoiceConnectionBuilder } = require('../Structures/VoiceConnection.js');

/**
 * @class VoiceHandler - Voice Handler for discord.js v13
 * @param {Client} Client Discord API Client from discord.js v13
 * @param {object} VoiceHandlerInterfaceOptions Voice handler Interface options for class VoiceHandler
 */

module.exports = class VoiceHandler {
  /**
   * @constructor VoiceHandler - Voice Handler for discord.js v13
   * @param {Client} Client Discord API Client from discord.js v13
   * @param {object} VoiceHandlerOptions Voice handler Interface options for class VoiceHandler
   */

  constructor(
    Client,
    VoiceHandlerInterfaceOptions = {
      LeaveOnEmpty: false,
      LeaveOnOnlyBot: false,
      LeaveOnOnlyUsers: false,
      LeaveDelay: 0,
      selfDeaf: false,
      selfMute: false,
      StageTopic: 'Jericho-Framework v2',
      StageSuppress: true,
    },
  ) {
    this.Client = Client;
    this.LeaveOnEmpty = !!VoiceHandlerInterfaceOptions.LeaveOnEmpty;
    this.LeaveOnOnlyBot = !!VoiceHandlerInterfaceOptions.LeaveOnOnlyBot;
    this.LeaveOnOnlyUsers = !!VoiceHandlerInterfaceOptions.LeaveOnOnlyUsers;
    this.LeaveDelay = VoiceHandlerInterfaceOptions.LeaveDelay > 0
      ? VoiceHandlerInterfaceOptions.LeaveDelay
      : 0;
    this.selfDeaf = !!VoiceHandlerInterfaceOptions.selfDeaf;
    this.selfMute = !!VoiceHandlerInterfaceOptions.selfMute;
    this.StageTopic = VoiceHandlerInterfaceOptions.StageTopic;
    this.StageSuppress = !!VoiceHandlerInterfaceOptions.StageSuppress;

    // Event Call for Leaveon attributes to check
    /**
     * @event voiceStateUpdate Voice Update from discord.js v13
     * @param OldState old State in Voice Channel
     * @param NewState new State in Voice Channel
     */

    this.Client.on('voiceStateUpdate', (OldState, NewState) => {
      if (
        OldState
        && !NewState
        && OldState.member.id !== this.Client.user.id
        && VoiceHandler.#GetVoiceConnection(OldState.guild.id)
      ) {
        const UserChecker = (member) => !member.user.bot;
        const BotChecker = (member) => member.user.bot;
        if (
          OldState.guild.me
          && OldState.guild.me.voice
          && OldState.guild.me.voice.channel
          && OldState.guild.me.voice.channel.members
          && OldState.guild.me.voice.channel.members.size <= 1
          && OldState.guild.me.voice.channel.members.has(`${Client.user.id}`)
          && this.LeaveOnEmpty
        ) return this.disconnect(OldState.guild.id, this.LeaveDelay);
        if (
          OldState.guild.me
          && OldState.guild.me.voice
          && OldState.guild.me.voice.channel
          && OldState.guild.me.voice.channel.members
          && OldState
          && OldState.guild.me.voice.channel.members.some(UserChecker)
          && !OldState.guild.me.voice.channel.members.some(BotChecker)
          && this.LeaveOnOnlyUsers
        ) return this.disconnect(OldState.guild.id, this.LeaveDelay);
        if (
          OldState.guild.me
          && OldState.guild.me.voice
          && OldState.guild.me.voice.channel
          && OldState.guild.me.voice.channel.members
          && OldState
          && !OldState.guild.me.voice.channel.members.some(UserChecker)
          && OldState.guild.me.voice.channel.members.some(BotChecker)
          && this.LeaveOnOnlyBot
        ) return this.disconnect(OldState.guild.id, this.LeaveDelay);
        return void null;
      }
      if (
        OldState
        && !NewState
        && OldState.member.id === this.Client.user.id
        && VoiceHandler.#GetVoiceConnection(OldState.guild.id)
        && VoiceHandler.#GetVoiceConnection(OldState.guild.id).ActiveChannel
      ) {
        return this.join(
          VoiceHandler.#GetVoiceConnection(OldState.guild.id).ChannelId,
          {
            LeaveOnEmpty: VoiceHandler.#GetVoiceConnection(OldState.guild.id)
              .LeaveOnEmpty,
            LeaveOnOnlyBot: VoiceHandler.#GetVoiceConnection(OldState.guild.id)
              .LeaveOnOnlyBot,
            LeaveOnOnlyUsers: VoiceHandler.#GetVoiceConnection(
              OldState.guild.id,
            ).LeaveOnOnlyUsers,
            LeaveDelay: VoiceHandler.#GetVoiceConnection(OldState.guild.id)
              .LeaveDelay,
            selfDeaf: VoiceHandler.#GetVoiceConnection(OldState.guild.id)
              .selfDeaf,
            selfMute: VoiceHandler.#GetVoiceConnection(OldState.guild.id)
              .selfMute,
            StageTopic: VoiceHandler.#GetVoiceConnection(OldState.guild.id)
              .StageTopic,
            StageSuppress: VoiceHandler.#GetVoiceConnection(OldState.guild.id)
              .StageSuppress,
          },
        );
      }
      if (
        NewState
        && !OldState
        && VoiceHandler.#GetVoiceConnection(NewState.guild.id)
      ) {
        const UserChecker = (member) => !member.user.bot;
        const BotChecker = (member) => member.user.bot;
        if (
          NewState.guild.me
          && NewState.guild.me.voice
          && NewState.guild.me.voice.channel
          && NewState.guild.me.voice.channel.members
          && NewState.guild.me.voice.channel.members.size <= 1
          && NewState.guild.me.voice.channel.members.has(`${Client.user.id}`)
          && this.LeaveOnEmpty
        ) return this.disconnect(NewState.guild.id, this.LeaveDelay);
        if (
          NewState.guild.me
          && NewState.guild.me.voice
          && NewState.guild.me.voice.channel
          && NewState.guild.me.voice.channel.members
          && NewState
          && NewState.guild.me.voice.channel.members.some(UserChecker)
          && !NewState.guild.me.voice.channel.members.some(BotChecker)
          && this.LeaveOnOnlyUsers
        ) return this.disconnect(NewState.guild.id, this.LeaveDelay);
        if (
          NewState.guild.me
          && NewState.guild.me.voice
          && NewState.guild.me.voice.channel
          && NewState.guild.me.voice.channel.members
          && NewState
          && !NewState.guild.me.voice.channel.members.some(UserChecker)
          && NewState.guild.me.voice.channel.members.some(BotChecker)
          && this.LeaveOnOnlyBot
        ) return this.disconnect(NewState.guild.id, this.LeaveDelay);
        return void null;
      }
      return undefined;
    });
  }

  /**
   * @property {object} #VoiceConnectionRecords - Cache Value of Voice Connections
   */

  static #VoiceConnectionRecords = {}

  /**
   * @method join - Voice Handler for discord.js v13
   * @param {StageChannel | VoiceChannel} channel Discord API Client from discord.js v13
   * @param {object} JoinVoiceOptions Voice handler Interface options for class VoiceHandler
   * @return {VoiceConnection} Voice Connection from "@discordjs/voice"
   */

  async join(
    channel,
    JoinVoiceChannelOptions = {
      Adapter: null,
      LeaveOnEmpty: false,
      LeaveOnOnlyBot: false,
      LeaveOnOnlyUsers: false,
      LeaveDelay: 0,
      selfDeaf: false,
      selfMute: false,
      StageTopic: 'Jericho-Framework v2',
      StageSuppress: true,
      ActiveChannel: false,
    },
  ) {
    if (!channel) throw SyntaxError('Invalid Voice Type Channel is Detected !');
    else channel = ChannnelResolver(this.Client, channel, { type: 'allvoice' });
    // Updating Class Properties
    JoinVoiceChannelOptions.LeaveOnEmpty = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    );
    JoinVoiceChannelOptions.LeaveOnOnlyBot = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    );
    JoinVoiceChannelOptions.LeaveOnOnlyUsers = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    );
    JoinVoiceChannelOptions.LeaveDelay = JoinVoiceChannelOptions.LeaveDelay > 0
      ? JoinVoiceChannelOptions.LeaveDelay
      : this.LeaveDelay;
    JoinVoiceChannelOptions.StageTopic = JoinVoiceChannelOptions.StageTopic || this.StageTopic;
    JoinVoiceChannelOptions.StageSuppress = BooleanResolver(
      JoinVoiceChannelOptions.StageSuppress,
      this.StageSuppress,
    );
    JoinVoiceChannelOptions.selfDeaf = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    );
    JoinVoiceChannelOptions.selfMute = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    );
    JoinVoiceChannelOptions.ActiveChannel = BooleanResolver(
      JoinVoiceChannelOptions.ActiveChannel,
      false,
    );

    if (VoiceHandler.#GetVoiceConnection(channel.guild.id)) {
      const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(
        channel.guild.id,
      );
      const NewVoiceConnectionInstance = VoiceConnectionInstance.set(channel, {
        LeaveOnEmpty: JoinVoiceChannelOptions.LeaveOnEmpty,
        LeaveOnOnlyBot: JoinVoiceChannelOptions.LeaveOnOnlyBot,
        LeaveOnOnlyUsers: JoinVoiceChannelOptions.LeaveOnOnlyUsers,
        LeaveDelay: JoinVoiceChannelOptions.LeaveDelay,
        selfDeaf: JoinVoiceChannelOptions.selfDeaf,
        selfMute: JoinVoiceChannelOptions.selfMute,
        StageSuppress: JoinVoiceChannelOptions.StageSuppress,
        StageTopic: JoinVoiceChannelOptions.StageTopic,
        ActiveChannel: JoinVoiceChannelOptions.ActiveChannel,
      });
      return VoiceHandler.#RegisterVoiceConnection(
        channel.guild.id,
        NewVoiceConnectionInstance,
      );
    }
    let VoiceConnectionInstance = new VoiceConnectionBuilder(
      this.Client,
      channel,
      channel.guild,
      JoinVoiceChannelOptions.Adapter,
      {
        LeaveOnEmpty: JoinVoiceChannelOptions.LeaveOnEmpty,
        LeaveOnOnlyBot: JoinVoiceChannelOptions.LeaveOnOnlyBot,
        LeaveOnOnlyUsers: JoinVoiceChannelOptions.LeaveOnOnlyUsers,
        LeaveDelay: JoinVoiceChannelOptions.LeaveDelay,
        selfDeaf: JoinVoiceChannelOptions.selfDeaf,
        selfMute: JoinVoiceChannelOptions.selfMute,
        StageSuppress: JoinVoiceChannelOptions.StageSuppress,
        StageTopic: JoinVoiceChannelOptions.StageTopic,
        ActiveChannel: JoinVoiceChannelOptions.ActiveChannel,
      },
    );
    VoiceConnectionInstance = VoiceConnectionInstance.create();
    return VoiceHandler.#RegisterVoiceConnection(
      channel.guild.id,
      VoiceConnectionInstance,
    );
  }

  /**
   * @method disconnect Disconnect Voice Connection on Discord Server
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   * @param {Number} Delay Disconnect Delay in Number in Seconds
   * @returns {Boolean} true if Disconnect is Successfull
   */

  disconnect(GuildId, Delay = 0) {
    const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(GuildId);
    if (VoiceConnectionInstance && VoiceConnectionInstance.disconnect) {
      throw Error(
        '[Connection is already Disconnected] : Please Connect to Channel',
      );
    } else if (!VoiceConnectionInstance) {
      throw Error(
        '[Connection is already Destroyed] : Please Connect to Channel',
      );
    }
    if (Delay && Delay !== 0) {
      return setTimeout(
        () => VoiceConnectionInstance.disconnect(),
        Delay * 1000,
      );
    }
    return VoiceConnectionInstance.disconnect();
  }

  /**
   * @method destroy Destroy Voice Connection on Discord Server
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   * @param {Boolean} AdapterAvailable Boolean Checker if Adaptar is Required
   * @param {Number} Delay Disconnect Delay in Number in Seconds
   */

  destroy(GuildId, AdapterAvailable = true, Delay = 0) {
    const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(GuildId);
    if (VoiceConnectionInstance && VoiceConnectionInstance.disconnect) {
      throw Error(
        '[Connection is already Disconnected] : Please Connect to Channel',
      );
    } else if (!VoiceConnectionInstance) {
      throw Error(
        '[Connection is already Destroyed] : Please Connect to Channel',
      );
    }
    VoiceConnectionInstance.destroy(AdapterAvailable);
    if (Delay && Delay !== 0) {
      return setTimeout(
        () => VoiceHandler.#DestroyVoiceConnection(GuildId),
        Delay * 1000,
      );
    }
    return VoiceHandler.#DestroyVoiceConnection(GuildId);
  }

  /**
   * @method get Getter Method for Voice Connection on Discord Server
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  get(GuildId) {
    const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(GuildId);
    if (!VoiceConnectionInstance) {
      throw Error(
        '[Connection is already Destroyed] : Please Connect to Channel',
      );
    }
    return VoiceConnectionInstance.get();
  }

  /**
   * @method #RegisterVoiceConnection Registration of Voice Connection on handler Class
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   * @param {object} VoiceConnectionInstance Builder Class Instance for Cache
   */

  static #RegisterVoiceConnection(GuildId, VoiceConnectionInstance) {
    VoiceHandler.#VoiceConnectionRecords[
      `"${GuildId}"`
    ] = VoiceConnectionInstance;
    return VoiceConnectionInstance.VoiceConnection;
  }

  /**
   * @method #GetVoiceConnection Getter Private Method Voice Connection for Cache in Handler Class
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  static #GetVoiceConnection(GuildId) {
    let VoiceConnectionInstance = VoiceHandler.#VoiceConnectionRecords[`"${GuildId}"`];
    if (VoiceConnectionInstance) {
      VoiceConnectionInstance = VoiceConnectionInstance.get();
      VoiceHandler.#VoiceConnectionRecords[
        `"${GuildId}"`
      ] = VoiceConnectionInstance;
    }
    return VoiceConnectionInstance;
  }

  /**
   * @method #DestroyVoiceConnection Destroy Private Method Voice Connection for Cache in Handler Class
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  static #DestroyVoiceConnection(GuildId) {
    VoiceHandler.#VoiceConnectionRecords[`"${GuildId}"`] = null;
    return true;
  }
};
