import Collection from "@discordjs/collection";
import { joinVoiceChannel } from "@discordjs/voice";
import { StageChannel, VoiceChannel, Client } from "discord.js";

/**
 * @class VoiceHandler - Voice Handler for discord.js v13
 * @param {Client} Client Discord API Client from discord.js v13
 * @param {object} VoiceHandlerInterfaceOptions Voice handler Interface options for class VoiceHandler
 */

export class VoiceHandler {
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
    }
  ) {
    this.Client = Client;
    this.LeaveOnEmpty = VoiceHandlerInterfaceOptions.LeaveOnEmpty ? true : false;
    this.LeaveOnOnlyBot = VoiceHandlerInterfaceOptions.LeaveOnOnlyBot ? true : false;
    this.LeaveOnOnlyUsers = VoiceHandlerInterfaceOptions.LeaveOnOnlyUsers ? true : false;
    this.LeaveDelay = VoiceHandlerInterfaceOptions.LeaveDelay ? VoiceHandlerInterfaceOptions.LeaveDelay : 0;
    this.selfDeaf = VoiceHandlerInterfaceOptions.selfDeaf ? true : false;
    this.selfMute = VoiceHandlerInterfaceOptions.selfMute ? true : false;
    this.VoiceConnection = null;
  }

  /**
   * @method join - Voice Handler for discord.js v13
   * @param {Collection<VoiceChannel, StageChannel>} channel Discord API Client from discord.js v13
   * @param {object} JoinVoiceOptions Voice handler Interface options for class VoiceHandler
   */

  async join(
    channel,
    JoinVoiceChannelOptions = {
      StageChannelTitle: `Voice Channel Handler - Jericho Framework`,
      debug: false,
      Adapter,
      LeaveOnEmpty: false,
      LeaveOnOnlyBot: false,
      LeaveOnOnlyUsers: false,
      LeaveDelay: 0,
      selfDeaf: false,
      selfMute: false,
    }
  ) {
    //Updating Class Properties
    this.LeaveOnEmpty = JoinVoiceChannelOptions.LeaveOnEmpty ? true : this.LeaveOnEmpty;
    this.LeaveOnOnlyBot = JoinVoiceChannelOptions.LeaveOnOnlyBot ? true : this.LeaveOnOnlyBot;
    this.LeaveOnOnlyUsers = JoinVoiceChannelOptions.LeaveOnOnlyUsers ? true : this.LeaveOnOnlyUsers;
    this.LeaveDelay = JoinVoiceChannelOptions.LeaveDelay ? JoinVoiceChannelOptions.LeaveDelay : this.LeaveDelay;
    this.selfDeaf = JoinVoiceChannelOptions.selfDeaf ? true : this.selfDeaf;
    this.selfMute = JoinVoiceChannelOptions.selfMute ? true : this.selfMute;

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

  async disconnect() { }
}
