import Collection from "@discordjs/collection";
import { joinVoiceChannel } from "@discordjs/voice";
import { StageChannel, VoiceChannel } from "discord.js";

/**
 * @class VoiceHandler - Voice Handler for discord.js v13
 * @param {Collection} Client Discord API Client from discord.js v13
 * @param {object} VoiceHandlerInterfaceOptions Voice handler Interface options for class VoiceHandler
 */

export class VoiceHandler {
  /**
   * @constructor VoiceHandler - Voice Handler for discord.js v13
   * @param {Collection} Client Discord API Client from discord.js v13
   * @param {object} VoiceHandlerInterfaceOptions Voice handler Interface options for class VoiceHandler
   */

  constructor(
    Client,
    {
      LeaveOnEmpty: Boolean,
      LeaveOnOnlyBot: Boolean,
      LeaveOnOnlyUsers: Boolean,
      LeaveDelay: Number,
      selfDeaf: Boolean,
      selfMute: Boolean,
    }
  ) {
    this.Client = Client;
    this.LeaveOnEmpty = LeaveOnEmpty ? true : false;
    this.LeaveOnOnlyBot = LeaveOnOnlyBot ? true : false;
    this.LeaveOnOnlyUsers = LeaveOnOnlyUsers ? true : false;
    this.LeaveDelay = LeaveDelay ? LeaveDelay : 0;
    this.selfDeaf = selfDeaf ? true : false;
    this.selfMute = selfMute ? true : false;
    this.VoiceConnection = null;
  }

  /**
   * @method join - Voice Handler for discord.js v13
   * @param {Collection<VoiceChannel, StageChannel>} channel Discord API Client from discord.js v13
   * @param {object} JoinVoiceChannelOptions Voice handler Interface options for class VoiceHandler
   */

  async join(
    channel,
    {
      StageChannelTitle: String,
      debug: Boolean,
      Adapter,
      LeaveOnEmpty: Boolean,
      LeaveOnOnlyBot: Boolean,
      LeaveOnOnlyUsers: Boolean,
      LeaveDelay: Number,
      selfDeaf: Boolean,
      selfMute: Boolean,
    }
  ) {
    //Updating Class Properties
    this.LeaveOnEmpty = LeaveOnEmpty ? true : this.LeaveOnEmpty;
    this.LeaveOnOnlyBot = LeaveOnOnlyBot ? true : this.LeaveOnOnlyBot;
    this.LeaveOnOnlyUsers = LeaveOnOnlyUsers ? true : this.LeaveOnOnlyUsers;
    this.LeaveDelay = LeaveDelay ? LeaveDelay : this.LeaveDelay;
    this.selfDeaf = selfDeaf ? true : this.selfDeaf;
    this.selfMute = selfMute ? true : this.selfMute;

    //Join Voice Channel with Adapter;
    const VoiceConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: this.selfDeaf ? true : false,
      selfMute: this.selfMute ? true : false,
      adapterCreator: Adapter ? Adapter : channel.guild.voiceAdapterCreator,
    });
    this.VoiceConnection = VoiceConnection;
    return VoiceConnection;
  }

  async disconnect() {}
}
