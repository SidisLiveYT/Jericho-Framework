const {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnection,
} = require('@discordjs/voice');
const {
  Client, Guild, StageChannel, VoiceChannel,
} = require('discord.js');
const { GuildResolver } = require('../Utilities/Resolver_Utils.js');

/**
 * @class VoiceConnectionBuilder - VoiceConnectionInstanceBuilder for Voice Handler for discord.js v13
 */

module.exports = class VoiceConnectionBuilder {
  /**
   *
   * @param {Client} Client
   * @param {StageChannel | VoiceChannel} channel Voice or Stage Channel Type from discord.js v13
   * @param {Guild} Guild Discord Guild Collection
   * @param {object} Adaptar Guild Adapter for "@discordjs/voice"
   * @param {object} ConnectioneOptions Interface Options for Builder
   */

  constructor(
    Client,
    Channel,
    Guild,
    Adaptar,
    ConnectionInterfaceOptions = {
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
    this.Client = Client;
    this.ChannelId = Channel.id;
    this.GuildId = Guild.id;
    this.Adaptar = Adaptar || Guild.voiceAdapterCreator;
    this.LeaveOnEmpty = ConnectionInterfaceOptions.LeaveOnEmpty;
    this.LeaveOnOnlyBot = ConnectionInterfaceOptions.LeaveOnOnlyBot;
    this.LeaveOnOnlyUsers = ConnectionInterfaceOptions.LeaveOnOnlyUsers;
    this.LeaveDelay = ConnectionInterfaceOptions.LeaveDelay;
    this.selfDeaf = ConnectionInterfaceOptions.selfDeaf;
    this.selfMute = ConnectionInterfaceOptions.selfMute;
    this.StageTopic = ConnectionInterfaceOptions.StageTopic;
    this.StageSuppress = ConnectionInterfaceOptions.StageSuppress;
    this.ActiveChannel = ConnectionInterfaceOptions.ActiveChannel;
  }

  /**
   * @method create Create method for Builder [ Creating Voice Connection for the Handler ]
   * @returns {Promise<VoiceConnection>} VoiceConnectionBuilder's Instance
   */

  create() {
    try {
      const VoiceConnection = joinVoiceChannel({
        channelId: this.ChannelId,
        guildId: this.GuildId,
        selfDeaf: !!this.selfDeaf,
        selfMute: !!this.selfMute,
        adapterCreator: this.Adaptar,
      });
      this.VoiceConnection = VoiceConnection;
      this.#RegisterStageChannel();
      return this;
    } catch (error) {
      throw Error(error);
    }
  }
  /**
   * @method get Getter method for Voice Connection at Present repsective to GuilId
   * @returns {Promise<this>} VoiceConnectionBuilder
   */

  async get() {
    this.VoiceConnection = getVoiceConnection({ guildId: this.GuildId });
    const Guild = await GuildResolver(this.Client, this.GuildId);
    if (Guild.me && Guild.me.voice && Guild.me.voice.channel) {
      this.ChannelId = Guild.me.voice.channel.id;
    }
    return this;
  }

  /**
   * @method disconnect Disconnect On-Going Connection from Discord API
   * @returns {Promise<Boolean>} true if the Conenction Disconnect Successfull
   */

  disconnect() {
    if (!this.VoiceConnection) {
      throw TypeError('No Voice Connection found in Handler!');
    }
    const SuccessBooleanResult = this.VoiceConnection.disconnect();
    if (!SuccessBooleanResult) {
      throw TypeError("Voice Connection can't be disconnected!");
    } else return SuccessBooleanResult;
  }

  /**
   * @method destroy Destroy On-Going Connection from Discord API
   * @param {Boolean} AdapterAvailable If Adapter should be avaliable after destruction
   * @returns {Promise<Boolean>} true if the Conenction Destroy Successfull
   */

  destroy(AdapterAvailable = true) {
    if (!this.VoiceConnection) {
      throw TypeError('No Voice Connection found in Handler!');
    }
    const SuccessBooleanResult = this.VoiceConnection.destroy({
      adapterAvailable: AdapterAvailable,
    });
    if (!SuccessBooleanResult) {
      throw TypeError("Voice Connection can't be distroyed!");
    } else {
      this.VoiceConnection = null;
      return true;
    }
  }

  /**
   * @method set Create method for Builder [ Creating Voice Connection for the Handler ]
   * @param {VoiceChannel | StageChannel} channel Voice Channel Resolve for Voice Connection Builder
   * @param {object} SetVoiceOptions Object Options Same as per JoinVoiceChannelOptions . for Edit Purpose in Instance
   * @returns {Promise<this>} VoiceConnectionBuilder's Instance
   */

  set(
    channel,
    SetVoiceChannelOptions = {
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
    this.ChannelId = channel.id;
    this.GuildId = channel.guild.id;
    this.Adaptar = SetVoiceChannelOptions.Adaptar || channel.Guild.voiceAdapterCreator;
    this.LeaveOnEmpty = SetVoiceChannelOptions.LeaveOnEmpty;
    this.LeaveOnOnlyBot = SetVoiceChannelOptions.LeaveOnOnlyBot;
    this.LeaveOnOnlyUsers = SetVoiceChannelOptions.LeaveOnOnlyUsers;
    this.LeaveDelay = SetVoiceChannelOptions.LeaveDelay;
    this.selfDeaf = SetVoiceChannelOptions.selfDeaf;
    this.selfMute = SetVoiceChannelOptions.selfMute;
    this.StageTopic = SetVoiceChannelOptions.StageTopic;
    this.StageSuppress = SetVoiceChannelOptions.StageSuppress;
    this.ActiveChannel = SetVoiceChannelOptions.ActiveChannel;

    try {
      const VoiceConnection = joinVoiceChannel({
        channelId: this.ChannelId,
        guildId: this.GuildId,
        selfDeaf: !!this.selfDeaf,
        selfMute: !!this.selfMute,
        adapterCreator: this.Adaptar,
      });
      this.VoiceConnection = VoiceConnection;
      this.#RegisterStageChannel();
      return this;
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * @returns {Promise<Boolean>} Success Boolaen Result
   */

  #RegisterStageChannel() {
    return void this.Client.channels
      .fetch(`${this.ChannelId}`)
      .then((Channel) => {
        if (Channel.type !== 'GUILD_STAGE_VOICE') return void null;
        if (Channel.Guild.me && Channel.Guild.me.voice && this.StageSuppress) {
          return void Channel.Guild.me.voice
            .setSuppressed(false)
            .then(() => {
              if (this.StageTopic) {
                return void Channel.createStageInstance({
                  topic: this.StageTopic,
                  privacyLevel: this.privacyLevel,
                })
                  .then(() => true)
                  .catch((error) => {
                    throw error;
                  });
              }
              return true;
            })
            .catch((error) => {
              throw error;
            });
        }
        if (this.StageTopic) {
          return void Channel.createStageInstance({
            topic: this.StageTopic,
            privacyLevel: this.privacyLevel,
          })
            .then(() => true)
            .catch((error) => {
              throw error;
            });
        }
        return true;
      })
      .catch((error) => {
        throw error;
      });
  }
};
